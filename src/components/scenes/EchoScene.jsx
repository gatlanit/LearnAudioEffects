import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const C = {
  ROT_SPEED: 0.5,
  MIN_SCALE: 0.25,
  MAX_SCALE: 1,
  DEFAULT_SCALE: 0.66,
  DRAG_SENS: 0.005,
  SMOOTH: 0.12,
  ACCEL: 6,
  BPM: 156,
  COLOR: {
    idle: '#8a8a8a',
    idleHover: '#94123b',
    active: '#ffffff',
    activeHover: '#ec195b',
  },
};

const AUDIO_URL = import.meta.env.BASE_URL + 'assets/Echo.wav';

function setupAudio(ctx) {
  const dryGain = ctx.createGain();
  const wetGain = ctx.createGain();
  const wetBoost = ctx.createGain();
  const delayL = ctx.createDelay(5);
  const delayR = ctx.createDelay(5);
  const feedbackL = ctx.createGain();
  const feedbackR = ctx.createGain();
  const panL = ctx.createStereoPanner();
  const panR = ctx.createStereoPanner();
  const bpL = ctx.createBiquadFilter();
  const bpR = ctx.createBiquadFilter();
  const output = ctx.createGain();

  [bpL, bpR].forEach(bp => {
    bp.type = 'bandpass';
    bp.frequency.value = 1760;
    bp.Q.value = 4.75;
  });

  panL.pan.value = -1;
  panR.pan.value = 1;
  delayL.connect(feedbackL).connect(delayR);
  delayR.connect(feedbackR).connect(delayL);

  delayL.delayTime.value = delayR.delayTime.value = 0.5;
  wetBoost.gain.value = 1.5;

  delayL.connect(bpL).connect(panL).connect(wetGain);
  delayR.connect(bpR).connect(panR).connect(wetGain);
  wetGain.connect(wetBoost).connect(output);
  dryGain.connect(output);
  output.connect(ctx.destination);

  return { dryGain, wetGain, wetBoost, delayL, delayR, feedbackL, feedbackR, output };
}

export function SpinningSphere({ mix, feedback, delayTime }) {
  const mesh = useRef();
  const drag = useRef(null);
  const speed = useRef(0);
  const ctx = useRef(null);
  const source = useRef(null);
  const gain = useRef(null);
  const nodes = useRef({});
  const [scaleTarget, setScaleTarget] = useState(C.DEFAULT_SCALE);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    ctx.current = new AudioContext();
    const audio = setupAudio(ctx.current);
    gain.current = audio.output;
    nodes.current = audio;

    fetch(AUDIO_URL)
      .then(res => res.arrayBuffer())
      .then(buf => ctx.current.decodeAudioData(buf))
      .then(decoded => {
        const src = ctx.current.createBufferSource();
        src.buffer = decoded;
        src.loop = true;
        src.connect(audio.dryGain);
        src.connect(audio.delayL);
        src.start();
        source.current = src;
      });

    return () => ctx.current?.close();
  }, []);

  useEffect(() => {
    const {
      dryGain, wetGain, delayL, delayR, feedbackL, feedbackR
    } = nodes.current;
    if (!ctx.current) return;

    const now = ctx.current.currentTime;
    const ramp = 0.05;
    const fb = THREE.MathUtils.clamp(feedback, 0, 0.98);
    const dt = THREE.MathUtils.lerp(0.05, 1.5, delayTime);

    [feedbackL.gain, feedbackR.gain].forEach(g => g.setTargetAtTime(fb, now, ramp));
    [delayL.delayTime, delayR.delayTime].forEach(d => d.setTargetAtTime(dt, now, ramp));
    dryGain.gain.setTargetAtTime(1 - mix, now, ramp);
    wetGain.gain.setTargetAtTime(mix, now, ramp);
  }, [mix, feedback, delayTime]);

  const onDown = useCallback(e => {
    e.stopPropagation();
    drag.current = { id: e.pointerId, y: e.clientY, base: scaleTarget };
    e.target.setPointerCapture?.(e.pointerId);
    ctx.current?.state === 'suspended' && ctx.current.resume();
  }, [scaleTarget]);

  const onMove = useCallback(e => {
    if (!drag.current || drag.current.id !== e.pointerId) return;
    const dy = drag.current.y - e.clientY;
    const next = THREE.MathUtils.clamp(
      drag.current.base + dy * C.DRAG_SENS,
      C.MIN_SCALE,
      C.MAX_SCALE
    );
    setScaleTarget(next);
    gain.current.gain.value = (next - C.MIN_SCALE) / (C.MAX_SCALE - C.MIN_SCALE);
  }, []);

  const onUp = useCallback(e => {
    if (drag.current?.id === e.pointerId) {
      drag.current = null;
      e.target.releasePointerCapture?.(e.pointerId);
    }
  }, []);

  useFrame((_, dt) => {
    if (!mesh.current) return;
    speed.current += (C.ROT_SPEED - speed.current) * C.ACCEL * dt;
    mesh.current.rotation.x += speed.current * dt;
    mesh.current.rotation.y += speed.current * 2 * dt;

    const active = gain.current?.gain.value > 0;
    const key = active
      ? hovered ? 'activeHover' : 'active'
      : hovered ? 'idleHover' : 'idle';
    mesh.current.material.color.lerp(new THREE.Color(C.COLOR[key]), 0.15);

    const eased = THREE.MathUtils.lerp(mesh.current.scale.x, scaleTarget, C.SMOOTH);
    mesh.current.scale.setScalar(eased);
  });

  return (
    <mesh
      ref={mesh}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
      onPointerOver={e => { e.stopPropagation(); setHovered(true); }}
      onPointerOut={e => { e.stopPropagation(); setHovered(false); }}
    >
      <icosahedronGeometry args={[1, 2]} />
      <meshStandardMaterial flatShading color="black" />
      <mesh scale={1.001}>
        <icosahedronGeometry args={[1, 2]} />
        <meshBasicMaterial wireframe color="black" />
      </mesh>
    </mesh>
  );
}

export default function EchoScene({ mix, feedback, delayTime }) {
  return (
    <div style={{ width: '100%', height: '500px', margin: '2rem 0' }}>
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <hemisphereLight skyColor={0xffffff} groundColor={0xff0062} />
        <SpinningSphere mix={mix} feedback={feedback} delayTime={delayTime} />
      </Canvas>
    </div>
  );
}

/*
TODO:
  - Visualize Delay
      - Using Paramaters from Dom inputs, use as visualizer paramaters
          - Flash lights on the left and right side of the sphere for each "delay" in each channel (Left and Right) and have them by synced to the delay such that they flash at {delayTime} intervals, gets more opaque as mix reaches 1 (0 makes flashes fully transparent).
          - As mix increases, transparenecy of the main icosphere increases such that at mix: 1, the icosphere is fully transparent and at mix: 0, the icosphere is fully opaque

  - Should be a way to display values below with their units (feedback and dry/wet as a percentage, delayTime as a bpm or ms)
    - Should be a global and persistant "BPM" setting that can be applied across all pages
      - DelayTime should be represented in terms of BPM 1/4, 1/3, 1/8, etc.
*/