"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export default function ProgressIndicator() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chapterNumRef = useRef<HTMLSpanElement | null>(null);
  const chapterNameRef = useRef<HTMLSpanElement | null>(null);
  const chapterFillRef = useRef<HTMLDivElement | null>(null);
  const teleFrameRef = useRef<HTMLSpanElement | null>(null);
  const teleTcRef = useRef<HTMLSpanElement | null>(null);
  const teleVelRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    let currentChapter = "01";

    const unsubscribe = scrollBridge.subscribe((progress, frameIndex) => {
      // 1. Chapter Progress Tracking
      let fillPercent = 0;
      let chapterNum = "01";
      let chapterName = "IGNITION";

      if (progress < 0.25) {
        chapterNum = "01";
        chapterName = "IGNITION";
        fillPercent = clamp(progress / 0.25) * 100;
      } else if (progress < 0.55) {
        chapterNum = "02";
        chapterName = "MACHINE";
        fillPercent = clamp((progress - 0.25) / 0.30) * 100;
      } else if (progress < 0.74) {
        chapterNum = "03";
        chapterName = "ENGINEERING";
        fillPercent = clamp((progress - 0.55) / 0.19) * 100;
      } else if (progress < 0.84) {
        chapterNum = "04";
        chapterName = "VELOCITY";
        fillPercent = clamp((progress - 0.74) / 0.10) * 100;
      } else if (progress < 0.94) {
        chapterNum = "05";
        chapterName = "CHAOS";
        fillPercent = clamp((progress - 0.84) / 0.10) * 100;
      } else if (progress < 0.975) {
        chapterNum = "06";
        chapterName = "ARRIVAL";
        fillPercent = clamp((progress - 0.94) / 0.035) * 100;
      } else {
        chapterNum = "07";
        chapterName = "FINISH";
        fillPercent = clamp((progress - 0.975) / 0.025) * 100;
      }

      if (chapterNumRef.current && chapterNum !== currentChapter) {
        currentChapter = chapterNum;
        chapterNumRef.current.textContent = chapterNum;
      }

      if (chapterNameRef.current) {
        chapterNameRef.current.textContent = chapterName;
      }

      if (chapterFillRef.current) {
        chapterFillRef.current.style.width = `${fillPercent.toFixed(1)}%`;
      }

      // HUD Progressive Cinematic Attenuation
      if (containerRef.current) {
        let opacity = 1.0;
        if (progress < 0.25) {
          opacity = 1.0;
        } else if (progress < 0.55) {
          opacity = 0.90;
        } else if (progress < 0.74) {
          opacity = 0.85;
        } else if (progress < 0.84) {
          if (progress >= 0.765 && progress <= 0.830) {
            const attIn = clamp((progress - 0.765) / 0.025);
            const attOut = clamp((progress - 0.815) / 0.015);
            opacity = 0.60 - attIn * (1 - attOut) * 0.35;
          } else {
            opacity = 0.60;
          }
        } else if (progress < 0.94) {
          opacity = 0.35;
        } else if (progress < 0.975) {
          opacity = 0.15 * (1 - clamp((progress - 0.94) / 0.035));
        } else {
          opacity = 0.0;
        }
        containerRef.current.style.opacity = opacity.toFixed(3);
      }

      // 2. Telemetry Readouts
      if (teleFrameRef.current) {
        const framePad = String(frameIndex).padStart(4, "0");
        teleFrameRef.current.textContent = `FRM // ${framePad} / 1311`;
      }

      if (teleTcRef.current) {
        const totalDurationSec = 43.7;
        const currentSec = progress * totalDurationSec;
        const min = Math.floor(currentSec / 60);
        const sec = Math.floor(currentSec % 60);
        const ms = Math.floor((currentSec % 1) * 100);
        teleTcRef.current.textContent = `TC // ${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}:${String(ms).padStart(2, "0")}`;
      }

      if (teleVelRef.current) {
        let vel = 0;
        if (progress < 0.10) {
          vel = Math.round(progress * 10 * 85);
        } else if (progress < 0.35) {
          vel = 85 + Math.round(((progress - 0.10) / 0.25) * 165);
        } else {
          vel = 250 + Math.round(((progress - 0.35) / 0.65) * 82);
        }
        teleVelRef.current.textContent = `VEL // ${String(vel).padStart(3, "0")} KM/H`;
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex justify-between items-center w-full pointer-events-none transition-opacity duration-150 will-change-opacity"
    >
      {/* Chapter Progress Indicator */}
      <div className="flex items-center gap-3.5 font-mono">
        <span ref={chapterNumRef} className="text-sm font-semibold text-text-primary">
          01
        </span>
        <div className="w-14 h-0.5 bg-white/10 relative overflow-hidden">
          <div
            ref={chapterFillRef}
            className="h-full w-0 bg-accent-red shadow-[0_0_6px_var(--accent-red-glow)] transition-[width] duration-100 ease-linear"
          />
        </div>
        <span
          ref={chapterNameRef}
          className="text-xs tracking-widest text-text-secondary uppercase"
        >
          IGNITION
        </span>
      </div>

      {/* Live Telemetry Display */}
      <div className="flex items-center gap-3 font-mono text-[0.7rem] tracking-wider text-text-secondary">
        <span ref={teleFrameRef} className="tabular-nums">
          FRM // 0001 / 1311
        </span>
        <span className="hidden md:inline-block text-text-muted">|</span>
        <span ref={teleTcRef} className="hidden md:inline-block tabular-nums">
          TC // 00:00:00
        </span>
        <span className="hidden md:inline-block text-text-muted">|</span>
        <span ref={teleVelRef} className="hidden md:inline-block tabular-nums">
          VEL // 000 KM/H
        </span>
      </div>
    </div>
  );
}
