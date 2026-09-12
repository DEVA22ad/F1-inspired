"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MachineSystemId } from "@/lib/animation/machineExplorer";
import MachineNavigation from "./MachineNavigation";
import MachinePanel from "./MachinePanel";
import MachineViewer from "./MachineViewer";
import MachineHotspots, { ProjectedHotspot } from "./MachineHotspots";

export default function MachineExplorer() {
  const router = useRouter();
  const [activeSystem, setActiveSystem] = useState<MachineSystemId>("aero");
  const [resetTrigger, setResetTrigger] = useState(0);
  const [projectedHotspots, setProjectedHotspots] = useState<ProjectedHotspot[]>([]);
  const [hoveredHotspotId, setHoveredHotspotId] = useState<string | null>(null);
  const [isEntering, setIsEntering] = useState(true);

  // Entrance fade-in transition
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsEntering(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectSystem = useCallback((sys: MachineSystemId) => {
    setActiveSystem(sys);
  }, []);

  const handleResetView = useCallback(() => {
    setResetTrigger((prev) => prev + 1);
  }, []);

  const handleExit = useCallback(() => {
    router.push("/");
  }, [router]);

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleExit();
      } else if (e.key === "1") {
        handleSelectSystem("aero");
      } else if (e.key === "2") {
        handleSelectSystem("powertrain");
      } else if (e.key === "3") {
        handleSelectSystem("control");
      } else if (e.key === "4") {
        handleSelectSystem("chassis");
      } else if (e.key === "r" || e.key === "R") {
        handleResetView();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleExit, handleSelectSystem, handleResetView]);

  return (
    <main
      className={`relative w-screen h-screen bg-[#060608] text-white overflow-hidden select-none transition-opacity duration-700 ${
        isEntering ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* 3D WebGL Vehicle Visualization Canvas */}
      <div className="absolute inset-0 z-0">
        <MachineViewer
          activeSystem={activeSystem}
          resetViewTrigger={resetTrigger}
          onUpdateHotspots={setProjectedHotspots}
        />
      </div>

      {/* Interactive 3D Projected Hotspot Nodes */}
      <MachineHotspots
        hotspots={projectedHotspots}
        activeSystem={activeSystem}
        onSelectSystem={handleSelectSystem}
        onHoverHotspot={setHoveredHotspotId}
      />

      {/* Precision Engineering Telemetry Panel (Left Zone) */}
      <MachinePanel
        activeSystem={activeSystem}
        hoveredHotspotId={hoveredHotspotId}
      />

      {/* Top HUD & Bottom Subsystem Navigation */}
      <MachineNavigation
        activeSystem={activeSystem}
        onSelectSystem={handleSelectSystem}
        onResetView={handleResetView}
        onExit={handleExit}
      />

      {/* Vignette & Ambient Corner Framing */}
      <div className="fixed inset-0 pointer-events-none z-10 bg-radial-[circle_at_center,_rgba(0,0,0,0)_50%,_rgba(0,0,0,0.75)_100%]" />
      <div className="corner-bracket top-left z-20" />
      <div className="corner-bracket top-right z-20" />
      <div className="corner-bracket bottom-left z-20" />
      <div className="corner-bracket bottom-right z-20" />
    </main>
  );
}
