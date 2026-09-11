import { describe, expect, it } from 'vitest';
import * as THREE from 'three';
import { getDieConfig, faceQuaternion } from '../components/Dice/diceGeometry';
import { DieType } from '../types';

describe.each([DieType.D4, DieType.D6, DieType.D8, DieType.D10])('d%i face labels', type => {
  it('provides every possible outcome on its own real, outward-facing surface', () => {
    const { geometry, faces } = getDieConfig(type);
    try {
      expect(faces.map(face => face.value)).toEqual(Array.from({ length: type }, (_, i) => i + 1));
      const positions = geometry.getAttribute('position');
      const indices = geometry.getIndex();
      for (const face of faces) {
        expect(face.normal.length()).toBeCloseTo(1);
        expect(face.normal.dot(face.position)).toBeGreaterThan(0);
        let matched = false;
        for (let i = 0; i < (indices?.count ?? positions.count); i += 3) {
          const vertices = [0, 1, 2].map(offset => new THREE.Vector3().fromBufferAttribute(positions, indices ? indices.getX(i + offset) : i + offset));
          const triangle = new THREE.Triangle(vertices[0], vertices[1], vertices[2]);
          const normal = triangle.getNormal(new THREE.Vector3());
          const gap = face.position.clone().sub(vertices[0]).dot(normal);
          const projected = face.position.clone().addScaledVector(normal, -gap);
          if (normal.dot(face.normal) > 0.99999 && triangle.closestPointToPoint(projected, new THREE.Vector3()).distanceTo(projected) < 1e-6) {
            expect(gap).toBeCloseTo(0.012, 5);
            matched = true;
          }
        }
        expect(matched, `face ${face.value} must sit just above its actual polygon`).toBe(true);
      }
    } finally { geometry.dispose(); }
  });

  it('shows the selected face and its label upright to the camera, including initial result 1', () => {
    const { geometry, faces } = getDieConfig(type);
    try {
      for (const face of faces) {
        const label = faceQuaternion(face.normal);
        const die = label.clone().invert();
        expect(face.normal.clone().applyQuaternion(die).distanceTo(new THREE.Vector3(0, 0, 1))).toBeLessThan(1e-6);
        expect(new THREE.Vector3(0, 1, 0).applyQuaternion(label).applyQuaternion(die).distanceTo(new THREE.Vector3(0, 1, 0))).toBeLessThan(1e-6);
      }
    } finally { geometry.dispose(); }
  });
});
