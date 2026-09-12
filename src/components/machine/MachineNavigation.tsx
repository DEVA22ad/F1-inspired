"use client";

import React from "react";
import { MachineSystemId, MACHINE_SYSTEMS } from "@/lib/animation/machineExplorer";

interface MachineNavigationProps {
  activeSystem: MachineSystemId;
  onSelectSystem: (system: MachineSystemId) => void;
  onResetView: () => void;
  onExit: () => void;
}

const SYSTEMS_LIST: { id: MachineSystemId; num: string; label: string; shortcut: string }[] = [
  { id: "aero", num: "01", label: "AERODYNAMICS", shortcut: "1" },
  { id: "powertrain", num: "02", label: "POWERTRAIN", shortcut: "2" },
  { id: "control", num: "03", label: "CONTROL", shortcut: "3" },
  { id: "chassis", num: "04", label: "CHASSIS", shortcut: "4" },
];

export default function MachineNavigation({
  activeSystem,
  onSelectSystem,
  onResetView,
  onExit,
}: MachineNavigationProps) {
  return (
    <>
      {/* Top Engineering Lab HUD */}
      <header className="fixed top-0 left-0 w-full px-6 py-5 md:px-12 md:py-6 flex justify-between items-center z-30 pointer-events-none select-none">
        {/* Left Branding & State */}
        <div className="flex items-center gap-3.5 pointer-events-auto">
          <span className="w-2 h-2 bg-accent-red rounded-full shadow-[0_0_8px_var(--accent-red-glow)] inline-block animate-pulse-dot" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-lg md:text-xl font-extrabold tracking-widest text-text-primary uppercase">
                SCUDERIA APEX
              </span>
              <span className="hidden sm:inline-block font-mono text-[0.65rem] tracking-wider text-text-muted border-l border-white/15 pl-2.5 uppercase">
                LAB 01 // EXPLORER
              </span>
            </div>
            <span className="font-mono text-[0.65rem] tracking-widest text-white/40 uppercase">
              APEX CHASSIS 01 // TELEMETRY LINK ACTIVE
            </span>
          </div>
        </div>

        {/* Right Navigation Controls */}
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Reset Camera View */}
          <button
            type="button"
            onClick={onResetView}
            aria-label="Reset camera view to default"
            className="group hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-[0.16em] text-white/70 uppercase border border-white/15 bg-black/40 backdrop-blur-md hover:border-white/40 hover:text-white transition-colors duration-200 cursor-pointer"
          >
            <span>RESET VIEW</span>
            <span className="text-xs group-hover:rotate-180 transition-transform duration-300 ease-out">↻</span>
            <span className="text-[0.6rem] text-white/40 border-l border-white/15 pl-1.5">[R]</span>
          </button>

          {/* Exit Explorer */}
          <button
            type="button"
            onClick={onExit}
            aria-label="Exit Machine Explorer and return to cinematic"
            className="group inline-flex items-center gap-2 px-4 py-1.5 font-mono text-[0.7rem] tracking-[0.18em] text-white uppercase border border-accent-red/50 bg-black/60 backdrop-blur-md hover:border-accent-red hover:bg-accent-red/15 transition-all duration-200 cursor-pointer"
          >
            <span>EXIT EXPLORER</span>
            <span className="text-sm text-accent-red group-hover:scale-125 transition-transform duration-200">×</span>
            <span className="hidden md:inline-block text-[0.6rem] text-white/40 border-l border-white/15 pl-1.5">[ESC]</span>
          </button>
        </div>
      </header>

      {/* Bottom Subsystems Navigation Strip */}
      <nav
        aria-label="Machine Subsystems"
        className="fixed bottom-0 left-0 w-full px-4 py-4 md:px-12 md:py-6 flex flex-col sm:flex-row justify-between items-center gap-3 z-30 pointer-events-none select-none"
      >
        {/* Interactive System Tabs */}
        <div className="flex items-center gap-1.5 sm:gap-3 bg-black/70 border border-white/15 p-1 sm:p-1.5 rounded-sm backdrop-blur-md pointer-events-auto max-w-full overflow-x-auto">
          {SYSTEMS_LIST.map((sys) => {
            const isActive = activeSystem === sys.id;
            return (
              <button
                key={sys.id}
                type="button"
                onClick={() => onSelectSystem(sys.id)}
                aria-pressed={isActive}
                aria-label={`Select ${sys.label} subsystem`}
                className={`group relative flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 font-mono text-[0.68rem] sm:text-xs tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white bg-white/10 shadow-[inset_0_0_12px_rgba(255,255,255,0.05)] border border-white/20"
                    : "text-white/40 hover:text-white/80 hover:bg-white/5 border border-transparent"
                }`}
              >
                {/* Active Indicator Light */}
                <span
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                    isActive
                      ? "bg-accent-red shadow-[0_0_6px_var(--accent-red-glow)] scale-100"
                      : "bg-white/20 scale-75 group-hover:bg-white/50"
                  }`}
                />
                <span className="font-medium text-white/60">{sys.num}</span>
                <span className="text-white/20 hidden md:inline">/</span>
                <span className={isActive ? "font-bold text-white" : ""}>{sys.label}</span>
                <span className="hidden lg:inline-block text-[0.6rem] text-white/30 border-l border-white/10 pl-1.5">
                  [{sys.shortcut}]
                </span>
              </button>
            );
          })}
        </div>

        {/* Interaction Hint (Desktop) */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.16em] text-white/40 pointer-events-auto">
          <span>DRAG TO ROTATE</span>
          <span className="text-white/20">|</span>
          <span>SCROLL TO ZOOM</span>
          <span className="text-white/20">|</span>
          <span>SELECT HOTSPOTS</span>
        </div>
      </nav>
    </>
  );
}
