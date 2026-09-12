"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeStadiumTimeline } from "@/lib/animation/stadium";

export default function StadiumSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // 1. Arrival Marker
  const arrivalMarkerRef = useRef<HTMLDivElement | null>(null);

  // 2. The Moment Group
  const momentGroupRef = useRef<HTMLDivElement | null>(null);
  const mTheRef = useRef<HTMLSpanElement | null>(null);
  const mMomentRef = useRef<HTMLSpanElement | null>(null);
  const mYoursRef = useRef<HTMLSpanElement | null>(null);
  const supportingCopyRef = useRef<HTMLParagraphElement | null>(null);

  // 3. Cross The Limit Climax Group
  const climaxGroupRef = useRef<HTMLDivElement | null>(null);
  const clCrossRef = useRef<HTMLSpanElement | null>(null);
  const clTheRef = useRef<HTMLSpanElement | null>(null);
  const clLimitRef = useRef<HTMLSpanElement | null>(null);

  // 4. Final Release Group
  const releaseGroupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeStadiumTimeline(progress);

      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        return;
      }

      section.style.visibility = "visible";

      // 1. Arrival Marker
      if (arrivalMarkerRef.current) {
        arrivalMarkerRef.current.style.opacity = timeline.arrivalMarkerOpacity.toFixed(3);
      }

      // 2. The Moment Group
      if (momentGroupRef.current) {
        const tm = timeline.theMoment;
        momentGroupRef.current.style.visibility = tm.isVisible ? "visible" : "hidden";

        if (mTheRef.current) {
          mTheRef.current.style.opacity = tm.wordThe.opacity.toFixed(3);
          mTheRef.current.style.transform = `translateY(${tm.wordThe.translateY.toFixed(1)}px) scale(${tm.wordThe.scale.toFixed(3)})`;
        }
        if (mMomentRef.current) {
          mMomentRef.current.style.opacity = tm.wordMoment.opacity.toFixed(3);
          mMomentRef.current.style.transform = `translateY(${tm.wordMoment.translateY.toFixed(1)}px) scale(${tm.wordMoment.scale.toFixed(3)})`;
        }
        if (mYoursRef.current) {
          mYoursRef.current.style.opacity = tm.wordIsYours.opacity.toFixed(3);
          mYoursRef.current.style.transform = `translateY(${tm.wordIsYours.translateY.toFixed(1)}px) scale(${tm.wordIsYours.scale.toFixed(3)})`;
        }
        if (supportingCopyRef.current) {
          supportingCopyRef.current.style.opacity = tm.supportingCopyOpacity.toFixed(3);
          supportingCopyRef.current.style.transform = `translateY(${tm.supportingCopyTranslateY.toFixed(1)}px)`;
        }
      }

      // 3. Climax: Cross The Limit
      if (climaxGroupRef.current) {
        const cl = timeline.crossLimit;
        climaxGroupRef.current.style.visibility = cl.isVisible ? "visible" : "hidden";

        if (clCrossRef.current) {
          clCrossRef.current.style.opacity = cl.wordCross.opacity.toFixed(3);
          clCrossRef.current.style.transform = `translateY(${cl.wordCross.translateY.toFixed(1)}px) scale(${cl.wordCross.scale.toFixed(3)})`;
        }
        if (clTheRef.current) {
          clTheRef.current.style.opacity = cl.wordThe.opacity.toFixed(3);
          clTheRef.current.style.transform = `translateY(${cl.wordThe.translateY.toFixed(1)}px) scale(${cl.wordThe.scale.toFixed(3)})`;
        }
        if (clLimitRef.current) {
          clLimitRef.current.style.opacity = cl.wordLimit.opacity.toFixed(3);
          clLimitRef.current.style.transform = `translateY(${cl.wordLimit.translateY.toFixed(1)}px) scale(${cl.wordLimit.scale.toFixed(3)})`;
        }
      }

      // 4. Final Release: The Race is Yours
      if (releaseGroupRef.current) {
        const fr = timeline.finalRelease;
        releaseGroupRef.current.style.visibility = fr.isVisible ? "visible" : "hidden";
        releaseGroupRef.current.style.opacity = fr.opacity.toFixed(3);
        releaseGroupRef.current.style.transform = `translateY(${fr.translateY.toFixed(1)}px)`;
        releaseGroupRef.current.style.pointerEvents = fr.isVisible ? "auto" : "none";
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const restartBtnRef = useRef<HTMLButtonElement | null>(null);

  const handleRestartMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const btn = restartBtnRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    // Restrained max 6px displacement
    const clampedX = Math.max(-6, Math.min(6, x * 0.15));
    const clampedY = Math.max(-6, Math.min(6, y * 0.15));
    btn.style.transform = `translate(${clampedX.toFixed(1)}px, ${clampedY.toFixed(1)}px)`;
  };

  const handleRestartMouseLeave = () => {
    const btn = restartBtnRef.current;
    if (btn) {
      btn.style.transform = "translate(0px, 0px)";
    }
  };

  const handleRestart = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="stadium-experience"
      ref={sectionRef}
      className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden select-none"
      style={{ visibility: "hidden" }}
    >
      {/* 1. Arrival Marker (Upper Left) */}
      <div
        ref={arrivalMarkerRef}
        className="absolute top-[10vh] left-[6vw] md:left-[8vw] flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.18em] text-text-secondary uppercase pointer-events-none"
        style={{ opacity: 0 }}
      >
        <div className="inline-flex items-center gap-1.5 text-text-primary font-medium">
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full inline-block animate-pulse" />
          <span>SYSTEM 06</span>
        </div>
        <span className="text-text-muted">/</span>
        <span className="text-text-secondary">ARRIVAL</span>
        <span className="hidden sm:inline-block text-text-muted">/</span>
        <span className="hidden sm:inline-block text-text-muted">STADIUM CIRCUIT APEX</span>
      </div>

      {/* 2. Anticipation: THE MOMENT IS YOURS. */}
      <div
        ref={momentGroupRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-[6vw] md:px-[8vw] pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        <div className="flex flex-col leading-[0.84] tracking-[-0.03em] font-display font-black text-text-primary uppercase select-none">
          <span
            ref={mTheRef}
            className="inline-block text-[clamp(3.5rem,11vw,11.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            THE
          </span>
          <span
            ref={mMomentRef}
            className="inline-block text-[clamp(3.5rem,11vw,11.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            MOMENT
          </span>
          <span
            ref={mYoursRef}
            className="inline-block text-[clamp(3.5rem,11vw,11.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            IS YOURS<span className="text-accent-red">.</span>
          </span>
        </div>

        <p
          ref={supportingCopyRef}
          className="font-sans text-xs md:text-sm text-text-secondary tracking-[0.15em] font-light uppercase mt-6 max-w-sm will-change-[transform,opacity]"
          style={{ opacity: 0 }}
        >
          Thousands watching. One line to cross.
        </p>
      </div>

      {/* 3. Climax: CROSS THE LIMIT. */}
      <div
        ref={climaxGroupRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-[6vw] md:px-[8vw] pointer-events-none"
        style={{ visibility: "hidden" }}
      >
        <div className="flex flex-col leading-[0.82] tracking-[-0.04em] font-display font-black text-text-primary uppercase select-none">
          <span
            ref={clCrossRef}
            className="inline-block text-[clamp(3.8rem,12vw,12.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            CROSS
          </span>
          <span
            ref={clTheRef}
            className="inline-block text-[clamp(3.8rem,12vw,12.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            THE
          </span>
          <span
            ref={clLimitRef}
            className="inline-block text-[clamp(3.8rem,12vw,12.5rem)] will-change-[transform,opacity]"
            style={{ opacity: 0 }}
          >
            LIMIT<span className="text-accent-red">.</span>
          </span>
        </div>
      </div>

      {/* 4. Release: THE RACE IS YOURS. + RESTART EXPERIENCE CTA */}
      <div
        ref={releaseGroupRef}
        className="absolute inset-0 flex flex-col items-center justify-center text-center px-[6vw] md:px-[8vw] pointer-events-none"
        style={{ visibility: "hidden", opacity: 0 }}
      >
        <div className="flex flex-col items-center gap-6 max-w-xl">
          {/* Final System Marker */}
          <div className="flex items-center gap-2 font-mono text-[10px] md:text-xs tracking-[0.25em] text-white/40 uppercase">
            <span className="w-1 h-1 bg-accent-red rounded-full" />
            <span>EXPERIENCE // COMPLETE</span>
          </div>

          {/* Release Headline */}
          <h2 className="font-display text-[clamp(2.2rem,6.5vw,5.5rem)] font-bold tracking-tight text-text-primary uppercase leading-tight">
            THE RACE IS YOURS<span className="text-accent-red">.</span>
          </h2>

          <p className="font-sans text-xs md:text-sm text-text-secondary tracking-widest font-light uppercase max-w-md leading-relaxed">
            Engineered through aerodynamic precision, delivered through hybrid torque, and mastered across every apex.
          </p>

          {/* Dual Action Controls: ENTER THE MACHINE (Primary) + RESTART EXPERIENCE (Secondary) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 pointer-events-auto">
            {/* Primary CTA: ENTER THE MACHINE */}
            <a
              href="/machine"
              className="group relative inline-flex items-center gap-3 px-7 py-3.5 font-mono text-xs md:text-sm tracking-[0.22em] text-white uppercase border border-accent-red/60 bg-black/60 backdrop-blur-md hover:border-accent-red hover:bg-accent-red/10 shadow-[0_0_20px_rgba(225,6,0,0.2)] hover:shadow-[0_0_30px_rgba(225,6,0,0.4)] transition-all duration-300 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_8px_var(--accent-red-glow)] group-hover:scale-125 transition-transform duration-200" />
              <span className="font-semibold text-text-primary">ENTER THE MACHINE</span>
              <span className="text-accent-red group-hover:translate-x-1 transition-transform duration-300 ease-out">
                →
              </span>
            </a>

            {/* Secondary CTA: RESTART EXPERIENCE */}
            <button
              ref={restartBtnRef}
              type="button"
              onClick={handleRestart}
              onMouseMove={handleRestartMouseMove}
              onMouseLeave={handleRestartMouseLeave}
              className="group relative inline-flex items-center gap-2.5 px-5 py-3.5 font-mono text-xs md:text-sm tracking-[0.20em] text-white/70 uppercase border border-white/15 bg-black/30 backdrop-blur-sm hover:border-white/40 hover:text-white hover:bg-black/60 transition-[border-color,background-color,color] duration-300 cursor-pointer will-change-transform"
            >
              <span>RESTART EXPERIENCE</span>
              <span className="text-sm leading-none group-hover:rotate-180 transition-transform duration-500 ease-out text-white/50 group-hover:text-white">
                ↻
              </span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
