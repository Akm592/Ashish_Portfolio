import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

const ControlPanel = ({ shape, setShape }) => {
  return (
    <div
      style={{
        position: "relative",
        top: 500,
        zIndex: 1000,
        background: "rgba(0,0,0,0.7)",
        padding: 10,
        borderRadius: 5,
      }}
    >
      <select
        value={shape}
        onChange={(e) => setShape(e.target.value)}
        style={{ padding: 5 }}
      >
        <option value="sphere">Sphere</option>
        <option value="spiral">Spiral</option>
        <option value="cube">Cube</option>
        <option value="cylinder">Cylinder</option>
        <option value="spring">Spring</option>
      </select>
    </div>
  );
};

const Particles = ({ count, isChaoticMode, shape }) => {
  const mesh = useRef();
  const { mouse, viewport, clock } = useThree();

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      let x, y, z;
      const t = i / count;
      const radius = 150;

      switch (shape) {
        case "sphere":
          const phi = Math.acos(-1 + (2 * i) / count);
          const theta = Math.sqrt(count * Math.PI) * phi;
          x = radius * Math.sin(phi) * Math.cos(theta);
          y = radius * Math.sin(phi) * Math.sin(theta);
          z = radius * Math.cos(phi);
          break;
        case "spiral":
          const angle = 0.1 * i;
          x = radius * Math.cos(angle);
          y = radius * Math.sin(angle);
          z = -200 + (i / count) * 400;
          break;
        case "cube":
          x = (Math.random() - 0.5) * 300;
          y = (Math.random() - 0.5) * 300;
          z = (Math.random() - 0.5) * 300;
          break;
        case "cylinder":
          const theta2 = (i / count) * Math.PI * 2;
          x = radius * Math.cos(theta2);
          y = -200 + (i / count) * 400;
          z = radius * Math.sin(theta2);
          break;
        case "spring":
          const tightness = 10;
          const windings = 5;
          const angle2 = windings * Math.PI * 2 * t;
          x = radius * Math.cos(angle2);
          y = -200 + (i / count) * 400;
          z = radius * Math.sin(angle2);
          x += Math.cos(tightness * angle2) * 30;
          z += Math.sin(tightness * angle2) * 30;
          break;
        default:
          x = y = z = 0;
      }

      temp.push({
        position: new THREE.Vector3(x, y, z),
        originalPosition: new THREE.Vector3(x, y, z),
        velocity: new THREE.Vector3(
          Math.random() * 2 - 1,
          Math.random() * 2 - 1,
          Math.random() * 2 - 1
        ).multiplyScalar(0.5),
        acceleration: new THREE.Vector3(0, 0, 0),
        size: Math.random() * 0.5 + 0.5,
        color: new THREE.Color().setHSL(Math.random(), 0.7, 0.5),
      });
    }
    return temp;
  }, [count, shape]);

  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colorArray = useMemo(() => new Float32Array(count * 3), [count]);
  const sizeArray = useMemo(() => new Float32Array(count), [count]);

  useFrame(() => {
    const time = clock.getElapsedTime();

    particles.forEach((particle, i) => {
      const {
        position,
        originalPosition,
        velocity,
        acceleration,
        size,
        color,
      } = particle;

      if (isChaoticMode) {
        // Chaotic movement (same as before)
        acceleration.set(
          Math.sin(time * 0.1 + i) * 0.02,
          Math.cos(time * 0.1 + i) * 0.02,
          Math.sin(time * 0.1 + i * 0.1) * 0.02
        );

        // Cursor interaction (same as before)
        const mouseX = (mouse.x * viewport.width) / 2;
        const mouseY = (mouse.y * viewport.height) / 2;
        const mousePosition = new THREE.Vector3(mouseX, mouseY, 0);
        const direction = position.clone().sub(mousePosition);
        const distance = direction.length();
        const repulsionStrength = 1000;
        const force = direction
          .normalize()
          .multiplyScalar(repulsionStrength / (distance * distance + 1));
        acceleration.add(force.multiplyScalar(0.00001));

        // Update velocity and position
        velocity.add(acceleration);
        velocity.multiplyScalar(0.99); // Damping
        position.add(velocity);

        // Boundary check (same as before)
        const bound = 200;
        if (
          Math.abs(position.x) > bound ||
          Math.abs(position.y) > bound ||
          Math.abs(position.z) > bound
        ) {
          position.set(
            Math.sign(position.x) * bound,
            Math.sign(position.y) * bound,
            Math.sign(position.z) * bound
          );
          velocity.multiplyScalar(-0.5); // Bounce off the boundaries
        }
      } else {
        // Return to original position (same as before)
        const returnStrength = 0.05;
        position.lerp(originalPosition, returnStrength);
        velocity.multiplyScalar(0.95); // Slow down
      }

      // Update instance
      dummy.position.copy(position);
      dummy.scale.setScalar(size * (1 + Math.sin(time * 2 + i) * 0.1)); // Pulsating size
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);

      // Update color (same as before)
      const targetColor = isChaoticMode
        ? new THREE.Color().setHSL((time * 0.1 + i * 0.001) % 1, 0.7, 0.5)
        : new THREE.Color(0x4a90e2); // Original blue color
      color.lerp(targetColor, 0.1);
      color.toArray(colorArray, i * 3);
      sizeArray[i] = size;
    });

    mesh.current.instanceMatrix.needsUpdate = true;
    mesh.current.geometry.attributes.color.needsUpdate = true;
    mesh.current.geometry.attributes.size.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 16, 16]}>
        <instancedBufferAttribute
          attach="attributes-color"
          args={[colorArray, 3]}
        />
        <instancedBufferAttribute
          attach="attributes-size"
          args={[sizeArray, 1]}
        />
      </sphereGeometry>
      <meshPhongMaterial vertexColors size={2} sizeAttenuation />
    </instancedMesh>
  );
};

const ChaoticParticleAnimation = () => {
  const [isChaoticMode, setIsChaoticMode] = useState(true);
  const [shape, setShape] = useState("sphere");

  const handleCanvasClick = () => {
    setIsChaoticMode((prev) => !prev);
  };

  return (
    <>
      <ControlPanel shape={shape} setShape={setShape} />
      <Canvas
        camera={{ position: [0, 0, 300], fov: 75 }}
        onClick={handleCanvasClick}
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Particles count={5000} isChaoticMode={isChaoticMode} shape={shape} />
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          enableRotate={true}
          zoomSpeed={0.5}
          panSpeed={0.5}
          rotateSpeed={0.5}
        />
      </Canvas>
    </>
  );
};

export default ChaoticParticleAnimation;
