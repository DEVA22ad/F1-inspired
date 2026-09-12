export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface SubSystemState {
  opacity: number;
  translateY: number;
  drawProgress: number;
  isVisible: boolean;
}

export interface CircuitState {
  opacity: number;
  translateY: number;
  trackDrawProgress: number;
  racingLineProgress: number;
  cornersValue: number;
  distanceValue: number;
  elevationValue: number;
  isVisible: boolean;
}

export interface EngineeringTimelineState {
  isVisible: boolean;
  activeSystemIndex: 1 | 2 | 3 | 0; // 1: Aero, 2: Powertrain, 3: Control, 0: Out/Circuit
  
  // Chapter 03 Intro
  introOpacity: number;
  introTranslateY: number;

  // 3 Sub-Systems
  aero: SubSystemState;
  powertrain: SubSystemState;
  control: SubSystemState;

  // Chapter 04 Circuit
  circuit: CircuitState;
}

export function computeEngineeringTimeline(progress: number): EngineeringTimelineState {
  // Phase 3 overall active window: 0.53 -> 0.76
  const isVisible = progress >= 0.53 && progress <= 0.76;

  // 1. Engineering Intro ("ENGINEERED TO FIND THE APEX.") (0.535 -> 0.60)
  const introIn = clamp((progress - 0.535) / 0.035);
  const introOut = clamp((progress - 0.585) / 0.03);
  const introOpacity = introIn * (1 - introOut);
  const introTranslateY = (1 - introIn) * 30 - introOut * 25;

  // Active engineering system indicator (1: Aero, 2: Powertrain, 3: Control)
  let activeSystemIndex: 1 | 2 | 3 | 0 = 0;
  if (progress >= 0.57 && progress < 0.635) {
    activeSystemIndex = 1; // Aerodynamics
  } else if (progress >= 0.635 && progress < 0.675) {
    activeSystemIndex = 2; // Powertrain
  } else if (progress >= 0.675 && progress < 0.715) {
    activeSystemIndex = 3; // Control
  } else {
    activeSystemIndex = 0;
  }

  // 2. Aerodynamics (0.575 -> 0.635)
  const aeroIn = clamp((progress - 0.575) / 0.025);
  const aeroOut = clamp((progress - 0.615) / 0.025);
  const aeroOpacity = aeroIn * (1 - aeroOut);
  const aeroTranslateY = (1 - aeroIn) * 25 - aeroOut * 20;
  const aeroDrawProgress = clamp((progress - 0.575) / 0.03);

  // 3. Powertrain (0.630 -> 0.680)
  const pwrIn = clamp((progress - 0.630) / 0.025);
  const pwrOut = clamp((progress - 0.665) / 0.025);
  const pwrOpacity = pwrIn * (1 - pwrOut);
  const pwrTranslateY = (1 - pwrIn) * 25 - pwrOut * 20;
  const pwrDrawProgress = clamp((progress - 0.630) / 0.03);

  // 4. Control (0.670 -> 0.720)
  const ctrlIn = clamp((progress - 0.670) / 0.025);
  const ctrlOut = clamp((progress - 0.705) / 0.025);
  const ctrlOpacity = ctrlIn * (1 - ctrlOut);
  const ctrlTranslateY = (1 - ctrlIn) * 25 - ctrlOut * 20;
  const ctrlDrawProgress = clamp((progress - 0.670) / 0.03);

  // 5. The Circuit (0.705 -> 0.752)
  const circIn = clamp((progress - 0.705) / 0.025);
  const circOut = clamp((progress - 0.738) / 0.016);
  const circOpacity = circIn * (1 - circOut);
  const circTranslateY = (1 - circIn) * 25 - circOut * 20;
  
  const trackDrawProgress = clamp((progress - 0.705) / 0.030);
  const racingLineProgress = clamp((progress - 0.718) / 0.020);
  
  const metricProgress = clamp((progress - 0.708) / 0.025);
  const cornersValue = Math.round(metricProgress * 27);
  const distanceValue = parseFloat((metricProgress * 5.8).toFixed(1));
  const elevationValue = Math.round(metricProgress * 18);

  return {
    isVisible,
    activeSystemIndex,
    introOpacity,
    introTranslateY,
    aero: {
      opacity: aeroOpacity,
      translateY: aeroTranslateY,
      drawProgress: aeroDrawProgress,
      isVisible: aeroOpacity > 0.01,
    },
    powertrain: {
      opacity: pwrOpacity,
      translateY: pwrTranslateY,
      drawProgress: pwrDrawProgress,
      isVisible: pwrOpacity > 0.01,
    },
    control: {
      opacity: ctrlOpacity,
      translateY: ctrlTranslateY,
      drawProgress: ctrlDrawProgress,
      isVisible: ctrlOpacity > 0.01,
    },
    circuit: {
      opacity: circOpacity,
      translateY: circTranslateY,
      trackDrawProgress,
      racingLineProgress,
      cornersValue,
      distanceValue,
      elevationValue,
      isVisible: circOpacity > 0.01,
    },
  };
}
