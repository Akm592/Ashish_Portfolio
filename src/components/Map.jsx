import React, { useEffect, useRef, useState } from "react";
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { PolygonLayer, ScatterplotLayer } from "@deck.gl/layers";
import { FlyToInterpolator } from "deck.gl";
import { TripsLayer } from "@deck.gl/geo-layers";
import { createGeoJSONCircle } from "../helpers";
import {
  getBoundingBoxFromPolygon,
  getMapGraph,
  getNearestNode,
} from "../services/MapService";
import PathfindingState from "../models/PathfindingState";
import Interface from "./Interface";
import { INITIAL_COLORS, INITIAL_VIEW_STATE } from "../config";
import useSmoothStateChange from "../hooks/useSmoothStateChange";

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json";

function Map() {
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [selectionRadius, setSelectionRadius] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [started, setStarted] = useState(false);
  const [time, setTime] = useState(0);
  const [animationEnded, setAnimationEnded] = useState(false);
  const [playbackOn, setPlaybackOn] = useState(false);
  const [playbackDirection, setPlaybackDirection] = useState(1);
  const [fadeRadiusReverse, setFadeRadiusReverse] = useState(false);
  const [cinematic, setCinematic] = useState(false);
  const [placeEnd, setPlaceEnd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settings, setSettings] = useState({
    algorithm: "astar",
    radius: 4,
    speed: 5,
  });
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [trailEffect, setTrailEffect] = useState({
    pulseSpeed: 0.1,
    glowIntensity: 2.5,
    trailLength: 5000,
  });

  const ui = useRef();
  const fadeRadius = useRef();
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const timer = useRef(0);
  const waypoints = useRef([]);
  const state = useRef(new PathfindingState());
  const traceNode = useRef(null);
  const traceNode2 = useRef(null);
  const selectionRadiusOpacity = useSmoothStateChange(
    0,
    0,
    1,
    400,
    fadeRadius.current,
    fadeRadiusReverse
  );

  async function mapClick(e, info, radius = null) {
    if (started && !animationEnded) return;

    setFadeRadiusReverse(false);
    fadeRadius.current = true;
    clearPath();

    if (info.rightButton || placeEnd) {
      if (e.layer?.id !== "selection-radius") {
        ui.current.showSnack(
          "Please select a point inside the radius.",
          "info"
        );
        return;
      }

      if (loading) {
        ui.current.showSnack("Please wait for all data to load.", "info");
        return;
      }

      const loadingHandle = setTimeout(() => {
        setLoading(true);
      }, 300);

      const node = await getNearestNode(e.coordinate[1], e.coordinate[0]);
      if (!node) {
        ui.current.showSnack(
          "No path was found in the vicinity, please try another location."
        );
        clearTimeout(loadingHandle);
        setLoading(false);
        return;
      }

      const realEndNode = state.current.getNode(node.id);
      setEndNode(node);

      clearTimeout(loadingHandle);
      setLoading(false);

      if (!realEndNode) {
        ui.current.showSnack("An error occurred. Please try again.");
        return;
      }
      state.current.endNode = realEndNode;

      return;
    }

    const loadingHandle = setTimeout(() => {
      setLoading(true);
    }, 300);

    const node = await getNearestNode(e.coordinate[1], e.coordinate[0]);
    if (!node) {
      ui.current.showSnack(
        "No path was found in the vicinity, please try another location."
      );
      clearTimeout(loadingHandle);
      setLoading(false);
      return;
    }

    setStartNode(node);
    setEndNode(null);
    const circle = createGeoJSONCircle(
      [node.lon, node.lat],
      radius ?? settings.radius
    );
    setSelectionRadius([{ contour: circle }]);

    getMapGraph(getBoundingBoxFromPolygon(circle), node.id).then((graph) => {
      state.current.graph = graph;
      clearPath();
      clearTimeout(loadingHandle);
      setLoading(false);
    });
  }

  function startPathfinding() {
    setFadeRadiusReverse(true);
    setTimeout(() => {
      clearPath();
      state.current.start(settings.algorithm);
      setStarted(true);
    }, 400);
  }

  function toggleAnimation(loop = true, direction = 1) {
    if (time === 0 && !animationEnded) return;
    setPlaybackDirection(direction);
    if (animationEnded) {
      if (loop && time >= timer.current) {
        setTime(0);
      }
      setStarted(true);
      setPlaybackOn(!playbackOn);
      return;
    }
    setStarted(!started);
    if (started) {
      previousTimeRef.current = null;
    }
  }

  function clearPath() {
    setStarted(false);
    setTripsData([]);
    setTime(0);
    state.current.reset();
    waypoints.current = [];
    timer.current = 0;
    previousTimeRef.current = null;
    traceNode.current = null;
    traceNode2.current = null;
    setAnimationEnded(false);
  }

  function animateStep(newTime) {
    const updatedNodes = state.current.nextStep();
    for (const updatedNode of updatedNodes) {
      updateWaypoints(updatedNode, updatedNode.referer);
    }

    if (state.current.finished && !animationEnded) {
      if (settings.algorithm === "bidirectional") {
        if (!traceNode.current) traceNode.current = updatedNodes[0];
        const parentNode = traceNode.current.parent;
        updateWaypoints(
          parentNode,
          traceNode.current,
          "route",
          Math.max(Math.log2(settings.speed), 1)
        );
        traceNode.current = parentNode ?? traceNode.current;

        if (!traceNode2.current) {
          traceNode2.current = updatedNodes[0];
          traceNode2.current.parent = traceNode2.current.prevParent;
        }
        const parentNode2 = traceNode2.current.parent;
        updateWaypoints(
          parentNode2,
          traceNode2.current,
          "route",
          Math.max(Math.log2(settings.speed), 1)
        );
        traceNode2.current = parentNode2 ?? traceNode2.current;
        setAnimationEnded(
          time >= timer.current && parentNode == null && parentNode2 == null
        );
      } else {
        if (!traceNode.current) traceNode.current = state.current.endNode;
        const parentNode = traceNode.current.parent;
        updateWaypoints(
          parentNode,
          traceNode.current,
          "route",
          Math.max(Math.log2(settings.speed), 1)
        );
        traceNode.current = parentNode ?? traceNode.current;
        setAnimationEnded(time >= timer.current && parentNode == null);
      }
    }

    if (previousTimeRef.current != null && !animationEnded) {
      const deltaTime = newTime - previousTimeRef.current;
      setTime((prevTime) => prevTime + deltaTime * playbackDirection);
    }

    if (previousTimeRef.current != null && animationEnded && playbackOn) {
      const deltaTime = newTime - previousTimeRef.current;
      if (time >= timer.current && playbackDirection !== -1) {
        setPlaybackOn(false);
      }
      setTime((prevTime) =>
        Math.max(
          Math.min(prevTime + deltaTime * 2 * playbackDirection, timer.current),
          0
        )
      );
    }
  }

  function animate(newTime) {
    for (let i = 0; i < settings.speed; i++) {
      animateStep(newTime);
    }

    previousTimeRef.current = newTime;
    requestRef.current = requestAnimationFrame(animate);
  }

  function updateWaypoints(
    node,
    refererNode,
    color = "path",
    timeMultiplier = 1
  ) {
    if (!node || !refererNode) return;
    const distance = Math.hypot(
      node.longitude - refererNode.longitude,
      node.latitude - refererNode.latitude
    );
    const timeAdd = distance * 50000 * timeMultiplier;

    waypoints.current = [
      ...waypoints.current,
      {
        path: [
          [refererNode.longitude, refererNode.latitude],
          [node.longitude, node.latitude],
        ],
        timestamps: [timer.current, timer.current + timeAdd],
        color,
      },
    ];

    timer.current += timeAdd;
    setTripsData(() => waypoints.current);
  }

  function changeLocation(location) {
    setViewState({
      ...viewState,
      longitude: location.longitude,
      latitude: location.latitude,
      zoom: 13,
      transitionDuration: 1,
      transitionInterpolator: new FlyToInterpolator(),
    });
  }

  function changeSettings(newSettings) {
    setSettings(newSettings);
    const items = { settings: newSettings, colors };
    localStorage.setItem("path_settings", JSON.stringify(items));
  }

  function changeColors(newColors) {
    setColors(newColors);
    const items = { settings, colors: newColors };
    localStorage.setItem("path_settings", JSON.stringify(items));
  }

  function changeAlgorithm(algorithm) {
    clearPath();
    changeSettings({ ...settings, algorithm });
  }

  function changeRadius(radius) {
    changeSettings({ ...settings, radius });
    if (startNode) {
      mapClick({ coordinate: [startNode.lon, startNode.lat] }, {}, radius);
    }
  }

  useEffect(() => {
    if (!started) return;
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [started, time, animationEnded, playbackOn]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((res) => {
      changeLocation(res.coords);
    });

    const settings = localStorage.getItem("path_settings");
    if (!settings) return;
    const items = JSON.parse(settings);

    setSettings(items.settings);
    setColors(items.colors);
  }, []);

  return (
    <>
      <div
        onContextMenu={(e) => {
          e.preventDefault();
        }}
        className="w-full h-screen"
      >
        <DeckGL
          initialViewState={viewState}
          controller={{ doubleClickZoom: false, keyboard: false }}
          onClick={mapClick}
        >
          <PolygonLayer
            id={"selection-radius"}
            data={selectionRadius}
            pickable={true}
            stroked={true}
            getPolygon={(d) => d.contour}
            getFillColor={[80, 210, 0, 10]}
            getLineColor={[9, 142, 46, 175]}
            getLineWidth={3}
            opacity={selectionRadiusOpacity}
          />
          <TripsLayer
            id={"pathfinding-layer"}
            data={tripsData}
            opacity={1}
            widthMinPixels={4}
            widthMaxPixels={8}
            fadeTrail={false}
            trailLength={trailEffect.trailLength}
            currentTime={time}
            getColor={(d) => {
              const baseColor =
                d.color === "path" ? [0, 191, 255] : colors[d.color]; // Bright blue for paths

              if (d.color !== "path") return baseColor;

              const startTime = d.timestamps[0];
              const endTime = d.timestamps[1];
              const duration = endTime - startTime;
              const progress = (time - startTime) / duration;

              // Create a pulsating effect
              const pulse = Math.sin(time * trailEffect.pulseSpeed) * 0.5 + 0.5;

              // Apply the glow effect without fading
              const glowEffect = 1 + pulse * trailEffect.glowIntensity;

              return baseColor.map((c) => Math.min(255, c * glowEffect));
            }}
            updateTriggers={{
              getColor: [colors.path, colors.route, time, trailEffect],
            }}
          />
          <ScatterplotLayer
            id="start-end-points"
            data={[
              ...(startNode
                ? [
                    {
                      coordinates: [startNode.lon, startNode.lat],
                      color: colors.startNodeFill,
                      lineColor: colors.startNodeBorder,
                    },
                  ]
                : []),
              ...(endNode
                ? [
                    {
                      coordinates: [endNode.lon, endNode.lat],
                      color: colors.endNodeFill,
                      lineColor: colors.endNodeBorder,
                    },
                  ]
                : []),
            ]}
            pickable={true}
            opacity={1}
            stroked={true}
            filled={true}
            radiusScale={1}
            radiusMinPixels={7}
            radiusMaxPixels={20}
            lineWidthMinPixels={1}
            lineWidthMaxPixels={3}
            getPosition={(d) => d.coordinates}
            getFillColor={(d) => d.color}
            getLineColor={(d) => d.lineColor}
          />
          <MapGL
            reuseMaps
            mapLib={maplibregl}
            mapStyle={MAP_STYLE}
            doubleClickZoom={false}
          />
        </DeckGL>
      </div>
      <div  className="w-full p-10 mb-32 h-screen">
      <Interface
        ref={ui}
        canStart={startNode && endNode}
        started={started}
        animationEnded={animationEnded}
        playbackOn={playbackOn}
        time={time}
        startPathfinding={startPathfinding}
        toggleAnimation={toggleAnimation}
        clearPath={clearPath}
        timeChanged={setTime}
        changeLocation={changeLocation}
        maxTime={timer.current}
        settings={settings}
        setSettings={changeSettings}
        changeAlgorithm={changeAlgorithm}
        colors={colors}
        setColors={changeColors}
        loading={loading}
        cinematic={cinematic}
        setCinematic={setCinematic}
        placeEnd={placeEnd}
        setPlaceEnd={setPlaceEnd}
        changeRadius={changeRadius}
      />
     </div> 
    
    </>
  );
}

export default Map;
