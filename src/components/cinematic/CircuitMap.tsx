"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";

export interface CircuitMapHandle {
  updateProgress: (trackProgress: number, racingLineProgress: number) => void;
}

const CircuitMap = forwardRef<CircuitMapHandle>((_, ref) => {
  const trackOutlineRef = useRef<SVGPathElement | null>(null);
  const racingLineRef = useRef<SVGPathElement | null>(null);
  const startFinishRef = useRef<SVGGElement | null>(null);
  const cornersGroupRef = useRef<SVGGElement | null>(null);

  useImperativeHandle(ref, () => ({
    updateProgress(trackProgress: number, racingLineProgress: number) {
      // 1. Progressive Track Outline Draw
      if (trackOutlineRef.current) {
        const trackLength = 1200;
        const trackOffset = (1 - Math.min(Math.max(trackProgress, 0), 1)) * trackLength;
        trackOutlineRef.current.style.strokeDashoffset = `${trackOffset.toFixed(1)}px`;
      }

      // 2. Progressive Racing Line Draw
      if (racingLineRef.current) {
        const lineLength = 1200;
        const lineOffset = (1 - Math.min(Math.max(racingLineProgress, 0), 1)) * lineLength;
        racingLineRef.current.style.strokeDashoffset = `${lineOffset.toFixed(1)}px`;
      }

      // 3. Start/Finish Marker Activation
      if (startFinishRef.current) {
        const sfOpacity = Math.min(Math.max((trackProgress - 0.7) / 0.3, 0), 1);
        startFinishRef.current.style.opacity = sfOpacity.toFixed(2);
      }

      // 4. Corners Sequence Reveal
      if (cornersGroupRef.current) {
        const cornersOpacity = Math.min(Math.max((trackProgress - 0.3) / 0.7, 0), 1);
        cornersGroupRef.current.style.opacity = cornersOpacity.toFixed(2);
      }
    },
  }));

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none select-none">
      <svg
        viewBox="0 0 800 500"
        className="w-full max-w-[850px] h-auto overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Racing Line Apex Glow Gradient */}
          <linearGradient id="racingLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.4" />
            <stop offset="45%" stopColor="#E10600" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FFFFFF" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#E10600" stopOpacity="1" />
          </linearGradient>

          <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FFFFFF" strokeWidth="0.5" opacity="0.05" />
          </pattern>
        </defs>

        {/* Blueprint Coordinate Grid Background */}
        <rect width="800" height="500" fill="url(#gridPattern)" />

        {/* Sector Background Zones (S1, S2, S3) */}
        <g opacity="0.2" className="font-mono text-[8px] tracking-[0.2em] fill-white">
          <text x="140" y="80">SECTOR 01 // HIGHSPEED SWEEP</text>
          <text x="600" y="110">SECTOR 02 // TECHNICAL APEX</text>
          <text x="560" y="440">SECTOR 03 // TRACTION ACCEL</text>
        </g>

        {/* Sector Boundary Dividing Lines */}
        <g stroke="#FFFFFF" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.25">
          <line x1="360" y1="60" x2="360" y2="180" />
          <line x1="620" y1="280" x2="720" y2="340" />
          <line x1="280" y1="360" x2="280" y2="460" />
        </g>

        {/* Track Outline Guide (Ghost) */}
        <path
          d="M 180 380 L 120 260 C 100 200, 140 120, 240 100 L 460 90 C 560 80, 680 120, 720 180 C 750 220, 730 280, 660 300 L 520 320 C 460 330, 420 380, 460 420 C 500 450, 620 440, 670 410 L 710 410 C 740 410, 750 450, 700 470 L 300 470 C 220 470, 190 430, 180 380 Z"
          stroke="#FFFFFF"
          strokeWidth="1"
          opacity="0.12"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Master Circuit Track Line (Progressive Stroke Draw) */}
        <path
          ref={trackOutlineRef}
          d="M 180 380 L 120 260 C 100 200, 140 120, 240 100 L 460 90 C 560 80, 680 120, 720 180 C 750 220, 730 280, 660 300 L 520 320 C 460 330, 420 380, 460 420 C 500 450, 620 440, 670 410 L 710 410 C 740 410, 750 450, 700 470 L 300 470 C 220 470, 190 430, 180 380 Z"
          stroke="#FFFFFF"
          strokeWidth="1.5"
          opacity="0.85"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1200"
          style={{ strokeDashoffset: "1200px" }}
        />

        {/* Dynamic Racing Line (Apex Trajectory) */}
        <path
          ref={racingLineRef}
          d="M 184 378 L 124 258 C 104 202, 144 122, 238 102 L 458 92 C 558 82, 676 122, 716 178 C 744 218, 726 276, 656 298 L 518 318 C 456 328, 418 376, 458 418 C 496 446, 616 438, 666 408 L 708 408 C 736 408, 744 446, 696 468 L 302 468 C 224 468, 194 428, 184 378 Z"
          stroke="url(#racingLineGrad)"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1200"
          style={{ strokeDashoffset: "1200px" }}
        />

        {/* Corner Numbers and Apex Markers */}
        <g ref={cornersGroupRef} style={{ opacity: 0 }} className="transition-opacity duration-150">
          {/* Turn 1 */}
          <g transform="translate(120, 260)">
            <circle cx="0" cy="0" r="3" fill="#E10600" />
            <text x="-18" y="4" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T1</text>
          </g>

          {/* Turn 4 */}
          <g transform="translate(240, 100)">
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.8" />
            <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T4</text>
          </g>

          {/* Turn 8 */}
          <g transform="translate(460, 90)">
            <circle cx="0" cy="0" r="3" fill="#E10600" />
            <text x="0" y="-8" textAnchor="middle" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T8</text>
          </g>

          {/* Turn 14 */}
          <g transform="translate(720, 180)">
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.8" />
            <text x="10" y="4" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T14</text>
          </g>

          {/* Turn 19 (Hairpin) */}
          <g transform="translate(460, 420)">
            <circle cx="0" cy="0" r="3" fill="#E10600" />
            <text x="-18" y="4" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T19</text>
          </g>

          {/* Turn 27 (Final Chicane) */}
          <g transform="translate(700, 470)">
            <circle cx="0" cy="0" r="3" fill="#FFFFFF" opacity="0.8" />
            <text x="10" y="4" className="font-mono text-[8px] tracking-[0.1em] fill-white font-medium">T27</text>
          </g>
        </g>

        {/* Start / Finish Line Marker */}
        <g ref={startFinishRef} transform="translate(300, 470)" style={{ opacity: 0 }} className="transition-opacity duration-150">
          <line x1="0" y1="-12" x2="0" y2="12" stroke="#E10600" strokeWidth="2.5" />
          <line x1="-3" y1="-12" x2="-3" y2="12" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
          <line x1="3" y1="-12" x2="3" y2="12" stroke="#FFFFFF" strokeWidth="1" opacity="0.8" />
          <text x="0" y="24" textAnchor="middle" className="font-mono text-[7px] tracking-[0.18em] fill-white/80 font-bold">START / FINISH</text>
        </g>

        {/* Elevation Profile Indicator */}
        <g transform="translate(80, 440)" opacity="0.6">
          <path d="M 0 15 Q 40 0, 80 12 T 140 5" stroke="#FFFFFF" strokeWidth="0.8" fill="none" strokeDasharray="2 3" />
          <text x="0" y="28" className="font-mono text-[7px] tracking-[0.14em] fill-white/50">ELEVATION DELTA +42M</text>
        </g>
      </svg>
    </div>
  );
});

CircuitMap.displayName = "CircuitMap";

export default CircuitMap;
