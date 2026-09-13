"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";

const CONFIG = {
  totalFrames: 1311,
  webpDir: "/frames-webp/",
  pngDir: "/frames/",
  padLength: 4,
  useWebP: true,
};

const TOTAL_FRAMES = CONFIG.totalFrames;

function getFrameUrl(globalIndex: number, preferWebp = CONFIG.useWebP): string {
  const clamped = Math.max(1, Math.min(globalIndex, TOTAL_FRAMES));
  const pad = String(clamped).padStart(CONFIG.padLength, "0");
  const baseDir = preferWebp ? CONFIG.webpDir : CONFIG.pngDir;
  const ext = preferWebp ? ".webp" : ".png";
  return `${baseDir}${pad}${ext}`;
}

export default function CinematicCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false, desynchronized: true });
    if (!ctx) return;

    const PRIORITY_AHEAD = 30;
    const PRIORITY_BEHIND = 10;
    const MEMORY_AHEAD = 50;
    const MEMORY_BEHIND = 15;
    const MAX_CONCURRENT_REQUESTS = 4;
    const HAS_IMAGE_BITMAP = typeof createImageBitmap === "function";

    // Decoded memory cache & in-flight requests
    const frameCache = new Map<number, ImageBitmap | HTMLImageElement>();
    const inFlightRequests = new Map<
      number,
      { controller: AbortController; promise: Promise<ImageBitmap | HTMLImageElement | null> }
    >();
    const loadQueue: number[] = [];
    let isQueueProcessing = false;

    let lastRenderedAsset: ImageBitmap | HTMLImageElement | null = null;
    let lastRenderedIndex = -1;

    let rawScrollProgress = 0;
    let smoothScrollProgress = 0;
    let targetFrameIndex = 1;
    let prevCalculatedFrame = 1;
    let animationFrameId: number | null = null;

    function isAssetValid(asset: ImageBitmap | HTMLImageElement | null): boolean {
      if (!asset) return false;
      try {
        if (typeof asset.width === "number" && asset.width === 0) return false;
        if (typeof asset.height === "number" && asset.height === 0) return false;
        return true;
      } catch (_) {
        return false;
      }
    }

    function safelyCloseAsset(asset: ImageBitmap | HTMLImageElement | null) {
      if (asset && asset !== lastRenderedAsset && typeof (asset as ImageBitmap).close === "function") {
        try {
          (asset as ImageBitmap).close();
        } catch (_) {}
      }
    }

    function evictDistantFrames(centerFrame: number) {
      const minKeep = Math.max(1, centerFrame - MEMORY_BEHIND);
      const maxKeep = Math.min(TOTAL_FRAMES, centerFrame + MEMORY_AHEAD);

      for (const [frameIndex, asset] of frameCache.entries()) {
        if (frameIndex < minKeep || frameIndex > maxKeep) {
          if (asset !== lastRenderedAsset) {
            safelyCloseAsset(asset);
            frameCache.delete(frameIndex);
          }
        }
      }
    }

    function cancelStaleInFlightRequests(centerFrame: number) {
      const minActive = Math.max(1, centerFrame - PRIORITY_BEHIND - 5);
      const maxActive = Math.min(TOTAL_FRAMES, centerFrame + PRIORITY_AHEAD + 10);

      for (const [frameIndex, req] of inFlightRequests.entries()) {
        if (frameIndex < minActive || frameIndex > maxActive) {
          if (req.controller) {
            req.controller.abort();
          }
          inFlightRequests.delete(frameIndex);
        }
      }
    }

    async function fetchAndDecodeFrame(
      frameIndex: number,
      signal: AbortSignal | null
    ): Promise<ImageBitmap | HTMLImageElement | null> {
      const url = getFrameUrl(frameIndex, CONFIG.useWebP);

      try {
        const response = await fetch(url, signal ? { signal } : {});
        if (!response.ok) throw new Error(`HTTP ${response.status}`);

        const blob = await response.blob();
        if (signal && signal.aborted) return null;

        if (HAS_IMAGE_BITMAP) {
          const bitmap = await createImageBitmap(blob, {
            premultiplyAlpha: "none",
            colorSpaceConversion: "default",
            resizeQuality: "high",
          });
          return bitmap;
        } else {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.decoding = "async";
            const objectUrl = URL.createObjectURL(blob);
            img.onload = () => {
              URL.revokeObjectURL(objectUrl);
              resolve(img);
            };
            img.onerror = (err) => {
              URL.revokeObjectURL(objectUrl);
              reject(err);
            };
            img.src = objectUrl;
          });
        }
      } catch (error: any) {
        if (error.name === "AbortError") {
          return null;
        }
        if (CONFIG.useWebP) {
          try {
            const fallbackUrl = getFrameUrl(frameIndex, false);
            const fallbackResp = await fetch(fallbackUrl, signal ? { signal } : {});
            const fallbackBlob = await fallbackResp.blob();
            if (HAS_IMAGE_BITMAP) {
              return await createImageBitmap(fallbackBlob, {
                premultiplyAlpha: "none",
                colorSpaceConversion: "default",
                resizeQuality: "high",
              });
            }
          } catch (_) {}
        }
        return null;
      }
    }

    function processQueue() {
      if (isQueueProcessing) return;
      isQueueProcessing = true;

      while (inFlightRequests.size < MAX_CONCURRENT_REQUESTS && loadQueue.length > 0) {
        const frameIndex = loadQueue.shift()!;

        if (frameCache.has(frameIndex) || inFlightRequests.has(frameIndex)) {
          continue;
        }

        const controller = new AbortController();
        const fetchPromise = fetchAndDecodeFrame(frameIndex, controller.signal)
          .then((decodedAsset) => {
            inFlightRequests.delete(frameIndex);
            if (decodedAsset && isAssetValid(decodedAsset)) {
              frameCache.set(frameIndex, decodedAsset);
              if (frameIndex === Math.round(targetFrameIndex)) {
                renderCurrentState();
              }
            }
            processQueue();
            return decodedAsset;
          })
          .catch(() => {
            inFlightRequests.delete(frameIndex);
            processQueue();
            return null;
          });

        inFlightRequests.set(frameIndex, { controller, promise: fetchPromise });
      }

      isQueueProcessing = false;
    }

    function updatePriorities(centerFrame: number) {
      evictDistantFrames(centerFrame);
      cancelStaleInFlightRequests(centerFrame);

      loadQueue.length = 0;

      if (!frameCache.has(centerFrame) && !inFlightRequests.has(centerFrame)) {
        loadQueue.push(centerFrame);
      }

      for (let i = 1; i <= PRIORITY_AHEAD; i++) {
        const forward = centerFrame + i;
        if (forward <= TOTAL_FRAMES && !frameCache.has(forward) && !inFlightRequests.has(forward)) {
          loadQueue.push(forward);
        }
        if (i <= PRIORITY_BEHIND) {
          const backward = centerFrame - i;
          if (backward >= 1 && !frameCache.has(backward) && !inFlightRequests.has(backward)) {
            loadQueue.push(backward);
          }
        }
      }

      processQueue();
    }

    function drawCover(asset: ImageBitmap | HTMLImageElement | null) {
      if (!isAssetValid(asset) || !asset || !canvas || !ctx) return;

      const cw = canvas.width;
      const ch = canvas.height;
      const iw = asset.width || (asset as HTMLImageElement).naturalWidth || 1920;
      const ih = asset.height || (asset as HTMLImageElement).naturalHeight || 1080;

      const scale = Math.max(cw / iw, ch / ih);
      const dw = Math.round(iw * scale);
      const dh = Math.round(ih * scale);
      const dx = Math.round((cw - dw) * 0.5);
      const dy = Math.round((ch - dh) * 0.5);

      try {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(asset, dx, dy, dw, dh);
      } catch (_) {}
    }

    function getNearestDecodedFrame(targetIndex: number) {
      if (frameCache.has(targetIndex)) {
        const asset = frameCache.get(targetIndex);
        if (isAssetValid(asset || null)) {
          return { asset: asset!, index: targetIndex };
        }
      }

      const maxSearch = Math.max(MEMORY_BEHIND, MEMORY_AHEAD);
      for (let offset = 1; offset <= maxSearch; offset++) {
        const prev = targetIndex - offset;
        if (prev >= 1 && frameCache.has(prev)) {
          const asset = frameCache.get(prev);
          if (isAssetValid(asset || null)) {
            return { asset: asset!, index: prev };
          }
        }
        const next = targetIndex + offset;
        if (next <= TOTAL_FRAMES && frameCache.has(next)) {
          const asset = frameCache.get(next);
          if (isAssetValid(asset || null)) {
            return { asset: asset!, index: next };
          }
        }
      }

      if (isAssetValid(lastRenderedAsset)) {
        return { asset: lastRenderedAsset!, index: lastRenderedIndex };
      }

      return null;
    }

    function renderCurrentState() {
      const targetIndex = Math.round(targetFrameIndex);
      const match = getNearestDecodedFrame(targetIndex);

      if (match && match.asset) {
        drawCover(match.asset);

        if (lastRenderedAsset && lastRenderedAsset !== match.asset) {
          const minKeep = Math.max(1, targetIndex - MEMORY_BEHIND);
          const maxKeep = Math.min(TOTAL_FRAMES, targetIndex + MEMORY_AHEAD);
          if (lastRenderedIndex < minKeep || lastRenderedIndex > maxKeep) {
            safelyCloseAsset(lastRenderedAsset);
          }
        }

        lastRenderedAsset = match.asset;
        lastRenderedIndex = match.index;
      }
    }

    function resizeCanvas() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      const width = window.innerWidth;
      const height = window.innerHeight;

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
      }

      renderCurrentState();
    }

    function calculateScrollProgress() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll <= 0) return 0;
      return Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    }

    function onScroll() {
      rawScrollProgress = calculateScrollProgress();
    }

    function rafLoop() {
      const diff = rawScrollProgress - smoothScrollProgress;
      if (Math.abs(diff) > 0.00005) {
        smoothScrollProgress += diff * 0.42;
      } else {
        smoothScrollProgress = rawScrollProgress;
      }

      targetFrameIndex = Math.min(
        Math.floor(smoothScrollProgress * (TOTAL_FRAMES - 1)) + 1,
        TOTAL_FRAMES
      );
      const roundedFrame = Math.round(targetFrameIndex);

      if (roundedFrame !== prevCalculatedFrame) {
        prevCalculatedFrame = roundedFrame;
        updatePriorities(roundedFrame);
      }

      renderCurrentState();
      scrollBridge.emit(smoothScrollProgress, roundedFrame);

      animationFrameId = requestAnimationFrame(rafLoop);
    }

    // Initialize
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", resizeCanvas, { passive: true });
    resizeCanvas();

    const prebufferFrames = [1, 2, 3, 4, 5];
    Promise.all(
      prebufferFrames.map(async (frameIdx) => {
        const asset = await fetchAndDecodeFrame(frameIdx, null);
        if (asset && isAssetValid(asset)) {
          frameCache.set(frameIdx, asset);
        }
      })
    ).then(() => {
      renderCurrentState();
      updatePriorities(1);
      animationFrameId = requestAnimationFrame(rafLoop);
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", resizeCanvas);
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
      }
      for (const asset of frameCache.values()) {
        safelyCloseAsset(asset);
      }
      frameCache.clear();
      inFlightRequests.forEach((req) => req.controller.abort());
      inFlightRequests.clear();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="f1-canvas"
      className="fixed top-0 left-0 w-screen h-screen block z-[1] bg-bg-primary pointer-events-none"
    />
  );
}
