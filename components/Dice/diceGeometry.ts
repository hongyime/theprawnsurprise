import * as THREE from 'three';
import { DieType } from '../../types';

export interface DieFace {
  value: number;
  normal: THREE.Vector3;
  position: THREE.Vector3;
}

function createD10Geometry(): THREE.BufferGeometry {
  const vertices = [0, 1.2, 0, 0, -1.2, 0];
  const indices: number[] = [];
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;
    vertices.push(Math.sin(angle), 0, Math.cos(angle));
    const current = i + 2;
    const next = (i + 1) % 5 + 2;
    indices.push(0, current, next, 1, next, current);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
  geometry.setIndex(indices);
  geometry.computeVertexNormals();
  return geometry;
}

// Derive labels from the actual face planes. Approximate radial offsets left
// the old d10 labels floating above the surface and tilted against its faces.
export function getDieConfig(type: DieType) {
  const geometry = type === DieType.D4 ? new THREE.TetrahedronGeometry(1.5)
    : type === DieType.D6 ? new THREE.BoxGeometry(2, 2, 2)
    : type === DieType.D8 ? new THREE.OctahedronGeometry(1.5)
    : createD10Geometry();
  const fontSize = type === DieType.D6 ? 0.8 : type === DieType.D8 ? 0.45 : 0.35;
  const positions = geometry.getAttribute('position');
  const indices = geometry.getIndex();
  const groups: { normal: THREE.Vector3; center: THREE.Vector3; count: number }[] = [];
  for (let i = 0; i < (indices?.count ?? positions.count); i += 3) {
    const points = [0, 1, 2].map(offset => new THREE.Vector3().fromBufferAttribute(positions, indices ? indices.getX(i + offset) : i + offset));
    const triangle = new THREE.Triangle(points[0], points[1], points[2]);
    const normal = triangle.getNormal(new THREE.Vector3());
    const center = triangle.getMidpoint(new THREE.Vector3());
    const existing = groups.find(face => face.normal.dot(normal) > 0.99999);
    if (existing) {
      existing.center.add(center);
      existing.count++;
    } else {
      groups.push({ normal, center, count: 1 });
    }
  }
  const faces: DieFace[] = groups.map((face, index) => ({
    value: index + 1,
    normal: face.normal,
    position: face.center.divideScalar(face.count).addScaledVector(face.normal, 0.012),
  }));
  return { geometry, faces, fontSize };
}

export function faceQuaternion(normal: THREE.Vector3): THREE.Quaternion {
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
}
