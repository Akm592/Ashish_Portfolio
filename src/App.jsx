import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Hero,
  Navbar,
  Works,
  StarsCanvas,
  Footer,
  AnimCursor,
  FlappyBirdGame,
  MapPage,
} from "./components";
import FlockingPage from "./components/FlockingPage";
import Preloader from "./components/Preloader";
import FunProjects from "./components/FunProjects";
const ScrollManager = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === "/astar") {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [location]);

  return children;
};

const App = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 4000);
  }, []);

  return (
    <BrowserRouter>
      <ScrollManager>
        {loading ? (
          <Preloader />
        ) : (
          <>
            <AnimCursor />
            <Navbar />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <div className="relative z-0 bg-primary">
                      <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                        <Hero />
                      </div>
                      <About />
                      <Experience />
                      <Works />
                      <FunProjects />
                      <div className="relative z-1">
                        <Contact />
                        <StarsCanvas />
                      </div>
                    </div>
                    <Footer />
                  </>
                }
              />
              <Route path="/fun" element={<FunProjects />} />
              <Route
                path="/flocking"
                element={
                  <>
                    <FlockingPage />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/flappybird"
                element={
                  <>
                    <FlappyBirdGame />
                    <Footer />
                  </>
                }
              />
              <Route
                path="/pathfinder"
                element={
                  <div className="overflow:hidden">
                    <MapPage />
                  </div>
                }
              />
            </Routes>
          </>
        )}
      </ScrollManager>
    </BrowserRouter>
  );
};

export default App;
