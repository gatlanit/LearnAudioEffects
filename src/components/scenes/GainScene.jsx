import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import * as Tone from 'tone';

// constants
const C = {
  ROT_SPEED     : 0.5,
  MIN_SCALE     : 0.25,
  MAX_SCALE     : 1,
  DEFAULT_SCALE : 0.66,
  DRAG_SENS     : 0.005,
  SMOOTH        : 0.12,   // scale lerp
  ACCEL         : 6,      // spin easing factor
  COLOR         : {
    idle        : '#8a8a8a', // Dark Gray
    idleHover   : '#94123b', // Maroon
    active      : '#ffffff', // White
    activeHover : '#ec195b', // Hot Pink
  },
};

const AUDIO_URL = import.meta.env.BASE_URL + 'assets/Demo.wav';

// Sphere
function SpinningSphere () {
  // refs
  const mesh   = useRef();
  const drag   = useRef(null);        // pointer drag state
  const speed  = useRef(0);           // current spin speed

  const gain   = useRef();            // Tone.Gain
  const player = useRef();            // Tone.Player

  /* state ----------------------------------------------------------- */
  const [scaleTarget, setScaleTarget] = useState(C.DEFAULT_SCALE);
  const [hovered,     setHovered]     = useState(false);

  /* audio ----------------------------------------------------------- */
  useEffect(() => {
    gain.current   = new Tone.Gain(C.DEFAULT_SCALE).toDestination();
    player.current = new Tone.Player({ url: AUDIO_URL, loop: true }).connect(gain.current);

    return () => {
      player.current?.dispose();
      gain.current?.dispose();
    };
  }, []);

  const startPlayback = async () => {
    if (player.current?.state !== 'started') {
      await Tone.start();   // must occur in user gesture
      player.current.start();
    }
  };

  /* pointer events -------------------------------------------------- */
  const onDown = useCallback(async (e) => {
    e.stopPropagation();
    drag.current = { id: e.pointerId, y: e.clientY, base: scaleTarget };
    e.target.setPointerCapture?.(e.pointerId);
    await startPlayback();
  }, [scaleTarget]);

  const onMove = useCallback((e) => {
    if (!drag.current || drag.current.id !== e.pointerId) return;

    const dy   = drag.current.y - e.clientY; // drag‑up ⇒ +ve
    const next = THREE.MathUtils.clamp(
      drag.current.base + dy * C.DRAG_SENS,
      C.MIN_SCALE,
      C.MAX_SCALE,
    );
    setScaleTarget(next);

    const vol = (next - C.MIN_SCALE) / (C.MAX_SCALE - C.MIN_SCALE);
    gain.current?.gain.setValueAtTime(vol, Tone.now());
  }, []);

  const onUp = useCallback((e) => {
    if (drag.current?.id !== e.pointerId) return;
    drag.current = null;
    e.target.releasePointerCapture?.(e.pointerId);
  }, []);

  /* animation loop -------------------------------------------------- */
  useFrame((_, dt) => {
    if (!mesh.current) return;

    // spin -------------------------------------------------------
    const desired = player.current?.state === 'started' ? C.ROT_SPEED : 0;
    speed.current += (desired - speed.current) * C.ACCEL * dt;
    mesh.current.rotation.x += speed.current * dt;
    mesh.current.rotation.y += speed.current * 2 * dt;

    // colour -----------------------------------------------------
    const active = gain.current?.gain.value > 0;
    const key    = active ? (hovered ? 'activeHover' : 'active') : (hovered ? 'idleHover' : 'idle');
    mesh.current.material.color.lerp(new THREE.Color(C.COLOR[key]), 0.15);

    // scale ------------------------------------------------------
    const eased = THREE.MathUtils.lerp(mesh.current.scale.x, scaleTarget, C.SMOOTH);
    mesh.current.scale.setScalar(eased);
  });

  /* mesh ----------------------------------------------------------- */
  return (
    <mesh
      ref={mesh}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerOver={(e) => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={(e)  => { e.stopPropagation(); setHovered(false); }}
    >
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial flatShading color="black" />
      {/* outline */}
      <mesh scale={1.001}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial wireframe color="black" />
      </mesh>
    </mesh>
  );
}

// ── scene wrapper ────────────────────────────────────────────────────
export default function GainScene () {
  return (
    <div style={{ width: '100%', height: '400px', margin: '2rem 0' }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={1.5} />
        <hemisphereLight skyColor={0xffffff} groundColor={0xff0062} />
        <SpinningSphere />
      </Canvas>
    </div>
  );
}
