import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { createRollSampler } from '../components/Dice/diceMotion';
import { faceQuaternion, getDieConfig } from '../components/Dice/diceGeometry';
import { DieType } from '../types';

describe.each([DieType.D4, DieType.D6, DieType.D8, DieType.D10])('d%i tumble', type => {
  it('visibly turns and lands upright on every outcome, including repeated rolls', () => {
    const { geometry, faces } = getDieConfig(type);
    const sample = createRollSampler();
    const orientation = new THREE.Quaternion();
    try {
      for (const face of faces) {
        const target = faceQuaternion(face.normal).invert();
        for (const start of [new THREE.Quaternion(), target.clone()]) {
          expect(sample(orientation, start, target, 0)).toBe(0);
          expect(orientation.angleTo(start)).toBeLessThan(1e-6);
          sample(orientation, start, target, 0.2);
          expect(orientation.angleTo(start)).toBeGreaterThan(0.1);
          expect(sample(orientation, start, target, 1)).toBeCloseTo(0);
          expect(face.normal.clone().applyQuaternion(orientation).distanceTo(new THREE.Vector3(0, 0, 1))).toBeLessThan(1e-6);
          const label = faceQuaternion(face.normal);
          expect(new THREE.Vector3(0, 1, 0).applyQuaternion(label).applyQuaternion(orientation).distanceTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(1e-6);
          sample(orientation, start, target, 10); // A throttled/background tab still lands.
          expect(orientation.angleTo(target)).toBeLessThan(1e-6);
        }
      }
    } finally {
      geometry.dispose();
    }
  });

  it('decelerates without a final orientation jump', () => {
    const sample = createRollSampler();
    const start = new THREE.Quaternion().setFromEuler(new THREE.Euler(0.7, 0.4, 1.2));
    const target = new THREE.Quaternion();
    const early = new THREE.Quaternion();
    const next = new THREE.Quaternion();
    sample(early, start, target, 0.1);
    sample(next, start, target, 0.11);
    const earlyStep = early.angleTo(next);
    sample(early, start, target, 0.99);
    sample(next, start, target, 1);
    expect(early.angleTo(next)).toBeLessThan(0.01);
    expect(early.angleTo(next)).toBeLessThan(earlyStep / 10);
  });
});
