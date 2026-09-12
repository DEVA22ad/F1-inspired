"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { computeMachineTimeline } from "@/lib/animation/machine";
import TechnicalLabel from "./TechnicalLabel";
import PerformanceMetric from "./PerformanceMetric";

export default function MachineSection() {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const titleContainerRef = useRef<HTMLDivElement | null>(null);

  // Metric container refs
  const powerRef = useRef<HTMLDivElement | null>(null);
  const accelRef = useRef<HTMLDivElement | null>(null);
  const speedRef = useRef<HTMLDivElement | null>(null);
  const massRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const unsubscribe = scrollBridge.subscribe((progress) => {
      const section = sectionRef.current;
      if (!section) return;

      const timeline = computeMachineTimeline(progress);

      if (!timeline.isVisible) {
        section.style.visibility = "hidden";
        return;
      }

      section.style.visibility = "visible";

      // 1. Chapter Title (THE MACHINE)
      if (titleContainerRef.current) {
        titleContainerRef.current.style.opacity = timeline.titleOpacity.toFixed(3);
        titleContainerRef.current.style.transform = `translateY(${timeline.titleTranslateY.toFixed(
          1
        )}px) scale(${timeline.titleScale.toFixed(3)})`;
      }

      // 2. Metric 1: POWER (950 HP)
      if (powerRef.current) {
        const p = timeline.power;
        powerRef.current.style.opacity = p.opacity.toFixed(3);
        powerRef.current.style.transform = `translateY(${p.translateY.toFixed(1)}px)`;
        const valEl = powerRef.current.querySelector("[data-metric-value]");
        if (valEl) {
          valEl.textContent = String(p.counterValue);
        }
      }

      // 3. Metric 2: ACCELERATION (2.8 SEC)
      if (accelRef.current) {
        const a = timeline.acceleration;
        accelRef.current.style.opacity = a.opacity.toFixed(3);
        accelRef.current.style.transform = `translateY(${a.translateY.toFixed(1)}px)`;
        const valEl = accelRef.current.querySelector("[data-metric-value]");
        if (valEl) {
          valEl.textContent = a.counterValue.toFixed(1);
        }
      }

      // 4. Metric 3: TOP SPEED (320 KM/H)
      if (speedRef.current) {
        const s = timeline.speed;
        speedRef.current.style.opacity = s.opacity.toFixed(3);
        speedRef.current.style.transform = `translateY(${s.translateY.toFixed(1)}px)`;
        const valEl = speedRef.current.querySelector("[data-metric-value]");
        if (valEl) {
          valEl.textContent = String(s.counterValue);
        }
      }

      // 5. Metric 4: MASS (795 KG)
      if (massRef.current) {
        const m = timeline.mass;
        massRef.current.style.opacity = m.opacity.toFixed(3);
        massRef.current.style.transform = `translateY(${m.translateY.toFixed(1)}px)`;
        const valEl = massRef.current.querySelector("[data-metric-value]");
        if (valEl) {
          valEl.textContent = String(m.counterValue);
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <section
      id="machine-experience"
      ref={sectionRef}
      className="fixed inset-0 z-10 pointer-events-none will-change-[transform,opacity] overflow-hidden"
      style={{ visibility: "hidden" }}
    >
      {/* Chapter 02 Title & Identification */}
      <div
        ref={titleContainerRef}
        className="absolute top-[10vh] left-[6vw] md:left-[8vw] flex flex-col gap-2 pointer-events-none will-change-[transform,opacity]"
        style={{ opacity: 0 }}
      >
        <TechnicalLabel
          systemId="SYSTEM 02"
          statusText="MACHINE ANALYSIS [ACTIVE]"
          location="TELEMETRY TELE-LINK"
        />

        <div className="flex flex-col leading-[0.84] mt-1">
          <span className="font-display text-[clamp(4.5rem,11vw,10.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            THE
          </span>
          <span className="font-display text-[clamp(4.5rem,11vw,10.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            MACHINE<span className="text-accent-red">.</span>
          </span>
        </div>
      </div>

      {/* Metric 1: POWER — 950 HP (Top Right) */}
      <PerformanceMetric
        ref={powerRef}
        label="POWER UNIT"
        telemetrySub="V10 HYBRID IC + MGU-K"
        unit="HP"
        alignment="right"
        positionClass="top-[12vh] md:top-[14vh] right-[6vw] md:right-[8vw]"
      />

      {/* Metric 2: ACCELERATION — 2.8 SEC (Mid Left) */}
      <PerformanceMetric
        ref={accelRef}
        label="ACCELERATION"
        telemetrySub="0–100 KM/H LAUNCH"
        unit="SEC"
        subText="0–100"
        alignment="left"
        positionClass="top-[38vh] md:top-[40vh] left-[6vw] md:left-[8vw]"
      />

      {/* Metric 3: TOP SPEED — 320 KM/H (Mid Right) */}
      <PerformanceMetric
        ref={speedRef}
        label="TOP SPEED"
        telemetrySub="MONACO APEX VELOCITY"
        unit="KM/H"
        alignment="right"
        positionClass="top-[44vh] md:top-[46vh] right-[6vw] md:right-[8vw]"
      />

      {/* Metric 4: MASS — 795 KG (Bottom Left) */}
      <PerformanceMetric
        ref={massRef}
        label="MINIMUM MASS"
        telemetrySub="DRY SPEC CHASSIS"
        unit="KG"
        subText="FIA MIN"
        alignment="left"
        positionClass="bottom-[18vh] md:bottom-[20vh] left-[6vw] md:left-[8vw]"
      />
    </section>
  );
}
