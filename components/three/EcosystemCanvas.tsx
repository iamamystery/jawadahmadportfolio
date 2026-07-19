"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/** Deterministic PRNG so the constellation is identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Network({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);
  const pointsMat = useRef<THREE.PointsMaterial>(null);
  const linesMat = useRef<THREE.LineBasicMaterial>(null);

  const { nodePositions, edgePositions } = useMemo(() => {
    const rand = mulberry32(7);
    const count = 120;
    const pts: THREE.Vector3[] = [];
    for (let i = 0; i < count; i++) {
      const radius = 7 * Math.cbrt(rand());
      const theta = rand() * Math.PI * 2;
      const y = (rand() - 0.5) * 3.4;
      pts.push(
        new THREE.Vector3(
          Math.cos(theta) * radius,
          y,
          Math.sin(theta) * radius * 0.7
        )
      );
    }
    // Connect every node to its two nearest neighbours — an organic mesh,
    // dense in the core, sparse at the edges.
    const segments: number[] = [];
    for (let i = 0; i < pts.length; i++) {
      const nearest = pts
        .map((q, j) => ({ j, d: i === j ? Infinity : pts[i].distanceToSquared(q) }))
        .sort((a, b) => a.d - b.d)
        .slice(0, 2);
      for (const { j } of nearest) {
        segments.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z);
      }
    }
    const nodePositions = new Float32Array(count * 3);
    pts.forEach((p, i) => nodePositions.set([p.x, p.y, p.z], i * 3));
    return { nodePositions, edgePositions: new Float32Array(segments) };
  }, []);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // Ecosystem forms: scale + opacity ease in over the first seconds.
    const form = Math.min(t / 2.4, 1);
    const eased = 1 - Math.pow(1 - form, 3);
    const scale = 0.55 + eased * 0.45;
    group.current.scale.setScalar(scale);
    if (pointsMat.current) pointsMat.current.opacity = 0.9 * eased;
    if (linesMat.current) linesMat.current.opacity = 0.14 * eased;

    if (reduced) return;

    group.current.rotation.y += delta * 0.035;

    // Subtle camera drift toward the pointer — the room breathes.
    const { x, y } = state.pointer;
    state.camera.position.x += (x * 1.1 - state.camera.position.x) * 0.02;
    state.camera.position.y += (y * 0.55 + 1.1 - state.camera.position.y) * 0.02;
    state.camera.lookAt(0, 0, 0);
  });

  return (
    <group ref={group}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={pointsMat}
          size={0.065}
          color="#D4A574"
          transparent
          opacity={0}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[edgePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial
          ref={linesMat}
          color="#D4A574"
          transparent
          opacity={0}
          depthWrite={false}
        />
      </lineSegments>

      {/* The core: everything in the ecosystem orbits this. */}
      <Float speed={reduced ? 0 : 1.2} rotationIntensity={0.4} floatIntensity={0.5}>
        <mesh>
          <icosahedronGeometry args={[0.85, 1]} />
          <meshBasicMaterial color="#FF6B35" wireframe transparent opacity={0.5} />
        </mesh>
        <mesh scale={0.45}>
          <icosahedronGeometry args={[0.85, 0]} />
          <meshBasicMaterial color="#D4A574" wireframe transparent opacity={0.85} />
        </mesh>
      </Float>
    </group>
  );
}

export default function EcosystemCanvas({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 1.1, 9.5], fov: 50 }}
      dpr={[1, 1.75]}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: true }}
      className="!absolute inset-0"
      aria-hidden
    >
      <AdaptiveDpr pixelated />
      <Network reduced={reduced} />
      <fog attach="fog" args={["#070B12", 9, 18]} />
    </Canvas>
  );
}
