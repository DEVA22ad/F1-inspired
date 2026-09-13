"use client";

import React, { useEffect, useRef, useState } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeHeroTimeline } from "@/lib/animation/hero";
import { autoScroll } from "@/lib/animation/autoScroll";

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // 1. System Boot Micro UI
  const bootContainerRef = useRef<HTMLDivElement | null>(null);
  const aeroStatusRef = useRef<HTMLSpanElement | null>(null);
  const powerStatusRef = useRef<HTMLSpanElement | null>(null);
  const tractionStatusRef = useRef<HTMLSpanElement | null>(null);
  const teleStatusRef = useRef<HTMLSpanElement | null>(null);

  // 2. Vertical Ignition Marker
  const markerRef = useRef<HTMLDivElement | null>(null);

  // 3. Race Control Indicator
  const raceControlRef = useRef<HTMLDivElement | null>(null);
  const raceControlDotRef = useRef<HTMLSpanElement | null>(null);
  const raceControlTextRef = useRef<HTMLSpanElement | null>(null);

  // 4. Car-Anchored Telemetry
  const carTeleRef = useRef<HTMLDivElement | null>(null);
  const puStateTextRef = useRef<HTMLSpanElement | null>(null);

  // 5. Master Display Typography
  const typographyContainerRef = useRef<HTMLDivElement | null>(null);
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);
  const statementRef = useRef<HTMLDivElement | null>(null);

  // 6. Scroll Initiation Prompt
  const cueRef = useRef<HTMLDivElement | null>(null);
  const cueTextRef = useRef<HTMLSpanElement | null>(null);
  const cueDotRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const isReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const unsubAuto = autoScroll.subscribe((active) => {
      setIsAutoScrolling(active);
    });

    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeHeroTimeline(progress);

      // Strict visibility boundary: false for progress >= 0.100
      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        section.style.opacity = "0";
        section.style.pointerEvents = "none";
        return;
      }

      section.style.visibility = "visible";
      section.style.opacity = timeline.heroOpacity.toFixed(3);
      section.style.transform = `translateY(${timeline.heroTranslateY.toFixed(1)}px)`;

      // 1. System Boot Micro UI
      if (bootContainerRef.current) {
        bootContainerRef.current.style.opacity = timeline.bootOpacity.toFixed(3);
        bootContainerRef.current.style.transform = `translateY(${timeline.bootTranslateY.toFixed(1)}px)`;
      }
      if (aeroStatusRef.current) {
        aeroStatusRef.current.textContent = timeline.aeroReady ? "READY" : "INIT...";
        aeroStatusRef.current.className = timeline.aeroReady ? "text-white font-medium" : "text-white/30";
      }
      if (powerStatusRef.current) {
        powerStatusRef.current.textContent = timeline.powerReady ? "READY" : "STANDBY";
        powerStatusRef.current.className = timeline.powerReady ? "text-white font-medium" : "text-white/30";
      }
      if (tractionStatusRef.current) {
        tractionStatusRef.current.textContent = timeline.tractionReady ? "READY" : "CALIB...";
        tractionStatusRef.current.className = timeline.tractionReady ? "text-white font-medium" : "text-white/30";
      }
      if (teleStatusRef.current) {
        teleStatusRef.current.textContent = timeline.telemetryLinked ? "LINKED" : "SEARCH";
        teleStatusRef.current.className = timeline.telemetryLinked ? "text-accent-red font-medium" : "text-white/30";
      }

      // 2. Vertical Ignition Marker
      if (markerRef.current) {
        markerRef.current.style.opacity = timeline.markerOpacity.toFixed(3);
        markerRef.current.style.transform = `translateY(${timeline.markerTranslateY.toFixed(1)}px)`;
      }

      // 3. Race Control / Ignition Status Indicator
      if (raceControlRef.current) {
        raceControlRef.current.style.opacity = timeline.raceControlOpacity.toFixed(3);
        raceControlRef.current.style.transform = `translateY(${timeline.raceControlTranslateY.toFixed(1)}px)`;
      }
      if (raceControlDotRef.current) {
        raceControlDotRef.current.className = `w-1.5 h-1.5 rounded-full inline-block ${
          timeline.isGreenLight
            ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
            : "bg-accent-red shadow-[0_0_6px_var(--accent-red-glow)]"
        }`;
      }
      if (raceControlTextRef.current) {
        raceControlTextRef.current.textContent = timeline.isGreenLight
          ? "RACE CONTROL // GREEN LIGHT"
          : "RACE CONTROL // STANDBY";
      }

      // 4. Car-Anchored Micro Telemetry
      if (carTeleRef.current) {
        carTeleRef.current.style.opacity = timeline.carTelemetryOpacity.toFixed(3);
      }
      if (puStateTextRef.current) {
        puStateTextRef.current.textContent = timeline.powerUnitOnline ? "ONLINE" : "STANDBY";
        puStateTextRef.current.className = timeline.powerUnitOnline ? "text-emerald-400 font-medium" : "text-white/40";
      }

      // 5. Master Display Typography (Velocity Pull)
      if (line1Ref.current) {
        const p1 = timeline.line1Progress;
        line1Ref.current.style.opacity = p1.toFixed(3);
        if (!isReducedMotion) {
          const transX = (1 - p1) * -30;
          const scaleX = 1 + (1 - p1) * 0.04;
          line1Ref.current.style.transform = `translateX(${transX.toFixed(1)}px) scaleX(${scaleX.toFixed(3)})`;
        }
      }
      if (line2Ref.current) {
        const p2 = timeline.line2Progress;
        line2Ref.current.style.opacity = p2.toFixed(3);
        if (!isReducedMotion) {
          const transX = (1 - p2) * -30;
          const scaleX = 1 + (1 - p2) * 0.04;
          line2Ref.current.style.transform = `translateX(${transX.toFixed(1)}px) scaleX(${scaleX.toFixed(3)})`;
        }
      }
      if (statementRef.current) {
        statementRef.current.style.opacity = timeline.statementOpacity.toFixed(3);
        statementRef.current.style.transform = `translateY(${timeline.statementTranslateY.toFixed(1)}px)`;
      }

      // 6. Scroll Initiation Cue
      if (cueRef.current) {
        cueRef.current.style.opacity = timeline.cueOpacity.toFixed(3);
        cueRef.current.style.transform = `translate(-50%, ${timeline.cueTranslateY.toFixed(1)}px)`;
        cueRef.current.style.visibility = timeline.cueOpacity <= 0.01 ? "hidden" : "visible";
      }
      if (cueTextRef.current) {
        cueTextRef.current.textContent = timeline.isInitiated ? "SEQUENCE // ACTIVE" : "SCROLL TO INITIATE";
      }
      if (cueDotRef.current) {
        cueDotRef.current.className = `w-1.5 h-1.5 rounded-full inline-block ${
          timeline.isInitiated ? "bg-accent-red animate-ping" : "bg-white/80"
        }`;
      }
    });

    return () => {
      unsubAuto();
      unsubscribe();
    };
  }, []);

  const handleToggleAutoScroll = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    autoScroll.toggle();
  };

  return (
    <section
      id="hero-experience"
      ref={sectionRef}
      aria-label="Pre-Race Ignition Sequence"
      className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden select-none"
      style={{ visibility: "hidden", opacity: 0 }}
    >
      {/* 1. System Boot Micro UI (Upper-Left Safe Area) */}
      <div
        ref={bootContainerRef}
        className="absolute top-[12vh] md:top-[13vh] left-[6vw] md:left-[7vw] flex flex-col gap-1.5 max-w-[260px] pointer-events-none will-change-[transform,opacity]"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2 font-mono text-[0.62rem] md:text-[0.68rem] tracking-[0.2em] text-white/50 uppercase">
          <span className="w-1 h-1 bg-accent-red rounded-full shadow-[0_0_4px_var(--accent-red-glow)]" />
          <span>SYSTEM // APEX-01</span>
        </div>
        <span className="font-mono text-[0.58rem] tracking-[0.16em] text-white/30 uppercase">
          INITIALIZING RACE SEQUENCE
        </span>

        {/* Subsystem Boot Diagnostics */}
        <div className="flex flex-col gap-1 pt-1.5 border-t border-white/10 font-mono text-[0.6rem] md:text-[0.65rem] tracking-[0.16em] uppercase">
          <div className="flex justify-between items-center text-white/40">
            <span>AERODYNAMICS</span>
            <span ref={aeroStatusRef} className="text-white/30">INIT...</span>
          </div>
          <div className="flex justify-between items-center text-white/40">
            <span>POWER UNIT</span>
            <span ref={powerStatusRef} className="text-white/30">STANDBY</span>
          </div>
          <div className="flex justify-between items-center text-white/40">
            <span>TRACTION</span>
            <span ref={tractionStatusRef} className="text-white/30">CALIB...</span>
          </div>
          <div className="flex justify-between items-center text-white/40">
            <span>TELEMETRY</span>
            <span ref={teleStatusRef} className="text-white/30">SEARCH</span>
          </div>
        </div>
      </div>

      {/* 2. Vertical Ignition Calibration Marker (Left Margin) */}
      <div
        ref={markerRef}
        className="hidden md:flex absolute top-[28vh] left-[3vw] flex-col items-center gap-3 font-mono text-[0.55rem] tracking-[0.25em] text-white/30 pointer-events-none will-change-[transform,opacity]"
        style={{ opacity: 0 }}
      >
        <span className="w-px h-8 bg-white/20" />
        <span>01</span>
        <span className="w-px h-6 bg-accent-red/60" />
        <span>02</span>
        <span className="w-px h-6 bg-white/20" />
        <span>03</span>
        <span className="w-px h-8 bg-white/20" />
      </div>

      {/* 3. Race Control / Ignition Status Indicator */}
      <div
        ref={raceControlRef}
        className="absolute top-[23vh] md:top-[25vh] left-[6vw] md:left-[7vw] flex items-center gap-2.5 font-mono text-[0.65rem] md:text-xs tracking-[0.18em] text-white/70 uppercase pointer-events-none will-change-[transform,opacity]"
        style={{ opacity: 0 }}
      >
        <span ref={raceControlDotRef} className="w-1.5 h-1.5 bg-accent-red rounded-full" />
        <span ref={raceControlTextRef} className="font-semibold text-white tracking-wider">
          RACE CONTROL // STANDBY
        </span>
        <span className="hidden sm:inline-block text-white/20">|</span>
        <span className="hidden sm:inline-block text-white/40">SESSION 01</span>
      </div>

      {/* 4. Master Display Typography (Negative Space on Left) */}
      <div
        ref={typographyContainerRef}
        className="absolute top-[28vh] md:top-[31vh] left-[6vw] md:left-[7vw] max-w-[90vw] md:max-w-2xl flex flex-col gap-3 pointer-events-none"
      >
        <div className="flex flex-col leading-[0.84] tracking-[-0.03em] font-display font-black text-text-primary uppercase select-none">
          <div className="overflow-visible py-0.5">
            <span
              ref={line1Ref}
              className="inline-block text-[clamp(4.2rem,11.5vw,11.5rem)] will-change-[transform,opacity] origin-left"
              style={{ opacity: 0 }}
            >
              ENGINEERED
            </span>
          </div>
          <div className="overflow-visible py-0.5">
            <span
              ref={line2Ref}
              className="inline-block text-[clamp(4.2rem,11.5vw,11.5rem)] will-change-[transform,opacity] origin-left"
              style={{ opacity: 0 }}
            >
              FOR SPEED<span className="text-accent-red">.</span>
            </span>
          </div>
        </div>

        {/* Supporting Statement & Actions */}
        <div
          ref={statementRef}
          className="flex flex-col gap-4 pt-3 border-t border-white/10 max-w-xl will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3">
            <div className="text-[clamp(0.85rem,1.1vw,1.05rem)] leading-snug font-light text-text-secondary">
              <p className="text-text-primary font-normal">A machine shaped by speed,</p>
              <p className="text-text-secondary">precision and aerodynamic control.</p>
            </div>
            <div className="hidden sm:flex flex-col items-end gap-0.5 font-mono text-right">
              <span className="text-[0.6rem] tracking-[0.14em] text-text-muted">AERO CONFIG</span>
              <span className="text-[0.7rem] tracking-wider text-text-primary">LOW DRAG // APEX SPEC</span>
            </div>
          </div>

          {/* Primary Action Button: INITIATE AUTO DRIVE */}
          <div className="flex items-center gap-3 pt-1 pointer-events-auto">
            <button
              type="button"
              onClick={handleToggleAutoScroll}
              aria-label={isAutoScrolling ? "Pause auto drive" : "Start cinematic auto drive"}
              className={`group relative inline-flex items-center gap-3 px-6 py-3 font-mono text-xs md:text-sm tracking-[0.22em] text-white uppercase border rounded-xs backdrop-blur-md transition-all duration-300 cursor-pointer ${
                isAutoScrolling
                  ? "bg-accent-red/20 border-accent-red shadow-[0_0_20px_rgba(225,6,0,0.4)]"
                  : "bg-black/60 border-accent-red/60 hover:border-accent-red hover:bg-accent-red/15 shadow-[0_0_15px_rgba(225,6,0,0.25)] hover:shadow-[0_0_25px_rgba(225,6,0,0.4)]"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isAutoScrolling
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"
                    : "bg-accent-red shadow-[0_0_8px_var(--accent-red-glow)] group-hover:scale-125"
                }`}
              />
              <span className="font-semibold text-text-primary">
                {isAutoScrolling ? "PAUSE AUTO DRIVE" : "INITIATE AUTO DRIVE"}
              </span>
              <span className="text-accent-red group-hover:translate-x-1 transition-transform duration-300 ease-out text-sm">
                {isAutoScrolling ? "❚❚" : "▶"}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* 5. Car-Anchored Contextual Micro Telemetry (Right-Center Safe Area) */}
      <div
        ref={carTeleRef}
        className="hidden lg:flex absolute top-[44vh] right-[10vw] flex-col items-end gap-1 font-mono text-[0.65rem] tracking-[0.18em] text-white/50 uppercase pointer-events-none will-change-opacity"
        style={{ opacity: 0 }}
      >
        <div className="flex items-center gap-2">
          <span>CHASSIS // 01</span>
          <span className="w-1 h-1 bg-white/40 rounded-full" />
          <span className="text-white/80">REAR AERO ACTIVE</span>
        </div>
        <div className="flex items-center gap-2">
          <span>POWER UNIT</span>
          <span className="w-1 h-1 bg-accent-red rounded-full" />
          <span ref={puStateTextRef} className="text-white/40">STANDBY</span>
        </div>
      </div>

      {/* 6. Intentional Scroll Initiation Cue */}
      <div
        ref={cueRef}
        onClick={handleToggleAutoScroll}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-auto flex flex-col items-center gap-2 font-mono text-[0.65rem] tracking-[0.2em] text-white/60 will-change-[opacity,transform] select-none cursor-pointer group"
        aria-label={isAutoScrolling ? "Pause auto drive" : "Click to start auto drive or scroll manually"}
      >
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-black/60 border border-white/15 rounded-xs backdrop-blur-md group-hover:border-accent-red/60 transition-colors">
          <span ref={cueDotRef} className={`w-1.5 h-1.5 rounded-full inline-block ${isAutoScrolling ? "bg-accent-red animate-pulse" : "bg-white/80"}`} />
          <span ref={cueTextRef} className="uppercase font-medium text-white tracking-widest group-hover:text-accent-red transition-colors">
            {isAutoScrolling ? "AUTO DRIVE ACTIVE" : "SCROLL TO INITIATE"}
          </span>
        </div>
        <div className="w-px h-5 bg-white/15 relative overflow-hidden">
          <div className="w-px h-2 bg-accent-red absolute top-0 left-0 animate-scroll-pulse" />
        </div>
      </div>
    </section>
  );
}

