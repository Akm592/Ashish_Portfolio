import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const TutorialPopup = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(0);

  const tutorialSteps = [
    {
      title: "Welcome to the Pathfinding Visualizer!",
      content:
        "This tutorial will guide you through the basic features of the application.",
    },
    {
      title: "Setting Start and End Points",
      content:
        "Click on the map to set the start point. Click again to set the end point.",
    },
    {
      title: "Choosing an Algorithm",
      content:
        "Open the settings menu and select an algorithm from the dropdown.",
    },
    {
      title: "Starting the Visualization",
      content:
        "Press the play button or hit the spacebar to start the pathfinding visualization.",
    },
    {
      title: "Adjusting Settings",
      content:
        "Use the settings menu to adjust the visualization speed, map radius, and more.",
    },
  ];

  const handleNext = () => {
    if (step < tutorialSteps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  const handlePrevious = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.9 }}
            className="bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {tutorialSteps[step].title}
              </h2>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            <p className="text-gray-300 mb-6">{tutorialSteps[step].content}</p>
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={step === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                {step === tutorialSteps.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TutorialPopup;
