import React from "react";
import { Settings, Shapes } from "lucide-react";

const ControlPanel = ({ shape, setShape, isChaoticMode, setIsChaoticMode }) => {
  return (
    <div
      style={{
        position: "absolute",
        bottom: "20px",
        left: "20px",
        zIndex: 1000,
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Shapes size={24} color="#fff" />
        <select value={shape} onChange={(e) => setShape(e.target.value)}>
          <option value="sphere">Sphere</option>
          <option value="cylinder">Spiral</option>
          <option value="cube">Cube</option>
          <option value="spiral">Cylinder</option>
          <option value="spring">Spring</option>
        </select>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Settings size={24} color="#fff" />
        <button
          onClick={() => setIsChaoticMode((prev) => !prev)}
          style={{
            padding: "8px 16px",
            borderRadius: "6px",
            border: "none",
            background: isChaoticMode ? "#4a90e2" : "rgba(255, 255, 255, 0.2)",
            color: "#fff",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s ease",
          }}
        >
          {isChaoticMode ? "Chaotic Mode" : "Normal Mode"}
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;
