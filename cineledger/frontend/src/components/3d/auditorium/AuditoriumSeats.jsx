import React, { useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { cinemaAudio } from '../../../utils/cinemaAudio';

// PVR Luxury Cinema Seat Palette
const TIER_COLOR = {
  RECLINER: new THREE.Color('#4E2416'), // PVR Gold Class / Director's Cut Mahogany Espresso
  PRIME: new THREE.Color('#C18C55'),    // PVR Club Champagne Cognac
  CLASSIC: new THREE.Color('#73675D'),  // PVR Classic Warm Graphite
};
const BOOKED = new THREE.Color('#241F1D');
const HELD = new THREE.Color('#D35400');
const HOVER = new THREE.Color('#F39C12');
const EMERALD = new THREE.Color('#10B981').multiplyScalar(1.6);
const RING = new THREE.Color('#10B981').multiplyScalar(2.4);
const WHITE = new THREE.Color('#ffffff');

const SCREEN_Z = -8.5;

function part(w, h, d, pos, radius, rotX = 0) {
  const g = new RoundedBoxGeometry(w, h, d, 3, radius);
  if (rotX) g.rotateX(rotX);
  g.translate(pos[0], pos[1], pos[2]);
  return g;
}

/**
 * PVR Luxury Cinema Seat Geometry
 * Contoured leather cushion with front thigh roll, ergonomic reclining backrest,
 * sculpted headrest cushion, and wide armrests with metallic cupholder accents.
 */
function buildSeatGeometries() {
  const body = mergeGeometries([
    // 1. Plush ergonomic cushion with front curved roll
    part(0.60, 0.18, 0.54, [0, 0.28, 0.02], 0.07),
    // 2. High backrest tilted back comfortably (-0.14 rad backward lean)
    part(0.58, 0.74, 0.16, [0, 0.74, 0.22], 0.06, 0.14),
    // 3. PVR Sculpted Headrest pillow
    part(0.44, 0.20, 0.15, [0, 1.15, 0.28], 0.05, 0.14),
  ]);

  const frame = mergeGeometries([
    // 4. Wide luxury armrests
    part(0.10, 0.22, 0.48, [-0.34, 0.40, 0.0], 0.03),
    part(0.10, 0.22, 0.48, [0.34, 0.40, 0.0], 0.03),
    // 5. Metallic cupholder accents
    part(0.06, 0.04, 0.06, [-0.34, 0.52, -0.16], 0.02),
    part(0.06, 0.04, 0.06, [0.34, 0.52, -0.16], 0.02),
    // 6. Solid heavy-duty theater pedestal base
    part(0.32, 0.22, 0.32, [0, 0.11, 0.10], 0.04),
  ]);

  return { body, frame };
}

const isClickable = (seat, selected) => {
  if (!seat) return false;
  return seat.status === 'AVAILABLE' || selected;
};

export default function AuditoriumSeats({
  seats = [],
  selectedSeats = [],
  selectedSeatIds = [],
  hoveredSeat = null,
  onSelectSeat,
  onHoverSeat,
}) {
  const bodyRef = useRef();
  const frameRef = useRef();
  const ringRef = useRef();
  const anim = useRef([]);
  const [internalHovered, setInternalHovered] = useState(null);
  const pointerDownPos = useRef({ x: 0, y: 0 });

  const { body, frame } = useMemo(buildSeatGeometries, []);
  const ringGeo = useMemo(() => new THREE.RingGeometry(0.35, 0.46, 48), []);

  const selectedIds = useMemo(() => {
    const ids =
      selectedSeatIds && selectedSeatIds.length > 0
        ? selectedSeatIds
        : (selectedSeats || []).map((s) => (typeof s === 'object' && s !== null ? s.id : s));
    return new Set(ids);
  }, [selectedSeats, selectedSeatIds]);

  const hoveredId = hoveredSeat ? hoveredSeat.id : internalHovered?.id ?? null;
  const hovered = hoveredSeat || internalHovered;

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tmp = useMemo(() => new THREE.Color(), []);

  useLayoutEffect(() => {
    anim.current = seats.map(() => ({ hover: 0, sel: 0 }));
    if (bodyRef.current && seats.length) {
      for (let i = 0; i < seats.length; i++) {
        bodyRef.current.setColorAt(i, WHITE);
      }
      bodyRef.current.instanceColor.needsUpdate = true;
      bodyRef.current.computeBoundingSphere();
    }
  }, [seats]);

  useFrame((state, delta) => {
    const bodyMesh = bodyRef.current;
    const frameMesh = frameRef.current;
    const ringMesh = ringRef.current;
    if (!bodyMesh || !frameMesh || !ringMesh || anim.current.length !== seats.length) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;

    for (let i = 0; i < seats.length; i++) {
      const s = seats[i];
      const a = anim.current[i];
      const selected = selectedIds.has(s.id);

      a.hover = THREE.MathUtils.damp(a.hover, s.id === hoveredId ? 1 : 0, 16, dt);
      a.sel = THREE.MathUtils.damp(a.sel, selected ? 1 : 0, 12, dt);

      // Toe-in: every seat subtly aims toward the center of the silver screen
      const yaw = Math.atan2(s.posX, s.posZ - SCREEN_Z);

      // Physical motorized electric recline glide & lean on selection
      const reclineTilt = a.sel * -0.07;
      const reclineSlide = a.sel * 0.04;
      dummy.position.set(s.posX, s.posY + a.hover * 0.035 + a.sel * 0.02, s.posZ + reclineSlide);
      dummy.rotation.set(reclineTilt, yaw, 0);
      dummy.scale.set(1 + a.sel * 0.02, 1 + a.sel * 0.02, 1 + a.sel * 0.04);
      dummy.updateMatrix();
      bodyMesh.setMatrixAt(i, dummy.matrix);
      frameMesh.setMatrixAt(i, dummy.matrix);

      // Selected emerald glow halo on the riser floor
      const ringScale = a.sel < 0.005 ? 0.0001 : a.sel * (1 + 0.06 * Math.sin(t * 3.8 + i));
      const ringYaw = yaw + (selected ? t * 0.4 : 0);
      dummy.position.set(s.posX, s.posY + 0.025, s.posZ);
      dummy.rotation.set(-Math.PI / 2, 0, ringYaw);
      dummy.scale.setScalar(ringScale);
      dummy.updateMatrix();
      ringMesh.setMatrixAt(i, dummy.matrix);

      // Realistic PVR leather color gradient
      if (s.status === 'BOOKED') {
        tmp.copy(BOOKED);
      } else if (s.status === 'HELD') {
        tmp.copy(HELD).multiplyScalar(0.85 + 0.15 * Math.sin(t * 2.5 + i));
      } else {
        tmp.copy(TIER_COLOR[s.tier] || TIER_COLOR.CLASSIC);
      }

      if (s.status === 'AVAILABLE') {
        tmp.lerp(HOVER, a.hover * 0.55);
      }
      tmp.lerp(EMERALD, a.sel);
      bodyMesh.setColorAt(i, tmp);
    }

    bodyMesh.instanceMatrix.needsUpdate = true;
    bodyMesh.instanceColor.needsUpdate = true;
    frameMesh.instanceMatrix.needsUpdate = true;
    ringMesh.instanceMatrix.needsUpdate = true;
  });

  const count = seats.length;

  const handlePointerDown = (e) => {
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleMove = (e) => {
    e.stopPropagation();
    const seat = seats[e.instanceId];
    if (!seat) return;
    const canClick = isClickable(seat, selectedIds.has(seat.id));
    document.body.style.cursor = canClick ? 'pointer' : 'not-allowed';
    if (seat.id !== hoveredId) {
      setInternalHovered(seat);
      onHoverSeat?.(seat);
    }
  };

  const handleOut = () => {
    document.body.style.cursor = 'auto';
    setInternalHovered(null);
    onHoverSeat?.(null);
  };

  const handleClick = (e) => {
    e.stopPropagation();
    // Verify distance from pointer down to up: ignore if dragging to orbit (>15px)
    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    if (Math.hypot(dx, dy) > 15) return;

    const seat = seats[e.instanceId];
    if (seat && isClickable(seat, selectedIds.has(seat.id))) {
      cinemaAudio.playReclinerMotor();
      cinemaAudio.playSeatSelectHaptic();
      onSelectSeat?.(seat);
    }
  };

  if (count === 0) return null;

  return (
    <group>
      <instancedMesh
        key={`body-${count}`}
        ref={bodyRef}
        args={[body, undefined, count]}
        castShadow
        receiveShadow
        frustumCulled={false}
        onPointerDown={handlePointerDown}
        onPointerMove={handleMove}
        onPointerOut={handleOut}
        onClick={handleClick}
      >
        <meshPhysicalMaterial
          color="#ffffff"
          roughness={0.34}
          metalness={0.06}
          sheen={1.0}
          sheenRoughness={0.38}
          sheenColor="#FFE2B8"
          clearcoat={0.35}
          clearcoatRoughness={0.28}
          reflectivity={0.6}
        />
      </instancedMesh>

      <instancedMesh
        key={`frame-${count}`}
        ref={frameRef}
        args={[frame, undefined, count]}
        castShadow
        receiveShadow
        frustumCulled={false}
        raycast={() => null}
      >
        <meshStandardMaterial color="#1B1715" roughness={0.38} metalness={0.88} />
      </instancedMesh>

      <instancedMesh
        key={`ring-${count}`}
        ref={ringRef}
        args={[ringGeo, undefined, count]}
        frustumCulled={false}
        raycast={() => null}
      >
        <meshBasicMaterial
          color={RING}
          toneMapped={false}
          transparent
          opacity={0.92}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </instancedMesh>

      {hovered && (
        <Html
          position={[hovered.posX, hovered.posY + 1.5, hovered.posZ]}
          center
          zIndexRange={[25, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div
            style={{
              padding: '8px 14px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, rgba(28, 20, 16, 0.94), rgba(15, 11, 9, 0.96))',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(229, 185, 130, 0.6)',
              color: '#F4EDE1',
              fontSize: 11,
              fontWeight: 500,
              lineHeight: 1.4,
              whiteSpace: 'nowrap',
              boxShadow: '0 12px 32px rgba(0,0,0,0.75), 0 0 16px rgba(193, 140, 85, 0.25)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: hovered.status === 'AVAILABLE' ? '#10B981' : '#E67E22',
                }}
              />
              <strong style={{ color: '#E5B982', fontSize: 13, letterSpacing: '0.02em' }}>
                Seat {hovered.seatCode}
              </strong>
              <span style={{ opacity: 0.4 }}>•</span>
              <span style={{ textTransform: 'uppercase', fontSize: 10, letterSpacing: '0.08em', color: '#D4AF37' }}>
                {hovered.tier}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 4 }}>
              <span style={{ color: '#34D399', fontWeight: 800, fontSize: 12 }}>₹{hovered.price}</span>
              <span style={{ color: '#817366', fontSize: 10 }}>
                {hovered.distanceMeters || '12'}m • {hovered.viewAngleDeg || '0'}° Sightline
              </span>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
