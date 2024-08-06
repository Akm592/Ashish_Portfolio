import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Stars, Rocket, Atom } from "lucide-react";
import { fun1, fun2, fun3 } from "../assets"; // Import the images

gsap.registerPlugin(ScrollTrigger);

const ProjectCard = ({ title, description, image, link, index }) => {
  const cardRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      {
        opacity: 0,
        y: 100,
        rotation: index % 2 === 0 ? -5 : 5,
        scale: 0.8,
      },
      {
        duration: 1,
        opacity: 1,
        y: 0,
        rotation: 0,
        scale: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom-=100",
          end: "bottom center",
          toggleActions: "play none none reverse",
          scrub: 1,
        },
      }
    );
  }, [index]);

  const Icon = index === 0 ? Stars : index === 1 ? Rocket : Atom;

  return (
    <div
      ref={cardRef}
      className={`absolute w-[90%] max-w-[500px] bg-[rgba(13,23,64,0.16)] p-6 rounded-3xl backdrop-blur-md shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105`}
      style={{
        top: `${index * 25}%`, // Increased spacing
        left: index % 2 === 0 ? "5%" : "auto",
        right: index % 2 !== 0 ? "5%" : "auto",
        zIndex: 10 - index,
        boxShadow:
          "0 0 20px rgba(65, 105, 225, 0.5), 0 0 30px rgba(65, 105, 225, 0.3), 0 0 40px rgba(65, 105, 225, 0.1)", // Glowing effect
        border: "2px solid rgba(65, 105, 225, 0.5)", // Glowing border
      }}
    >
      <div className="relative w-full h-[200px] overflow-hidden rounded-2xl mb-4">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 bg-[rgba(13,23,64,0.7)] p-3 rounded-full">
          <Icon className="text-yellow-300" size={24} />
        </div>
      </div>
      <h3 className="text-white font-bold text-[28px] mb-2">{title}</h3>
      <p className="text-[#a6b2ec] text-[16px] mb-4">{description}</p>
      <Link
        to={link}
        className="inline-block bg-[#4169e1] py-3 px-8 text-white font-bold shadow-md shadow-[#4169e1]/50 rounded-xl hover:bg-[#3a5cd1] transition-colors duration-300"
      >
        Explore
      </Link>
    </div>
  );
};

const FunProjects = () => {
  const projects = [
    {
      title: "Cosmic Flocking",
      description:
        "Witness the mesmerizing dance of celestial bodies in this immersive simulation.",
      image: fun1,
      link: "/flocking",
    },
    {
      title: "Nebula Navigator",
      description:
        "Pilot your spacecraft through treacherous nebulae in this thrilling space adventure.",
      image: fun2,
      link: "/flappybird",
    },
    {
      title: "Quantum Pathfinder",
      description:
        "Unravel the mysteries of quantum space-time and chart impossible courses across the universe.",
      image: fun3,
      link: "/pathfinder",
    },
  ];

  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".section-title", {
        duration: 1.5,
        y: 100,
        opacity: 0,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className=" min-h-screen relative overflow-hidden py-20"
    >
      <div className="absolute inset-0 opacity-20"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[rgba(142,187,255,0.1)] to-transparent"></div>
      <div className={`relative z-10 max-w-7xl mx-auto px-6 sm:px-16`}>
        <div className="section-title text-center mb-32">
          <p className="sm:text-[20px] text-[16px] text-[#4169e1] uppercase tracking-wider mb-4">
            Embark on Cosmic Adventures
          </p>
          <h2 className="text-white font-black md:text-[72px] sm:text-[60px] xs:text-[50px] text-[40px] leading-tight">
            Galactic Projects
          </h2>
        </div>

        <div className="relative h-[1200px]">
          {" "}
          {/* Increased height to accommodate more spacing */}
          {projects.map((project, index) => (
            <ProjectCard key={`project-${index}`} {...project} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FunProjects;
