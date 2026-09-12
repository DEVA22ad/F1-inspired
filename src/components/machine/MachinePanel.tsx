"use client";

import React from "react";
import { MachineSystemId, MACHINE_SYSTEMS } from "@/lib/animation/machineExplorer";

interface MachinePanelProps {
  activeSystem: MachineSystemId;
  hoveredHotspotId?: string | null;
}

export default function MachinePanel({
  activeSystem,
  hoveredHotspotId,
}: MachinePanelProps) {
  const current = MACHINE_SYSTEMS[activeSystem];

  return (
    <aside
      aria-label="Engineering System Details"
      className="fixed top-[12vh] left-[5vw] md:left-[6vw] max-w-[90vw] sm:max-w-md lg:max-w-lg z-20 pointer-events-none select-none transition-all duration-300"
    >
      <div className="flex flex-col gap-3.5 pointer-events-auto">
        {/* System Identifier Pre-header */}
        <div className="flex items-center gap-2.5 font-mono text-[0.7rem] md:text-xs tracking-[0.18em] text-white/50 uppercase">
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_6px_var(--accent-red-glow)]" />
          <span className="text-white font-medium">SYS // {current.systemIndex}</span>
          <span className="text-white/20">|</span>
          <span className="text-white/70">{current.codeName}</span>
        </div>

        {/* System Title Headline */}
        <div className="flex flex-col leading-[0.88] mt-0.5">
          <h1 className="font-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase">
            {current.title}
            <span className="text-accent-red">.</span>
          </h1>
          <span className="font-mono text-[0.68rem] md:text-xs tracking-[0.18em] text-white/60 uppercase mt-2">
            {current.headline}
          </span>
        </div>

        {/* Technical Description */}
        <p className="font-sans text-xs md:text-sm text-text-secondary tracking-wide font-light leading-relaxed border-t border-white/10 pt-3">
          {current.description}
        </p>

        {/* Subsystem Conceptual Telemetry Matrix */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          {current.specs.map((spec) => (
            <div
              key={spec.label}
              className="flex flex-col p-2.5 bg-white/[0.03] border border-white/10 rounded-sm"
            >
              <span className="font-mono text-[0.6rem] md:text-[0.65rem] tracking-[0.16em] text-white/40 uppercase">
                {spec.label}
              </span>
              <div className="flex items-center justify-between mt-1">
                <span className="font-mono text-xs md:text-sm font-bold text-text-primary tracking-wider">
                  {spec.value}
                </span>
                {spec.status && (
                  <span className="font-mono text-[0.55rem] md:text-[0.6rem] tracking-[0.14em] text-accent-red px-1.5 py-0.5 bg-accent-red/10 border border-accent-red/30 rounded-xs">
                    {spec.status}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Powertrain Conceptual Pathway (Active only in Powertrain mode) */}
        {current.pathwayNodes && (
          <div className="flex flex-col gap-1.5 pt-2 border-t border-white/10">
            <span className="font-mono text-[0.6rem] tracking-[0.18em] text-white/40 uppercase">
              CONCEPTUAL ENERGY FLUX PATHWAY
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {current.pathwayNodes.map((node, index) => (
                <div
                  key={node.id}
                  className="flex flex-col p-2 bg-black/40 border border-white/10 rounded-sm text-center relative"
                >
                  <span className="font-mono text-[0.55rem] tracking-wider text-accent-red font-semibold">
                    0{index + 1}
                  </span>
                  <span className="font-mono text-[0.65rem] tracking-wider text-white font-medium mt-0.5">
                    {node.label}
                  </span>
                  <span className="font-mono text-[0.5rem] tracking-tight text-white/40 mt-0.5">
                    {node.subLabel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live Lab Status Footnote */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10 font-mono text-[0.65rem] tracking-[0.18em] text-white/40">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-white/80">{current.status}</span>
          </div>
          <span>SPEC // 2026 APEX</span>
        </div>
      </div>
    </aside>
  );
}
