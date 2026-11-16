import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import PosterCard from './PosterCard';

export default function PosterRow({
  posters = [],
  y = 0,
  z = 0,
  speed = 0.55,
  direction = 1,
  cardWidth = 1.5,
  cardHeight = 2.25,
  gap = 0.36,
  rowRotation = [0, 0, -0.09],
  cardRotation = [0, 0.12, 0],
  parallaxFactor = 0.4,
  pointerRef,
  scrollProgress = 0,
  reducedMotion = false,
  onSelectPoster,
}) {
  const rowGroupRef = useRef();
  const itemRefs = useRef([]);

  const stride = cardWidth + gap;

  // Repeat items enough times to span cleanly across wide viewports
  const repeatedPosters = useMemo(() => {
    const minCount = 12;
    const out = [];
    while (out.length < minCount && posters.length > 0) {
      out.push(...posters);
    }
    return out.slice(0, Math.max(minCount, posters.length));
  }, [posters]);

  const totalSpan = repeatedPosters.length * stride;
  const halfSpan = totalSpan / 2;

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);

    // Move each poster along local X axis & wrap seamlessly at boundaries
    if (!reducedMotion) {
      for (let i = 0; i < repeatedPosters.length; i++) {
        const el = itemRefs.current[i];
        if (!el) continue;
        el.position.x += direction * speed * dt;
        if (direction > 0 && el.position.x > halfSpan) {
          el.position.x -= totalSpan;
        } else if (direction < 0 && el.position.x < -halfSpan) {
          el.position.x += totalSpan;
        }
      }
    }

    // Apply pointer parallax & scroll-based depth drift on the row container
    if (rowGroupRef.current && pointerRef?.current) {
      const targetX = pointerRef.current.x * parallaxFactor;
      const scrollShiftY = scrollProgress * parallaxFactor * 1.4;
      const scrollShiftZ = scrollProgress * parallaxFactor * 0.9;
      const targetY = y + pointerRef.current.y * (parallaxFactor * 0.45) + scrollShiftY;
      const targetZ = z - scrollShiftZ;

      const lerpStep = Math.min(dt * 4.5, 1);
      rowGroupRef.current.position.x = THREE.MathUtils.lerp(rowGroupRef.current.position.x, targetX, lerpStep);
      rowGroupRef.current.position.y = THREE.MathUtils.lerp(rowGroupRef.current.position.y, targetY, lerpStep);
      rowGroupRef.current.position.z = THREE.MathUtils.lerp(rowGroupRef.current.position.z, targetZ, lerpStep);
    }
  });

  return (
    <group ref={rowGroupRef} position={[0, y, z]} rotation={rowRotation}>
      {repeatedPosters.map((poster, index) => {
        const initialX = index * stride - halfSpan + stride * 0.5;
        return (
          <group
            key={`${poster.id}-${index}`}
            ref={(el) => {
              itemRefs.current[index] = el;
            }}
            position={[initialX, 0, (index % 3 - 1) * 0.14]}
          >
            <PosterCard
              poster={poster}
              width={cardWidth}
              height={cardHeight}
              baseRotation={cardRotation}
              phase={index * 0.7}
              reducedMotion={reducedMotion}
              onSelect={onSelectPoster}
            />
          </group>
        );
      })}
    </group>
  );
}

