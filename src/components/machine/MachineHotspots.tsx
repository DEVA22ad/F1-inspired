"use client";

import React, { useState } from "react";
import { HOTSPOTS, HotspotData, MachineSystemId } from "@/lib/animation/machineExplorer";

export interface ProjectedHotspot extends HotspotData {
  screenX: number;
  screenY: number;
  visible: boolean;
}

interface MachineHotspotsProps {
  hotspots: ProjectedHotspot[];
  activeSystem: MachineSystemId;
  onSelectSystem: (system: MachineSystemId) => void;
  onHoverHotspot?: (hotspotId: string | null) => void;
}

export default function MachineHotspots({
  hotspots,
  activeSystem,
  onSelectSystem,
  onHoverHotspot,
}: MachineHotspotsProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleMouseEnter = (h: HotspotData) => {
    setHoveredId(h.id);
    onHoverHotspot?.(h.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    onHoverHotspot?.(null);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 overflow-hidden select-none" aria-label="Interactive Hotspots">
      {hotspots.map((h) => {
        if (!h.visible) return null;
        const isHovered = hoveredId === h.id;
        const isSystemActive = h.systemId === activeSystem;

        return (
          <div
            key={h.id}
            className="absolute origin-center -translate-x-1/2 -translate-y-1/2 transition-transform duration-75"
            style={{
              left: `${h.screenX}px`,
              top: `${h.screenY}px`,
            }}
          >
            {/* Interactive Target Button */}
            <button
              type="button"
              onClick={() => onSelectSystem(h.systemId)}
              onMouseEnter={() => handleMouseEnter(h)}
              onMouseLeave={handleMouseLeave}
              onFocus={() => handleMouseEnter(h)}
              onBlur={handleMouseLeave}
              aria-label={`Inspect ${h.label} (${h.subLabel})`}
              className="relative flex items-center justify-center w-8 h-8 pointer-events-auto cursor-pointer group focus:outline-none"
            >
              {/* Outer Pulsing Reticle */}
              <span
                className={`absolute inset-0 rounded-full border border-accent-red transition-all duration-300 ${
                  isHovered || isSystemActive
                    ? "scale-125 opacity-100 border-accent-red"
                    : "scale-75 opacity-40 group-hover:scale-100 group-hover:opacity-80"
                }`}
              />

              {/* Central Pinpoint Dot */}
              <span
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  isHovered || isSystemActive
                    ? "bg-accent-red shadow-[0_0_10px_var(--accent-red-glow)] scale-125"
                    : "bg-white/80 group-hover:bg-accent-red"
                }`}
              />

              {/* Crosshair Corner Ticks */}
              {(isHovered || isSystemActive) && (
                <div className="absolute inset-0 pointer-events-none">
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-accent-red" />
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-accent-red" />
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-accent-red" />
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 h-0.5 w-1.5 bg-accent-red" />
                </div>
              )}
            </button>

            {/* Connecting Line & Hover Tag Annotation */}
            <div
              className={`absolute left-8 top-1/2 -translate-y-1/2 flex items-center gap-2 pointer-events-none transition-all duration-200 ${
                isHovered
                  ? "opacity-100 translate-x-0"
                  : isSystemActive
                  ? "opacity-80 translate-x-0"
                  : "opacity-0 -translate-x-2"
              }`}
            >
              {/* Connecting Line */}
              <div className="w-8 h-px bg-accent-red/80 shadow-[0_0_6px_var(--accent-red-glow)]" />

              {/* Technical Annotation Pill */}
              <div className="flex flex-col px-2.5 py-1.5 bg-black/85 border border-white/20 rounded-xs backdrop-blur-md shadow-lg min-w-[140px]">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[0.65rem] font-bold text-white tracking-wider uppercase">
                    {h.label}
                  </span>
                  <span className="font-mono text-[0.55rem] text-accent-red font-semibold">
                    {h.subLabel}
                  </span>
                </div>
                <span className="font-sans text-[0.6rem] text-white/60 tracking-tight font-light mt-0.5 leading-tight">
                  {h.description}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
