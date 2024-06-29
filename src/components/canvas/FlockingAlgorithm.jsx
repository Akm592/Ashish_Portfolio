import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, extend } from "@react-three/fiber";
import * as THREE from "three";
import { OrbitControls, Effects } from "@react-three/drei";
import Random from "canvas-sketch-util/random";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

extend({ UnrealBloomPass });

// Flocking behavior parameters
const ALIGNMENT_STRENGTH = 0.08;
const COHESION_STRENGTH = 0.05;
const SEPARATION_DISTANCE = 0.2;
const SEPARATION_STRENGTH = 0.15;
const MAX_SPEED = 0.5;
const NEIGHBOR_RADIUS = 1.5;

// Create a custom shader material for the glowing boids
const GlowingBoidMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uColor1: { value: new THREE.Color("#8AA2FF") },
    uColor2: { value: new THREE.Color("#FF80BF") },
  },
  vertexShader: `
    uniform float uTime;
    varying float vProgress;
    varying vec3 vPosition;
    
    void main() {
      vPosition = position;
      vProgress = sin(uTime * position.x * 2.0) * cos(uTime * position.y); 
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * mvPosition;
      gl_PointSize = 10.0 / -mvPosition.z;
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying float vProgress;
    varying vec3 vPosition;

    void main() {
      vec3 color = mix(uColor1, uColor2, vProgress);
      vec2 center = gl_PointCoord - 0.5;
      float dist = length(center);
      float strength = 1.0 - smoothstep(0.0, 0.5, dist);
      float pulse = (sin(uTime * 3.0 + vPosition.x * 10.0) + 1.0) * 0.5;
      strength *= 0.7 + 0.3 * pulse;
      gl_FragColor = vec4(color, 1.0) * strength;
    }
  `,
  transparent: true,
  blending: THREE.AdditiveBlending,
});

// Flocking Boid class
class Boid {
  constructor(initialPosition) {
    this.position = initialPosition || new THREE.Vector3();
    this.velocity = new THREE.Vector3(
      Random.range(-0.1, 0.1),
      Random.range(-0.1, 0.1),
      Random.range(-0.1, 0.1)
    );
    this.acceleration = new THREE.Vector3();
  }

  update(boids) {
    this.flock(boids);
    this.velocity.add(this.acceleration);
    this.velocity.clampLength(0, MAX_SPEED);
    this.position.add(this.velocity);

    this.position.x = ((this.position.x + 5) % 10) - 5;
    this.position.y = ((this.position.y + 5) % 10) - 5;
    this.position.z = ((this.position.z + 5) % 10) - 5;

    this.acceleration.multiplyScalar(0);
  }

  flock(boids) {
    const alignment = this.align(boids);
    const cohesion = this.cohere(boids);
    const separation = this.separate(boids);

    this.acceleration.add(alignment);
    this.acceleration.add(cohesion);
    this.acceleration.add(separation);
  }

  align(boids) {
    const steering = new THREE.Vector3();
    let total = 0;
    for (const other of boids) {
      if (
        other !== this &&
        this.position.distanceTo(other.position) < NEIGHBOR_RADIUS
      ) {
        steering.add(other.velocity);
        total++;
      }
    }
    if (total > 0) {
      steering.divideScalar(total);
      steering.normalize();
      steering.multiplyScalar(MAX_SPEED);
      steering.sub(this.velocity);
      steering.multiplyScalar(ALIGNMENT_STRENGTH);
    }
    return steering;
  }

  cohere(boids) {
    const steering = new THREE.Vector3();
    let total = 0;
    for (const other of boids) {
      if (
        other !== this &&
        this.position.distanceTo(other.position) < NEIGHBOR_RADIUS
      ) {
        steering.add(other.position);
        total++;
      }
    }
    if (total > 0) {
      steering.divideScalar(total);
      steering.sub(this.position);
      steering.normalize();
      steering.multiplyScalar(MAX_SPEED);
      steering.sub(this.velocity);
      steering.multiplyScalar(COHESION_STRENGTH);
    }
    return steering;
  }

  separate(boids) {
    const steering = new THREE.Vector3();
    let total = 0;
    for (const other of boids) {
      const distance = this.position.distanceTo(other.position);
      if (other !== this && distance < SEPARATION_DISTANCE) {
        const diff = new THREE.Vector3().subVectors(
          this.position,
          other.position
        );
        diff.normalize();
        diff.divideScalar(distance);
        steering.add(diff);
        total++;
      }
    }
    if (total > 0) {
      steering.divideScalar(total);
      steering.normalize();
      steering.multiplyScalar(MAX_SPEED);
      steering.sub(this.velocity);
      steering.multiplyScalar(SEPARATION_STRENGTH);
    }
    return steering;
  }
}

const FlockingParticles = () => {
  const pointsRef = useRef();
  const boidCount = 1000;

  const boids = useMemo(() => {
    return Array.from({ length: boidCount }, () => {
      const position = new THREE.Vector3(
        Random.range(-5, 5),
        Random.range(-5, 5),
        Random.range(-5, 5)
      );
      return new Boid(position);
    });
  }, []);

  const positions = useMemo(() => {
    return Float32Array.from(boids.flatMap((boid) => boid.position.toArray()));
  }, [boids]);

  useFrame((state) => {
    boids.forEach((boid) => boid.update(boids));

    const pointsPositions =
      pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < boidCount; i++) {
      pointsPositions[i * 3 + 0] = boids[i].position.x;
      pointsPositions[i * 3 + 1] = boids[i].position.y;
      pointsPositions[i * 3 + 2] = boids[i].position.z;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    GlowingBoidMaterial.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
         
          array={positions}
          count={positions.length / 3}
          itemSize={3}
        />
      </bufferGeometry>
      <shaderMaterial
        uniforms={GlowingBoidMaterial.uniforms}
        vertexShader={GlowingBoidMaterial.vertexShader}
        fragmentShader={GlowingBoidMaterial.fragmentShader}
        transparent={true}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const FlockingAlgorithm = () => {
  return (
    <Canvas camera={{ position: [0, 0, 10] }}>
      <FlockingParticles />
      <OrbitControls />
      <Effects>
        <unrealBloomPass threshold={0.1} strength={1} radius={30} />
      </Effects>
    </Canvas>
  );
};

export default FlockingAlgorithm;
