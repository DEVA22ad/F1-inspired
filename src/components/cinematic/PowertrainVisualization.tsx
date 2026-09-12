"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { SubSystemState } from "@/lib/animation/engineering";

export interface PowertrainVisualizationHandle {
  updateState: (state: SubSystemState) => void;
}

const PowertrainVisualization = forwardRef<PowertrainVisualizationHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const flowPath1Ref = useRef<SVGPathElement | null>(null);
  const flowPath2Ref = useRef<SVGPathElement | null>(null);
  const flowPath3Ref = useRef<SVGPathElement | null>(null);
  const node1Ref = useRef<SVGGElement | null>(null);
  const node2Ref = useRef<SVGGElement | null>(null);
  const node3Ref = useRef<SVGGElement | null>(null);
  const node4Ref = useRef<SVGGElement | null>(null);

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

      // Progressive energy flow line draw
      const p = state.drawProgress;
      
      // Node 1: Power Unit (0.0 -> 0.35)
      const p1 = Math.min(Math.max(p / 0.35, 0), 1);
      if (node1Ref.current) {
        node1Ref.current.style.opacity = p1.toFixed(2);
        node1Ref.current.style.transform = `scale(${0.85 + 0.15 * p1})`;
      }
      if (flowPath1Ref.current) {
        flowPath1Ref.current.style.strokeDashoffset = `${((1 - p1) * 200).toFixed(1)}px`;
      }

      // Node 2: Energy Storage (0.25 -> 0.6)
      const p2 = Math.min(Math.max((p - 0.25) / 0.35, 0), 1);
      if (node2Ref.current) {
        node2Ref.current.style.opacity = p2.toFixed(2);
        node2Ref.current.style.transform = `scale(${0.85 + 0.15 * p2})`;
      }
      if (flowPath2Ref.current) {
        flowPath2Ref.current.style.strokeDashoffset = `${((1 - p2) * 200).toFixed(1)}px`;
      }

      // Node 3: Torque Delivery (0.5 -> 0.85)
      const p3 = Math.min(Math.max((p - 0.5) / 0.35, 0), 1);
      if (node3Ref.current) {
        node3Ref.current.style.opacity = p3.toFixed(2);
        node3Ref.current.style.transform = `scale(${0.85 + 0.15 * p3})`;
      }
      if (flowPath3Ref.current) {
        flowPath3Ref.current.style.strokeDashoffset = `${((1 - p3) * 200).toFixed(1)}px`;
      }

      // Node 4: Wheel Traction (0.75 -> 1.0)
      const p4 = Math.min(Math.max((p - 0.75) / 0.25, 0), 1);
      if (node4Ref.current) {
        node4Ref.current.style.opacity = p4.toFixed(2);
        node4Ref.current.style.transform = `scale(${0.85 + 0.15 * p4})`;
      }
    },
  }));

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none will-change-[transform,opacity] select-none transition-opacity duration-75"
      style={{ opacity: 0 }}
    >
      {/* Upper Editorial Safe Zone: Title & System Identification */}
      <div className="absolute top-[12vh] md:top-[14vh] left-[6vw] md:left-[8vw] flex flex-col gap-2 max-w-[90vw] md:max-w-xl z-10">
        <div className="flex items-center gap-2 font-mono text-[0.7rem] md:text-xs tracking-[0.16em] text-white/50 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_6px_var(--accent-red-glow)]" />
          <span>SYS // 03.2</span>
          <span className="text-white/20">|</span>
          <span>ENERGY CONVERSION & FLUX</span>
        </div>

        <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-black tracking-[-0.03em] leading-[0.88] text-text-primary uppercase">
          POWERTRAIN<span className="text-accent-red">.</span>
        </h2>

        <p className="font-sans text-xs md:text-sm text-text-secondary tracking-wide max-w-md font-light leading-relaxed mt-1">
          Power is only useful when it can be delivered. Instantaneous torque transfer synchronizes hybrid kinetic boost directly to asphalt.
        </p>
      </div>

      {/* Dedicated Lower Visual Zone: Energy Flow Horizontal Conduit */}
      <div className="absolute bottom-[16vh] md:bottom-[20vh] left-0 w-full flex items-center justify-center px-[4vw] md:px-[8vw] pointer-events-none z-[5]">
        <svg
          viewBox="0 0 1000 220"
          className="w-full max-w-[1100px] h-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="pwrEnergyGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#E10600" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Coordinate Datum Grid */}
          <g opacity="0.2" stroke="#FFFFFF" strokeWidth="0.5">
            <line x1="100" y1="100" x2="900" y2="100" strokeDasharray="3 6" />
            <circle cx="180" cy="100" r="2" fill="#FFFFFF" />
            <circle cx="420" cy="100" r="2" fill="#FFFFFF" />
            <circle cx="660" cy="100" r="2" fill="#FFFFFF" />
            <circle cx="860" cy="100" r="2" fill="#FFFFFF" />
          </g>

          {/* Energy Flow Interconnect Lines */}
          <g stroke="url(#pwrEnergyGrad)" strokeWidth="1.5" strokeLinecap="round">
            {/* Flow 1: Power Unit -> Energy Storage */}
            <path
              ref={flowPath1Ref}
              d="M 230 100 L 370 100"
              strokeDasharray="200"
              style={{ strokeDashoffset: "200px" }}
            />
            {/* Flow 2: Energy Storage -> Torque Delivery */}
            <path
              ref={flowPath2Ref}
              d="M 470 100 L 610 100"
              strokeDasharray="200"
              style={{ strokeDashoffset: "200px" }}
            />
            {/* Flow 3: Torque Delivery -> Wheel Traction */}
            <path
              ref={flowPath3Ref}
              d="M 710 100 L 810 100"
              strokeDasharray="200"
              style={{ strokeDashoffset: "200px" }}
            />
          </g>

          {/* Node 1: POWER UNIT */}
          <g
            ref={node1Ref}
            transform="translate(180, 100)"
            className="origin-[180px_100px] transition-transform duration-75"
            style={{ opacity: 0 }}
          >
            <rect x="-48" y="-42" width="96" height="84" rx="4" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" fill="#080808" fillOpacity="0.85" />
            <circle cx="0" cy="0" r="14" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
            <circle cx="0" cy="0" r="3.5" fill="#E10600" />
            <text x="0" y="58" textAnchor="middle" className="font-mono text-[9.5px] tracking-[0.16em] fill-white font-medium">POWER UNIT</text>
            <text x="0" y="70" textAnchor="middle" className="font-mono text-[7.5px] tracking-[0.12em] fill-white/40">V6 TURBO + MGU-H</text>
          </g>

          {/* Node 2: ENERGY STORAGE */}
          <g
            ref={node2Ref}
            transform="translate(420, 100)"
            className="origin-[420px_100px] transition-transform duration-75"
            style={{ opacity: 0 }}
          >
            <rect x="-48" y="-42" width="96" height="84" rx="4" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" fill="#080808" fillOpacity="0.85" />
            <path d="M -14 -10 L 0 0 L -6 3 L 12 14 L 2 3 L 6 0 Z" fill="#FFFFFF" opacity="0.85" />
            <circle cx="0" cy="0" r="2" fill="#E10600" />
            <text x="0" y="58" textAnchor="middle" className="font-mono text-[9.5px] tracking-[0.16em] fill-white font-medium">ENERGY STORAGE</text>
            <text x="0" y="70" textAnchor="middle" className="font-mono text-[7.5px] tracking-[0.12em] fill-white/40">800V ESS MATRIX</text>
          </g>

          {/* Node 3: TORQUE DELIVERY */}
          <g
            ref={node3Ref}
            transform="translate(660, 100)"
            className="origin-[660px_100px] transition-transform duration-75"
            style={{ opacity: 0 }}
          >
            <rect x="-48" y="-42" width="96" height="84" rx="4" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" fill="#080808" fillOpacity="0.85" />
            <circle cx="0" cy="0" r="13" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
            <circle cx="0" cy="0" r="4.5" stroke="#E10600" strokeWidth="1.5" />
            <text x="0" y="58" textAnchor="middle" className="font-mono text-[9.5px] tracking-[0.16em] fill-white font-medium">TORQUE DELIVERY</text>
            <text x="0" y="70" textAnchor="middle" className="font-mono text-[7.5px] tracking-[0.12em] fill-white/40">DIRECT DRIVESHAFT</text>
          </g>

          {/* Node 4: WHEEL TRACTION */}
          <g
            ref={node4Ref}
            transform="translate(860, 100)"
            className="origin-[860px_100px] transition-transform duration-75"
            style={{ opacity: 0 }}
          >
            <rect x="-44" y="-42" width="88" height="84" rx="4" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.4" fill="#080808" fillOpacity="0.85" />
            <line x1="-14" y1="-14" x2="14" y2="14" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
            <line x1="-14" y1="14" x2="14" y2="-14" stroke="#FFFFFF" strokeWidth="1.2" opacity="0.8" />
            <circle cx="0" cy="0" r="2.5" fill="#E10600" />
            <text x="0" y="58" textAnchor="middle" className="font-mono text-[9.5px] tracking-[0.16em] fill-white font-medium">WHEEL TRACTION</text>
            <text x="0" y="70" textAnchor="middle" className="font-mono text-[7.5px] tracking-[0.12em] fill-white/40">APEX LATERAL BITE</text>
          </g>
        </svg>
      </div>
    </div>
  );
});

PowertrainVisualization.displayName = "PowertrainVisualization";

export default PowertrainVisualization;
