import { useState, useEffect } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

import vertexShader from "./vertexShader";
import fragmentShader from "./fragmentShader";

const CustomGeometryParticles = (props) => {
  const { count } = props;
  const radius = 2;
  const points = useRef();
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const distance = Math.sqrt(Math.random()) * radius;
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      let x = distance * Math.sin(theta) * Math.cos(phi);
      let y = distance * Math.sin(theta) * Math.sin(phi);
      let z = distance * Math.cos(theta);
      positions.set([x, y, z], i * 3);
    }
    return positions;
  }, [count]);
  const uniforms = useMemo(
    () => ({
      uTime: {
        value: 0.0,
      },
      uRadius: {
        value: radius,
      },
    }),
    []
  );
  useFrame((state) => {
    const { clock } = state;
    points.current.material.uniforms.uTime.value = clock.elapsedTime;
  });
  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
      />
    </points>
  );
};
const cameraPosition = [1, 2, 2];
function Rig() {
  const { camera, mouse } = useThree();
  const vec = new THREE.Vector3();
  return useFrame(() =>
    camera.position.lerp(
      vec.set(mouse.x * 2, mouse.y * 1, camera.position.z),
      0.09
    )
  );
}
function ParticleSphere() {
    return (
      <Canvas camera={{ position: cameraPosition }}>
          <ambientLight intensity={0.5} />
          <CustomGeometryParticles count={10000} />
          <ambientLight />
          <OrbitControls
            position={[0, 0, 0]}
            autoRotate={true}
            enableDamping={true}
            keyPanSpeed={0.5}
            minDistance={0}
            maxDistance={100}
            dampingFactor={0.5}
            autoRotateSpeed={3}
            zoomSpeed={0.5}
            autoZoom={true}
            enableZoom={false}
            minZoom={0.1}
            maxZoom={3.0}
            enablePan={false}
          />
          <Rig />
        </Canvas>
    );
    }
    export default ParticleSphere;