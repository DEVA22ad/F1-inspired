"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { SubSystemState } from "@/lib/animation/engineering";

export interface ControlVisualizationHandle {
  updateState: (state: SubSystemState) => void;
}

const ControlVisualization = forwardRef<ControlVisualizationHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const steeringArcRef = useRef<SVGPathElement | null>(null);
  const brakeBarRef = useRef<SVGRectElement | null>(null);
  const tractionCurveRef = useRef<SVGPathElement | null>(null);
  const apexIndicatorRef = useRef<SVGCircleElement | null>(null);

  useImperativeHandle(ref, () => ({
    updateState(state: SubSystemState) {
      const el = containerRef.current;
      if (!el) return;

      if (!state.isVisible) {
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        return;
      }

      el.style.opacity = state.opacity.toFixed(3);
      el.style.transform = `translateY(${state.translateY.toFixed(1)}px)`;

      const p = state.drawProgress;

      // Steering Arc progression
      if (steeringArcRef.current) {
        const offset = (1 - p) * 160;
        steeringArcRef.current.style.strokeDashoffset = `${offset.toFixed(1)}px`;
      }

      // Braking Pressure Bar Fill
      if (brakeBarRef.current) {
        const barWidth = p * 120;
        brakeBarRef.current.setAttribute("width", barWidth.toFixed(1));
      }

      // Traction Curve progression
      if (tractionCurveRef.current) {
        const offset = (1 - p) * 220;
        tractionCurveRef.current.style.strokeDashoffset = `${offset.toFixed(1)}px`;
      }

      // Apex Target Marker
      if (apexIndicatorRef.current) {
        apexIndicatorRef.current.style.transform = `scale(${Math.min(Math.max(p * 1.5, 0), 1)})`;
      }
    },
  }));

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none will-change-[transform,opacity] select-none transition-opacity duration-75"
      style={{ opacity: 0 }}
    >
      {/* Title & System Identification Header */}
      <div className="absolute top-[12vh] md:top-[14vh] left-[6vw] md:left-[8vw] flex flex-col gap-2 max-w-[90vw] md:max-w-xl z-10">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] md:text-xs tracking-[0.16em] text-white/50 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_6px_var(--accent-red-glow)]" />
          <span>SYS // 03.3</span>
          <span className="text-white/20">|</span>
          <span>CHASSIS DYNAMICS & VECTORING</span>
        </div>

        <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-black tracking-[-0.03em] leading-[0.88] text-text-primary uppercase">
          CONTROL<span className="text-accent-red">.</span>
        </h2>

        <p className="font-sans text-xs md:text-sm text-text-secondary tracking-wide max-w-md font-light leading-relaxed mt-1">
          Power is nothing without control. Precise steering geometry, hydraulic braking pressure, and predictive traction algorithms lock the chassis onto the apex.
        </p>
      </div>

      {/* Precision Mechanical Control Graphics Overlay */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[4vw] pointer-events-none z-[5]">
        <svg
          viewBox="0 0 1000 450"
          className="w-[92vw] max-w-[1100px] h-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="ctrlLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E10600" stopOpacity="1" />
            </linearGradient>

            <linearGradient id="brakeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E10600" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Coordinate Datum Grid & Centerline */}
          <g opacity="0.2" stroke="#FFFFFF" strokeWidth="0.5">
            <line x1="500" y1="50" x2="500" y2="400" strokeDasharray="3 6" />
            <line x1="100" y1="225" x2="900" y2="225" strokeDasharray="3 6" />
            <circle cx="500" cy="225" r="40" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 4" />
            <circle cx="500" cy="225" r="2" fill="#E10600" />
          </g>

          {/* 1. STEERING / APEX VECTOR (Top Right) */}
          <g transform="translate(720, 130)">
            {/* Steering angle gauge arc */}
            <circle cx="0" cy="0" r="55" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.3" />
            <path
              ref={steeringArcRef}
              d="M -38.8 38.8 A 55 55 0 0 1 45 -31"
              stroke="url(#ctrlLineGrad)"
              strokeWidth="1.5"
              strokeDasharray="160"
              style={{ strokeDashoffset: "160px" }}
            />
            {/* Apex vector line */}
            <line x1="0" y1="0" x2="45" y2="-31" stroke="#E10600" strokeWidth="1" />
            <circle
              ref={apexIndicatorRef}
              cx="45"
              cy="-31"
              r="3.5"
              fill="#E10600"
              className="origin-[45px_-31px] transition-transform duration-75"
            />
            <text x="-65" y="-65" className="font-mono text-[10px] tracking-[0.16em] fill-white font-medium">STEERING</text>
            <text x="-65" y="-53" className="font-mono text-[8px] tracking-[0.12em] fill-white/40">APEX VECTOR</text>
          </g>

          {/* 2. BRAKING / PRESSURE DISTRIBUTION (Center / Lower-Mid) */}
          <g transform="translate(420, 310)">
            <text x="0" y="-18" className="font-mono text-[10px] tracking-[0.16em] fill-white font-medium">BRAKING</text>
            <text x="0" y="-6" className="font-mono text-[8px] tracking-[0.12em] fill-white/40">PRESSURE DISTRIBUTION</text>
            
            {/* Pressure Track */}
            <rect x="0" y="4" width="120" height="4" rx="2" fill="#FFFFFF" fillOpacity="0.1" />
            <rect
              ref={brakeBarRef}
              x="0"
              y="4"
              width="0"
              height="4"
              rx="2"
              fill="url(#brakeGrad)"
            />
            {/* Calibration ticks */}
            <line x1="30" y1="0" x2="30" y2="12" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
            <line x1="60" y1="0" x2="60" y2="12" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
            <line x1="90" y1="0" x2="90" y2="12" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.3" />
            <line x1="120" y1="0" x2="120" y2="12" stroke="#E10600" strokeWidth="1" opacity="0.8" />
          </g>

          {/* 3. TRACTION / RESPONSE CURVE (Bottom Right) */}
          <g transform="translate(720, 310)">
            <text x="0" y="-20" className="font-mono text-[10px] tracking-[0.16em] fill-white font-medium">TRACTION</text>
            <text x="0" y="-8" className="font-mono text-[8px] tracking-[0.12em] fill-white/40">RESPONSE CURVE</text>

            {/* Slip Angle Response Curve */}
            <path
              d="M 0 30 L 140 30"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              opacity="0.3"
            />
            <path
              d="M 0 30 L 0 -10"
              stroke="#FFFFFF"
              strokeWidth="0.5"
              strokeDasharray="2 4"
              opacity="0.3"
            />
            <path
              ref={tractionCurveRef}
              d="M 0 30 C 40 28, 60 5, 85 -5 C 105 -12, 125 5, 140 12"
              stroke="url(#ctrlLineGrad)"
              strokeWidth="1.5"
              strokeDasharray="220"
              style={{ strokeDashoffset: "220px" }}
            />
            <circle cx="85" cy="-5" r="2.5" fill="#E10600" />
          </g>
        </svg>
      </div>
    </div>
  );
});

ControlVisualization.displayName = "ControlVisualization";

export default ControlVisualization;
