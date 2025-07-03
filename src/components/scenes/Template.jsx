import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function SpinningSphere() {
  const meshRef = useRef();
  const wireRef = useRef();
  const speed = 0.25;

  useFrame((_, delta) => {
    if (meshRef.current && wireRef.current) {
      meshRef.current.rotation.x += delta * speed;
      meshRef.current.rotation.y += delta * speed * 2;
      wireRef.current.rotation.x = meshRef.current.rotation.x;
      wireRef.current.rotation.y = meshRef.current.rotation.y;
    }
  });

  return (
    <>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color={0xffffff} flatShading />
      </mesh>

      {/* Slightly larger black wireframe overlay */}
      <mesh ref={wireRef} scale={1.001}>
        <icosahedronGeometry args={[1.2, 2]} />
        <meshBasicMaterial color={0x000000} wireframe />
      </mesh>
    </>
  );
}

export default function Template() {
  return (
    <div style={{ width: '100%', height: '500px', margin: '2rem 0'}}>
      <Canvas camera={{ position: [0, 0, 2], fov: 75 }}>
        <ambientLight intensity={1.5} />
        <hemisphereLight skyColor={0xffffff} groundColor={0xff0062} />
        <SpinningSphere />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
}