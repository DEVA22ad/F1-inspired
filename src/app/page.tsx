import React from "react";
import CinematicCanvas from "@/components/cinematic/CinematicCanvas";
import CinematicOverlay from "@/components/cinematic/CinematicOverlay";
import GlobalNav from "@/components/cinematic/GlobalNav";
import Hero from "@/components/cinematic/Hero";
import MachineSection from "@/components/cinematic/MachineSection";
import EngineeringSection from "@/components/cinematic/EngineeringSection";
import CircuitSection from "@/components/cinematic/CircuitSection";
import TunnelSection from "@/components/cinematic/TunnelSection";
import ChaosSection from "@/components/cinematic/ChaosSection";
import StadiumSection from "@/components/cinematic/StadiumSection";
import ProgressIndicator from "@/components/cinematic/ProgressIndicator";
import CursorOverlay from "@/components/cinematic/CursorOverlay";
import LoadingScreen from "@/components/cinematic/LoadingScreen";

export default function HomePage() {
  return (
    <main className="relative w-full min-h-[1000vh] bg-bg-primary overflow-x-hidden">
      {/* Cinematic Boot Loading State */}
      <LoadingScreen />

      {/* Scroll Runway to control the 1,311-frame cinematic timeline */}
      <div id="scroll-container" className="w-full h-[1000vh] min-h-[1000vh] relative pointer-events-none" />

      {/* Authoritative Fixed Canvas Animation Engine */}
      <CinematicCanvas />

      {/* Cinematic Layering: Vignette, Film Grain, Corner Brackets */}
      <CinematicOverlay />

      {/* Minimal Top HUD Header */}
      <GlobalNav />

      {/* Phase 1: Hero Opening Experience (ENGINEERED FOR SPEED) */}
      <Hero />

      {/* Phase 2: The Machine / Performance Analysis (950 HP, 2.8 SEC, 320 KM/H, 795 KG) */}
      <MachineSection />

      {/* Phase 3: Engineering Subsystems (Aerodynamics, Powertrain, Control) */}
      <EngineeringSection />

      {/* Phase 3: The Circuit Experience (5.8 KM, 27 Corners, 18 Elevation Changes) */}
      <CircuitSection />

      {/* Phase 4: The Tunnel / Velocity Experience (SPEED HAS NO SHADOW.) */}
      <TunnelSection />

      {/* Phase 4: Night / Wet Track Chaos (CONTROL THE CHAOS.) */}
      <ChaosSection />

      {/* Phase 5: Stadium Arrival, Climax, and Final Release (THE MOMENT IS YOURS. -> CROSS THE LIMIT. -> THE RACE IS YOURS.) */}
      <StadiumSection />

      {/* Persistent Bottom HUD: Chapter Progress & Live Telemetry */}
      <footer id="bottom-hud" className="fixed bottom-0 left-0 w-full px-6 py-6 md:px-12 md:py-8 z-20 pointer-events-none">
        <ProgressIndicator />
      </footer>

      {/* Cinematic Custom Pointer Details */}
      <CursorOverlay />
    </main>
  );
}
