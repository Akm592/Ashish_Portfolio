import React from "react";
import {Tilt} from "react-tilt";
import { motion } from "framer-motion";

import { styles } from "../styles";
import { services } from "../constants";
import { SectionWrapper } from "../hoc";
import { fadeIn, textVariant } from "../utils/motion";
import { Me } from "../assets";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa"; 

const ServiceCard = ({ index, title, icon }) => (
  <Tilt className="xs:w-[250px] w-full">
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full bg-gray-900 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-70 border border-gray-100 rounded-lg p-[1px] rounded-[20px] shadow-card"
    >
      <div
        options={{
          max: 45,
          scale: 1,
          speed: 450,
        }}
        className="bg-grey rounded-[25px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <img
          src={icon}
          alt="web-development"
          className="w-16 h-16 object-contain"
        />

        <h3 className="text-white text-[20px] font-bold text-center font-jedi">
          {title}
        </h3>
      </div>
    </motion.div>
  </Tilt>
);

const About = () => {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>Overview.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-slate-400 text-[17px] max-w-3xl leading-[30px]"
      >
        <img
          src={Me}
          alt="me"
          class="w-40 h-40 rounded-full object-cover 
            shadow-lg shadow-slate-500/50 
            filter drop-shadow-lg drop-shadow-yellow-500/10
            shadow-card"
        />
        <h1 className="mt-6">
          I'm a results-driven web developer with a knack for transforming ideas
          into engaging web applications. My portfolio demonstrates my
          proficiency in JavaScript, Python, and modern frameworks. Projects
          include interactive games, real-time communication tools, stunning 3D
          visualizations, and explorations in natural language processing (NLP).
          I'm eager to leverage my skills to solve unique challenges and deliver
          innovative web experiences.
        </h1>
    <div className="flex justify-start mt-9">
        <div className="flex justify-center mt-9">
          <a
            href="https://github.com/Akm592"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-red transition duration-200 ease-in-out mx-3 "
          >
            <FaGithub className="w-10 h-10" />
          </a>
          <a
            href="https://www.linkedin.com/in/ashish-kumar-mishra-a286a2224/"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-red transition duration-200 ease-in-out mx-3"
          >
            <FaLinkedin className="w-10 h-10" />
          </a>
          <a
            href="https://twitter.com/AKM957"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red transition duration-200 ease-in-out mx-3"
          >
            <FaTwitter className="w-10 h-10" />
          </a>
        </div>
      </div>
      </motion.p>

      <div className="mt-20 flex flex-wrap gap-10">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(About, "about");
