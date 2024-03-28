import { useRef, useState, useEffect } from "react";
import * as THREE from "three";

const TextPoints = () => {
  const groupRef = useRef();
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

  useEffect(() => {
    const fontLoader = new THREE.FontLoader();
    fontLoader.load(
      "/font.json",
      (font) => {
        const textGeometry = new THREE.TextBufferGeometry("Ashish", {
          font: font,
          size: 4,
          height: 1,
        });
        const pointsMaterial = new THREE.PointsMaterial({
          size: 0.05,
          sizeAttenuation: true,
          transparent: true,
          opacity: 1 - Math.min(scrollY / 500, 1),
          color: new THREE.Color("#ffffff"),
        });
        const textPoints = new THREE.Points(textGeometry, pointsMaterial);
        groupRef.current.add(textPoints);
      },
      undefined,
      (error) => {
        console.error(error);
      }
    );
  }, [scrollY]);

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta / 10;
    groupRef.current.position.y = -scrollY / 50;
  });

  return <group ref={groupRef} />;
};

const PointsCanvas = () => {
  return (
    <div className="w-full fixed top-0 left-0 z-[-1]">
      <Canvas camera={{ position: [0, 0, 0], fov: 70 }}>
        <TextPoints />
      </Canvas>
    </div>
  );
};

export default PointsCanvas;
