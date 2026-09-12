import React from "react";
import type { Metadata } from "next";
import MachineExplorer from "@/components/machine/MachineExplorer";

export const metadata: Metadata = {
  title: "MACHINE EXPLORER // Scuderia Apex",
  description:
    "Interactive 3D engineering laboratory: inspect aerodynamics, hybrid powertrain flux, chassis kinematics, and monocoque architecture.",
};

export default function MachinePage() {
  return <MachineExplorer />;
}
