"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeTunnelTimeline } from "@/lib/animation/tunnel";

export default function TunnelSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sysRef = useRef<HTMLDivElement | null>(null);
  const wordSpeedRef = useRef<HTMLSpanElement | null>(null);
  const wordHasRef = useRef<HTMLSpanElement | null>(null);
  const wordNoShadowRef = useRef<HTMLSpanElement | null>(null);
  const vignetteOverlayRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeTunnelTimeline(progress);

      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        if (vignetteOverlayRef.current) {
          vignetteOverlayRef.current.style.opacity = "0";
        }
        return;
      }

      section.style.visibility = "visible";

      // 1. System Identifier
      if (sysRef.current) {
        sysRef.current.style.opacity = timeline.systemOpacity.toFixed(3);
      }

      // 2. Word "SPEED"
      if (wordSpeedRef.current) {
        const s = timeline.wordSpeed;
        wordSpeedRef.current.style.opacity = s.opacity.toFixed(3);
        wordSpeedRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px) scale(${s.scale.toFixed(3)})`;
        wordSpeedRef.current.style.filter = s.blurPx > 0.5 ? `blur(${s.blurPx.toFixed(1)}px)` : "none";
      }

      // 3. Word "HAS"
      if (wordHasRef.current) {
        const h = timeline.wordHas;
        wordHasRef.current.style.opacity = h.opacity.toFixed(3);
        wordHasRef.current.style.transform = `translateY(${h.translateY.toFixed(1)}px) scale(${h.scale.toFixed(3)})`;
        wordHasRef.current.style.filter = h.blurPx > 0.5 ? `blur(${h.blurPx.toFixed(1)}px)` : "none";
      }

      // 4. Word "NO SHADOW."
      if (wordNoShadowRef.current) {
        const ns = timeline.wordNoShadow;
        wordNoShadowRef.current.style.opacity = ns.opacity.toFixed(3);
        wordNoShadowRef.current.style.transform = `translateY(${ns.translateY.toFixed(1)}px) scale(${ns.scale.toFixed(3)})`;
        wordNoShadowRef.current.style.filter = ns.blurPx > 0.5 ? `blur(${ns.blurPx.toFixed(1)}px)` : "none";
      }

      // 5. Deep Tunnel Vignette Intensification
      if (vignetteOverlayRef.current) {
        vignetteOverlayRef.current.style.opacity = timeline.tunnelVignetteIntensity.toFixed(3);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Dynamic Tunnel Darkness Vignette Layer */}
      <div
        ref={vignetteOverlayRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[8] bg-radial-[circle_at_center,_rgba(0,0,0,0)_30%,_rgba(0,0,0,0.92)_100%] will-change-opacity transition-opacity duration-100"
        style={{ opacity: 0 }}
      />

      {/* Tunnel Typography & Experience Layer */}
      <section
        id="tunnel-experience"
        ref={sectionRef}
        className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden select-none"
        style={{ visibility: "hidden" }}
      >
        {/* System Identifier (Upper Left) */}
        <div
          ref={sysRef}
          className="absolute top-[10vh] left-[6vw] md:left-[8vw] flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.18em] text-text-secondary uppercase pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="inline-flex items-center gap-1.5 text-text-primary font-medium">
            <span className="w-1.5 h-1.5 bg-accent-red rounded-full inline-block animate-pulse" />
            <span>SYSTEM 04</span>
          </div>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">VELOCITY</span>
          <span className="hidden sm:inline-block text-text-muted">/</span>
          <span className="hidden sm:inline-block text-text-muted">TUNNEL APEX TRANSIT</span>
        </div>

        {/* Enormous Editorial Typography Composition */}
        <div className="absolute inset-0 flex flex-col justify-center px-[6vw] md:px-[8vw] pointer-events-none">
          <div className="flex flex-col leading-[0.80] tracking-[-0.04em] font-display font-black text-text-primary uppercase select-none">
            {/* Word 1: SPEED */}
            <div className="overflow-visible py-1">
              <span
                ref={wordSpeedRef}
                className="inline-block text-[clamp(3.6rem,11.5vw,12rem)] will-change-[transform,opacity,filter]"
                style={{ opacity: 0 }}
              >
                SPEED
              </span>
            </div>

            {/* Word 2: HAS */}
            <div className="overflow-visible py-1">
              <span
                ref={wordHasRef}
                className="inline-block text-[clamp(3.6rem,11.5vw,12rem)] will-change-[transform,opacity,filter]"
                style={{ opacity: 0 }}
              >
                HAS
              </span>
            </div>

            {/* Word 3: NO SHADOW. */}
            <div className="overflow-visible py-1">
              <span
                ref={wordNoShadowRef}
                className="inline-block text-[clamp(3.6rem,11.5vw,12rem)] will-change-[transform,opacity,filter]"
                style={{ opacity: 0 }}
              >
                NO SHADOW<span className="text-accent-red">.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Minimal Vertical Coordinate Marker (Right Side) */}
        <div className="absolute top-1/2 right-[6vw] md:right-[8vw] -translate-y-1/2 flex flex-col items-center gap-2 opacity-30 font-mono text-[9px] tracking-[0.25em] text-white pointer-events-none">
          <span className="w-px h-12 bg-white/40" />
          <span className="[writing-mode:vertical-lr]">V // 340+</span>
          <span className="w-px h-12 bg-white/40" />
        </div>
      </section>
    </>
  );
}
