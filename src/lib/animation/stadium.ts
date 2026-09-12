export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface WordRevealState {
  opacity: number;
  translateY: number;
  scale: number;
}

export interface StadiumTimelineState {
  isVisible: boolean;
  
  // 1. Stadium Approach Marker ("SYSTEM 06 // ARRIVAL")
  arrivalMarkerOpacity: number;

  // 2. Anticipation: "THE MOMENT IS YOURS."
  theMoment: {
    wordThe: WordRevealState;
    wordMoment: WordRevealState;
    wordIsYours: WordRevealState;
    supportingCopyOpacity: number;
    supportingCopyTranslateY: number;
    isVisible: boolean;
  };

  // 3. Climax: "CROSS THE LIMIT."
  crossLimit: {
    wordCross: WordRevealState;
    wordThe: WordRevealState;
    wordLimit: WordRevealState;
    isVisible: boolean;
  };

  // 4. Release: "THE RACE IS YOURS." + Restart CTA
  finalRelease: {
    opacity: number;
    translateY: number;
    isVisible: boolean;
  };

  // HUD Fade-out Factor (1.0 -> 0.0)
  hudOpacity: number;
}

export function computeStadiumTimeline(progress: number): StadiumTimelineState {
  // Phase 5 overall active window: 0.935 -> 1.000
  const isVisible = progress >= 0.935 && progress <= 1.000;

  // 1. Arrival Marker (0.938 -> 0.965)
  const arrIn = clamp((progress - 0.938) / 0.012);
  const arrOut = clamp((progress - 0.960) / 0.012);
  const arrivalMarkerOpacity = arrIn * (1 - arrOut);

  // 2. "THE MOMENT IS YOURS." (0.955 -> 0.978)
  const mIn = clamp((progress - 0.955) / 0.010);
  const mOut = clamp((progress - 0.972) / 0.008);
  const mOpacity = mIn * (1 - mOut);
  
  // Staggered reveals for The Moment
  const mTheIn = clamp((progress - 0.955) / 0.008);
  const mMomIn = clamp((progress - 0.958) / 0.008);
  const mYoursIn = clamp((progress - 0.961) / 0.008);

  const wordThe: WordRevealState = {
    opacity: mTheIn * (1 - mOut),
    translateY: (1 - mTheIn) * 25 - mOut * 20,
    scale: 0.97 + mTheIn * 0.03,
  };

  const wordMoment: WordRevealState = {
    opacity: mMomIn * (1 - mOut),
    translateY: (1 - mMomIn) * 25 - mOut * 20,
    scale: 0.97 + mMomIn * 0.03,
  };

  const wordIsYours: WordRevealState = {
    opacity: mYoursIn * (1 - mOut),
    translateY: (1 - mYoursIn) * 25 - mOut * 20,
    scale: 0.97 + mYoursIn * 0.03,
  };

  // Supporting copy enters slightly later and disappears earlier (0.960 -> 0.970)
  const supIn = clamp((progress - 0.960) / 0.006);
  const supOut = clamp((progress - 0.968) / 0.005);
  const supportingCopyOpacity = supIn * (1 - supOut);
  const supportingCopyTranslateY = (1 - supIn) * 15 - supOut * 10;

  // 3. Climax: "CROSS THE LIMIT." (0.976 -> 0.988)
  // Exits cleanly by 0.988 so 0.988 -> 0.994 is pure finish crossing footage
  const clIn = clamp((progress - 0.976) / 0.006);
  const clOut = clamp((progress - 0.985) / 0.005);
  
  const cCrossIn = clamp((progress - 0.976) / 0.005);
  const cTheIn = clamp((progress - 0.978) / 0.005);
  const cLimitIn = clamp((progress - 0.980) / 0.005);

  const wordCross: WordRevealState = {
    opacity: cCrossIn * (1 - clOut),
    translateY: (1 - cCrossIn) * 30 - clOut * 25,
    scale: 1.04 - cCrossIn * 0.04,
  };

  const wordThe2: WordRevealState = {
    opacity: cTheIn * (1 - clOut),
    translateY: (1 - cTheIn) * 30 - clOut * 25,
    scale: 1.04 - cTheIn * 0.04,
  };

  const wordLimit: WordRevealState = {
    opacity: cLimitIn * (1 - clOut),
    translateY: (1 - cLimitIn) * 30 - clOut * 25,
    scale: 1.04 - cLimitIn * 0.04,
  };

  // 4. Release: "THE RACE IS YOURS." + Restart CTA (0.994 -> 1.000)
  // Enters after finish footage breath, sitting calmly as the final emotional release
  const relIn = clamp((progress - 0.994) / 0.005);
  const relOpacity = relIn;
  const relTranslateY = (1 - relIn) * 20;

  // Global HUD fading: 0.94 -> 0.98 (fades from 1.0 down to 0.0)
  let hudOpacity = 1.0;
  if (progress >= 0.940) {
    hudOpacity = 1.0 - clamp((progress - 0.940) / 0.040);
  }

  return {
    isVisible,
    arrivalMarkerOpacity,
    theMoment: {
      wordThe,
      wordMoment,
      wordIsYours,
      supportingCopyOpacity,
      supportingCopyTranslateY,
      isVisible: mOpacity > 0.01,
    },
    crossLimit: {
      wordCross,
      wordThe: wordThe2,
      wordLimit,
      isVisible: clIn * (1 - clOut) > 0.01,
    },
    finalRelease: {
      opacity: relOpacity,
      translateY: relTranslateY,
      isVisible: relOpacity > 0.01,
    },
    hudOpacity,
  };
}
