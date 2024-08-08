import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";

import { styles } from "../styles";
import { navLinks } from "../constants";
import { logo, menu, close } from "../assets";

const Navbar = () => {
  const [active, setActive] = useState("");
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const navRef = useRef(null);

  useEffect(() => {
    let lastScrollTop = 0;

    const handleScroll = () => {
      const scrollTop = window.scrollY;

      if (scrollTop > lastScrollTop) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;

      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSmoothScroll = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  useEffect(() => {
    const tl = gsap.timeline({ ease: "power3.inOut" });
    const navLinks = document.querySelectorAll(".nav-link");

    if (toggle) {
      tl.to(navRef.current, {
        height: "100vh",
        duration: 0.5,
        ease: "power3.inOut",
        zIndex: 1000,
      })
        .fromTo(
          navLinks,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, stagger: 0.1, duration: 0.3 }
        )
        .set("body", { overflow: "hidden" });
    } else {
      tl.to(navRef.current, { height: "auto", duration: 0.5 })
        .to(navLinks, { opacity: 0, y: -20, stagger: 0.1 })
        .set("body", { overflow: "auto" });
    }
  }, [toggle]);

  return (
    <nav
      ref={navRef}
      className={`${styles.paddingX} w-full fixed top-0 z-20 
        ${scrolled ? "bg-primary" : "bg-transparent"} 
        ${showNavbar ? "translate-y-0" : "-translate-y-full"} 
        transition-all duration-300 ease-in-out`}
    >
      <div className="w-full flex justify-between items-center py-5 max-w-7xl mx-auto font-jedi">
        <Link
          to="/"
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => {
            setActive("");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <p className="text-white text-[25px] font-bold flex font-jedi">
            Ashish
            <span className="sm:block hidden"></span>
          </p>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((nav) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-slate-400"
              } hover:text-white text-[20px] font-medium cursor-pointer font-jedi`}
              onClick={() => {
                setActive(nav.title);
                handleSmoothScroll(nav.id);
              }}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
          <li>
            <a
              href="https://drive.google.com/file/d/1vp-26MLxhbzcyXBRftmmnPclwl9ZHEQK/view?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[18px] font-medium cursor-pointer text-slate-400 hover:text-white font-jedi"
            >
              Resume
            </a>
          </li>
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer z-50 relative"
            onClick={() => setToggle(!toggle)}
          />

          <div
            className={`fixed top-0 left-0 w-full h-screen bg-black/90  
              ${
                toggle
                  ? "opacity-100 pointer-events-auto"
                  : "opacity-0 pointer-events-none"
              } transition-all duration-500 ease-in-out flex justify-center items-center`}
          >
            <ul className="text-center flex flex-col gap-10 text-3xl font-bold">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className="nav-link text-slate-400 hover:text-white cursor-pointer font-jedi"
                  onClick={() => {
                    setToggle(false);
                    setActive(nav.title);
                    handleSmoothScroll(nav.id);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
              <li className="nav-link">
                <a
                  href="https://drive.google.com/file/d/1vp-26MLxhbzcyXBRftmmnPclwl9ZHEQK/view?usp=sharing"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-400 hover:text-white cursor-pointer font-jedi"
                >
                  Resume
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
