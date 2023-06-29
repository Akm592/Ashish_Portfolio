import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";
import "./icons.css";
function Icons() {
  return (
    <>
    <div className="icons">
      <a   
        
        href="https://github.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaGithub className="icon" />
      </a>
      <a 
        href="https://www.linkedin.com/in/ashish-kumar-mishra-a286a2224/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaLinkedin className="icon" />
      </a>
      <a
        href="https://twitter.com/yourusername"
        target="_blank"
        rel="noopener noreferrer"
      >
        <FaTwitter className="icon" />
      </a>
      </div>
    </>
  );
}

export default Icons;
