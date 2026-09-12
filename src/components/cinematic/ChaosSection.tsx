"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeChaosTimeline } from "@/lib/animation/chaos";

export default function ChaosSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const sysRef = useRef<HTMLDivElement | null>(null);
  const wordCtrlRef = useRef<HTMLSpanElement | null>(null);
  const wordTheRef = useRef<HTMLSpanElement | null>(null);
  const wordChaosRef = useRef<HTMLSpanElement | null>(null);

  // Floating Micro-annotations
  const labelTrackRef = useRef<HTMLDivElement | null>(null);
  const labelVisRef = useRef<HTMLDivElement | null>(null);
  const labelSurfaceRef = useRef<HTMLDivElement | null>(null);
  const labelPressureRef = useRef<HTMLDivElement | null>(null);

  // Wet atmosphere texture
  const wetSheenRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeChaosTimeline(progress);

      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        if (wetSheenRef.current) {
          wetSheenRef.current.style.opacity = "0";
        }
        return;
      }

      section.style.visibility = "visible";

      // 1. System Identifier
      if (sysRef.current) {
        sysRef.current.style.opacity = timeline.systemOpacity.toFixed(3);
      }

      // 2. Word "CONTROL"
      if (wordCtrlRef.current) {
        const c = timeline.wordControl;
        wordCtrlRef.current.style.opacity = c.opacity.toFixed(3);
        wordCtrlRef.current.style.transform = `translate(${c.translateX.toFixed(1)}px, ${c.translateY.toFixed(1)}px) scale(${c.scale.toFixed(3)})`;
      }

      // 3. Word "THE"
      if (wordTheRef.current) {
        const t = timeline.wordThe;
        wordTheRef.current.style.opacity = t.opacity.toFixed(3);
        wordTheRef.current.style.transform = `translate(${t.translateX.toFixed(1)}px, ${t.translateY.toFixed(1)}px) scale(${t.scale.toFixed(3)})`;
      }

      // 4. Word "CHAOS."
      if (wordChaosRef.current) {
        const ch = timeline.wordChaos;
        wordChaosRef.current.style.opacity = ch.opacity.toFixed(3);
        wordChaosRef.current.style.transform = `translate(${ch.translateX.toFixed(1)}px, ${ch.translateY.toFixed(1)}px) scale(${ch.scale.toFixed(3)})`;
      }

      // 5. Floating Environmental Annotations
      if (labelTrackRef.current) {
        const l = timeline.labelTrackWet;
        labelTrackRef.current.style.opacity = l.opacity.toFixed(3);
        labelTrackRef.current.style.transform = `translateY(${l.translateY.toFixed(1)}px)`;
      }

      if (labelVisRef.current) {
        const l = timeline.labelVisibilityLow;
        labelVisRef.current.style.opacity = l.opacity.toFixed(3);
        labelVisRef.current.style.transform = `translateY(${l.translateY.toFixed(1)}px)`;
      }

      if (labelSurfaceRef.current) {
        const l = timeline.labelSurfaceVariable;
        labelSurfaceRef.current.style.opacity = l.opacity.toFixed(3);
        labelSurfaceRef.current.style.transform = `translateY(${l.translateY.toFixed(1)}px)`;
      }

      if (labelPressureRef.current) {
        const l = timeline.labelPressureHigh;
        labelPressureRef.current.style.opacity = l.opacity.toFixed(3);
        labelPressureRef.current.style.transform = `translateY(${l.translateY.toFixed(1)}px)`;
      }

      // 6. Wet Atmosphere Sheen Overlay
      if (wetSheenRef.current) {
        wetSheenRef.current.style.opacity = timeline.wetAtmosphereOpacity.toFixed(3);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Subtle Wet Atmosphere Sheen Layer */}
      <div
        ref={wetSheenRef}
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none z-[8] bg-gradient-to-b from-transparent via-cyan-950/10 to-blue-950/20 backdrop-contrast-[1.04] will-change-opacity transition-opacity duration-100"
        style={{ opacity: 0 }}
      />

      {/* Chaos Experience Layer */}
      <section
        id="chaos-experience"
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
            <span>SYSTEM 05</span>
          </div>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">DYNAMICS</span>
          <span className="hidden sm:inline-block text-text-muted">/</span>
          <span className="hidden sm:inline-block text-text-muted">WET PROTOCOL ACTIVE</span>
        </div>

        {/* Heavy, Grounded Display Typography Composition */}
        <div className="absolute inset-0 flex flex-col justify-center px-[6vw] md:px-[8vw] pointer-events-none">
          <div className="flex flex-col leading-[0.82] tracking-[-0.03em] font-display font-black text-text-primary uppercase select-none">
            {/* Line 1: CONTROL */}
            <div className="overflow-visible py-1">
              <span
                ref={wordCtrlRef}
                className="inline-block text-[clamp(3.4rem,10.5vw,10.5rem)] will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              >
                CONTROL
              </span>
            </div>

            {/* Line 2: THE */}
            <div className="overflow-visible py-1">
              <span
                ref={wordTheRef}
                className="inline-block text-[clamp(3.4rem,10.5vw,10.5rem)] will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              >
                THE
              </span>
            </div>

            {/* Line 3: CHAOS. */}
            <div className="overflow-visible py-1">
              <span
                ref={wordChaosRef}
                className="inline-block text-[clamp(3.4rem,10.5vw,10.5rem)] will-change-[transform,opacity]"
                style={{ opacity: 0 }}
              >
                CHAOS<span className="text-accent-red">.</span>
              </span>
            </div>
          </div>
        </div>

        {/* Sparse Floating Environmental Annotations (Asymmetric layout) */}
        
        {/* 1. TRACK // WET (Lower Left) */}
        <div
          ref={labelTrackRef}
          className="absolute bottom-[16vh] left-[6vw] md:left-[8vw] flex flex-col gap-0.5 font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-1 h-1 bg-accent-red rounded-full" />
            <span>TRACK</span>
          </div>
          <span className="text-white/40">WET</span>
        </div>

        {/* 2. VISIBILITY // LOW (Upper Right) */}
        <div
          ref={labelVisRef}
          className="absolute top-[16vh] right-[6vw] md:right-[8vw] flex flex-col items-end gap-0.5 font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1.5 text-white font-medium">
            <span>VISIBILITY</span>
            <span className="w-1 h-1 bg-white/60 rounded-full" />
          </div>
          <span className="text-white/40">LOW</span>
        </div>

        {/* 3. SURFACE // VARIABLE (Mid Left) */}
        <div
          ref={labelSurfaceRef}
          className="absolute top-[48vh] left-[6vw] md:left-[8vw] flex flex-col gap-0.5 font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1.5 text-white font-medium">
            <span className="w-1 h-1 bg-white/60 rounded-full" />
            <span>SURFACE</span>
          </div>
          <span className="text-white/40">VARIABLE</span>
        </div>

        {/* 4. PRESSURE // HIGH (Lower Right) */}
        <div
          ref={labelPressureRef}
          className="absolute bottom-[16vh] right-[6vw] md:right-[8vw] flex flex-col items-end gap-0.5 font-mono text-[10px] md:text-xs tracking-[0.2em] text-white/70 uppercase pointer-events-none"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center gap-1.5 text-white font-medium">
            <span>PRESSURE</span>
            <span className="w-1 h-1 bg-accent-red rounded-full" />
          </div>
          <span className="text-white/40">HIGH</span>
        </div>
      </section>
    </>
  );
}
