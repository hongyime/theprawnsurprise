import * as THREE from 'three';

export const ROLL_DURATION_MS = 1400;

// Reuse these per die: no geometry, Euler or quaternion allocations per frame.
export function createRollSampler() {
  const tumble = new THREE.Quaternion();
  const rotation = new THREE.Euler();

  return (out: THREE.Quaternion, start: THREE.Quaternion, target: THREE.Quaternion, progress: number) => {
    const t = THREE.MathUtils.clamp(progress, 0, 1);
    const eased = 1 - (1 - t) ** 3;
    // Complete whole turns on every axis, then land exactly on the chosen face.
    rotation.set(eased * Math.PI * 6, eased * Math.PI * 8, eased * Math.PI * 4);
    tumble.setFromEuler(rotation);
    out.copy(start).slerp(target, t * t * (3 - 2 * t)).premultiply(tumble);
    if (t === 1) out.copy(target);
    return Math.sin(Math.PI * t) ** 2 * 0.25;
  };
}
