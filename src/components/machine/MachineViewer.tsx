"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { MachineSystemId, MACHINE_SYSTEMS, HOTSPOTS } from "@/lib/animation/machineExplorer";
import { ProjectedHotspot } from "./MachineHotspots";

interface MachineViewerProps {
  activeSystem: MachineSystemId;
  resetViewTrigger: number;
  onUpdateHotspots: (projected: ProjectedHotspot[]) => void;
}

export default function MachineViewer({
  activeSystem,
  resetViewTrigger,
  onUpdateHotspots,
}: MachineViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeSystemRef = useRef<MachineSystemId>(activeSystem);
  activeSystemRef.current = activeSystem;

  const onUpdateHotspotsRef = useRef(onUpdateHotspots);
  onUpdateHotspotsRef.current = onUpdateHotspots;

  // Scene references for dynamic updates
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const rootCarGroupRef = useRef<THREE.Group | null>(null);
  const aeroVisualGroupRef = useRef<THREE.Group | null>(null);
  const powertrainVisualGroupRef = useRef<THREE.Group | null>(null);
  const controlVisualGroupRef = useRef<THREE.Group | null>(null);
  const explodedBodyGroupRef = useRef<THREE.Group | null>(null);

  // Camera targets for smooth lerping
  const targetCamPos = useRef(new THREE.Vector3(3.8, 1.6, 3.2));
  const targetCamLook = useRef(new THREE.Vector3(0.3, 0.2, 0.0));
  const currentCamLook = useRef(new THREE.Vector3(0.3, 0.2, 0.0));

  // User manual rotation offsets
  const isDragging = useRef(false);
  const prevMousePos = useRef({ x: 0, y: 0 });
  const userRotation = useRef({ x: 0, y: 0 });
  const userZoom = useRef(1.0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Scene & Camera Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x060608);
    scene.fog = new THREE.FogExp2(0x060608, 0.08);

    const camera = new THREE.PerspectiveCamera(
      45,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    cameraRef.current = camera;
    camera.position.set(3.8, 1.6, 3.2);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      powerPreference: "high-performance",
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 2. Engineering Lab Lighting
    const ambientLight = new THREE.AmbientLight(0x22222a, 1.8);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 8, 4);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xaaccff, 2.0);
    rimLight.position.set(-6, 5, -5);
    scene.add(rimLight);

    const redAccentLight = new THREE.PointLight(0xe10600, 3.0, 15);
    redAccentLight.position.set(0, 2, 2);
    scene.add(redAccentLight);

    // Coordinate Datum Grid Floor
    const gridHelper = new THREE.GridHelper(14, 28, 0xe10600, 0x1f1f26);
    gridHelper.position.y = -0.01;
    scene.add(gridHelper);

    // 3. Materials
    const carbonMat = new THREE.MeshStandardMaterial({
      color: 0x141416,
      roughness: 0.35,
      metalness: 0.85,
    });
    const redAccentMat = new THREE.MeshStandardMaterial({
      color: 0xe10600,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0x440000,
    });
    const mechanicalMetalMat = new THREE.MeshStandardMaterial({
      color: 0x777780,
      roughness: 0.25,
      metalness: 0.95,
    });
    const tireMat = new THREE.MeshStandardMaterial({
      color: 0x0a0a0c,
      roughness: 0.85,
      metalness: 0.1,
    });
    const haloTitaniumMat = new THREE.MeshStandardMaterial({
      color: 0x2a2a30,
      roughness: 0.3,
      metalness: 0.9,
    });
    const energyGlowMat = new THREE.LineBasicMaterial({
      color: 0xe10600,
      linewidth: 2,
    });

    // 4. Construct Procedural F1 Chassis
    const rootCar = new THREE.Group();
    rootCarGroupRef.current = rootCar;
    scene.add(rootCar);

    // Exploded Body Group (for Chassis Mode separation)
    const explodedBody = new THREE.Group();
    explodedBodyGroupRef.current = explodedBody;
    rootCar.add(explodedBody);

    // --- Monocoque Fuselage Body ---
    const bodyGeom = new THREE.BoxGeometry(2.4, 0.45, 0.65);
    const bodyMesh = new THREE.Mesh(bodyGeom, carbonMat);
    bodyMesh.position.set(0.2, 0.35, 0);
    explodedBody.add(bodyMesh);

    // Nosecone & Front Bulkhead
    const noseGeom = new THREE.ConeGeometry(0.3, 1.4, 4);
    const noseMesh = new THREE.Mesh(noseGeom, carbonMat);
    noseMesh.rotation.z = Math.PI / 2;
    noseMesh.rotation.y = Math.PI / 4;
    noseMesh.position.set(1.9, 0.25, 0);
    explodedBody.add(noseMesh);

    // Front Wing Mainplane & Endplates
    const frontWingGeom = new THREE.BoxGeometry(0.5, 0.04, 2.2);
    const frontWingMesh = new THREE.Mesh(frontWingGeom, carbonMat);
    frontWingMesh.position.set(2.4, 0.15, 0);
    explodedBody.add(frontWingMesh);

    const fwEndplateLeft = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.03), redAccentMat);
    fwEndplateLeft.position.set(2.4, 0.22, 1.1);
    explodedBody.add(fwEndplateLeft);

    const fwEndplateRight = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.25, 0.03), redAccentMat);
    fwEndplateRight.position.set(2.4, 0.22, -1.1);
    explodedBody.add(fwEndplateRight);

    // Sculpted Sidepods (Left & Right)
    const sidepodGeom = new THREE.BoxGeometry(1.6, 0.38, 0.45);
    const sidepodLeft = new THREE.Mesh(sidepodGeom, carbonMat);
    sidepodLeft.position.set(0.1, 0.32, 0.65);
    explodedBody.add(sidepodLeft);

    const sidepodRight = new THREE.Mesh(sidepodGeom, carbonMat);
    sidepodRight.position.set(0.1, 0.32, -0.65);
    explodedBody.add(sidepodRight);

    // Halo Safety Structure
    const haloGeom = new THREE.TorusGeometry(0.35, 0.04, 8, 24, Math.PI);
    const haloMesh = new THREE.Mesh(haloGeom, haloTitaniumMat);
    haloMesh.rotation.x = Math.PI / 2;
    haloMesh.position.set(0.45, 0.72, 0);
    explodedBody.add(haloMesh);

    const haloPillar = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.3), haloTitaniumMat);
    haloPillar.position.set(0.8, 0.58, 0);
    explodedBody.add(haloPillar);

    // Engine Cover Shark Fin
    const sharkFinGeom = new THREE.BufferGeometry();
    const finVerts = new Float32Array([
      -0.2, 0.55, 0,
      -1.4, 0.85, 0,
      -1.4, 0.45, 0,
    ]);
    sharkFinGeom.setAttribute("position", new THREE.BufferAttribute(finVerts, 3));
    sharkFinGeom.computeVertexNormals();
    const sharkFinMesh = new THREE.Mesh(sharkFinGeom, redAccentMat);
    explodedBody.add(sharkFinMesh);

    // Rear Wing Assembly
    const rearWingGeom = new THREE.BoxGeometry(0.4, 0.05, 1.6);
    const rearWingMesh = new THREE.Mesh(rearWingGeom, carbonMat);
    rearWingMesh.position.set(-1.8, 0.95, 0);
    explodedBody.add(rearWingMesh);

    const rwDrsFlap = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.03, 1.55), redAccentMat);
    rwDrsFlap.position.set(-1.75, 1.02, 0);
    explodedBody.add(rwDrsFlap);

    const rwEndplateL = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.03), redAccentMat);
    rwEndplateL.position.set(-1.8, 0.8, 0.8);
    explodedBody.add(rwEndplateL);

    const rwEndplateR = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.6, 0.03), redAccentMat);
    rwEndplateR.position.set(-1.8, 0.8, -0.8);
    explodedBody.add(rwEndplateR);

    // Ground Effect Floor Diffuser
    const floorGeom = new THREE.BoxGeometry(3.2, 0.04, 1.6);
    const floorMesh = new THREE.Mesh(floorGeom, carbonMat);
    floorMesh.position.set(0.1, 0.1, 0);
    rootCar.add(floorMesh);

    // --- 4 Apex Wheels & Suspension Wishbones ---
    const wheelPositions: [number, number, number][] = [
      [1.4, 0.35, 0.95],   // Front Left
      [1.4, 0.35, -0.95],  // Front Right
      [-1.3, 0.38, 1.0],   // Rear Left
      [-1.3, 0.38, -1.0],  // Rear Right
    ];

    const wheelMeshes: THREE.Group[] = [];

    wheelPositions.forEach(([wx, wy, wz]) => {
      const wheelGroup = new THREE.Group();
      wheelGroup.position.set(wx, wy, wz);

      const tireGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.35, 24);
      const tire = new THREE.Mesh(tireGeom, tireMat);
      tire.rotation.x = Math.PI / 2;
      wheelGroup.add(tire);

      const rimGeom = new THREE.CylinderGeometry(0.22, 0.22, 0.36, 16);
      const rim = new THREE.Mesh(rimGeom, mechanicalMetalMat);
      rim.rotation.x = Math.PI / 2;
      wheelGroup.add(rim);

      const caliperGeom = new THREE.BoxGeometry(0.12, 0.16, 0.08);
      const caliper = new THREE.Mesh(caliperGeom, redAccentMat);
      caliper.position.set(0, 0.14, wz > 0 ? -0.1 : 0.1);
      wheelGroup.add(caliper);

      rootCar.add(wheelGroup);
      wheelMeshes.push(wheelGroup);

      // Suspension Wishbones
      const armGeom = new THREE.CylinderGeometry(0.015, 0.015, 0.65);
      const upperArm = new THREE.Mesh(armGeom, carbonMat);
      upperArm.position.set(wx, wy + 0.08, wz * 0.6);
      upperArm.rotation.x = wz > 0 ? 0.2 : -0.2;
      upperArm.rotation.z = Math.PI / 2;
      rootCar.add(upperArm);
    });

    // 5. Dynamic Subsystem Visual Layers

    // --- AERO: Streamline Flow Ribbons & Particles ---
    const aeroVisualGroup = new THREE.Group();
    aeroVisualGroupRef.current = aeroVisualGroup;
    rootCar.add(aeroVisualGroup);

    const streamPoints1 = [
      new THREE.Vector3(2.8, 0.25, 0),
      new THREE.Vector3(1.8, 0.45, 0.1),
      new THREE.Vector3(0.5, 0.85, 0),
      new THREE.Vector3(-1.0, 0.75, 0),
      new THREE.Vector3(-2.2, 1.15, 0),
    ];
    const streamCurve1 = new THREE.CatmullRomCurve3(streamPoints1);
    const streamGeom1 = new THREE.TubeGeometry(streamCurve1, 32, 0.012, 8, false);
    const streamMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75 });
    const streamMesh1 = new THREE.Mesh(streamGeom1, streamMat);
    aeroVisualGroup.add(streamMesh1);

    const streamPoints2 = [
      new THREE.Vector3(2.6, 0.2, 0.8),
      new THREE.Vector3(1.0, 0.25, 0.7),
      new THREE.Vector3(-0.2, 0.25, 0.8),
      new THREE.Vector3(-1.8, 0.4, 0.9),
    ];
    const streamCurve2 = new THREE.CatmullRomCurve3(streamPoints2);
    const streamMesh2 = new THREE.Mesh(new THREE.TubeGeometry(streamCurve2, 24, 0.01, 8, false), streamMat);
    aeroVisualGroup.add(streamMesh2);

    const streamPoints3 = [
      new THREE.Vector3(2.6, 0.2, -0.8),
      new THREE.Vector3(1.0, 0.25, -0.7),
      new THREE.Vector3(-0.2, 0.25, -0.8),
      new THREE.Vector3(-1.8, 0.4, -0.9),
    ];
    const streamCurve3 = new THREE.CatmullRomCurve3(streamPoints3);
    const streamMesh3 = new THREE.Mesh(new THREE.TubeGeometry(streamCurve3, 24, 0.01, 8, false), streamMat);
    aeroVisualGroup.add(streamMesh3);

    // --- POWERTRAIN: Kinetic Energy Flow Pathway ---
    const powertrainVisualGroup = new THREE.Group();
    powertrainVisualGroupRef.current = powertrainVisualGroup;
    rootCar.add(powertrainVisualGroup);

    const puEngineBlock = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.35, 0.4), redAccentMat);
    puEngineBlock.position.set(-0.65, 0.35, 0);
    powertrainVisualGroup.add(puEngineBlock);

    const pwrPoints = [
      new THREE.Vector3(-0.65, 0.35, 0),
      new THREE.Vector3(-0.1, 0.25, 0),
      new THREE.Vector3(-1.0, 0.3, 0),
      new THREE.Vector3(-1.3, 0.38, 0.9),
    ];
    const pwrCurve = new THREE.CatmullRomCurve3(pwrPoints);
    const pwrTube = new THREE.Mesh(new THREE.TubeGeometry(pwrCurve, 24, 0.02, 8, false), energyGlowMat);
    powertrainVisualGroup.add(pwrTube);

    // --- CONTROL: Steering Arcs & Braking Pressure Vector ---
    const controlVisualGroup = new THREE.Group();
    controlVisualGroupRef.current = controlVisualGroup;
    rootCar.add(controlVisualGroup);

    const steeringArcGeom = new THREE.TorusGeometry(0.3, 0.015, 8, 24, Math.PI / 2);
    const steeringArc = new THREE.Mesh(steeringArcGeom, energyGlowMat);
    steeringArc.position.set(1.4, 0.55, 0.95);
    steeringArc.rotation.x = Math.PI / 2;
    controlVisualGroup.add(steeringArc);

    // 6. User Drag / Rotation Listeners
    const handleMouseDown = (e: MouseEvent) => {
      isDragging.current = true;
      prevMousePos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMousePos.current.x;
      const dy = e.clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.clientX, y: e.clientY };

      userRotation.current.y += dx * 0.006;
      userRotation.current.x = Math.max(-0.4, Math.min(0.6, userRotation.current.x + dy * 0.005));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      userZoom.current = Math.max(0.75, Math.min(1.45, userZoom.current + e.deltaY * 0.0008));
    };

    // Touch Support for Mobile
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      const dx = e.touches[0].clientX - prevMousePos.current.x;
      const dy = e.touches[0].clientY - prevMousePos.current.y;
      prevMousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      userRotation.current.y += dx * 0.008;
      userRotation.current.x = Math.max(-0.4, Math.min(0.6, userRotation.current.x + dy * 0.007));
    };

    const handleTouchEnd = () => {
      isDragging.current = false;
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    // 7. Master Render & Hotspot Projection Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      const elapsed = clock.getElapsedTime();
      const sys = activeSystemRef.current;

      // Update camera target based on selected system
      const sysDef = MACHINE_SYSTEMS[sys];
      const targetPos = new THREE.Vector3(...sysDef.cameraPosition).multiplyScalar(userZoom.current);
      const targetLook = new THREE.Vector3(...sysDef.cameraTarget);

      // Smooth camera interpolation
      camera.position.lerp(targetPos, 0.05);
      currentCamLook.current.lerp(targetLook, 0.05);
      camera.lookAt(currentCamLook.current);

      // Apply subtle manual user orbit
      rootCar.rotation.y = userRotation.current.y + Math.sin(elapsed * 0.2) * 0.04;
      rootCar.rotation.x = userRotation.current.x;

      // Dynamic System Visualization States
      aeroVisualGroup.visible = sys === "aero";
      powertrainVisualGroup.visible = sys === "powertrain";
      controlVisualGroup.visible = sys === "control";

      // Chassis Exploded View Vertical Separation
      const targetExplodeY = sys === "chassis" ? 0.45 : 0.0;
      explodedBody.position.y += (targetExplodeY - explodedBody.position.y) * 0.08;

      // Pulse energy pathway in powertrain mode
      if (sys === "powertrain") {
        const pulse = 0.5 + Math.sin(elapsed * 5) * 0.5;
        pwrTube.scale.setScalar(1.0 + pulse * 0.15);
      }

      // Continuous 3D Hotspot Screen Projection
      const projectedHotspots: ProjectedHotspot[] = HOTSPOTS.map((h) => {
        const wp = new THREE.Vector3(...h.position3D);
        if (sys === "chassis" && ["front-wing", "rear-wing", "sidepod", "monocoque"].includes(h.id)) {
          wp.y += explodedBody.position.y;
        }
        wp.applyMatrix4(rootCar.matrixWorld);

        // Check if point is in front of camera
        const isBehind = wp.clone().sub(camera.position).dot(camera.getWorldDirection(new THREE.Vector3())) <= 0;

        wp.project(camera);

        const screenX = ((wp.x + 1) * container.clientWidth) / 2;
        const screenY = ((-wp.y + 1) * container.clientHeight) / 2;

        return {
          ...h,
          screenX,
          screenY,
          visible: !isBehind && Math.abs(wp.x) <= 1.1 && Math.abs(wp.y) <= 1.1,
        };
      });

      onUpdateHotspotsRef.current(projectedHotspots);

      renderer.render(scene, camera);
    };

    render();

    // 8. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      canvas.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("resize", handleResize);

      // Deep WebGL disposal
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  // Handle reset view trigger
  useEffect(() => {
    if (resetViewTrigger > 0) {
      userRotation.current = { x: 0, y: 0 };
      userZoom.current = 1.0;
    }
  }, [resetViewTrigger]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-grab active:cursor-grabbing select-none overflow-hidden"
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
