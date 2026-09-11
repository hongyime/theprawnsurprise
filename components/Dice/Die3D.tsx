import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DieType } from '../../types';
import { useReducedMotion } from 'framer-motion';
import { getDieConfig, faceQuaternion, type DieFace } from './diceGeometry';

function FaceNumber({ face, fontSize }: { face: DieFace; fontSize: number }) {
  // Ten possible numbers need only a small local texture, not a font loader,
  // glyph worker or general-purpose 3D typesetting engine.
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 128;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Dice labels require a 2D canvas context');
    context.font = 'bold 90px Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillStyle = '#000';
    context.fillText(String(face.value), 64, 68);
    const label = new THREE.CanvasTexture(canvas);
    label.colorSpace = THREE.SRGBColorSpace;
    return label;
  }, [face.value]);
  useEffect(() => () => texture.dispose(), [texture]);
  const orientation = useMemo(() => faceQuaternion(face.normal), [face.normal]);
  const size = fontSize * 128 / 90;
  return (
    <mesh position={face.position} quaternion={orientation}>
      <planeGeometry args={[size, size]} />
      <meshBasicMaterial map={texture} transparent alphaTest={0.02} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function DieMesh({ type, result, isRolling, reduceMotion }: {
  type: DieType; result: number | null; isRolling: boolean; reduceMotion: boolean;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const floatRef = useRef<THREE.Group>(null);
  const { geometry, faces, fontSize } = useMemo(() => getDieConfig(type), [type]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  const rotationSpeed = useRef(new THREE.Vector3(0.16, 0.23, 0.19));
  const targetQuaternion = useMemo(() => {
    const face = faces.find(candidate => candidate.value === result);
    return face ? faceQuaternion(face.normal).invert() : null;
  }, [result, faces]);

  useFrame((state, delta) => {
    if (!meshRef.current || !floatRef.current) return;
    const floating = !isRolling && !reduceMotion;
    const time = state.clock.elapsedTime;
    floatRef.current.position.y = floating ? Math.sin(time) * 0.05 : 0;
    floatRef.current.rotation.set(
      floating ? Math.cos(time / 2) * 0.025 : 0,
      floating ? Math.sin(time / 2) * 0.025 : 0,
      floating ? Math.sin(time / 2) * 0.0125 : 0,
    );
    if (isRolling && !reduceMotion) {
      const step = Math.min(delta, 0.05) * 60;
      meshRef.current.rotation.x += rotationSpeed.current.x * step;
      meshRef.current.rotation.y += rotationSpeed.current.y * step;
      meshRef.current.rotation.z += rotationSpeed.current.z * step;
    } else if (targetQuaternion) {
      meshRef.current.quaternion.slerp(targetQuaternion, reduceMotion ? 1 : 1 - Math.exp(-6 * delta));
    }
  });
  return (
    <group ref={floatRef}>
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial color="#FFFFFF" roughness={0.4} metalness={0.1} flatShading />
        {faces.map(face => <FaceNumber key={face.value} face={face} fontSize={fontSize} />)}
        <lineSegments>
          <edgesGeometry args={[geometry, 15]} />
          <lineBasicMaterial color="black" />
        </lineSegments>
      </mesh>
    </group>
  );
}

interface Die3DProps {
  type: DieType;
  value: number | null;
  isRolling: boolean;
}

export const Die3D: React.FC<Die3DProps> = ({ type, value, isRolling }) => {
  const reduceMotion = !!useReducedMotion();
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, -10, 10]} angle={0.3} />
        <DieMesh type={type} result={value} isRolling={isRolling} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
};
