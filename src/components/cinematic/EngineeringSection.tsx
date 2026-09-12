"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeEngineeringTimeline } from "@/lib/animation/engineering";
import EngineeringIndex, { EngineeringIndexHandle } from "./EngineeringIndex";
import AeroVisualization, { AeroVisualizationHandle } from "./AeroVisualization";
import PowertrainVisualization, { PowertrainVisualizationHandle } from "./PowertrainVisualization";
import ControlVisualization, { ControlVisualizationHandle } from "./ControlVisualization";

export default function EngineeringSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const introContainerRef = useRef<HTMLDivElement | null>(null);
  const indexContainerRef = useRef<HTMLDivElement | null>(null);

  // Sub-system visualization handles
  const indexHandleRef = useRef<EngineeringIndexHandle | null>(null);
  const aeroHandleRef = useRef<AeroVisualizationHandle | null>(null);
  const powertrainHandleRef = useRef<PowertrainVisualizationHandle | null>(null);
  const controlHandleRef = useRef<ControlVisualizationHandle | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeEngineeringTimeline(progress);

      // Visibility Gate
      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        return;
      }

      section.style.visibility = "visible";

      // 1. Chapter 03 Intro ("ENGINEERED TO FIND THE APEX.")
      if (introContainerRef.current) {
        introContainerRef.current.style.opacity = timeline.introOpacity.toFixed(3);
        introContainerRef.current.style.transform = `translateY(${timeline.introTranslateY.toFixed(1)}px)`;
      }

      // 2. Engineering System Index (01/02/03)
      if (indexHandleRef.current) {
        indexHandleRef.current.setActiveIndex(timeline.activeSystemIndex);
      }
      if (indexContainerRef.current) {
        const indexOpacity = timeline.activeSystemIndex > 0 ? 1 : 0;
        indexContainerRef.current.style.opacity = String(indexOpacity);
      }

      // 3. Sub-System 1: Aerodynamics
      if (aeroHandleRef.current) {
        aeroHandleRef.current.updateState(timeline.aero);
      }

      // 4. Sub-System 2: Powertrain
      if (powertrainHandleRef.current) {
        powertrainHandleRef.current.updateState(timeline.powertrain);
      }

      // 5. Sub-System 3: Control
      if (controlHandleRef.current) {
        controlHandleRef.current.updateState(timeline.control);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section
      id="engineering-experience"
      ref={sectionRef}
      className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden select-none"
      style={{ visibility: "hidden" }}
    >
      {/* Chapter 03 Intro Header & Statement (Projected into Upper Composition) */}
      <div
        ref={introContainerRef}
        className="absolute top-[10vh] left-[6vw] md:left-[8vw] flex flex-col gap-2 pointer-events-none will-change-[transform,opacity] max-w-[90vw] md:max-w-4xl"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.14em] text-text-secondary uppercase">
          <div className="inline-flex items-center gap-1.5 text-text-primary font-medium">
            <span className="w-1.5 h-1.5 bg-accent-red rounded-full inline-block" />
            <span>SYSTEM 03</span>
          </div>
          <span className="text-text-muted">/</span>
          <span className="text-text-secondary">ENGINEERING ANALYSIS</span>
          <span className="hidden md:inline-block text-text-muted">/</span>
          <span className="hidden md:inline-block text-text-muted">AERODYNAMICS · POWERTRAIN · CONTROL</span>
        </div>

        <div className="flex flex-col leading-[0.84] mt-2">
          <span className="font-display text-[clamp(4rem,9.5vw,9.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            ENGINEERED
          </span>
          <span className="font-display text-[clamp(4rem,9.5vw,9.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            TO FIND
          </span>
          <span className="font-display text-[clamp(4rem,9.5vw,9.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            THE APEX<span className="text-accent-red">.</span>
          </span>
        </div>

        <p className="font-sans text-xs md:text-base text-text-secondary tracking-wide max-w-lg font-light leading-relaxed mt-2">
          Every surface has a purpose. Every movement has a consequence.
        </p>
      </div>

      {/* Engineering Subsystems Mini Navigation Index (Top Right) */}
      <div
        ref={indexContainerRef}
        className="absolute top-[12vh] right-[6vw] md:right-[8vw] pointer-events-none transition-opacity duration-200"
        style={{ opacity: 0 }}
      >
        <EngineeringIndex ref={indexHandleRef} />
      </div>

      {/* Sub-System Visualizations */}
      <AeroVisualization ref={aeroHandleRef} />
      <PowertrainVisualization ref={powertrainHandleRef} />
      <ControlVisualization ref={controlHandleRef} />
    </section>
  );
}
