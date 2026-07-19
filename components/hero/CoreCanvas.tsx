"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";
import { useMemo, useRef } from "react";

/* ---------------------------------------------------------------------------
   THE INFRASTRUCTURE CORE

   A machined gimbal assembly, not a celestial body. A faceted kernel sits
   inside a wireframe cage, braced by six radial struts, encircled by three
   independently inclined ring tracks. Service nodes ride the tracks; data
   packets run through them faster than the tracks themselves turn.

   The engineering read comes from precision rather than ornament — paired
   rails on every ring, a braced hub, exact repetition. Everything is built
   from first principles here: no imported models, no `wireframe` flag.
   --------------------------------------------------------------------------- */

/** Deterministic PRNG so the assembly is identical on every visit. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const CORE_R = 0.54;
const CAGE_R = 0.82;

/** Ring tracks. Periods sit in the 44–60s band — one revolution is slow
    enough that you register it as drift, never as spin. */
const RINGS = [
  { radius: 1.62, tilt: [1.34, 0.22, 0.0], period: 46, nodes: 7 },
  { radius: 2.16, tilt: [0.36, 1.08, 0.42], period: 54, nodes: 9 },
  { radius: 2.74, tilt: [1.88, 0.58, 0.94], period: 60, nodes: 6 },
] as const;

const TOTAL_NODES = RINGS.reduce((n, r) => n + r.nodes, 0);
const MOTES_PER_RING = 5;
const TOTAL_MOTES = RINGS.length * MOTES_PER_RING;

/** A ring track: two concentric rails in the XY plane, merged into a single
    buffer so the whole track costs one draw call. */
function trackGeometry(radius: number, segments: number, gauge: number) {
  const v: number[] = [];
  for (const r of [radius, radius - gauge]) {
    for (let i = 0; i < segments; i++) {
      const a0 = (i / segments) * Math.PI * 2;
      const a1 = ((i + 1) / segments) * Math.PI * 2;
      v.push(Math.cos(a0) * r, Math.sin(a0) * r, 0);
      v.push(Math.cos(a1) * r, Math.sin(a1) * r, 0);
    }
  }
  return new Float32Array(v);
}

/** Six struts bracing the cage outward toward the inner track. */
function strutGeometry() {
  const v: number[] = [];
  const dirs = [
    [1, 0, 0],
    [-1, 0, 0],
    [0, 1, 0],
    [0, -1, 0],
    [0, 0, 1],
    [0, 0, -1],
  ];
  for (const d of dirs) {
    v.push(d[0] * CAGE_R, d[1] * CAGE_R, d[2] * CAGE_R);
    v.push(d[0] * 1.36, d[1] * 1.36, d[2] * 1.36);
  }
  return new Float32Array(v);
}

/** Edge list of an icosahedron, de-duplicated — the cage around the kernel. */
function cageGeometry(radius: number) {
  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const pos = geo.attributes.position;
  const seen = new Set<string>();
  const v: number[] = [];
  const key = (a: number, b: number) => {
    const ka = `${pos.getX(a).toFixed(4)},${pos.getY(a).toFixed(4)},${pos.getZ(a).toFixed(4)}`;
    const kb = `${pos.getX(b).toFixed(4)},${pos.getY(b).toFixed(4)},${pos.getZ(b).toFixed(4)}`;
    return ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
  };
  for (let f = 0; f < pos.count; f += 3) {
    for (const [a, b] of [
      [f, f + 1],
      [f + 1, f + 2],
      [f + 2, f],
    ]) {
      const k = key(a, b);
      if (seen.has(k)) continue;
      seen.add(k);
      v.push(pos.getX(a), pos.getY(a), pos.getZ(a));
      v.push(pos.getX(b), pos.getY(b), pos.getZ(b));
    }
  }
  geo.dispose();
  return new Float32Array(v);
}

