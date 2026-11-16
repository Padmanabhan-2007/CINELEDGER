import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { easing } from 'maath';
import { cinemaAudio } from '../../../utils/cinemaAudio';

const SCREEN_CENTER = new THREE.Vector3(0, 4.2, -8.5);
const OVERVIEW_POS = new THREE.Vector3(0, 10.5, 20.0);
const OVERVIEW_LOOK = new THREE.Vector3(0, 3.8, 4.5);

// Stage View (Standing on the screen stage, looking back at all 252 seats)
const STAGE_POS = new THREE.Vector3(0, 2.4, -6.5);
const STAGE_LOOK = new THREE.Vector3(0, 4.5, 9.5);

// Back-most VIP seat view (Row P Center Recliner, looking at full screen)
const BACK_SEAT_POS = new THREE.Vector3(0, 5.8, 18.5);
const BACK_SEAT_LOOK = new THREE.Vector3(0, 4.2, -8.5);

const FOV_OVERVIEW = 56;
const FOV_STAGE = 68;
const FOV_SEAT = 64;
const FOV_TOUR = 58;

export default function ExactSeatCameraController({
  cameraMode = 'OVERVIEW',
  activeSeat = null,
  orbitControlsRef,
  onFlightEnd,
  onTourProgress,
}) {
  const { camera } = useThree();
  const seatMode = cameraMode === 'SEAT_PERSPECTIVE' && !!activeSeat;
  const stageMode = cameraMode === 'STAGE_VIEW';
  const tourMode = cameraMode === 'CINEMA_TOUR';

  const targetPos = useRef(OVERVIEW_POS.clone());
  const targetLook = useRef(OVERVIEW_LOOK.clone());
  const look = useRef(OVERVIEW_LOOK.clone());
  const targetFov = useRef(FOV_OVERVIEW);
  const flying = useRef(false);
  const scratch = useRef(new THREE.Vector3());
  const tourStartTime = useRef(null);

  useEffect(() => {
    const controls = orbitControlsRef?.current;
    flying.current = true;

    if (controls) {
      controls.enabled = false;
      look.current.copy(controls.target);
    }

    if (seatMode && activeSeat) {
      // Position camera at exact seated human eye height (1.22m)
      const eye = activeSeat.eyeHeightY ?? 1.22;
      targetPos.current.set(activeSeat.posX, activeSeat.posY + eye, activeSeat.posZ + 0.05);

      // Natural forward sightline: Screen is 20m wide (-10m to +10m)
      // Gentle toe-in convergence (posX * 0.70) keeps the screen centered and natural
      // without extreme swiveling when sitting in corner seats!
      const lookX = activeSeat.posX * 0.70;
      targetLook.current.set(lookX, 4.2, -8.5);
      targetFov.current = FOV_SEAT;
      cinemaAudio.playReclinerMotor();
    } else if (stageMode) {
      // Stage View: Look from front screen back at all 252 seats
      targetPos.current.copy(STAGE_POS);
      targetLook.current.copy(STAGE_LOOK);
      targetFov.current = FOV_STAGE;
      cinemaAudio.playLaserScanBeep();
    } else if (tourMode) {
      targetFov.current = FOV_TOUR;
      tourStartTime.current = null;
      cinemaAudio.playAtmosSpatialRumble();
    } else {
      // Overview Mode
      targetPos.current.copy(OVERVIEW_POS);
      targetLook.current.copy(OVERVIEW_LOOK);
      targetFov.current = FOV_OVERVIEW;
    }
  }, [seatMode, stageMode, tourMode, activeSeat, orbitControlsRef]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.05);
    const controls = orbitControlsRef?.current;

    // -------------------------------------------------------------------------
    // HOLLYWOOD CINEBOT CAMERA 5-ACT FLIGHT TOUR (24 Seconds)
    // -------------------------------------------------------------------------
    if (tourMode) {
      if (tourStartTime.current === null) {
        tourStartTime.current = state.clock.elapsedTime;
      }
      const elapsed = state.clock.elapsedTime - tourStartTime.current;

      // 5-Act Choreography:
      // Act 1 (0.0s - 5.0s): Left Top Corner (High rear balcony entrance establishing shot)
      // Act 2 (5.0s - 10.0s): Diving smoothly through tiered seats & aisle skimming towards screen
      // Act 3 (10.0s - 15.0s): Full 360° panoramic rotation across the front stage
      // Act 4 (15.0s - 19.5s): Directly go to the left corner slowly from the screen side
      // Act 5 (19.5s - 24.0s): Ascend smoothly to back-most seat view (Row P VIP) to frame full screen

      if (elapsed < 5.0) {
        // ACT 1: Left Top Corner (High rear balcony entrance)
        const p = elapsed / 5.0;
        const sp = 0.5 - 0.5 * Math.cos(p * Math.PI);
        targetPos.current.lerpVectors(
          new THREE.Vector3(-8.8, 10.2, 19.8),
          new THREE.Vector3(-8.2, 8.8, 17.0),
          sp
        );
        targetLook.current.lerpVectors(
          new THREE.Vector3(0, 3.8, 2.0),
          new THREE.Vector3(-1.5, 3.5, 0.0),
          sp
        );
        onTourProgress?.(1, 'Act 1: Left Top Corner Establishing Crane', p);
      } else if (elapsed < 10.0) {
        // ACT 2: Diving smoothly down through all tiered seats & aisle towards the screen
        const p = (elapsed - 5.0) / 5.0;
        const sp = 0.5 - 0.5 * Math.cos(p * Math.PI);
        targetPos.current.lerpVectors(
          new THREE.Vector3(-8.2, 8.8, 17.0),
          new THREE.Vector3(0, 2.2, -5.5),
          sp
        );
        targetLook.current.lerpVectors(
          new THREE.Vector3(-1.5, 3.5, 0.0),
          new THREE.Vector3(0, 4.2, -8.5),
          sp
        );
        onTourProgress?.(2, 'Act 2: Diving Through Seats to Stage & Screen', p);
      } else if (elapsed < 15.0) {
        // ACT 3: Full 360° Panoramic Rotation on Front Stage
        const p = (elapsed - 10.0) / 5.0;
        targetPos.current.set(0, 2.2, -5.5);

        // Continuous panoramic 360° sweep across the entire auditorium bowl
        const angle = p * Math.PI * 2;
        const radius = 10.0;
        targetLook.current.set(
          Math.sin(angle) * radius,
          4.5 - Math.cos(angle) * 0.8,
          -5.5 + Math.cos(angle) * radius
        );
        onTourProgress?.(3, 'Act 3: 360° Stage Full Panoramic Sweep', p);
      } else if (elapsed < 19.5) {
        // ACT 4: Directly go to the left corner slowly from the screen side
        const p = (elapsed - 15.0) / 4.5;
        const sp = 0.5 - 0.5 * Math.cos(p * Math.PI);
        targetPos.current.lerpVectors(
          new THREE.Vector3(0, 2.2, -5.5),
          new THREE.Vector3(-9.0, 2.4, -5.8), // Front-left stage wing corner near screen
          sp
        );
        targetLook.current.lerpVectors(
          new THREE.Vector3(0, 4.2, -8.5),
          new THREE.Vector3(2.5, 5.0, 10.5),  // Looking diagonally across all 252 tiered seats
          sp
        );
        onTourProgress?.(4, 'Act 4: Screen-Side Left Corner Diagonal Glide', p);
      } else if (elapsed < 24.0) {
        // ACT 5: Finally show the full screen from the back-most seat view
        const p = (elapsed - 19.5) / 4.5;
        const sp = 0.5 - 0.5 * Math.cos(p * Math.PI);
        targetPos.current.lerpVectors(
          new THREE.Vector3(-9.0, 2.4, -5.8),
          BACK_SEAT_POS, // Center VIP Recliner in Row P
          sp
        );
        targetLook.current.lerpVectors(
          new THREE.Vector3(2.5, 5.0, 10.5),
          BACK_SEAT_LOOK, // Centered right on the 20m curved silver screen
          sp
        );
        onTourProgress?.(5, 'Act 5: Ascending to Back-Most Seat Full Screen View', p);
      } else {
        // TOUR COMPLETE: Locks permanently in Back-Most Seat View
        targetPos.current.copy(BACK_SEAT_POS);
        targetLook.current.copy(BACK_SEAT_LOOK);
        onTourProgress?.(5, 'Back-Most Seat Full Screen View (Tour Complete)', 1.0);
      }

      easing.damp3(camera.position, targetPos.current, 0.42, dt);
      easing.damp3(look.current, targetLook.current, 0.32, dt);
      camera.lookAt(look.current);
      return;
    }

    // SMOOTH CAMERA FLIGHT TRANSITIONS
    if (flying.current) {
      easing.damp3(camera.position, targetPos.current, 0.38, dt);
      easing.damp3(look.current, targetLook.current, 0.32, dt);
      easing.damp(camera, 'fov', targetFov.current, 0.35, dt);
      camera.lookAt(look.current);
      camera.updateProjectionMatrix();

      const arrived =
        camera.position.distanceTo(targetPos.current) < 0.08 &&
        look.current.distanceTo(targetLook.current) < 0.08 &&
        Math.abs(camera.fov - targetFov.current) < 0.1;

      if (arrived) {
        flying.current = false;
        if (controls && !seatMode) {
          controls.target.copy(targetLook.current);
          controls.enabled = true;
          controls.update();
        }
        onFlightEnd?.(cameraMode);
      }
      return;
    }

    // SEATED PERSPECTIVE (SMOOTH & SUBTLE MOUSE LOOK)
    if (seatMode) {
      const t = state.clock.elapsedTime;
      camera.position.set(
        targetPos.current.x,
        targetPos.current.y + Math.sin(t * 0.8) * 0.004,
        targetPos.current.z,
      );

      scratch.current.copy(targetLook.current);
      scratch.current.x += state.pointer.x * 0.45;
      scratch.current.y += state.pointer.y * 0.22;
      easing.damp3(look.current, scratch.current, 0.16, dt);
      camera.lookAt(look.current);
      return;
    }

    // STAGE PERSPECTIVE (LOOKING AT ALL SEATS FROM SCREEN)
    if (stageMode && !controls?.state) {
      scratch.current.copy(targetLook.current);
      scratch.current.x += state.pointer.x * 0.7;
      scratch.current.y += state.pointer.y * 0.3;
      easing.damp3(look.current, scratch.current, 0.16, dt);
      camera.lookAt(look.current);
    }
  });

  return null;
}
