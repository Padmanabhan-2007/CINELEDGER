import React, { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { MeshReflectorMaterial, Sparkles, Text } from '@react-three/drei';
import { CinematicFilmEngine } from './CinematicFilmCanvas';

const SCREEN = { width: 20, height: 10.0, radius: 28, center: [0, 4.2, -8.5] };
const ROW_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P'];

const noRaycast = () => null;

/* ------------------------------------------------------------------ */
/* 1. Dynamic 60FPS Theatrical Curved Screen                         */
/* ------------------------------------------------------------------ */
function DynamicCurvedScreen({ filmEngine, screenFormat }) {
  const { width, height, radius, center } = SCREEN;
  const arc = width / radius;
  const textureRef = useRef();

  // Create canvas texture directly from the Film Engine's dynamic canvas
  const canvasTexture = useMemo(() => {
    const tex = new THREE.CanvasTexture(filmEngine.canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = false;
    textureRef.current = tex;
    return tex;
  }, [filmEngine]);

  const screenGeo = useMemo(
    () => new THREE.CylinderGeometry(radius, radius, height, 128, 1, true, Math.PI - arc / 2, arc),
    [radius, height, arc],
  );

  const bezelGeo = useMemo(
    () =>
      new THREE.CylinderGeometry(
        radius + 0.08,
        radius + 0.08,
        height + 0.6,
        128,
        1,
        true,
        Math.PI - (arc + 0.04) / 2,
        arc + 0.04,
      ),
    [radius, height, arc],
  );

  const meshZ = center[2] + radius;
  const lastUpdate = useRef(0);

  useFrame((state) => {
    // 24FPS authentic cinema frame rate throttle (cuts GPU texture uploads by 60%)
    const t = state.clock.elapsedTime;
    if (t - lastUpdate.current >= 0.0416) {
      lastUpdate.current = t;
      filmEngine.update(t);
      if (textureRef.current) {
        textureRef.current.needsUpdate = true;
      }
    }
  });

  return (
    <group raycast={noRaycast}>
      {/* Curved Screen Mesh displaying dynamic film trailer */}
      <mesh geometry={screenGeo} position={[0, center[1], meshZ]} raycast={noRaycast}>
        <meshBasicMaterial map={canvasTexture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>

      {/* Screen Frame Bezel */}
      <mesh geometry={bezelGeo} position={[0, center[1], meshZ]} raycast={noRaycast}>
        <meshStandardMaterial color="#0A0807" roughness={0.92} metalness={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Screen Frame Ambient Bias Backlight Glow */}
      <mesh geometry={bezelGeo} position={[0, center[1], meshZ - 0.06]} raycast={noRaycast}>
        <meshBasicMaterial color={[0.6, 0.45, 0.28]} side={THREE.BackSide} toneMapped={false} />
      </mesh>

      {/* Screen Format Branding Plaque */}
      <group position={[0, center[1] - height / 2 - 0.55, center[2] + 0.25]} raycast={noRaycast}>
        <mesh position={[0, 0, -0.02]} raycast={noRaycast}>
          <boxGeometry args={[7.4, 0.45, 0.04]} />
          <meshStandardMaterial color="#14100E" roughness={0.8} metalness={0.5} />
        </mesh>
        <Text
          position={[0, 0, 0.01]}
          fontSize={0.24}
          letterSpacing={0.2}
          color="#D4AF37"
          anchorX="center"
          anchorY="middle"
          raycast={noRaycast}
        >
          {String(screenFormat || 'IMAX 4K DUAL LASER • DOLBY ATMOS').toUpperCase()}
        </Text>
      </group>

      {/* Flanking Velvet Stage Curtains / Masking Borders */}
      <mesh position={[-11.2, center[1], -7.5]} rotation-y={0.25} raycast={noRaycast}>
        <boxGeometry args={[2.5, height + 2, 0.4]} />
        <meshStandardMaterial color="#181210" roughness={0.98} />
      </mesh>
      <mesh position={[11.2, center[1], -7.5]} rotation-y={-0.25} raycast={noRaycast}>
        <boxGeometry args={[2.5, height + 2, 0.4]} />
        <meshStandardMaterial color="#181210" roughness={0.98} />
      </mesh>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Volumetric Projector Beam that Synchronizes with Film Light     */
/* ------------------------------------------------------------------ */
const beamVert = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  void main() {
    vUv = uv;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vN = normalize(normalMatrix * normal);
    vV = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const beamFrag = /* glsl */ `
  precision highp float;
  uniform float uTime; uniform vec3 uColor; uniform float uIntensity;
  varying vec2 vUv; varying vec3 vN; varying vec3 vV;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){
    vec2 i = floor(p), f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1,0)), f.x), mix(hash(i + vec2(0,1)), hash(i + vec2(1,1)), f.x), f.y);
  }
  void main() {
    float soft = pow(abs(dot(vN, vV)), 1.5);
    float streak = noise(vec2(vUv.x * 40.0, vUv.y * 3.5 - uTime * 0.05));
    float a = soft * (0.04 + 0.18 * vUv.y) * (0.5 + 0.9 * streak) * uIntensity;
    a *= 0.95 + 0.05 * sin(uTime * 48.0);
    gl_FragColor = vec4(uColor * a, a);
  }
`;

function DynamicProjectorBeam({ filmEngine, isScreening }) {
  const matRef = useRef();
  const { position, quaternion, length } = useMemo(() => {
    const from = new THREE.Vector3(0, 10.2, 22.0); // Booth window
    const to = new THREE.Vector3(0, 4.2, -8.0);    // Screen center
    const dir = to.clone().sub(from);
    const len = dir.length();
    const q = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, -1, 0),
      dir.clone().normalize(),
    );
    return { position: from.clone().add(to).multiplyScalar(0.5), quaternion: q, length: len };
  }, []);

  useFrame((s) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = s.clock.elapsedTime;
      const c = filmEngine.currentAverageColor;
      matRef.current.uniforms.uColor.value.setRGB(c.r / 255, c.g / 255, c.b / 255);
      matRef.current.uniforms.uIntensity.value = isScreening ? c.intensity : 0.45;
    }
  });

  return (
    <mesh position={position} quaternion={quaternion} scale={[2.1, 1, 1]} renderOrder={5} raycast={noRaycast}>
      <coneGeometry args={[6.2, length, 64, 1, true]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
        toneMapped={false}
        uniforms={{
          uTime: { value: 0 },
          uColor: { value: new THREE.Color('#FFE2B3') },
          uIntensity: { value: 1.0 },
        }}
        vertexShader={beamVert}
        fragmentShader={beamFrag}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Stadium Handrails & Safety Railings                             */
/* ------------------------------------------------------------------ */
function StadiumSafetyHandrails() {
  const rails = useMemo(() => {
    // Steps along Left Aisle (X = -5.0) and Right Aisle (X = +5.0)
    const points = [];
    for (let r = 0; r < 14; r++) {
      const z = 2.0 + r * 1.25;
      const y = (r + 1) * 0.38 + 0.45; // Railing height
      points.push({ z, y });
    }
    return points;
  }, []);

  return (
    <group raycast={noRaycast}>
      {[-5.0, 5.0].map((aisleX) => (
        <group key={aisleX} raycast={noRaycast}>
          {rails.map((pt, i) => (
            <group key={i} position={[aisleX - 0.76 * Math.sign(aisleX), pt.y - 0.25, pt.z]} raycast={noRaycast}>
              {/* Vertical Stanchion Post */}
              <mesh raycast={noRaycast}>
                <cylinderGeometry args={[0.022, 0.022, 0.5, 12]} />
                <meshStandardMaterial color="#3A322D" metalness={0.85} roughness={0.3} />
              </mesh>
              {/* Horizontal Connecting Rail segment */}
              {i < rails.length - 1 && (
                <mesh
                  position={[0, 0.25, 0.625]}
                  rotation-x={Math.atan2(0.38, 1.25)}
                  raycast={noRaycast}
                >
                  <cylinderGeometry args={[0.024, 0.024, 1.32, 12]} />
                  <meshStandardMaterial color="#6B5344" metalness={0.9} roughness={0.25} />
                </mesh>
              )}
            </group>
          ))}
        </group>
      ))}

      {/* Rear Balcony Safety Guardrail (Row P, Z = 19.8) */}
      <group position={[0, 5.8, 19.8]} raycast={noRaycast}>
        <mesh raycast={noRaycast}>
          <boxGeometry args={[21.5, 0.05, 0.05]} />
          <meshStandardMaterial color="#6B5344" metalness={0.9} roughness={0.25} />
        </mesh>
        {[-8, -4, 0, 4, 8].map((x) => (
          <mesh key={x} position={[x, -0.35, 0]} raycast={noRaycast}>
            <cylinderGeometry args={[0.025, 0.025, 0.7, 12]} />
            <meshStandardMaterial color="#3A322D" metalness={0.85} roughness={0.3} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Grand Stadium Risers with Aisle Floor Guides & Stage Floor      */
/* ------------------------------------------------------------------ */
function Risers({ reflections }) {
  const rows = useMemo(
    () =>
      ROW_LETTERS.map((letter, i) => ({
        letter,
        posZ: 2.0 + i * 1.25,
        posY: (i + 1) * 0.38,
      })),
    [],
  );

  return (
    <group raycast={noRaycast}>
      {/* Stadium Foundation Floor */}
      <mesh position={[0, -0.2, 6.5]} receiveShadow raycast={noRaycast}>
        <boxGeometry args={[23, 0.4, 33]} />
        <meshStandardMaterial color="#161210" roughness={0.92} />
      </mesh>

      {/* Glossy Reflective Stage in front of Screen */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.008, -3.8]} raycast={noRaycast}>
        <planeGeometry args={[22, 9.6]} />
        {reflections ? (
          <MeshReflectorMaterial
            color="#14100E"
            blur={[300, 100]}
            resolution={512}
            mixBlur={1}
            mixStrength={0.95}
            roughness={0.82}
            depthScale={1}
            minDepthThreshold={0.4}
            maxDepthThreshold={1.4}
            metalness={0.4}
            mirror={0}
          />
        ) : (
          <meshStandardMaterial color="#14100E" roughness={0.45} metalness={0.4} />
        )}
      </mesh>

      {/* Continuous Illuminated Aisle Floor Guide Tracks */}
      {[-5.0, 5.0].map((aisleX) => (
        <group key={aisleX} raycast={noRaycast}>
          <mesh position={[aisleX, 0.02, 10.5]} rotation-x={-Math.PI / 2} raycast={noRaycast}>
            <planeGeometry args={[1.5, 20]} />
            <meshStandardMaterial color="#1F1916" roughness={0.85} />
          </mesh>
          <mesh position={[aisleX - 0.72, 0.03, 10.5]} raycast={noRaycast}>
            <boxGeometry args={[0.04, 0.02, 20]} />
            <meshBasicMaterial color={[1.8, 1.2, 0.4]} toneMapped={false} />
          </mesh>
          <mesh position={[aisleX + 0.72, 0.03, 10.5]} raycast={noRaycast}>
            <boxGeometry args={[0.04, 0.02, 20]} />
            <meshBasicMaterial color={[1.8, 1.2, 0.4]} toneMapped={false} />
          </mesh>
        </group>
      ))}

      {/* 14 Tiered Stadium Row Steps */}
      {rows.map((r) => {
        const height = r.posY + 0.2;
        return (
          <group key={r.letter} raycast={noRaycast}>
            {/* Step Platform */}
            <mesh position={[0, (r.posY - 0.2) / 2, r.posZ]} receiveShadow castShadow raycast={noRaycast}>
              <boxGeometry args={[21.5, height, 1.35]} />
              <meshStandardMaterial color="#211B18" roughness={0.82} />
            </mesh>

            {/* Front Step Edge LED Safety Light Strip */}
            <mesh position={[0, r.posY - 0.02, r.posZ - 0.69]} raycast={noRaycast}>
              <boxGeometry args={[21.2, 0.025, 0.03]} />
              <meshBasicMaterial color={[2.2, 1.3, 0.4]} toneMapped={false} />
            </mesh>

            {/* Illuminated Row Letters at Aisle Crossings */}
            {[-10.2, -5.0, 5.0, 10.2].map((x) => (
              <Text
                key={x}
                position={[x, r.posY - 0.12, r.posZ - 0.685]}
                fontSize={0.16}
                color="#D4AF37"
                anchorX="center"
                anchorY="middle"
                raycast={noRaycast}
              >
                {r.letter}
              </Text>
            ))}
          </group>
        );
      })}

      <StadiumSafetyHandrails />
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Acoustic Wall Panelling & Architectural Warm Sconces            */
/* ------------------------------------------------------------------ */
function AcousticWallPanels({ x, isScreening }) {
  const slatCount = 72;
  const slatRef = useRef();

  useLayoutEffect(() => {
    const d = new THREE.Object3D();
    for (let i = 0; i < slatCount; i++) {
      d.position.set(x, 5.5, -7.5 + i * 0.42);
      d.updateMatrix();
      slatRef.current.setMatrixAt(i, d.matrix);
    }
    slatRef.current.instanceMatrix.needsUpdate = true;
  }, [x, slatCount]);

  const sconceIntensity = isScreening ? 1.8 : 4.8;

  return (
    <group raycast={noRaycast}>
      {/* Wall Substrate */}
      <mesh position={[x + Math.sign(x) * 0.35, 5.5, 6.5]} receiveShadow raycast={noRaycast}>
        <boxGeometry args={[0.5, 12, 33]} />
        <meshStandardMaterial color="#14100E" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>

      {/* Acoustic Wood Slats */}
      <instancedMesh ref={slatRef} args={[undefined, undefined, slatCount]} castShadow receiveShadow frustumCulled={false} raycast={noRaycast}>
        <boxGeometry args={[0.12, 10.5, 0.24]} />
        <meshStandardMaterial color="#38291F" roughness={0.65} metalness={0.08} />
      </instancedMesh>

      {/* Vertical Architectural Warm LED Sconces */}
      {[-4, 2, 8, 14, 20].map((z) => (
        <group key={z} position={[x - Math.sign(x) * 0.14, 4.8, z]} raycast={noRaycast}>
          <mesh raycast={noRaycast}>
            <boxGeometry args={[0.1, 0.9, 0.22]} />
            <meshStandardMaterial color="#1F1814" roughness={0.4} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.4, 0.05]} raycast={noRaycast}>
            <boxGeometry args={[0.08, 0.08, 0.14]} />
            <meshBasicMaterial color={[2.8, 1.8, 0.9]} toneMapped={false} />
          </mesh>
          <mesh position={[0, -0.4, 0.05]} raycast={noRaycast}>
            <boxGeometry args={[0.08, 0.08, 0.14]} />
            <meshBasicMaterial color={[2.8, 1.8, 0.9]} toneMapped={false} />
          </mesh>
          <pointLight position={[-Math.sign(x) * 0.4, 0.5, 0]} color="#FFE0B2" intensity={sconceIntensity} distance={8} decay={2} />
          <pointLight position={[-Math.sign(x) * 0.4, -0.5, 0]} color="#FFE0B2" intensity={sconceIntensity} distance={8} decay={2} />
        </group>
      ))}

      {/* Wall-Mounted Surround Speakers */}
      {[-2, 6, 14].map((z) => (
        <group key={z} position={[x - Math.sign(x) * 0.25, 7.5, z]} rotation-y={Math.sign(x) * 0.3} raycast={noRaycast}>
          <mesh raycast={noRaycast}>
            <boxGeometry args={[0.3, 0.5, 0.35]} />
            <meshStandardMaterial color="#0E0C0B" roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Emergency Illuminated Green EXIT Signs */}
      {[-5, 17].map((z) => (
        <group key={z} position={[x - Math.sign(x) * 0.16, 2.8, z]} raycast={noRaycast}>
          <mesh raycast={noRaycast}>
            <boxGeometry args={[0.06, 0.32, 0.7]} />
            <meshStandardMaterial color="#0B1C10" />
          </mesh>
          <mesh position={[-Math.sign(x) * 0.04, 0, 0]} raycast={noRaycast}>
            <planeGeometry args={[0.62, 0.26]} />
            <meshBasicMaterial color={[0.2, 2.5, 0.6]} toneMapped={false} />
          </mesh>
          <Text
            position={[-Math.sign(x) * 0.05, 0, 0]}
            rotation-y={-Math.sign(x) * Math.PI / 2}
            fontSize={0.14}
            fontWeight="bold"
            color="#05240E"
            anchorX="center"
            anchorY="middle"
            raycast={noRaycast}
          >
            EXIT ➔
          </Text>
          <pointLight position={[-Math.sign(x) * 0.3, 0, 0]} color="#10B981" intensity={1.5} distance={4} decay={2} />
        </group>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Ceiling Deck & Projection Booth Window                         */
/* ------------------------------------------------------------------ */
function Ceiling() {
  return (
    <group raycast={noRaycast}>
      <mesh position={[0, 11.5, 6.5]} raycast={noRaycast}>
        <boxGeometry args={[23, 0.4, 33]} />
        <meshStandardMaterial color="#110E0D" roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* Linear Troffers */}
      {[-6.5, -2.2, 2.2, 6.5].map((x) => (
        <mesh key={x} position={[x, 11.26, 6.5]} raycast={noRaycast}>
          <boxGeometry args={[0.14, 0.05, 26]} />
          <meshBasicMaterial color={[1.5, 1.1, 0.7]} toneMapped={false} />
        </mesh>
      ))}

      {/* Ceiling Dolby Atmos Speakers */}
      {[-4.0, 4.0].map((x) =>
        [2, 8, 14].map((z) => (
          <mesh key={`${x}-${z}`} position={[x, 11.15, z]} rotation-x={0.2} raycast={noRaycast}>
            <boxGeometry args={[0.45, 0.3, 0.45]} />
            <meshStandardMaterial color="#0D0B0A" roughness={0.8} />
          </mesh>
        )),
      )}

      {/* Luxury Architectural Perimeter Amber Cove Light Troughs */}
      {[-10.8, 10.8].map((x) => (
        <mesh key={`cove-${x}`} position={[x, 11.18, 6.5]} raycast={noRaycast}>
          <boxGeometry args={[0.10, 0.04, 31]} />
          <meshBasicMaterial color={[1.8, 1.25, 0.65]} toneMapped={false} />
        </mesh>
      ))}

      {/* Rear Projection Booth Wall & Window */}
      <group position={[0, 10.2, 22.8]} raycast={noRaycast}>
        <mesh raycast={noRaycast}>
          <boxGeometry args={[23, 3.2, 0.6]} />
          <meshStandardMaterial color="#14100E" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, -0.32]} raycast={noRaycast}>
          <boxGeometry args={[1.4, 0.8, 0.1]} />
          <meshStandardMaterial color="#0A0807" metalness={0.9} roughness={0.1} transparent opacity={0.85} />
        </mesh>
        <mesh position={[0, 0, -0.38]} raycast={noRaycast}>
          <circleGeometry args={[0.22, 32]} />
          <meshBasicMaterial color={[4.2, 3.6, 2.8]} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Master Auditorium Assembly                                     */
/* ------------------------------------------------------------------ */
export default function AuditoriumRoom({
  moviePosterUrl,
  screenFormat,
  lightingMode = 'SCREENING',
  quality = 'high',
}) {
  const high = quality === 'high';
  const isScreening = lightingMode === 'SCREENING';

  // Instantiate film engine singleton
  const filmEngine = useMemo(
    () => new CinematicFilmEngine(moviePosterUrl, 'KALKI 2898 AD'),
    [moviePosterUrl],
  );

  const screenLightRef = useRef();

  useFrame(() => {
    if (screenLightRef.current) {
      const c = filmEngine.currentAverageColor;
      screenLightRef.current.color.setRGB(c.r / 255, c.g / 255, c.b / 255);
      screenLightRef.current.intensity = isScreening ? c.intensity * 14 : 7;
    }
  });

  return (
    <group raycast={noRaycast}>
      <DynamicCurvedScreen filmEngine={filmEngine} screenFormat={screenFormat} />
      <DynamicProjectorBeam filmEngine={filmEngine} isScreening={isScreening} />
      <Risers reflections={high} />
      <AcousticWallPanels x={-11.2} isScreening={isScreening} />
      <AcousticWallPanels x={11.2} isScreening={isScreening} />
      <Ceiling />

      {/* Rear Wall */}
      <mesh position={[0, 4.2, 22.8]} raycast={noRaycast}>
        <boxGeometry args={[23, 9.0, 0.6]} />
        <meshStandardMaterial color="#161210" roughness={0.96} side={THREE.DoubleSide} />
      </mesh>

      {/* Front Screen Stage Wall */}
      <mesh position={[0, 5.5, -9.8]} raycast={noRaycast}>
        <boxGeometry args={[23, 12, 0.6]} />
        <meshStandardMaterial color="#0A0807" roughness={0.98} side={THREE.DoubleSide} />
      </mesh>

      {/* Atmospheric Dust Motes */}
      <Sparkles
        count={high ? 240 : 100}
        scale={[14, 8, 24]}
        position={[0, 6.8, 6.0]}
        size={2.4}
        speed={0.18}
        opacity={isScreening ? 0.42 : 0.22}
        color="#FFE0B2"
        noise={0.3}
        raycast={noRaycast}
      />

      {/* Dynamic Ambient Light Spill onto Audience */}
      <pointLight
        ref={screenLightRef}
        position={[0, 4.5, -6.0]}
        intensity={14}
        distance={26}
        decay={2}
        color="#D4AF37"
      />

      {/* Secondary Soft Ambient Audience Bounce Fill */}
      <pointLight
        position={[0, 7.2, 5.5]}
        intensity={isScreening ? 1.8 : 4.5}
        distance={24}
        decay={2}
        color="#FFEED6"
      />
    </group>
  );
}
