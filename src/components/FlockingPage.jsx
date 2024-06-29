import FlockingAlgorithm from "./canvas/FlockingAlgorithm";
import ChaoticParticleAnimation from "./canvas/NameAnimation";

const FlockingPage = () => {
  return (
    <div className="relative z-0 bg-primary w-screen h-[90vh]">
      {/* <FlockingAlgorithm /> */}
      <ChaoticParticleAnimation />  
    </div>
  );
};

export default FlockingPage;