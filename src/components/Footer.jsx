import React from "react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer h-full w-full bg-gray-900 rounded-2xl bg-clip-padding backdrop-filter backdrop-blur-none bg-opacity-70 border border-gray-100 rounded-lg z-20">
      {/* Social media icons */}
      <div className="flex justify-center mt-9">
        <a
          href="https://github.com/Akm592"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white  hover:text-red transition duration-200 ease-in-out mx-3 "
        >
          <FaGithub className="w-7 h-7" />
        </a>
        <a
          href="https://www.linkedin.com/in/ashish-kumar-mishra-a286a2224/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-red transition duration-200 ease-in-out mx-3"
        >
          <FaLinkedin className="w-7 h-7" />
        </a>
        <a
          href="https://twitter.com/AKM957"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white hover:text-red transition duration-200 ease-in-out mx-3"
        >
          <FaTwitter className="w-7 h-7" />
        </a>
      </div>

      {/* Copyright section */}
      <div className="bg-neutral-300 p-4 text-center text-neutral-700 dark:bg-inherit dark:text-neutral-200 z-10">
        © 2023 Copyright:
        <a className="text-neutral-800 dark:text-neutral-400" href="#!">
          Ashish Kumar Mishra
        </a>
      </div>
    </footer>
  );
}

export default Footer;
