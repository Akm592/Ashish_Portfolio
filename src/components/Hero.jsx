import { motion } from "framer-motion";
import { styles } from "../styles";

import ParticleSphere from "./ParticleSphere/ParticleSphere";
import Typewriter from "typewriter-effect";


function Hero() {
  return (
    <>
      <section className={`relative w-full h-screen mx-auto -z-1 `}>
        <div
          className={`absolute inset-0 top-[170px]  max-w-7xl mx-auto ${styles.paddingX} flex flex-row items-start gap-5 `}
        >
          <div className="flex flex-col justify-center items-center mt-5 ">
            <div className="w-5 h-5 rounded-full bg-gray-900  " />
            <div className="w-1 sm:h-80 h-40 violet-gradient" />
          </div>

          <div>
            <h1 className={`${styles.heroHeadText} text-white font-jedi`}>
              Hi, I'm{" "}
              <span className="text-transparent text-8xl bg-clip-text bg-gradient-to-r from-gray-400 to-gray-600  font-jedi">
                Ashish
              </span>
            </h1>
            <span className={`${styles.heroHeadText}`}>
              <Typewriter
                options={{
                  autoStart: true,
                  loop: true,
                  delay: 150,
                  deleteSpeed: 20,
                }}
                onInit={(typewriter) => {
                  typewriter
                    .typeString("Web Developer")
                    .pauseFor(200)
                    .deleteAll()
                    .typeString("Frontend Developer")
                    .pauseFor(200)
                    .deleteAll()
                    .typeString("ML Engineer")
                    .pauseFor(200)
                    .deleteAll()
                    .typeString("Freelancer")
                    .pauseFor(200)

                    .deleteAll()
                    .start();
                }}
              />
            </span>
          </div>
        </div>

        <ParticleSphere />

        <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
          <a href="#about">
            <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
              <motion.div
                animate={{
                  y: [0, 24, 0],
                }}
                transition={{
                  duration: 1.0,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="w-3 h-3 rounded-full bg-secondary mb-1"
              />
            </div>
          </a>
        </div>
      </section>
    </>
  );
}
export default Hero;
