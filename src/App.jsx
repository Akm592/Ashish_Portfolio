import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  // Feedbacks, // Not used in this code, remove if unnecessary
  Hero,
  Navbar,
  // Tech, // Not used in this code, remove if unnecessary
  Works,
  StarsCanvas,
  Footer,
  AnimCursor,
  FlappyBirdGame
} from "./components";
import FlockingPage from "./components/FlockingPage";
import Preloader from "./components/Preloader";

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
      {loading ? (
        <Preloader />
      ) : (
        <>
          <AnimCursor />
          <Navbar />{" "}
          {/* Navbar is outside the Routes component to be always visible */}
          <Routes>
            <Route
              path="/"
              element={
                <div className="relative z-0 bg-primary">
                  <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                    <Hero />
                  </div>
                  <About />
                  <Experience />
                  <Works />
                  <div className="relative z-1">
                    <Contact />
                    <StarsCanvas />
                  </div>
                </div>
              }
            />
            <Route path="/flocking" element={<FlockingPage />} />
            <Route path="/flappy-bird" element={<FlappyBirdGame />} />
          </Routes>
          <div className="relative z-0">
            <Footer />
          </div>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;
