export type MachineSystemId = "aero" | "powertrain" | "control" | "chassis";

export interface SystemSpecItem {
  label: string;
  value: string;
  status?: string;
}

export interface PathwayNode {
  id: string;
  label: string;
  subLabel: string;
}

export interface SystemDefinition {
  id: MachineSystemId;
  systemIndex: string;
  title: string;
  codeName: string;
  headline: string;
  description: string;
  status: string;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  specs: SystemSpecItem[];
  pathwayNodes?: PathwayNode[];
  hotspotIds: string[];
}

export interface HotspotData {
  id: string;
  systemId: MachineSystemId;
  label: string;
  subLabel: string;
  position3D: [number, number, number];
  description: string;
}

export const MACHINE_SYSTEMS: Record<MachineSystemId, SystemDefinition> = {
  aero: {
    id: "aero",
    systemIndex: "01",
    title: "AERODYNAMICS",
    codeName: "AERO // DYNAMICS",
    headline: "AIR MANAGEMENT & BOUNDARY CONTROL",
    description:
      "Every surface guides and separates turbulent boundary layers. Sculpted sidepod undercuts and active floor venturi tunnels create sustained ground-effect downforce through apex transitions.",
    status: "ACTIVE PROTOCOL",
    cameraPosition: [3.8, 1.6, 3.2],
    cameraTarget: [0.3, 0.2, 0.0],
    specs: [
      { label: "SURFACE PRESSURE", value: "OPTIMIZED", status: "HIGH" },
      { label: "DOWNFORCE BALANCE", value: "ACTIVE", status: "NOMINAL" },
      { label: "BOUNDARY LAYER", value: "CONTROLLED", status: "LAMINAR" },
      { label: "FLOOR SUCTION", value: "STABLE", status: "MAX LOAD" },
    ],
    hotspotIds: ["front-wing", "rear-wing", "sidepod"],
  },
  powertrain: {
    id: "powertrain",
    systemIndex: "02",
    title: "POWERTRAIN",
    codeName: "POWERTRAIN // FLUX",
    headline: "HYBRID ENERGY GENERATION & TORQUE TRANSFER",
    description:
      "Instantaneous hybrid energy conversion synchronizes internal combustion boost with electrical torque delivery directly through the drivetrain to the contact patch.",
    status: "ENERGY ACTIVE",
    cameraPosition: [-3.2, 2.0, 3.4],
    cameraTarget: [-0.4, 0.1, 0.0],
    specs: [
      { label: "POWER CONVERSION", value: "ENGAGED", status: "HIGH" },
      { label: "ENERGY FLOW", value: "ACTIVE", status: "SYNCHRONIZED" },
      { label: "TORQUE DELIVERY", value: "DIRECT", status: "OPTIMIZED" },
      { label: "TRACTION RESPONSE", value: "BALANCED", status: "STABLE" },
    ],
    pathwayNodes: [
      { id: "pu", label: "POWER UNIT", subLabel: "V6 TURBO + MGU-H" },
      { id: "es", label: "ENERGY STORAGE", subLabel: "BATTERY MATRIX" },
      { id: "td", label: "TORQUE DELIVERY", subLabel: "DIRECT DRIVESHAFT" },
      { id: "wt", label: "WHEEL TRACTION", subLabel: "APEX LATERAL BITE" },
    ],
    hotspotIds: ["power-unit", "energy-storage"],
  },
  control: {
    id: "control",
    systemIndex: "03",
    title: "CONTROL",
    codeName: "CONTROL // APEX",
    headline: "PRECISION CHASSIS VECTORING & DYNAMICS",
    description:
      "Chassis control combines variable steering geometry, conceptual hydraulic brake balance modeling, and predictive traction curves to secure absolute apex lock.",
    status: "SYSTEM ENGAGED",
    cameraPosition: [2.5, 2.4, 2.5],
    cameraTarget: [0.6, 0.0, 0.4],
    specs: [
      { label: "STEERING GEOMETRY", value: "APEX VECTOR LOCK", status: "PRECISE" },
      { label: "BRAKING DYNAMICS", value: "CONCEPTUAL MODEL", status: "BALANCED" },
      { label: "TRACTION CURVE", value: "ACTIVE RESPONSE", status: "OPTIMIZED" },
      { label: "SLIP ANGLE", value: "RESTRICTED", status: "STABLE" },
    ],
    hotspotIds: ["steering-rack", "braking-caliper"],
  },
  chassis: {
    id: "chassis",
    systemIndex: "04",
    title: "CHASSIS",
    codeName: "CHASSIS // CORE",
    headline: "MONOCOQUE SAFETY CELL & SUSPENSION GEOMETRY",
    description:
      "Ultra-rigid carbon composite survival cell with integrated halo driver envelope and multi-link push-rod suspension architecture resisting extreme lateral G-forces.",
    status: "STRUCTURAL LOCK",
    cameraPosition: [0.0, 4.2, 3.8],
    cameraTarget: [0.0, 0.0, 0.0],
    specs: [
      { label: "MONOCOQUE TUB", value: "CARBON COMPOSITE", status: "HIGH RIGIDITY" },
      { label: "MASS BALANCE", value: "OPTIMIZED", status: "CENTERED" },
      { label: "SUSPENSION", value: "PUSH-ROD KINEMATICS", status: "ACTIVE" },
      { label: "SAFETY ENVELOPE", value: "TITANIUM HALO", status: "MAX INTEGRITY" },
    ],
    hotspotIds: ["monocoque", "suspension-wishbone"],
  },
};

