import React, { useState, useEffect, forwardRef, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Settings, ChevronLeft, ChevronRight } from "lucide-react";

const Interface = forwardRef(
  (
    {
      canStart,
      started,
      animationEnded,
      playbackOn,
      time,
      maxTime,
      settings = {}, // Provide a default empty object
      loading,
      timeChanged,
      changeRadius,
      changeAlgorithm,
      setSettings,
      startPathfinding,
      toggleAnimation,
      clearPath,
    },
    ref
  ) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const sidebarRef = useRef(null);

    useEffect(() => {
      const handleKeyPress = (e) => {
        if (e.code === "Space") {
          e.preventDefault();
          handlePlay();
        } else if (e.code === "KeyR" && (animationEnded || !started)) {
          clearPath();
        }
      };

      window.addEventListener("keydown", handleKeyPress);
      return () => window.removeEventListener("keydown", handleKeyPress);
    }, [animationEnded, started, clearPath]);

    useEffect(() => {
      const handleClickOutside = (event) => {
        if (
          sidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target)
        ) {
          setSidebarOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [sidebarOpen]);

    const handlePlay = () => {
      if (!canStart) return;
      if (!started && time === 0) {
        startPathfinding();
      } else {
        toggleAnimation();
      }
    };

    const handleRadiusChange = (value) => {
      setSettings((prev) => ({ ...prev, radius: value }));
      changeRadius(value);
    };

    return (
      <div className="fixed inset-0 p-4 flex flex-col justify-end pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4 pointer-events-auto"
        >
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => timeChanged(Math.max(0, time - 1))}
              disabled={!animationEnded || time <= 0}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handlePlay}
              disabled={!canStart}
              className="p-4 bg-blue-600 text-white rounded-full hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {!started || (animationEnded && !playbackOn) ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6" />
              )}
            </button>
            <button
              onClick={() => timeChanged(Math.min(maxTime, time + 1))}
              disabled={!animationEnded || time >= maxTime}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
          </div>

          <div className="flex justify-center">
            <input
              type="range"
              min={0}
              max={maxTime}
              value={animationEnded ? time : maxTime}
              onChange={(e) => timeChanged(Number(e.target.value))}
              disabled={!animationEnded}
              className="w-full max-w-md"
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={clearPath}
              disabled={!animationEnded && started}
              className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear path
            </button>
          </div>
        </motion.div>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50"
            >
              <div className="w-16 h-16 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
            </motion.div>
          )}
        </AnimatePresence>

        {sidebarOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 pointer-events-auto">
            <div
              ref={sidebarRef}
              className="absolute left-0 top-0 bottom-0 w-64 bg-gray-900 p-4 overflow-y-auto text-white"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-blue-400">Settings</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="algorithm"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Algorithm
                  </label>
                  <select
                    id="algorithm"
                    value={settings.algorithm || "astar"}
                    onChange={(e) => changeAlgorithm(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-white bg-gray-800 border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="astar">A* algorithm</option>
                    <option value="greedy">Greedy algorithm</option>
                    <option value="dijkstra">Dijkstra algorithm</option>
                    <option value="bidirectional">
                      Bidirectional Search algorithm
                    </option>
                    {/* <option value="bellmanford">Bellman-Ford algorithm</option>
                    <option value="floydwarshall">Floyd-Warshall algorithm</option>
                    <option value="jump">Jump Point Search algorithm</option>
                    <option value="bidirectionalAstar"> Bidirectional A* algorithm</option>  */}

                  </select>
                </div>
                <div>
                  <label
                    htmlFor="radius"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Area radius: {settings.radius || 10}km (
                    {((settings.radius || 10) / 1.609).toFixed(1)}mi)
                  </label>
                  <input
                    type="range"
                    id="radius"
                    min={2}
                    max={20}
                    step={1}
                    value={settings.radius || 10}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    disabled={started && !animationEnded}
                    className="mt-1 block w-full"
                  />
                </div>
                <div>
                  <label
                    htmlFor="speed"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Animation speed
                  </label>
                  <input
                    type="range"
                    id="speed"
                    min={1}
                    max={30}
                    value={settings.speed || 15}
                    onChange={(e) =>
                      setSettings((prev) => ({
                        ...prev,
                        speed: Number(e.target.value),
                      }))
                    }
                    className="mt-1 block w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Interface.displayName = "Interface";

export default Interface;
