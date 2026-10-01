import React, { useMemo, useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DieType } from '../../types';
import { getDieConfig, faceQuaternion, type DieFace } from './diceGeometry';
import { createRollSampler, ROLL_DURATION_MS } from './diceMotion';

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
  const roll = useRef({ start: new THREE.Quaternion(), startedAt: 0 });
  const sampleRoll = useMemo(createRollSampler, []);
  const targetQuaternion = useMemo(() => {
    const face = faces.find(candidate => candidate.value === result);
    return face ? faceQuaternion(face.normal).invert() : null;
  }, [result, faces]);

  useEffect(() => {
    if (!meshRef.current) return;
    if (isRolling) {
      roll.current.start.copy(meshRef.current.quaternion);
      roll.current.startedAt = performance.now();
    } else if (targetQuaternion) {
      meshRef.current.quaternion.copy(targetQuaternion);
    }
  }, [isRolling, targetQuaternion]);

  useFrame(() => {
    if (!meshRef.current || !floatRef.current) return;
    if (isRolling && !reduceMotion && targetQuaternion) {
      const progress = (performance.now() - roll.current.startedAt) / ROLL_DURATION_MS;
      floatRef.current.position.y = sampleRoll(
        meshRef.current.quaternion, roll.current.start, targetQuaternion, progress,
      );
    } else if (targetQuaternion) {
      floatRef.current.position.y = 0;
      meshRef.current.quaternion.copy(targetQuaternion);
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
  reduceMotion: boolean;
}

export const Die3D: React.FC<Die3DProps> = ({ type, value, isRolling, reduceMotion }) => {
  return (
    <div className="w-full h-full">
      <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5.4], fov: 45 }}>
        <ambientLight intensity={1.5} />
        <pointLight position={[10, 10, 10]} intensity={2} />
        <spotLight position={[-10, -10, 10]} angle={0.3} />
        <DieMesh key={type} type={type} result={value} isRolling={isRolling} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
};
