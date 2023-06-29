import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as random from "maath/random/dist/maath-random.esm";
import { useThree } from "@react-three/fiber";


const Stars = ({ scrollY, ...props }) => {
  const ref = useRef();
  const [sphere] = useState(() =>
    random.inSphere(new Float32Array(5000), { radius: 1.2 })
  );

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  useEffect(() => {
    gsap.to(ref.current.rotation, {
      duration: 1,
      x: scrollY / 10000,
      y: -scrollY / 5000,
      ease: "power3.out",
    });
  }, [scrollY]);

  return (
    <Points ref={ref} positions={sphere} {...props}>
      <PointMaterial
        transparent
        color="#ffffff"
        size={0.002}
        sizeAttenuation={true}
        depthWrite={false}
      />
    </Points>
  );
};


const StarsCanvas = () => {
  function Rig() {
    const { camera, mouse } = useThree();
    const vec = new THREE.Vector3();
    return useFrame(() =>
      camera.position.lerp(
        vec.set(mouse.x * 2, mouse.y * 1, camera.position.z),
        0.02
      )
    );
  }
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="w-full h-screen fixed top-0 left-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 0] }}>
        <Stars scrollY={scrollY} />
        
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
