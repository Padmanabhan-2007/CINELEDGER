import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const SHARED_CARD_GEO = new THREE.PlaneGeometry(1, 1);

export default function PosterCard({
  poster,
  width = 1.6,
  height = 2.4,
  baseRotation = [0, 0, 0],
  phase = 0,
  reducedMotion = false,
  onSelect,
}) {
  const cardGroupRef = useRef();
  const shadowMatRef = useRef();
  const [hovered, setHovered] = useState(false);

  const texture = useTexture(poster.path);

  useEffect(() => {
    if (texture) {
      texture.generateMipmaps = true;
      texture.minFilter = THREE.LinearMipmapLinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    }
  }, [texture]);

  useEffect(() => {
    return () => {
      if (hovered) {
        document.body.style.cursor = 'auto';
      }
    };
  }, [hovered]);

  const cardScale = useMemo(() => [width, height, 1], [width, height]);
  const shadowScale = useMemo(() => [width * 1.04, height * 1.04, 1], [width, height]);

  useFrame((state, delta) => {
    if (!cardGroupRef.current) return;
    const t = state.clock.elapsedTime;
    const floatY = reducedMotion ? 0 : Math.sin(t * 0.85 + phase) * 0.055;
    const floatRotY = reducedMotion ? 0 : Math.cos(t * 0.6 + phase) * 0.035;

    const targetZ = hovered ? 0.62 : 0;
    const targetScale = hovered ? 1.09 : 1.0;
    const targetRotX = baseRotation[0] + (hovered ? -0.06 : 0);
    const targetRotY = baseRotation[1] + (hovered ? 0.14 : floatRotY);
    const targetRotZ = baseRotation[2];

    const step = Math.min(delta * 8.5, 1);
    cardGroupRef.current.position.y = THREE.MathUtils.lerp(cardGroupRef.current.position.y, floatY, step);
    cardGroupRef.current.position.z = THREE.MathUtils.lerp(cardGroupRef.current.position.z, targetZ, step);

    const curS = cardGroupRef.current.scale.x;
    const nextS = THREE.MathUtils.lerp(curS, targetScale, step);
    cardGroupRef.current.scale.set(nextS, nextS, 1);

    cardGroupRef.current.rotation.x = THREE.MathUtils.lerp(cardGroupRef.current.rotation.x, targetRotX, step);
    cardGroupRef.current.rotation.y = THREE.MathUtils.lerp(cardGroupRef.current.rotation.y, targetRotY, step);
    cardGroupRef.current.rotation.z = THREE.MathUtils.lerp(cardGroupRef.current.rotation.z, targetRotZ, step);

    if (shadowMatRef.current) {
      shadowMatRef.current.opacity = THREE.MathUtils.lerp(
        shadowMatRef.current.opacity,
        hovered ? 0.34 : 0.18,
        step
      );
    }
  });

  return (
    <group ref={cardGroupRef}>
      {/* Soft warm contact shadow behind poster */}
      <mesh position={[0.06, -0.08, -0.05]} scale={shadowScale} geometry={SHARED_CARD_GEO}>
        <meshBasicMaterial
          ref={shadowMatRef}
          color="#29211D"
          transparent
          opacity={0.18}
          depthWrite={false}
        />
      </mesh>

      {/* Main Colourful Movie Poster Plane */}
      <mesh
        scale={cardScale}
        geometry={SHARED_CARD_GEO}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (onSelect) onSelect(poster);
        }}
      >
        <meshStandardMaterial
          map={texture}
          roughness={hovered ? 0.22 : 0.38}
          metalness={0.08}
          emissive={hovered ? '#C18C55' : '#000000'}
          emissiveIntensity={hovered ? 0.12 : 0}
        />
      </mesh>
    </group>
  );
}
