import React from 'react';

export default function PosterLighting() {
  return (
    <>
      {/* Soft warm ivory ambient illumination */}
      <ambientLight intensity={1.35} color="#FFF9F0" />

      {/* Primary directional warm key light */}
      <directionalLight
        position={[5, 7, 8]}
        intensity={1.55}
        color="#FFF5E6"
      />

      {/* Champagne rim highlight */}
      <pointLight
        position={[-6, 3, 4]}
        intensity={18}
        distance={24}
        color="#D6A876"
      />

      {/* Subtle sage balance fill from lower right */}
      <pointLight
        position={[6, -4, 3]}
        intensity={10}
        distance={22}
        color="#869B86"
      />
    </>
  );
}

