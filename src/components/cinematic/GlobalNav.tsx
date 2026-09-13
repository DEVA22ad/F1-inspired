"use client";

import React, { useEffect, useRef } from "react";
import { scrollBridge } from "@/lib/animation/scroll";
import { autoScroll } from "@/lib/animation/autoScroll";

function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export default function GlobalNav() {
  const headerRef = useRef<HTMLElement | null>(null);
  const [isAutoScrolling, setIsAutoScrolling] = React.useState(false);

  useEffect(() => {
    const unsubAuto = autoScroll.subscribe((active) => {
      setIsAutoScrolling(active);
    });

    const unsubscribe = scrollBridge.subscribe((progress) => {
      const el = headerRef.current;
      if (!el) return;

      let opacity = 1.0;

      if (progress < 0.25) {
        opacity = 1.0;
      } else if (progress < 0.55) {
        opacity = 0.90;
      } else if (progress < 0.74) {
        opacity = 0.85;
      } else if (progress < 0.84) {
        // Velocity / Tunnel attenuation
        if (progress >= 0.765 && progress <= 0.830) {
          const attIn = clamp((progress - 0.765) / 0.025);
          const attOut = clamp((progress - 0.815) / 0.015);
          opacity = 0.60 - attIn * (1 - attOut) * 0.35;
        } else {
          opacity = 0.60;
        }
      } else if (progress < 0.94) {
        opacity = 0.35;
      } else if (progress < 0.975) {
        // Arrival fading down to 0
        opacity = 0.15 * (1 - clamp((progress - 0.94) / 0.035));
      } else {
        // Finish & Release: 100% footage dominance (0%)
        opacity = 0.0;
      }

      el.style.opacity = opacity.toFixed(3);
    });

    return () => {
      unsubAuto();
      unsubscribe();
    };
  }, []);

  const handleToggleAutoScroll = () => {
    autoScroll.toggle();
  };

  return (
    <header
      id="global-nav"
      ref={headerRef}
      className="fixed top-0 left-0 w-full px-6 py-6 md:px-12 md:py-8 flex justify-between items-center z-20 pointer-events-none transition-opacity duration-200 will-change-opacity select-none"
    >
      <div className="flex items-center gap-3 pointer-events-auto">
        <span className="w-1.5 h-1.5 bg-accent-red rounded-full shadow-[0_0_8px_var(--accent-red-glow)] inline-block animate-pulse-dot" />
        <span className="font-display text-lg md:text-xl font-extrabold tracking-widest text-text-primary uppercase">
          SCUDERIA APEX
        </span>
        <span className="hidden md:inline-block font-mono text-[0.7rem] tracking-wider text-text-muted border-l border-border-subtle pl-3 uppercase">
          CHASSIS 01 // 2026 SPEC
        </span>
      </div>

      <div className="flex items-center gap-3 pointer-events-auto">
        {/* Auto Scroll / Drive Toggle Control */}
        <button
          type="button"
          onClick={handleToggleAutoScroll}
          aria-label={isAutoScrolling ? "Pause auto scroll" : "Play auto scroll"}
          className={`group inline-flex items-center gap-2 px-3.5 py-1.5 font-mono text-[0.7rem] tracking-wider border rounded-sm backdrop-blur-md transition-all duration-200 cursor-pointer ${
            isAutoScrolling
              ? "bg-accent-red/20 border-accent-red text-white shadow-[0_0_12px_rgba(225,6,0,0.3)]"
              : "bg-bg-surface/60 border-border-subtle text-text-secondary hover:text-text-primary hover:border-white/30"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              isAutoScrolling ? "bg-accent-red animate-pulse" : "bg-white/40 group-hover:bg-white"
            }`}
          />
          <span className="font-medium">
            {isAutoScrolling ? "PAUSE AUTO" : "AUTO DRIVE"}
          </span>
          <span className="text-[0.65rem] text-accent-red font-bold">
            {isAutoScrolling ? "❚❚" : "▶"}
          </span>
        </button>

        {/* Live Stream Status Badge */}
        <div className="hidden sm:flex items-center gap-2.5 font-mono text-[0.7rem] tracking-wider px-3.5 py-1.5 bg-bg-surface/60 border border-border-subtle rounded-sm backdrop-blur-md">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block animate-pulse" />
          <span className="text-text-primary font-medium">4K 60FPS</span>
        </div>
      </div>
    </header>
  );
}
