import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import PosterRow from './PosterRow';
import { POSTER_COLLECTION } from '../../data/posterManifest';

const DESKTOP_ROWS = [
  // Background layer (smaller posters, deeper Z, gentle parallax)
  { y: 4.5, z: -3.8, speed: 0.28, direction: 1, width: 1.15, height: 1.72, gap: 0.34, rotZ: -0.11, cardRot: [0.04, 0.14, 0], parallax: 0.22, slice: [0, 7] },
  { y: -4.4, z: -3.5, speed: 0.32, direction: -1, width: 1.18, height: 1.77, gap: 0.34, rotZ: -0.09, cardRot: [-0.04, -0.12, 0], parallax: 0.25, slice: [7, 14] },
  // Middle ground layer (diagonal gallery rows, varied speeds & directions)
  { y: 2.35, z: -1.4, speed: 0.48, direction: -1, width: 1.46, height: 2.19, gap: 0.36, rotZ: -0.1, cardRot: [0.02, -0.16, 0], parallax: 0.52, slice: [10, 20] },
  { y: 0.05, z: -0.9, speed: 0.42, direction: 1, width: 1.52, height: 2.28, gap: 0.38, rotZ: -0.08, cardRot: [0, 0.14, 0], parallax: 0.58, slice: [3, 13] },
  { y: -2.25, z: -1.3, speed: 0.52, direction: -1, width: 1.44, height: 2.16, gap: 0.36, rotZ: -0.11, cardRot: [-0.02, -0.15, 0], parallax: 0.5, slice: [14, 20] },
  // Foreground layer (larger bold posters, closer Z, strongest parallax & perspective)
  { y: 1.25, z: 1.15, speed: 0.66, direction: 1, width: 1.78, height: 2.67, gap: 0.55, rotZ: -0.09, cardRot: [0.03, 0.18, 0], parallax: 0.95, slice: [0, 10] },
  { y: -1.45, z: 1.0, speed: 0.62, direction: -1, width: 1.72, height: 2.58, gap: 0.52, rotZ: -0.1, cardRot: [-0.03, -0.18, 0], parallax: 0.9, slice: [5, 16] },
];

export default function PosterWall({
  viewportTier = 'desktop',
  scrollProgress = 0,
  reducedMotion = false,
  onSelectPoster,
}) {
  const wallGroupRef = useRef();
  const pointerSmooth = useRef({ x: 0, y: 0 });
  const { camera } = useThree();

  const activeRows = useMemo(() => {
    if (viewportTier === 'mobile') {
      return [DESKTOP_ROWS[2], DESKTOP_ROWS[3], DESKTOP_ROWS[5]];
    }
    if (viewportTier === 'tablet') {
      return [DESKTOP_ROWS[0], DESKTOP_ROWS[2], DESKTOP_ROWS[4], DESKTOP_ROWS[5], DESKTOP_ROWS[6]];
    }
    return DESKTOP_ROWS;
  }, [viewportTier]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const lerpSpeed = Math.min(dt * 4, 1);

    // Smooth pointer state from normalized R3F pointer [-1, 1]
    pointerSmooth.current.x = THREE.MathUtils.lerp(pointerSmooth.current.x, state.pointer.x, lerpSpeed);
    pointerSmooth.current.y = THREE.MathUtils.lerp(pointerSmooth.current.y, state.pointer.y, lerpSpeed);

    // Subtle global scene perspective & camera drift on cursor + scroll
    if (wallGroupRef.current) {
      const targetRotY = -0.18 + pointerSmooth.current.x * 0.075 + scrollProgress * 0.14;
      const targetRotX = 0.06 - pointerSmooth.current.y * 0.055 + scrollProgress * 0.08;
      wallGroupRef.current.rotation.y = THREE.MathUtils.lerp(wallGroupRef.current.rotation.y, targetRotY, lerpSpeed);
      wallGroupRef.current.rotation.x = THREE.MathUtils.lerp(wallGroupRef.current.rotation.x, targetRotX, lerpSpeed);
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, pointerSmooth.current.x * 0.45, lerpSpeed);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, pointerSmooth.current.y * 0.3 - scrollProgress * 0.65, lerpSpeed);
    camera.lookAt(0, 0, -0.5);
  });

  return (
    <group ref={wallGroupRef} position={[1.4, 0, -0.4]}>
      {activeRows.map((row, idx) => {
        const subset = POSTER_COLLECTION.slice(row.slice[0], row.slice[1]);
        const rowPosters = subset.length >= 6 ? subset : POSTER_COLLECTION;
        return (
          <PosterRow
            key={idx}
            posters={rowPosters}
            y={row.y}
            z={row.z}
            speed={row.speed}
            direction={row.direction}
            cardWidth={row.width}
            cardHeight={row.height}
            gap={row.gap}
            rowRotation={[0, 0, row.rotZ]}
            cardRotation={row.cardRot}
            parallaxFactor={row.parallax}
            pointerRef={pointerSmooth}
            scrollProgress={scrollProgress}
            reducedMotion={reducedMotion}
            onSelectPoster={onSelectPoster}
          />
        );
      })}
    </group>
  );
}

