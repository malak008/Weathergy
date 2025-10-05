import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function EarthGlobe() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Create earth texture with more visible continents
  const earthTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Ocean base
    ctx.fillStyle = '#1e40af';
    ctx.fillRect(0, 0, 1024, 512);
    
    // Add continents with more visible green
    ctx.fillStyle = '#10b981';
    
    // North America
    ctx.fillRect(100, 100, 200, 150);
    ctx.fillRect(150, 80, 100, 40);
    
    // South America  
    ctx.fillRect(200, 250, 80, 200);
    
    // Europe/Africa
    ctx.fillRect(450, 80, 120, 100);
    ctx.fillRect(480, 180, 100, 200);
    
    // Asia
    ctx.fillRect(600, 60, 300, 180);
    
    // Australia
    ctx.fillRect(750, 320, 100, 60);
    
    // Add some texture variation
    ctx.fillStyle = '#059669';
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

  useEffect(() => {
    return () => {
      if (earthTexture) {
        earthTexture.dispose();
      }
    };
  }, [earthTexture]);

  return (
    <Sphere ref={meshRef} args={[2.2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial 
        map={earthTexture}
        transparent
        opacity={0.95}
        emissive="#002244"
        emissiveIntensity={0.1}
        roughness={0.8}
        metalness={0.1}
      />
    </Sphere>
  );
}

function AtmosphereGlow() {
  const meshRef = useRef<THREE.Mesh>(null!);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
    }
  });

  return (
    <Sphere ref={meshRef} args={[2.4, 32, 32]} position={[0, 0, 0]}>
      <meshBasicMaterial 
        color="#10b981"
        transparent
        opacity={0.1}
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

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y += 0.0005;
      particlesRef.current.rotation.x += 0.0002;
    }
  });

  useEffect(() => {
    return () => {
      if (geometry) {
        geometry.dispose();
      }
    };
  }, [geometry]);

  return (
    <points ref={particlesRef} geometry={geometry}>
      <pointsMaterial 
        color="#10b981" 
        size={0.015} 
        transparent 
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

function GlobeScene() {
  return (
    <>
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#ffffff" />
      <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10b981" />
      <pointLight position={[0, 0, 10]} intensity={0.5} color="#3b82f6" />
      
      <Stars 
        radius={100} 
        depth={50} 
        count={8000} 
        factor={6} 
        saturation={0} 
        fade 
        speed={0.5}
      />
      <FloatingParticles />
      <AtmosphereGlow />
      <EarthGlobe />
      
      <OrbitControls 
        enableZoom={true}
        enablePan={false}
        enableRotate={true}
        autoRotate={true}
        autoRotateSpeed={1}
        minDistance={4}
        maxDistance={10}
        enableDamping={true}
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
          preserveDrawingBuffer: false
        }}
        style={{ background: 'transparent' }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
        }}
      >
        <GlobeScene />
      </Canvas>
    </div>
  );
}