export const HOTSPOTS: HotspotData[] = [
  {
    id: "front-wing",
    systemId: "aero",
    label: "FRONT WING & VORTEX",
    subLabel: "SYS // 01.1",
    position3D: [1.8, 0.25, 0.0],
    description: "Multi-element cascade generating targeted aerodynamic vortices under the floor.",
  },
  {
    id: "sidepod",
    systemId: "aero",
    label: "VENTURI UNDERCUT",
    subLabel: "SYS // 01.2",
    position3D: [0.2, 0.4, 0.95],
    description: "Sculpted sidepod channeling undisturbed airflow toward the rear diffuser.",
  },
  {
    id: "rear-wing",
    systemId: "aero",
    label: "REAR WING & DRS FLAP",
    subLabel: "SYS // 01.3",
    position3D: [-1.9, 0.95, 0.0],
    description: "High-downforce dual-tier wing producing vertical loading over the rear axle.",
  },
  {
    id: "power-unit",
    systemId: "powertrain",
    label: "HYBRID POWER UNIT",
    subLabel: "SYS // 02.1",
    position3D: [-0.7, 0.55, 0.0],
    description: "V6 turbocharged internal combustion engine synchronized with kinetic recovery.",
  },
  {
    id: "energy-storage",
    systemId: "powertrain",
    label: "ENERGY STORAGE MATRIX",
    subLabel: "SYS // 02.2",
    position3D: [-0.1, 0.35, 0.0],
    description: "Central low-center-of-gravity battery matrix delivering peak instant torque.",
  },
  {
    id: "steering-rack",
    systemId: "control",
    label: "STEERING RACK VECTOR",
    subLabel: "SYS // 03.1",
    position3D: [1.1, 0.35, 0.0],
    description: "Precision steering dynamics locking front wheel yaw onto apex trajectory.",
  },
  {
    id: "braking-caliper",
    systemId: "control",
    label: "CARBON-CERAMIC BRAKES",
    subLabel: "SYS // 03.2",
    position3D: [1.35, 0.35, 0.82],
    description: "Multi-piston monobloc calipers executing rapid kinetic energy dissipation.",
  },
  {
    id: "monocoque",
    systemId: "chassis",
    label: "MONOCOQUE SURVIVAL CELL",
    subLabel: "SYS // 04.1",
    position3D: [0.5, 0.55, 0.0],
    description: "Structural carbon fiber survival core enclosing cockpit and front bulkhead.",
  },
  {
    id: "suspension-wishbone",
    systemId: "chassis",
    label: "PUSH-ROD SUSPENSION",
    subLabel: "SYS // 04.2",
    position3D: [1.2, 0.45, 0.65],
    description: "Carbon composite aerodynamic wishbones managing ride height and camber.",
  },
];
