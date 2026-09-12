import React from "react";

export default function CinematicOverlay() {
  return (
    <div id="cinematic-overlay" className="fixed inset-0 z-[5] pointer-events-none" aria-hidden="true">
      <div className="vignette" />
      <div className="film-grain" />

      {/* Precision Alignment Brackets */}
      <div className="corner-bracket top-left" />
      <div className="corner-bracket top-right" />
      <div className="corner-bracket bottom-left" />
      <div className="corner-bracket bottom-right" />
    </div>
  );
}
