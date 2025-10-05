import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null!);

  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Bright ocean
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Brighter continents
    ctx.fillStyle = '#22c55e';
    ctx.fillRect(100, 100, 200, 150);
    ctx.fillRect(150, 80, 100, 40);
    ctx.fillRect(200, 250, 80, 200);
    ctx.fillRect(450, 80, 120, 100);
    ctx.fillRect(480, 180, 100, 200);
    ctx.fillRect(600, 60, 300, 180);
    ctx.fillRect(750, 320, 100, 60);

    // Variation
    ctx.fillStyle = '#16a34a';
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 512;
      const size = Math.random() * 30 + 5;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  useEffect(() => () => earthTexture.dispose(), [earthTexture]);

  return (
    <Sphere ref={meshRef} args={[2.2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        map={earthTexture}
        roughness={0.4}
        metalness={0.3}
        emissive="#1e3a8a"
        emissiveIntensity={0.3}
        toneMapped={true}
      />
    </Sphere>
  );
}

function AtmosphereGlow() {
  const meshRef = useRef<THREE.Mesh>(null!);
  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.002;
  });

  return (
    <Sphere ref={meshRef} args={[2.35, 32, 32]}>
      <meshBasicMaterial
        color="#3b82f6"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </Sphere>
  );
}

function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null!);
  const [positions, geometry] = useMemo(() => {
    const positions = new Float32Array(2000 * 3);
    for (let i = 0; i < 2000; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return [positions, geometry];
  }, []);

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial
        color="#60a5fa"
        size={0.015}
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
}

function GlobeScene() {
  return (
    <>
      {/* Stronger ambient and directional lights */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[5, 3, 5]}
        intensity={2}
        color="#ffffff"
      />
      <pointLight position={[-5, -5, -5]} intensity={0.8} color="#60a5fa" />
      <Stars radius={100} depth={50} count={8000} factor={6} fade speed={0.5} />
      <FloatingParticles />
      <AtmosphereGlow />
      <EarthGlobe />
      <OrbitControls
        enableZoom
        enablePan={false}
        enableRotate
        autoRotate
        autoRotateSpeed={1}
        minDistance={4}
        maxDistance={10}
        enableDamping
        dampingFactor={0.05}
      />
    </>
  );
}

export default function Globe() {
  return (
    <div className="w-full h-full relative">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 60 }}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          outputEncoding: THREE.sRGBEncoding,
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}
