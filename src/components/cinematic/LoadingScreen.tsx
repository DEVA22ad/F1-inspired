"use client";

import React, { useEffect, useState } from "react";

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);

  useEffect(() => {
    // Fast initial frame stream readiness simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoaded(true), 150);
          setTimeout(() => setIsRemoved(true), 650);
          return 100;
        }
        return prev + Math.floor(Math.random() * 25) + 15;
      });
    }, 60);

    return () => clearInterval(interval);
  }, []);

  if (isRemoved) return null;

  return (
    <div
      id="cinematic-loader"
      aria-live="polite"
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg-primary select-none transition-opacity duration-500 ease-out ${
        isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-5 max-w-xs text-center px-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5">
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_6px_var(--accent-red-glow)] animate-pulse" />
          <span className="font-display text-xl font-extrabold tracking-widest text-text-primary uppercase">
            SCUDERIA APEX
          </span>
        </div>

        {/* Minimal Progress Bar */}
        <div className="w-48 h-1 bg-white/10 relative overflow-hidden rounded-full mt-2">
          <div
            className="h-full bg-accent-red transition-all duration-150 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Status Readout */}
        <div className="flex flex-col gap-1 font-mono text-[0.65rem] tracking-[0.2em] text-text-secondary uppercase">
          <span>{progress < 100 ? "INITIALIZING EXPERIENCE..." : "FRAME STREAM READY"}</span>
          <span className="text-text-muted">{Math.min(progress, 100)}%</span>
        </div>
      </div>
    </div>
  );
}
