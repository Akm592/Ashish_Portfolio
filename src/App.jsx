import { useState, useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import {
  About,
  Contact,
  Experience,
  Feedbacks,
  Hero,
  Navbar,
  Tech,
  Works,
  StarsCanvas,
  Footer,
  AnimCursor,
} from "./components";
import Preloader from "./components/Preloader";
import Test from "./components/Test";

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
          <div className="relative z-0 bg-primary">
            <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
              <Hero />
              <Navbar />
            </div>
            <About />
            <Experience />  
            {/*<Tech />*/}

            <Works />
            
            <div className="relative z-1">
              <Contact />
              {/*  */}
              <StarsCanvas />
            </div>
          </div>
          <div className="relative z-0">
          <Footer />
          </div>
        </>
      )}
    </BrowserRouter>
  );
};

export default App;

