import React, { Suspense, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  Environment,
  Lightformer,
  PerformanceMonitor,
  Preload,
} from '@react-three/drei';
import {
  EffectComposer,
  Bloom,
  N8AO,
  Vignette,
  ToneMapping,
  ChromaticAberration,
} from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import AuditoriumRoom from './AuditoriumRoom';
import AuditoriumSeats from './AuditoriumSeats';
import ExactSeatCameraController from './ExactSeatCameraController';

/**
 * Camera Interior Boundary Clamper
 * Guarantees the camera NEVER penetrates the theatre walls, ceiling, or floor,
 * and prevents zooming out into the black void.
 */
function CameraBoundaryClamp({ activeMode }) {
  const { camera } = useThree();

  useFrame(() => {
    // Only clamp when not in seat perspective (which is already locked to a seat)
    if (activeMode !== 'SEAT_PERSPECTIVE') {
      camera.position.x = THREE.MathUtils.clamp(camera.position.x, -9.8, 9.8);
      camera.position.y = THREE.MathUtils.clamp(camera.position.y, 0.8, 10.5);
      camera.position.z = THREE.MathUtils.clamp(camera.position.z, -6.8, 20.6);
    }
  });

  return null;
}

export default function AuditoriumScene({
  seats = [],
  selectedSeats = [],
  hoveredSeat = null,
  activeCameraSeat = null,
  cameraMode = 'OVERVIEW',
  lightingMode = 'SCREENING',
  onSelectSeat,
  onHoverSeat,
  onTourProgress,
  moviePosterUrl = null,
  screenFormat = 'IMAX 4K Dual Laser',
}) {
  const orbitControlsRef = useRef();
  const [quality, setQuality] = useState('high');
  const high = quality === 'high';
  const caOffset = useMemo(() => new THREE.Vector2(0.0003, 0.0005), []);
  const isScreening = lightingMode === 'SCREENING';

  return (
    <div className="w-full h-full relative select-none bg-[#0D0A08]">
      <Canvas
        flat
        shadows
        dpr={high ? [1, 1.75] : [1, 1.25]}
        gl={{ antialias: false, stencil: false, powerPreference: 'high-performance' }}
      >
        <PerformanceMonitor
          flipflops={3}
          onDecline={() => setQuality('low')}
          onIncline={() => setQuality('high')}
        />

        <PerspectiveCamera makeDefault position={[0, 10.5, 20.0]} fov={56} near={0.1} far={120} />
        <color attach="background" args={['#080605']} />
        <fog attach="fog" args={['#080605', 20, 56]} />

        {/* Ambient Cinema Lighting */}
        <Environment resolution={256} frames={1}>
          <Lightformer
            form="rect"
            intensity={isScreening ? 2.0 : 1.2}
            color="#FFE5C4"
            position={[0, 4.2, -8.5]}
            scale={[20, 10, 1]}
          />
          <Lightformer
            form="rect"
            intensity={isScreening ? 0.3 : 0.8}
            color="#FFF4E6"
            position={[0, 11.2, 8]}
            rotation-x={Math.PI / 2}
            scale={[18, 26, 1]}
          />
          <Lightformer
            form="rect"
            intensity={isScreening ? 0.45 : 0.85}
            color="#D4AF37"
            position={[-11, 5, 8]}
            rotation-y={Math.PI / 2}
            scale={[22, 6, 1]}
          />
          <Lightformer
            form="rect"
            intensity={isScreening ? 0.45 : 0.85}
            color="#D4AF37"
            position={[11, 5, 8]}
            rotation-y={-Math.PI / 2}
            scale={[22, 6, 1]}
          />
        </Environment>

        <ambientLight intensity={isScreening ? 0.18 : 0.38} color="#F4EDE1" />
        <directionalLight
          position={[0, 14, 8]}
          intensity={isScreening ? 0.45 : 0.85}
          color="#FFF2E0"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0005}
          shadow-camera-left={-16}
          shadow-camera-right={16}
          shadow-camera-top={16}
          shadow-camera-bottom={-16}
          shadow-camera-near={1}
          shadow-camera-far={48}
        />

        <Suspense fallback={null}>
          <AuditoriumRoom
            moviePosterUrl={moviePosterUrl}
            screenFormat={screenFormat}
            lightingMode={lightingMode}
            quality={quality}
          />
          <AuditoriumSeats
            seats={seats}
            selectedSeats={selectedSeats}
            hoveredSeat={hoveredSeat}
            onSelectSeat={onSelectSeat}
            onHoverSeat={onHoverSeat}
          />
          <ExactSeatCameraController
            cameraMode={cameraMode}
            activeSeat={activeCameraSeat}
            orbitControlsRef={orbitControlsRef}
            onTourProgress={onTourProgress}
          />
          <CameraBoundaryClamp activeMode={cameraMode} />
          <Preload all />
        </Suspense>

        {/* OrbitControls strictly constrained within the theatre box */}
        <OrbitControls
          ref={orbitControlsRef}
          enableDamping
          dampingFactor={0.06}
          enablePan={false}
          maxPolarAngle={Math.PI / 2 - 0.08}
          minPolarAngle={Math.PI * 0.15}
          minDistance={2.5}
          maxDistance={17.5}
          target={[0, 3.8, 4.5]}
        />

        <EffectComposer key={quality} multisampling={0} disableNormalPass>
          {high ? <N8AO aoRadius={1.2} distanceFalloff={0.8} intensity={2.2} quality="medium" color="black" /> : <></>}
          <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.3} intensity={high ? 1.15 : 0.7} radius={0.78} />
          {high ? <ChromaticAberration offset={caOffset} radialModulation modulationOffset={0.4} /> : <></>}
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
          <Vignette eskil={false} offset={0.24} darkness={0.82} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
