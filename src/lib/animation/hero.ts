export function clamp(val: number, min = 0, max = 1): number {
  return Math.min(Math.max(val, min), max);
}

export interface HeroAnimationValues {
  isVisible: boolean;
  
  // 1. System Boot Micro UI (0.000 -> 0.048)
  bootOpacity: number;
  bootTranslateY: number;
  aeroReady: boolean;
  powerReady: boolean;
  tractionReady: boolean;
  telemetryLinked: boolean;

  // 2. Vertical Ignition Marker (0.005 -> 0.065)
  markerOpacity: number;
  markerTranslateY: number;

  // 3. Car-Anchored Micro Telemetry (0.005 -> 0.065)
  carTelemetryOpacity: number;
  powerUnitOnline: boolean;

  // 4. Race Control / Ignition Status (0.035 -> 0.085)
  raceControlOpacity: number;
  raceControlTranslateY: number;
  isGreenLight: boolean;

  // 5. Master Display Typography (ENGINEERED FOR SPEED.)
  line1Progress: number;
  line2Progress: number;
  statementOpacity: number;
  statementTranslateY: number;
  heroExitProgress: number;
  heroOpacity: number;
  heroTranslateY: number;

  // 6. Scroll Initiation Cue
  cueOpacity: number;
  cueTranslateY: number;
  isInitiated: boolean;
}

export function computeHeroTimeline(progress: number): HeroAnimationValues {
  // Strictly false for progress >= 0.100
  const isVisible = progress < 0.100;

  // 1. System Boot Micro UI (0.005 -> 0.048)
  const bootIn = clamp((progress - 0.005) / 0.012);
  const bootOut = clamp((progress - 0.035) / 0.013);
  const bootOpacity = bootIn * (1 - bootOut);
  const bootTranslateY = (1 - bootIn) * 12 - bootOut * 10;

  const aeroReady = progress >= 0.010;
  const powerReady = progress >= 0.016;
  const tractionReady = progress >= 0.022;
  const telemetryLinked = progress >= 0.028;

  // 2. Vertical Ignition Calibration Marker (0.005 -> 0.065)
  const markerIn = clamp((progress - 0.005) / 0.015);
  const markerOut = clamp((progress - 0.048) / 0.017);
  const markerOpacity = markerIn * (1 - markerOut);
  const markerTranslateY = (1 - markerIn) * 15 - markerOut * 25;

  // 3. Car-Anchored Micro Telemetry (0.005 -> 0.065)
  const carIn = clamp((progress - 0.005) / 0.015);
  const carOut = clamp((progress - 0.050) / 0.015);
  const carTelemetryOpacity = carIn * (1 - carOut);
  const powerUnitOnline = progress >= 0.015;

  // 4. Race Control / Ignition Status Indicator (0.035 -> 0.085)
  const rcIn = clamp((progress - 0.035) / 0.014);
  const rcOut = clamp((progress - 0.070) / 0.015);
  const raceControlOpacity = rcIn * (1 - rcOut);
  const raceControlTranslateY = (1 - rcIn) * 10 - rcOut * 12;
  const isGreenLight = progress >= 0.055;

  // 5. Master Display Typography (ENGINEERED FOR SPEED.)
  const line1Progress = clamp((progress - 0.030) / 0.025);
  const line2Progress = clamp((progress - 0.045) / 0.025);

  const stmtIn = clamp((progress - 0.052) / 0.020);
  const statementOpacity = stmtIn;
  const statementTranslateY = (1 - stmtIn) * 12;

  // Final Withdrawal: begins at 0.080 and finishes with absolute 0 at 0.100
  const heroExitProgress = clamp((progress - 0.080) / 0.020);
  const heroOpacity = (1 - heroExitProgress);
  const heroTranslateY = -heroExitProgress * 30;

  // 6. Intentional Scroll Initiation Cue
  const isInitiated = progress >= 0.008;
  const cueOpacity = clamp(1 - progress / 0.025);
  const cueTranslateY = -progress * 200;

  return {
    isVisible,
    bootOpacity,
    bootTranslateY,
    aeroReady,
    powerReady,
    tractionReady,
    telemetryLinked,
    markerOpacity,
    markerTranslateY,
    carTelemetryOpacity,
    powerUnitOnline,
    raceControlOpacity,
    raceControlTranslateY,
    isGreenLight,
    line1Progress,
    line2Progress,
    statementOpacity,
    statementTranslateY,
    heroExitProgress,
    heroOpacity,
    heroTranslateY,
    cueOpacity,
    cueTranslateY,
    isInitiated,
  };
}
