"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";

export interface EngineeringIndexHandle {
  setActiveIndex: (index: 1 | 2 | 3 | 0) => void;
}

const SYSTEMS = [
  { id: 1, label: "01 / AERODYNAMICS" },
  { id: 2, label: "02 / POWERTRAIN" },
  { id: 3, label: "03 / CONTROL" },
];

const EngineeringIndex = forwardRef<EngineeringIndexHandle>((_, ref) => {
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  useImperativeHandle(ref, () => ({
    setActiveIndex(index: 1 | 2 | 3 | 0) {
      itemRefs.current.forEach((el, i) => {
        if (!el) return;
        const systemId = i + 1;
        const isActive = systemId === index;
        const dot = el.querySelector("[data-index-dot]") as HTMLElement | null;
        const text = el.querySelector("[data-index-text]") as HTMLElement | null;

        if (isActive) {
          if (dot) {
            dot.style.opacity = "1";
            dot.style.transform = "scale(1)";
          }
          if (text) {
            text.style.color = "#FFFFFF";
            text.style.fontWeight = "600";
          }
        } else {
          if (dot) {
            dot.style.opacity = "0";
            dot.style.transform = "scale(0)";
          }
          if (text) {
            text.style.color = "rgba(255, 255, 255, 0.35)";
            text.style.fontWeight = "400";
          }
        }
      });
    },
  }));

  return (
    <nav
      aria-label="Engineering Systems Index"
      className="flex flex-col gap-2 font-mono text-[0.65rem] md:text-xs tracking-[0.18em] uppercase select-none pointer-events-none"
    >
      {SYSTEMS.map((sys, idx) => (
        <div
          key={sys.id}
          ref={(el) => {
            itemRefs.current[idx] = el;
          }}
          className="flex items-center gap-2.5 transition-colors duration-200"
        >
          <span
            data-index-dot
            className="w-1.5 h-1.5 rounded-full bg-accent-red shadow-[0_0_6px_var(--accent-red-glow)] transition-all duration-200 opacity-0 scale-0"
          />
          <span
            data-index-text
            className="text-white/35 transition-colors duration-200"
          >
            {sys.label}
          </span>
        </div>
      ))}
    </nav>
  );
});

EngineeringIndex.displayName = "EngineeringIndex";

export default EngineeringIndex;
