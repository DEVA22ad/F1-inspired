import React from "react";

interface TechnicalLabelProps {
  systemId?: string;
  statusText?: string;
  location?: string;
}

export default function TechnicalLabel({
  systemId = "SYSTEM 01",
  statusText = "IGNITION PROTOCOL [ACTIVE]",
  location = "CIRCUIT DE MONACO",
}: TechnicalLabelProps) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs md:text-sm tracking-[0.14em] text-text-secondary uppercase">
      <div className="inline-flex items-center gap-1.5 text-text-primary font-medium">
        <span className="w-1 h-1 bg-accent-red rounded-full inline-block" />
        <span>{systemId}</span>
      </div>
      <span className="text-text-muted">/</span>
      <span className="text-text-secondary">{statusText}</span>
      <span className="hidden sm:inline-block text-text-muted">/</span>
      <span className="hidden sm:inline-block text-text-muted">{location}</span>
    </div>
  );
}
