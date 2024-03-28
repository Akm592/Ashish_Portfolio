import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { navLinks } from '../constants'; // Import your navigation links

const Overlay = ({ isOpen, onClose }) => {
  const overlayRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, {
        duration: 0.5,
        opacity: 1,
        ease: 'power3.inOut',
      });
    } else {
      gsap.to(overlayRef.current, {
        duration: 0.5,
        opacity: 0,
        ease: 'power3.inOut',
        onComplete: onClose, // Call the onClose callback when animation completes
      });
    }
  }, [isOpen, onClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50"
    >
      <div className="absolute top-0 right-0 p-5">
        <button onClick={onClose}>
          <img src="/close.svg" alt="Close" />
        </button>
      </div>
      <ul className="flex flex-col items-center justify-center h-full space-y-5">
        {navLinks.map((nav) => (
          <li key={nav.id}>
            <a
              href={nav.url}
              className="text-2xl text-white"
              onClick={onClose}
            >
              {nav.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Overlay;