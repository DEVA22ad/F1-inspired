export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface WordAnimationState {
  opacity: number;
  translateY: number;
  scale: number;
  blurPx: number;
  clipProgress: number; // 0 (clipped) -> 1 (fully revealed)
}

export interface TunnelTimelineState {
  isVisible: boolean;
  systemOpacity: number;
  
  // Three staggered words
  wordSpeed: WordAnimationState;
  wordHas: WordAnimationState;
  wordNoShadow: WordAnimationState;

  // Cinematic Environmental Lighting
  tunnelVignetteIntensity: number; // 0.0 -> 0.85 inside tunnel
  hudAttenuation: number; // 1.0 (normal) -> 0.25 (deep tunnel)
}

export function computeTunnelTimeline(progress: number): TunnelTimelineState {
  // Tunnel active window: 0.740 -> 0.840 (Frames ~970 to 1100)
  const isVisible = progress >= 0.740 && progress <= 0.840;

  // System tag ("SYSTEM 04 // VELOCITY")
  const sysIn = clamp((progress - 0.742) / 0.02);
  const sysOut = clamp((progress - 0.805) / 0.02);
  const systemOpacity = sysIn * (1 - sysOut);

  // 1. Word "SPEED" (Enters 0.746, peaks 0.768, exits 0.800)
  const speedIn = clamp((progress - 0.746) / 0.022);
  const speedOut = clamp((progress - 0.795) / 0.020);
  const speedOpacity = speedIn * (1 - speedOut);
  const speedTranslateY = (1 - speedIn) * 45 - speedOut * 35;
  const speedScale = 0.92 + speedIn * 0.08 + speedOut * 0.15;
  const speedBlur = (1 - speedIn) * 6 + speedOut * 10;
  const speedClip = speedIn;

  // 2. Word "HAS" (Enters 0.753, peaks 0.774, exits 0.806)
  const hasIn = clamp((progress - 0.753) / 0.021);
  const hasOut = clamp((progress - 0.801) / 0.020);
  const hasOpacity = hasIn * (1 - hasOut);
  const hasTranslateY = (1 - hasIn) * 45 - hasOut * 35;
  const hasScale = 0.92 + hasIn * 0.08 + hasOut * 0.15;
  const hasBlur = (1 - hasIn) * 6 + hasOut * 10;
  const hasClip = hasIn;

  // 3. Word "NO SHADOW." (Enters 0.760, peaks 0.780, exits 0.814)
  const nsIn = clamp((progress - 0.760) / 0.020);
  const nsOut = clamp((progress - 0.808) / 0.020);
  const nsOpacity = nsIn * (1 - nsOut);
  const nsTranslateY = (1 - nsIn) * 45 - nsOut * 35;
  const nsScale = 0.92 + nsIn * 0.08 + nsOut * 0.15;
  const nsBlur = (1 - nsIn) * 6 + nsOut * 10;
  const nsClip = nsIn;

  // Tunnel Darkness / Vignette intensification:
  // Peaks as the car plunges into the deepest tunnel section (0.785 -> 0.815),
  // then opens cleanly as daylight/exit burst approaches (0.825 -> 0.840)
  let tunnelVignetteIntensity = 0;
  if (progress >= 0.755 && progress <= 0.835) {
    const vigIn = clamp((progress - 0.755) / 0.035);
    const vigOut = clamp((progress - 0.815) / 0.020);
    tunnelVignetteIntensity = vigIn * (1 - vigOut) * 0.75;
  }

  // HUD attenuation: quiet down inside the tunnel
  let hudAttenuation = 1.0;
  if (progress >= 0.765 && progress <= 0.830) {
    const attIn = clamp((progress - 0.765) / 0.025);
    const attOut = clamp((progress - 0.815) / 0.015);
    hudAttenuation = 1.0 - (attIn * (1 - attOut) * 0.75);
  }

  return {
    isVisible,
    systemOpacity,
    wordSpeed: {
      opacity: speedOpacity,
      translateY: speedTranslateY,
      scale: speedScale,
      blurPx: speedBlur,
      clipProgress: speedClip,
    },
    wordHas: {
      opacity: hasOpacity,
      translateY: hasTranslateY,
      scale: hasScale,
      blurPx: hasBlur,
      clipProgress: hasClip,
    },
    wordNoShadow: {
      opacity: nsOpacity,
      translateY: nsTranslateY,
      scale: nsScale,
      blurPx: nsBlur,
      clipProgress: nsClip,
    },
    tunnelVignetteIntensity,
    hudAttenuation,
  };
}
