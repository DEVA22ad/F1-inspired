"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeEngineeringTimeline } from "@/lib/animation/engineering";
import CircuitMap, { CircuitMapHandle } from "./CircuitMap";

export default function CircuitSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleGroupRef = useRef<HTMLDivElement | null>(null);
  const circuitMapRef = useRef<CircuitMapHandle | null>(null);

  // Numerical value refs
  const distValRef = useRef<HTMLSpanElement | null>(null);
  const cornersValRef = useRef<HTMLSpanElement | null>(null);
  const elevValRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeEngineeringTimeline(progress);
      const circ = timeline.circuit;

      if (!circ.isVisible) {
        section.style.visibility = "hidden";
        return;
      }

      section.style.visibility = "visible";
      section.style.opacity = circ.opacity.toFixed(3);
      section.style.transform = `translateY(${circ.translateY.toFixed(1)}px)`;

      // Update Circuit Map SVG stroke draws
      if (circuitMapRef.current) {
        circuitMapRef.current.updateProgress(
          circ.trackDrawProgress,
          circ.racingLineProgress
        );
      }

      // Live animated metric updates
      if (distValRef.current) {
        distValRef.current.textContent = circ.distanceValue.toFixed(1);
      }
      if (cornersValRef.current) {
        cornersValRef.current.textContent = String(circ.cornersValue);
      }
      if (elevValRef.current) {
        elevValRef.current.textContent = String(circ.elevationValue);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section
      id="circuit-experience"
      ref={sectionRef}
      className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden select-none"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {/* Left Column: Chapter 04 Title, Description & Unified Telemetry Specs */}
      <div
        ref={titleGroupRef}
        className="absolute top-[10vh] md:top-[12vh] left-[6vw] md:left-[8vw] flex flex-col gap-3 max-w-[90vw] md:max-w-xl pointer-events-none z-10"
      >
        <div className="flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.14em] text-text-secondary uppercase">
          <div className="inline-flex items-center gap-1.5 text-text-primary font-medium">
            <span className="w-1.5 h-1.5 bg-accent-red rounded-full inline-block" />
            <span>SYSTEM 04</span>
          </div>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">THE CIRCUIT [APEX VALIDATION]</span>
        </div>

        <div className="flex flex-col leading-[0.84] mt-1">
          <span className="font-display text-[clamp(3.8rem,9vw,8.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            THE
          </span>
          <span className="font-display text-[clamp(3.8rem,9vw,8.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            CIRCUIT<span className="text-accent-red">.</span>
          </span>
        </div>

        <p className="font-sans text-xs md:text-sm text-text-secondary tracking-wide max-w-md font-light leading-relaxed">
          Where engineering theory meets tarmac. High lateral loads, rapid elevation drops, and aggressive apex curbs test every system.
        </p>

        {/* Unified Conceptual Telemetry Strip */}
        <div className="flex flex-wrap items-center gap-6 md:gap-8 pt-3 border-t border-white/10 mt-1">
          {/* Metric 1: Track Distance */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span
                ref={distValRef}
                className="font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary tabular-nums"
              >
                5.8
              </span>
              <span className="font-mono text-xs md:text-sm font-semibold text-accent-red">
                KM
              </span>
            </div>
            <span className="font-mono text-[0.65rem] md:text-[0.7rem] tracking-[0.18em] text-text-secondary uppercase mt-0.5">
              TRACK DISTANCE
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/15" />

          {/* Metric 2: Apex Corners */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span
                ref={cornersValRef}
                className="font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary tabular-nums"
              >
                27
              </span>
              <span className="font-mono text-xs md:text-sm font-medium text-text-secondary uppercase">
                APEX
              </span>
            </div>
            <span className="font-mono text-[0.65rem] md:text-[0.7rem] tracking-[0.18em] text-text-secondary uppercase mt-0.5">
              CORNERS
            </span>
          </div>

          <div className="hidden sm:block w-px h-8 bg-white/15" />

          {/* Metric 3: Elevation Shifts */}
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span
                ref={elevValRef}
                className="font-display text-3xl md:text-5xl font-bold tracking-tight text-text-primary tabular-nums"
              >
                18
              </span>
              <span className="font-mono text-xs md:text-sm font-medium text-text-secondary uppercase">
                SHIFTS
              </span>
            </div>
            <span className="font-mono text-[0.65rem] md:text-[0.7rem] tracking-[0.18em] text-text-secondary uppercase mt-0.5">
              ELEVATION
            </span>
          </div>
        </div>
      </div>

      {/* Blueprint Circuit Map Overlay (Positioned in Right Visual Field) */}
      <div className="absolute inset-0 flex items-center justify-end pr-[4vw] md:pr-[6vw] pointer-events-none z-[5]">
        <div className="w-[85vw] md:w-[54vw] max-w-[850px] h-[45vh] md:h-[60vh] flex items-center justify-center">
          <CircuitMap ref={circuitMapRef} />
        </div>
      </div>
    </section>
  );
}
