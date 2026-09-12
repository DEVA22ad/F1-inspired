export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface ChaosWordState {
  opacity: number;
  translateY: number;
  translateX: number;
  scale: number;
}

export interface AnnotationState {
  opacity: number;
  translateY: number;
  isVisible: boolean;
}

export interface ChaosTimelineState {
  isVisible: boolean;
  systemOpacity: number;
  
  // Three staggered words
  wordControl: ChaosWordState;
  wordThe: ChaosWordState;
  wordChaos: ChaosWordState;

  // Floating Micro-Environmental Annotations
  labelTrackWet: AnnotationState;
  labelVisibilityLow: AnnotationState;
  labelSurfaceVariable: AnnotationState;
  labelPressureHigh: AnnotationState;

  // Wet atmospheric texture opacity
  wetAtmosphereOpacity: number;
}

export function computeChaosTimeline(progress: number): ChaosTimelineState {
  // Chaos / Wet track active window: 0.835 -> 0.940 (Frames ~1090 to 1230)
  const isVisible = progress >= 0.835 && progress <= 0.940;

  // System tag ("SYSTEM 05 // DYNAMICS [WET PROTOCOL]")
  const sysIn = clamp((progress - 0.838) / 0.02);
  const sysOut = clamp((progress - 0.905) / 0.02);
  const systemOpacity = sysIn * (1 - sysOut);

  // 1. Word "CONTROL" (Enters 0.842, peaks 0.868, exits 0.902)
  const ctrlIn = clamp((progress - 0.842) / 0.022);
  const ctrlOut = clamp((progress - 0.898) / 0.020);
  const ctrlOpacity = ctrlIn * (1 - ctrlOut);
  const ctrlTranslateY = (1 - ctrlIn) * 35 - ctrlOut * 25;
  const ctrlTranslateX = (1 - ctrlIn) * -15;
  const ctrlScale = 0.95 + ctrlIn * 0.05 - ctrlOut * 0.04;

  // 2. Word "THE" (Enters 0.849, peaks 0.874, exits 0.908)
  const theIn = clamp((progress - 0.849) / 0.021);
  const theOut = clamp((progress - 0.904) / 0.020);
  const theOpacity = theIn * (1 - theOut);
  const theTranslateY = (1 - theIn) * 35 - theOut * 25;
  const theTranslateX = (1 - theIn) * -10;
  const theScale = 0.95 + theIn * 0.05 - theOut * 0.04;

  // 3. Word "CHAOS." (Enters 0.856, peaks 0.880, exits 0.915)
  const chaosIn = clamp((progress - 0.856) / 0.020);
  const chaosOut = clamp((progress - 0.910) / 0.020);
  const chaosOpacity = chaosIn * (1 - chaosOut);
  const chaosTranslateY = (1 - chaosIn) * 35 - chaosOut * 25;
  const chaosTranslateX = (1 - chaosIn) * -5;
  const chaosScale = 0.95 + chaosIn * 0.08 - chaosOut * 0.05;

  // Helper for sparse environmental floating labels
  const makeAnnotation = (startIn: number, startOut: number): AnnotationState => {
    const aIn = clamp((progress - startIn) / 0.018);
    const aOut = clamp((progress - startOut) / 0.018);
    const opacity = aIn * (1 - aOut);
    const translateY = (1 - aIn) * 15 - aOut * 10;
    return {
      opacity,
      translateY,
      isVisible: opacity > 0.01,
    };
  };

  // 4 Sparse floating labels
  const labelTrackWet = makeAnnotation(0.862, 0.908);
  const labelVisibilityLow = makeAnnotation(0.868, 0.914);
  const labelSurfaceVariable = makeAnnotation(0.874, 0.920);
  const labelPressureHigh = makeAnnotation(0.880, 0.926);

  // Subtle wet atmosphere sheen overlay
  const wetIn = clamp((progress - 0.840) / 0.030);
  const wetOut = clamp((progress - 0.920) / 0.020);
  const wetAtmosphereOpacity = wetIn * (1 - wetOut) * 0.45;

  return {
    isVisible,
    systemOpacity,
    wordControl: {
      opacity: ctrlOpacity,
      translateY: ctrlTranslateY,
      translateX: ctrlTranslateX,
      scale: ctrlScale,
    },
    wordThe: {
      opacity: theOpacity,
      translateY: theTranslateY,
      translateX: theTranslateX,
      scale: theScale,
    },
    wordChaos: {
      opacity: chaosOpacity,
      translateY: chaosTranslateY,
      translateX: chaosTranslateX,
      scale: chaosScale,
    },
    labelTrackWet,
    labelVisibilityLow,
    labelSurfaceVariable,
    labelPressureHigh,
    wetAtmosphereOpacity,
  };
}
