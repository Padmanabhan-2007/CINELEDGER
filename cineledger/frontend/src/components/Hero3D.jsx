import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Hero3D() {
  const mountRef = useRef(null);
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
        return;
      }
    } catch (e) {
      setHasWebGL(false);
      return;
    }

    // Three.js Scene Setup
    const width = currentMount.clientWidth || 600;
    const height = currentMount.clientHeight || 500;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 7.5);

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      currentMount.appendChild(renderer.domElement);
    } catch (err) {
      setHasWebGL(false);
      return;
    }

    // Cinematic Lights
    const ambientLight = new THREE.AmbientLight(0xF7F5F0, 0.8);
    scene.add(ambientLight);

    const brassSpotLight = new THREE.PointLight(0xB88750, 4, 15);
    brassSpotLight.position.set(3, 4, 3);
    scene.add(brassSpotLight);

    const forestRimLight = new THREE.PointLight(0x294A3C, 3, 15);
    forestRimLight.position.set(-4, -2, 2);
    scene.add(forestRimLight);

    const frontLight = new THREE.DirectionalLight(0xFFFEFB, 1.2);
    frontLight.position.set(0, 2, 5);
    scene.add(frontLight);

    // Group for entire dimensional centerpiece
    const centralGroup = new THREE.Group();
    scene.add(centralGroup);

    // 1. Curved Sculptural Film Strip Ring
    const curve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.8, -1.2, -1.0),
      new THREE.Vector3(-1.8, 1.4, 0.4),
      new THREE.Vector3(0.0, 1.8, 1.2),
      new THREE.Vector3(1.8, 0.8, 0.2),
      new THREE.Vector3(2.6, -1.0, -0.8),
      new THREE.Vector3(1.0, -1.8, -0.4),
      new THREE.Vector3(-0.8, -1.6, 0.6),
      new THREE.Vector3(-2.4, -0.2, 0.8)
    ], true);

    const tubeGeo = new THREE.TubeGeometry(curve, 120, 0.14, 16, false);
    const filmMaterial = new THREE.MeshStandardMaterial({
      color: 0x1E221B,
      metalness: 0.85,
      roughness: 0.25,
    });
    const filmStripMesh = new THREE.Mesh(tubeGeo, filmMaterial);
    centralGroup.add(filmStripMesh);

    // 2. Converging Financial Report Panels
    // POS Ledger Panel (Left)
    const posGeo = new THREE.BoxGeometry(1.6, 2.2, 0.04);
    const posMat = new THREE.MeshStandardMaterial({
      color: 0x242A20,
      metalness: 0.5,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92,
    });
    const posPanel = new THREE.Mesh(posGeo, posMat);
    posPanel.position.set(-1.6, 0.4, 0.5);
    posPanel.rotation.set(0.15, 0.45, -0.1);
    centralGroup.add(posPanel);

    // Distributor Statement Panel (Right)
    const distGeo = new THREE.BoxGeometry(1.6, 2.2, 0.04);
    const distMat = new THREE.MeshStandardMaterial({
      color: 0x1A2821,
      metalness: 0.6,
      roughness: 0.3,
      transparent: true,
      opacity: 0.92,
    });
    const distPanel = new THREE.Mesh(distGeo, distMat);
    distPanel.position.set(1.6, -0.2, 0.2);
    distPanel.rotation.set(-0.1, -0.4, 0.08);
    centralGroup.add(distPanel);

    // Center Reconciled Settlement Node (Golden Crystal Prism)
    const octaGeo = new THREE.OctahedronGeometry(0.7, 0);
    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xB88750,
      metalness: 0.95,
      roughness: 0.15,
      wireframe: false,
    });
    const settlementCore = new THREE.Mesh(octaGeo, goldMat);
    settlementCore.position.set(0, 0.1, 0.8);
    centralGroup.add(settlementCore);

    // Wireframe Outer Gyro Ring
    const torusGeo = new THREE.TorusGeometry(1.2, 0.02, 16, 100);
    const torusMat = new THREE.MeshBasicMaterial({
      color: 0xD4A76A,
      transparent: true,
      opacity: 0.5,
    });
    const gyroRing = new THREE.Mesh(torusGeo, torusMat);
    gyroRing.position.set(0, 0.1, 0.8);
    centralGroup.add(gyroRing);

    // Floating Data Particles
    const particlesCount = 90;
    const posArray = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 6;
      posArray[i + 1] = (Math.random() - 0.5) * 5;
      posArray[i + 2] = (Math.random() - 0.5) * 4;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
      size: 0.04,
      color: 0xB88750,
      transparent: true,
      opacity: 0.7,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    centralGroup.add(particles);

    // Pointer Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event) => {
      const rect = currentMount.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / rect.width) * 2 - 1;
      mouseY = -(y / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth pointer following
      targetX += (mouseX * 0.4 - targetX) * 0.05;
      targetY += (mouseY * 0.3 - targetY) * 0.05;

      centralGroup.rotation.y = elapsedTime * 0.18 + targetX;
      centralGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.1 + targetY;

      // Pulse and spin center core
      settlementCore.rotation.y = elapsedTime * 0.7;
      settlementCore.rotation.x = elapsedTime * 0.5;

      gyroRing.rotation.x = elapsedTime * 0.8;
      gyroRing.rotation.y = elapsedTime * 0.6;

      // Slight floating of panels
      posPanel.position.y = 0.4 + Math.sin(elapsedTime * 1.5) * 0.08;
      distPanel.position.y = -0.2 + Math.cos(elapsedTime * 1.5) * 0.08;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[520px] flex items-center justify-center overflow-hidden">
      {hasWebGL ? (
        <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />
      ) : (
        /* Graceful Non-WebGL Fallback */
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-[#181B15] to-[#11130F] rounded-2xl border border-[#2E332A]">
          <div className="w-32 h-32 rounded-full border-2 border-[#B88750] flex items-center justify-center shadow-lg shadow-[#B88750]/20 mb-6 animate-pulse">
            <span className="text-4xl text-[#D4A76A]">🎬</span>
          </div>
          <h3 className="text-xl font-serif text-[#F7F5F0] mb-2">CineLedger Convergence Architecture</h3>
          <p className="text-sm text-[#8E948A] text-center max-w-md">
            Theatre POS transactions, distributor statements, and ticketing batches converge into a unified, contract-verified settlement ledger.
          </p>
        </div>
      )}
    </div>
  );
}
