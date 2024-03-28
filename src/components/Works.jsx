import React, { useState, useEffect } from "react";
import { Tilt } from "react-tilt";
import { motion } from "framer-motion";
import { styles } from "../styles";
import { github } from "../assets";
import { SectionWrapper } from "../hoc";
import { projects, projects1 } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

const ProjectCard = ({ index, project }) => {
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);

  const handleClick = () => {
    setIsOverlayVisible(!isOverlayVisible);
  };

  return (
    <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
      <Tilt
        options={{ max: 45, scale: 1, speed: 450 }}
        className="h-full w-full bg-gray-900 rounded-2xl bg-clip-padding backdrop-filter  bg-opacity-50 border border-gray-100 border- backdrop-blur-sm p-5 sm:w-[300px]"
      >
        <div className="relative w-full h-[100]" onClick={handleClick}>
          <img
            src={project.image}
            alt="project_image"
            className="w-full h-full object-cover rounded-2xl"
          />
          <div className="absolute inset-0 flex justify-end m-3 card-img_hover">
            <div
              onClick={() => window.open(project.source_code_link, "_blank")}
              className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer"
            >
              <img
                src={github}
                alt="source code"
                className="w-1/2 h-1/2 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="mt-5">
          <h3 className="text-white font-bold text-[24px]">{project.name}</h3>
          <p className="mt-2 text-secondary text-[14px]">
            {project.description}
          </p>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <p
              key={`${project.name}-${tag.name}`}
              className={`text-[14px] ${tag.color}`}
            >
              #{tag.name}
            </p>
          ))}
        </div>
      </Tilt>
      {isOverlayVisible && (
        <Overlay project={project} onClose={() => setIsOverlayVisible(false)} />
      )}
    </motion.div>
  );
};

// Overlay component
const Overlay = ({ project, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10 "
      onClick={onClose}
    >
      <div className=" bg-gray-900 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-70 border border-gray-100 rounded-lg p-8 max-w-max h-5/6">
        <div className="relative">
          <img
            src={project.image}
            alt={project.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          <button
            className="absolute top-2 right-2 p-2 rounded-full bg-gray-200 hover:bg-gray-300"
            onClick={onClose}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h3 className="text-2xl font-bold mt-4">{project.name}</h3>
        <p className="mt-2 text-gray-600">{project.description1}</p>
        <div className="mt-4 flex flex-wrap gap-7">
          <a
            href={project.source_code_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 "
          >
            View Code
          </a>
          <a
            href={project.live_link}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 "
          >
            Live
          </a>
        </div>
      </div>
    </div>
  );
};

const Works = () => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>
      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          Following projects showcases my skills and experience through
          real-world examples of my work. Each project is briefly described with
          links to code repositories and live demos in it. It reflects my
          ability to solve complex problems, work with different technologies,
          and manage projects effectively.
        </motion.p>
      </div>
      <div className="mt-20 flex flex-wrap gap-24 ">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            project={project}
          />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Works, "");