function Core({ reduced }: { reduced: boolean }) {
  const shell = useRef<THREE.Group>(null);
  const hub = useRef<THREE.Group>(null);
  const trackRefs = useRef<(THREE.Group | null)[]>([]);
  const nodesRef = useRef<THREE.InstancedMesh>(null);
  const motesRef = useRef<THREE.Points>(null);

  const geo = useMemo(() => {
    const rand = mulberry32(23);

    // Node placement: fixed angle on a given track, spaced but not uniform,
    // so the assembly reads as provisioned rather than decorative.
    const nodes: { ring: number; angle: number; phase: number }[] = [];
    RINGS.forEach((ring, ri) => {
      for (let i = 0; i < ring.nodes; i++) {
        const base = (i / ring.nodes) * Math.PI * 2;
        nodes.push({
          ring: ri,
          angle: base + (rand() - 0.5) * 0.22,
          phase: rand() * Math.PI * 2,
        });
      }
    });

    const motes: { ring: number; angle: number; speed: number }[] = [];
    RINGS.forEach((ring, ri) => {
      for (let i = 0; i < MOTES_PER_RING; i++) {
        motes.push({
          ring: ri,
          angle: rand() * Math.PI * 2,
          // Packets outrun their track — that contrast is what reads as traffic.
          speed: 0.12 + rand() * 0.1,
        });
      }
    });

    // Sparse depth field. Held very faint; it exists to give the assembly air.
    const FIELD = 90;
    const field = new Float32Array(FIELD * 3);
    for (let i = 0; i < FIELD; i++) {
      const r = 3.4 + rand() * 2.6;
      const phi = Math.acos(2 * rand() - 1);
      const theta = rand() * Math.PI * 2;
      field.set(
        [
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.cos(phi) * 0.66,
          r * Math.sin(phi) * Math.sin(theta),
        ],
        i * 3
      );
    }

    return {
      tracks: RINGS.map((r) => trackGeometry(r.radius, 128, 0.055)),
      struts: strutGeometry(),
      cage: cageGeometry(CAGE_R),
      nodes,
      motes,
      field,
      motePositions: new Float32Array(TOTAL_MOTES * 3),
      // Precomputed tilt quaternions — node and packet positions are derived
      // analytically from these rather than read back off the scene graph.
      tiltQ: RINGS.map((r) =>
        new THREE.Quaternion().setFromEuler(
          new THREE.Euler(r.tilt[0], r.tilt[1], r.tilt[2])
        )
      ),
    };
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const vec = useMemo(() => new THREE.Vector3(), []);
  const spin = useRef<number[]>(RINGS.map(() => 0));

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    const d = Math.min(delta, 0.05); // clamp after a tab regains focus

    if (!reduced) {
      for (let i = 0; i < RINGS.length; i++) {
        spin.current[i] += (d * Math.PI * 2) / RINGS[i].period;
      }
      // Tracks turn in place; the hub counter-rotates on a longer period.
      trackRefs.current.forEach((g, i) => {
        if (g) g.rotation.z = spin.current[i];
      });
      if (hub.current) {
        hub.current.rotation.y += (d * Math.PI * 2) / 52;
        hub.current.rotation.x += (d * Math.PI * 2) / 88;
      }
    }

    // Service nodes — one instanced draw call for the whole assembly.
    if (nodesRef.current) {
      geo.nodes.forEach((n, i) => {
        const a = n.angle + spin.current[n.ring];
        const r = RINGS[n.ring].radius - 0.0275; // seat between the rails
        vec.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(geo.tiltQ[n.ring]);
        dummy.position.copy(vec);
        // Soft pulse — a slow breath, never a blink.
        const pulse = reduced ? 1 : 1 + Math.sin(t * 0.55 + n.phase) * 0.16;
        dummy.scale.setScalar(pulse);
        dummy.rotation.set(a * 0.5, a, 0);
        dummy.updateMatrix();
        nodesRef.current!.setMatrixAt(i, dummy.matrix);
      });
      nodesRef.current.instanceMatrix.needsUpdate = true;
    }

    // Data packets travelling the tracks.
    if (motesRef.current && !reduced) {
      const arr = geo.motePositions;
      geo.motes.forEach((m, i) => {
        const a = m.angle + t * m.speed + spin.current[m.ring];
        const r = RINGS[m.ring].radius - 0.0275;
        vec.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyQuaternion(geo.tiltQ[m.ring]);
        arr.set([vec.x, vec.y, vec.z], i * 3);
      });
      (motesRef.current.geometry.attributes.position as THREE.BufferAttribute).needsUpdate =
        true;
    }

    if (!shell.current) return;

    if (reduced) return;

    // Very slow float, and a pointer parallax measured in fractions of a degree.
    shell.current.position.y = Math.sin(t * 0.24) * 0.09;
    const { x, y } = state.pointer;
    shell.current.rotation.y += (x * 0.1 - shell.current.rotation.y) * 0.022;
    shell.current.rotation.x += (-y * 0.07 - shell.current.rotation.x) * 0.022;
  });

  return (
    <group ref={shell}>
      {/* ── Hub: faceted kernel inside its cage, braced outward ───────── */}
      <group ref={hub}>
        <mesh>
          <icosahedronGeometry args={[CORE_R, 0]} />
          <meshStandardMaterial
            color="#5A4229"
            metalness={0.95}
            roughness={0.34}
            flatShading
          />
        </mesh>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[geo.cage, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#B87333"
            transparent
            opacity={0.26}
            depthWrite={false}
          />
        </lineSegments>

        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[geo.struts, 3]} />
          </bufferGeometry>
          <lineBasicMaterial
            color="#B87333"
            transparent
            opacity={0.2}
            depthWrite={false}
          />
        </lineSegments>
      </group>

      {/* ── Ring tracks: one draw call each, both rails included ───────── */}
      {RINGS.map((ring, i) => (
        <group key={i} rotation={ring.tilt as unknown as THREE.Euler}>
          <group ref={(el) => void (trackRefs.current[i] = el)}>
            <lineSegments>
              <bufferGeometry>
                <bufferAttribute
                  attach="attributes-position"
                  args={[geo.tracks[i], 3]}
                />
              </bufferGeometry>
              <lineBasicMaterial
                color="#B87333"
                transparent
                opacity={0.17}
                depthWrite={false}
              />
            </lineSegments>
          </group>
        </group>
      ))}

      {/* ── Service nodes ─────────────────────────────────────────────── */}
      <instancedMesh
        ref={nodesRef}
        args={[undefined, undefined, TOTAL_NODES]}
        frustumCulled={false}
      >
        <octahedronGeometry args={[0.058, 0]} />
        <meshStandardMaterial
          color="#C89257"
          metalness={0.9}
          roughness={0.28}
          flatShading
        />
      </instancedMesh>

      {/* ── Data packets ──────────────────────────────────────────────── */}
      <points ref={motesRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[geo.motePositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.036}
          color="#E4C89E"
          transparent
          opacity={0.75}
          sizeAttenuation
          depthWrite={false}
        />
      </points>

      {/* ── Depth field ───────────────────────────────────────────────── */}
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[geo.field, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.019}
          color="#F8FAFC"
          transparent
          opacity={0.16}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
}

/** Eases the whole assembly in, and holds it right-of-centre on wide screens. */
function Rig({ reduced }: { reduced: boolean }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;

    // Power-on: scale and settle over the first few seconds.
    const form = 1 - Math.pow(1 - Math.min(t / 3.2, 1), 3);
    const { width } = state.viewport;
    const wide = width > 9;
    const targetX = wide ? width * 0.26 : 0;
    const targetScale = (wide ? 1.0 : 0.72) * (0.82 + form * 0.18);

    const k = Math.min(delta * 3, 1);
    group.current.position.x += (targetX - group.current.position.x) * k;
    const s = group.current.scale.x + (targetScale - group.current.scale.x) * k;
    group.current.scale.setScalar(s);
  });

  return (
    <group ref={group} scale={0.82}>
      <Core reduced={reduced} />
    </group>
  );
}

export default function CoreCanvas({ reduced = false }: { reduced?: boolean }) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 8.6], fov: 46 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, powerPreference: "high-performance", alpha: true }}
      className="!absolute inset-0"
      aria-hidden
    >
      <AdaptiveDpr pixelated />

      {/* Soft three-point rig: cool fill, warm key, cool rim. No bloom, no
          emissive — the bronze reads through lighting alone. */}
      <ambientLight intensity={0.42} color="#8FA3BC" />
      <directionalLight position={[3.5, 4, 5]} intensity={1.15} color="#FFE6C6" />
      <directionalLight position={[-4.5, -1.2, -3]} intensity={0.4} color="#7FA4CC" />

      <Rig reduced={reduced} />
      <fog attach="fog" args={["#080A0D", 7.5, 17]} />
    </Canvas>
  );
}
