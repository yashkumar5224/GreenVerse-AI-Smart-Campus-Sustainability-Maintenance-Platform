import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeEarth: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Dimensions
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 12;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Group to hold all objects (to rotate together)
    const earthGroup = new THREE.Group();
    scene.add(earthGroup);

    // 1. Central Core Globe
    const globeGeom = new THREE.SphereGeometry(3, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0x06b6d4, // Cyan Accent
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globe = new THREE.Mesh(globeGeom, globeMat);
    earthGroup.add(globe);

    // 2. Outer AI / Grid Shield
    const gridGeom = new THREE.SphereGeometry(3.3, 16, 16);
    const gridMat = new THREE.MeshBasicMaterial({
      color: 0x10b981, // Emerald Green
      wireframe: true,
      transparent: true,
      opacity: 0.15,
    });
    const grid = new THREE.Mesh(gridGeom, gridMat);
    earthGroup.add(grid);

    // 3. Floating IoT Orbit Nodes
    const satelliteGroup = new THREE.Group();
    earthGroup.add(satelliteGroup);

    const satellites: THREE.Mesh[] = [];
    const satCount = 6;
    const satColors = [0x10b981, 0x06b6d4, 0xf59e0b];

    for (let i = 0; i < satCount; i++) {
      const satGeom = new THREE.SphereGeometry(0.12, 8, 8);
      const satMat = new THREE.MeshBasicMaterial({
        color: satColors[i % satColors.length],
        transparent: true,
        opacity: 0.85
      });
      const sat = new THREE.Mesh(satGeom, satMat);
      
      // Position sat at random points on an orbit radius of 4
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 4.0;

      sat.position.x = r * Math.sin(phi) * Math.cos(theta);
      sat.position.y = r * Math.sin(phi) * Math.sin(theta);
      sat.position.z = r * Math.cos(phi);
      
      satelliteGroup.add(sat);
      satellites.push(sat);
    }

    // 4. Orbit rings
    const ringGeom = new THREE.RingGeometry(3.98, 4.02, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.05
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2;
    earthGroup.add(ring);

    // Lights (Basic Ambient for materials helper, though using BasicMaterial which does not need light)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    // Animation Loop
    let animationFrameId: number;
    const startTime = performance.now();
    const satOriginalY = satellites.map(s => s.position.y);

    const animate = () => {
      const elapsedTime = (performance.now() - startTime) / 1000;

      // Slow group rotation
      earthGroup.rotation.y = elapsedTime * 0.12;
      earthGroup.rotation.x = elapsedTime * 0.06;

      // Pulse orbits
      grid.rotation.y = -elapsedTime * 0.05;
      
      // Orbiting micro-wobbles for nodes
      satellites.forEach((sat, index) => {
        sat.position.y = satOriginalY[index] + Math.sin(elapsedTime + index) * 0.15;
      });

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight || 450;
      
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      
      // Dispose materials/geometries
      globeGeom.dispose();
      globeMat.dispose();
      gridGeom.dispose();
      gridMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      satellites.forEach(sat => {
        sat.geometry.dispose();
        if (Array.isArray(sat.material)) {
          sat.material.forEach(m => m.dispose());
        } else {
          sat.material.dispose();
        }
      });
    };
  }, []);

  return (
    <div className="relative w-full h-[350px] md:h-[450px] flex items-center justify-center overflow-hidden">
      {/* 3D Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />
      
      {/* Inner overlays for tech aesthetics */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 pointer-events-none">
        <div className="flex justify-between items-start">
          <div className="glass-panel px-3 py-1 text-[11px] font-mono tracking-widest text-accent-green uppercase border border-accent-green/20 rounded-md">
            SYS.ACTIVE
          </div>
          <div className="glass-panel px-3 py-1 text-[11px] font-mono tracking-widest text-accent-blue uppercase border border-accent-blue/20 rounded-md">
            GRID.LIVE
          </div>
        </div>
        
        <div className="text-center md:text-left">
          <div className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white mb-1">
            250kW Solar Farm
          </div>
          <p className="text-xs text-slate-400 font-mono">
            Location: Block C | Coordinates: 26.1982° N, 87.4948° E
          </p>
        </div>
      </div>
    </div>
  );
};
export default ThreeEarth;
