import React, { forwardRef } from "react";

interface PerformanceMetricProps {
  label: string;
  telemetrySub: string;
  unit: string;
  subText?: string;
  alignment?: "left" | "right";
  positionClass?: string;
  svgType?: "top-right" | "top-left" | "bottom-left" | "bottom-right";
}

export interface PerformanceMetricHandle {
  container: HTMLDivElement | null;
  valueEl: HTMLSpanElement | null;
}

const PerformanceMetric = forwardRef<HTMLDivElement, PerformanceMetricProps>(
  (
    {
      label,
      telemetrySub,
      unit,
      subText,
      alignment = "left",
      positionClass = "",
      svgType = "top-right",
    },
    ref
  ) => {
    const isRight = alignment === "right";

    return (
      <div
        ref={ref}
        className={`absolute flex flex-col pointer-events-none will-change-[transform,opacity] ${positionClass} ${
          isRight ? "items-end text-right" : "items-start text-left"
        }`}
        style={{ opacity: 0 }}
      >
        {/* Technical Pre-annotation */}
        <div
          className={`flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.16em] text-text-secondary uppercase mb-1 ${
            isRight ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span className="w-1.5 h-1.5 bg-accent-red rounded-full inline-block shadow-[0_0_6px_var(--accent-red-glow)]" />
          <span className="text-text-primary font-medium">{label}</span>
          <span className="text-text-muted">/</span>
          <span className="text-text-muted">{telemetrySub}</span>
        </div>

        {/* Giant Typographic Number & Unit */}
        <div
          className={`flex items-baseline gap-2.5 leading-[0.82] ${
            isRight ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <span
            data-metric-value
            className="font-display text-[clamp(4.5rem,10.5vw,10.5rem)] font-black tracking-[-0.03em] text-text-primary uppercase tabular-nums"
          >
            0
          </span>
          <div className="flex flex-col items-start leading-none">
            <span className="font-display text-[clamp(1.75rem,3.5vw,3.5rem)] font-bold tracking-tight text-accent-red">
              {unit}
            </span>
            {subText && (
              <span className="font-mono text-[0.7rem] tracking-[0.14em] text-text-muted mt-1 uppercase">
                {subText}
              </span>
            )}
          </div>
        </div>

        {/* Precision Measurement Hairline Indicator */}
        <div
          className={`flex items-center gap-2 mt-2 font-mono text-[0.62rem] tracking-widest text-text-muted ${
            isRight ? "flex-row-reverse" : "flex-row"
          }`}
        >
          <svg
            className="w-24 h-4 overflow-visible stroke-white/20 fill-none"
            viewBox="0 0 96 16"
          >
            {isRight ? (
              <path d="M96 2 H16 L0 16" strokeWidth="1" />
            ) : (
              <path d="M0 2 H80 L96 16" strokeWidth="1" />
            )}
            <circle cx={isRight ? 0 : 96} cy="16" r="2" className="fill-accent-red" />
          </svg>
          <span className="opacity-60">ANALYSIS // ACTIVE</span>
        </div>
      </div>
    );
  }
);

PerformanceMetric.displayName = "PerformanceMetric";

export default PerformanceMetric;
