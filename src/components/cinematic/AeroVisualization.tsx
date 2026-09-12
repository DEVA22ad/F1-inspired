"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";
import { SubSystemState } from "@/lib/animation/engineering";

export interface AeroVisualizationHandle {
  updateState: (state: SubSystemState) => void;
}

const AeroVisualization = forwardRef<AeroVisualizationHandle>((_, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stream1Ref = useRef<SVGPathElement | null>(null);
  const stream2Ref = useRef<SVGPathElement | null>(null);
  const stream3Ref = useRef<SVGPathElement | null>(null);
  const stream4Ref = useRef<SVGPathElement | null>(null);
  const downforce1Ref = useRef<SVGLineElement | null>(null);
  const downforce2Ref = useRef<SVGLineElement | null>(null);

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

      // Flow offset calculations for SVG streamlines
      const offset = (1 - state.drawProgress) * 400;

      if (stream1Ref.current) stream1Ref.current.style.strokeDashoffset = `${offset.toFixed(1)}px`;
      if (stream2Ref.current) stream2Ref.current.style.strokeDashoffset = `${(offset * 0.85).toFixed(1)}px`;
      if (stream3Ref.current) stream3Ref.current.style.strokeDashoffset = `${(offset * 1.15).toFixed(1)}px`;
      if (stream4Ref.current) stream4Ref.current.style.strokeDashoffset = `${(offset * 0.95).toFixed(1)}px`;

      // Downforce vectors expansion
      const vectorScale = Math.min(Math.max(state.drawProgress * 1.2, 0), 1);
      if (downforce1Ref.current) downforce1Ref.current.style.transform = `scaleY(${vectorScale.toFixed(2)})`;
      if (downforce2Ref.current) downforce2Ref.current.style.transform = `scaleY(${vectorScale.toFixed(2)})`;
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
          <span>SYS // 03.1</span>
          <span className="text-white/20">|</span>
          <span>WIND TUNNEL TELEMETRY</span>
        </div>

        <h2 className="font-display text-[clamp(3.2rem,7.5vw,6.5rem)] font-black tracking-[-0.03em] leading-[0.88] text-text-primary uppercase">
          AERODYNAMICS<span className="text-accent-red">.</span>
        </h2>

        <p className="font-sans text-xs md:text-sm text-text-secondary tracking-wide max-w-md font-light leading-relaxed mt-1">
          Every surface manages boundary separation. Sculpted pressure gradients create sustained downforce through high-speed apexes.
        </p>
      </div>

      {/* Automotive Wind-Tunnel Technical Graphic Overlay */}
      <div className="absolute inset-0 flex items-center justify-center md:justify-end md:pr-[4vw] pointer-events-none z-[5]">
        <svg
          viewBox="0 0 1000 450"
          className="w-[92vw] max-w-[1100px] h-auto overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradient for aerodynamic streamlines */}
            <linearGradient id="aeroStreamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
              <stop offset="35%" stopColor="#FFFFFF" stopOpacity="0.4" />
              <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.85" />
              <stop offset="90%" stopColor="#E10600" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </linearGradient>

            <linearGradient id="downforceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#E10600" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Coordinate Datum Grid & Crosshairs */}
          <g opacity="0.25" stroke="#FFFFFF" strokeWidth="0.5">
            <line x1="50" y1="225" x2="950" y2="225" strokeDasharray="4 8" />
            <line x1="280" y1="80" x2="280" y2="370" strokeDasharray="2 6" />
            <line x1="720" y1="80" x2="720" y2="370" strokeDasharray="2 6" />
            <circle cx="280" cy="225" r="3" fill="#FFFFFF" />
            <circle cx="720" cy="225" r="3" fill="#FFFFFF" />
          </g>

          {/* Abstract Side Profile Vehicle Silhouette (Fine 1px engineering stroke) */}
          <g opacity="0.35" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
            {/* Front Wing & Nosecone */}
            <path d="M 120 280 L 160 280 L 220 250 L 330 235 L 430 220" />
            {/* Halo & Cockpit Arc */}
            <path d="M 430 220 C 470 170, 520 165, 560 175 L 590 215" />
            {/* Engine Cover & Shark Fin */}
            <path d="M 560 175 L 750 185 L 760 240" />
            {/* Rear Wing & Endplate */}
            <path d="M 750 160 L 840 155 L 850 250" />
            <path d="M 770 180 L 835 180" />
            {/* Underfloor Ground-Effect Venturi Tunnel */}
            <path d="M 230 285 L 480 295 L 740 280 L 810 245" strokeDasharray="4 4" />
            {/* Front & Rear Wheels Baseline */}
            <circle cx="250" cy="285" r="42" strokeDasharray="3 3" opacity="0.6" />
            <circle cx="730" cy="285" r="44" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* Animated Airflow Streamlines (Wind-tunnel Paths) */}
          <g stroke="url(#aeroStreamGrad)" strokeWidth="1.25" strokeLinecap="round">
            {/* Stream 1: Nose to Cockpit to Rear Wing Top Surface */}
            <path
              ref={stream1Ref}
              d="M 60 220 C 200 210, 360 190, 480 150 C 580 115, 720 135, 940 145"
              strokeDasharray="180 220"
              style={{ strokeDashoffset: "400px" }}
            />
            {/* Stream 2: Front Wing Splitter to Undercut Sidepod */}
            <path
              ref={stream2Ref}
              d="M 80 260 C 200 255, 340 245, 460 230 C 600 210, 720 205, 930 215"
              strokeDasharray="140 180"
              style={{ strokeDashoffset: "400px" }}
            />
            {/* Stream 3: Ground Effect Floor Venturi Suction Stream */}
            <path
              ref={stream3Ref}
              d="M 100 295 C 240 298, 420 310, 600 305 C 720 300, 800 270, 950 260"
              strokeDasharray="160 200"
              style={{ strokeDashoffset: "400px" }}
            />
            {/* Stream 4: Rear Diffuser Expansion Vortex */}
            <path
              ref={stream4Ref}
              d="M 680 300 C 760 290, 840 250, 940 240"
              strokeDasharray="90 130"
              style={{ strokeDashoffset: "400px" }}
            />
          </g>

          {/* Downforce Load Vectors */}
          <g stroke="url(#downforceGrad)" strokeWidth="1.5" strokeLinecap="round">
            {/* Front Axle Load Arrow */}
            <line
              ref={downforce1Ref}
              x1="250"
              y1="170"
              x2="250"
              y2="235"
              className="origin-[250px_170px] transition-transform duration-75"
            />
            <polygon points="247,233 250,240 253,233" fill="#E10600" />

            {/* Rear Wing Downforce Arrow */}
            <line
              ref={downforce2Ref}
              x1="790"
              y1="90"
              x2="790"
              y2="155"
              className="origin-[790px_90px] transition-transform duration-75"
            />
            <polygon points="787,153 790,160 793,153" fill="#E10600" />
          </g>

          {/* Technical Annotations (Authentic Engineering Telemetry) */}
          <g className="font-mono text-[9px] tracking-[0.15em] fill-white select-none">
            {/* Front Load Annotation (Positioned cleanly below front axle) */}
            <g transform="translate(180, 350)">
              <circle cx="0" cy="0" r="2" fill="#E10600" />
              <line x1="0" y1="0" x2="35" y2="15" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="35" y1="15" x2="115" y2="15" stroke="#FFFFFF" strokeWidth="0.5" />
              <text x="40" y="11" fill="#FFFFFF" opacity="0.9">FRONT LOAD</text>
              <text x="40" y="23" fill="rgba(255,255,255,0.4)">ACTIVE</text>
            </g>

            {/* Rear Balance Annotation */}
            <g transform="translate(800, 75)">
              <circle cx="0" cy="0" r="2" fill="#E10600" />
              <line x1="0" y1="0" x2="30" y2="-15" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="30" y1="-15" x2="110" y2="-15" stroke="#FFFFFF" strokeWidth="0.5" />
              <text x="35" y="-19" fill="#FFFFFF" opacity="0.9">REAR BALANCE</text>
              <text x="35" y="-7" fill="rgba(255,255,255,0.4)">STABLE</text>
            </g>

            {/* Airflow Laminar Annotation */}
            <g transform="translate(480, 110)">
              <circle cx="0" cy="0" r="2" fill="#FFFFFF" opacity="0.8" />
              <line x1="0" y1="0" x2="25" y2="-20" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="25" y1="-20" x2="95" y2="-20" stroke="#FFFFFF" strokeWidth="0.5" />
              <text x="30" y="-24" fill="#FFFFFF" opacity="0.9">AIRFLOW</text>
              <text x="30" y="-12" fill="rgba(255,255,255,0.4)">LAMINAR</text>
            </g>

            {/* Downforce High Annotation */}
            <g transform="translate(560, 340)">
              <circle cx="0" cy="0" r="2" fill="#E10600" />
              <line x1="0" y1="0" x2="30" y2="20" stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="2 2" />
              <line x1="30" y1="20" x2="105" y2="20" stroke="#FFFFFF" strokeWidth="0.5" />
              <text x="35" y="16" fill="#FFFFFF" opacity="0.9">DOWNFORCE</text>
              <text x="35" y="28" fill="rgba(255,255,255,0.4)">HIGH</text>
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
});

AeroVisualization.displayName = "AeroVisualization";

export default AeroVisualization;
