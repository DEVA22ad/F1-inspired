export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface MetricState {
  opacity: number;
  translateY: number;
  counterValue: number;
  isVisible: boolean;
}

export interface MachineTimelineState {
  isVisible: boolean;
  chapterProgress: number; // 0 -> 1 within Chapter 2 (0.24 -> 0.56)
  
  // Chapter 2 Header & Title
  titleOpacity: number;
  titleTranslateY: number;
  titleScale: number;
  
  // 4 Core Performance Metrics
  power: MetricState;        // 950 HP
  acceleration: MetricState; // 2.8 SEC
  speed: MetricState;        // 320 KM/H
  mass: MetricState;         // 795 KG

  // Overall Section Exit
  exitProgress: number;
}

export function computeMachineTimeline(progress: number): MachineTimelineState {
  // Phase 2 active window: 0.23 -> 0.57
  const isVisible = progress >= 0.23 && progress <= 0.57;
  const chapterProgress = clamp((progress - 0.24) / 0.32);

  // 1. Chapter Title (THE MACHINE) - Enters 0.235 -> 0.28, settles, dims as metrics take over 0.33 -> 0.40
  const tTitleIn = clamp((progress - 0.235) / 0.045);
  const tTitleDim = clamp((progress - 0.32) / 0.06);
  const tTitleOut = clamp((progress - 0.51) / 0.05);

  let titleOpacity = 0;
  if (progress < 0.32) {
    titleOpacity = tTitleIn;
  } else if (progress < 0.51) {
    titleOpacity = 1 - tTitleDim * 0.75; // Dims down to 0.25 to stay as atmospheric watermark
  } else {
    titleOpacity = (1 - tTitleDim * 0.75) * (1 - tTitleOut);
  }

  const titleTranslateY = (1 - tTitleIn) * 35 - tTitleOut * 40;
  const titleScale = 1 - tTitleDim * 0.04;

  // 2. Metric 1: POWER - 950 HP (Window: 0.28 -> 0.38)
  const powerIn = clamp((progress - 0.275) / 0.04);
  const powerOut = clamp((progress - 0.355) / 0.035);
  const powerOpacity = powerIn * (1 - powerOut);
  const powerTranslateY = (1 - powerIn) * 30 - powerOut * 25;
  const powerCounterProgress = clamp((progress - 0.275) / 0.035);
  const powerCounter = Math.round(powerCounterProgress * 950);

  // 3. Metric 2: ACCELERATION - 2.8 SEC (Window: 0.34 -> 0.44)
  const accelIn = clamp((progress - 0.335) / 0.04);
  const accelOut = clamp((progress - 0.415) / 0.035);
  const accelOpacity = accelIn * (1 - accelOut);
  const accelTranslateY = (1 - accelIn) * 30 - accelOut * 25;
  const accelCounterProgress = clamp((progress - 0.335) / 0.035);
  const accelCounter = parseFloat((accelCounterProgress * 2.8).toFixed(1));

  // 4. Metric 3: TOP SPEED - 320 KM/H (Window: 0.40 -> 0.50)
  const speedIn = clamp((progress - 0.395) / 0.04);
  const speedOut = clamp((progress - 0.475) / 0.035);
  const speedOpacity = speedIn * (1 - speedOut);
  const speedTranslateY = (1 - speedIn) * 30 - speedOut * 25;
  const speedCounterProgress = clamp((progress - 0.395) / 0.035);
  const speedCounter = Math.round(speedCounterProgress * 320);

  // 5. Metric 4: MASS - 795 KG (Window: 0.46 -> 0.56)
  const massIn = clamp((progress - 0.455) / 0.04);
  const massOut = clamp((progress - 0.535) / 0.035);
  const massOpacity = massIn * (1 - massOut);
  const massTranslateY = (1 - massIn) * 30 - massOut * 25;
  const massCounterProgress = clamp((progress - 0.455) / 0.035);
  const massCounter = Math.round(massCounterProgress * 795);

  const exitProgress = clamp((progress - 0.53) / 0.04);

  return {
    isVisible,
    chapterProgress,
    titleOpacity,
    titleTranslateY,
    titleScale,
    power: {
      opacity: powerOpacity,
      translateY: powerTranslateY,
      counterValue: powerCounter,
      isVisible: powerOpacity > 0.01,
    },
    acceleration: {
      opacity: accelOpacity,
      translateY: accelTranslateY,
      counterValue: accelCounter,
      isVisible: accelOpacity > 0.01,
    },
    speed: {
      opacity: speedOpacity,
      translateY: speedTranslateY,
      counterValue: speedCounter,
      isVisible: speedOpacity > 0.01,
    },
    mass: {
      opacity: massOpacity,
      translateY: massTranslateY,
      counterValue: massCounter,
      isVisible: massOpacity > 0.01,
    },
    exitProgress,
  };
}
