import React, { useEffect, useState, useRef } from "react";
import DeckGL from "@deck.gl/react";
import { Map as MapGL } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { ScatterplotLayer, PolygonLayer } from "@deck.gl/layers";
import { TripsLayer } from "@deck.gl/geo-layers";
import { FlyToInterpolator } from "deck.gl";
import {
  getBoundingBoxFromPolygon,
  getMapGraph,
  getNearestNode,
} from "../services/MapService";
import { createGeoJSONCircle } from "../helpers";
import { MAP_STYLE, INITIAL_VIEW_STATE, INITIAL_COLORS } from "../config";
import {
  Button,
  IconButton,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
  Fade,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { PlayArrow, Settings, Movie, Pause } from "@mui/icons-material";
import PathfindingState from "../models/PathfindingState";

const LOCATIONS = [
  { name: "Mumbai", coordinates: [72.8777, 19.076] },
  { name: "Delhi", coordinates: [77.1025, 28.7041] },
  { name: "Bangalore", coordinates: [77.5946, 12.9716] },
  { name: "Hyderabad", coordinates: [78.4867, 17.385] },
  { name: "Chennai", coordinates: [80.2707, 13.0827] },
  { name: "Kolkata", coordinates: [88.3639, 22.5726] },
  { name: "Ahmedabad", coordinates: [72.5714, 23.0225] },
  { name: "Pune", coordinates: [73.8567, 18.5204] },
  { name: "Jaipur", coordinates: [75.7873, 26.9124] },
  { name: "Lucknow", coordinates: [80.9462, 26.8467] },
];

const CityVisualization = () => {
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);
  const [selectionRadius, setSelectionRadius] = useState([]);
  const [tripsData, setTripsData] = useState([]);
  const [colors, setColors] = useState(INITIAL_COLORS);
  const [loading, setLoading] = useState(false);
  const [playbackOn, setPlaybackOn] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    type: "error",
  });
  const [time, setTime] = useState(0);
  const [animationEnded, setAnimationEnded] = useState(false);

  const requestRef = useRef();
  const previousTimeRef = useRef();
  const pathfindingState = useRef(new PathfindingState());
  const waypoints = useRef([]);
  const timer = useRef(0);

  const handleMapClick = async (event) => {
    if (loading) return;

    setLoading(true);
    const { coordinate } = event;

    if (!coordinate) {
      console.error("No coordinates found in the click event.");
      setLoading(false);
      return;
    }

    const [lng, lat] = coordinate;

    try {
      const node = await getNearestNode(lat, lng);
      if (!node) {
        showSnack("No path found in the vicinity.", "error");
        return;
      }

      if (!startNode) {
        setStartNode(node);
        const circle = createGeoJSONCircle([node.lon, node.lat], 1);
        setSelectionRadius([{ contour: circle }]);

        const newGraph = await getMapGraph(
          getBoundingBoxFromPolygon(circle),
          node.id
        );
        console.log("Fetched graph:", newGraph);
        if (!newGraph || !newGraph.nodes || !(newGraph.nodes instanceof Map)) {
          throw new Error("Invalid graph structure received from getMapGraph");
        }
        pathfindingState.current.graph = newGraph;
      } else if (!endNode) {
        setEndNode(node);
        pathfindingState.current.endNode = pathfindingState.current.getNode(
          node.id
        );
        showSnack("End node set. Click play to start pathfinding.", "success");
      } else {
        // Reset and start over
        setStartNode(node);
        setEndNode(null);
        setTripsData([]);
        const circle = createGeoJSONCircle([node.lon, node.lat], 1);
        setSelectionRadius([{ contour: circle }]);

        const newGraph = await getMapGraph(
          getBoundingBoxFromPolygon(circle),
          node.id
        );
        console.log("Fetched graph:", newGraph);
        if (!newGraph || !newGraph.nodes || !(newGraph.nodes instanceof Map)) {
          throw new Error("Invalid graph structure received from getMapGraph");
        }
        pathfindingState.current.graph = newGraph;
      }
    } catch (error) {
      console.error("Error handling map click:", error);
      showSnack(
        `Error setting node: ${error.message}. Please try again.`,
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const layers = [
    new PolygonLayer({
      id: "selection-radius",
      data: selectionRadius,
      pickable: true,
      stroked: true,
      filled: true,
      getPolygon: (d) => d.contour,
      getFillColor: [80, 210, 0, 20],
      getLineColor: [9, 142, 46, 175],
      getLineWidth: 3,
    }),
    new ScatterplotLayer({
      id: "start-end-points",
      data: [
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
      ],
      pickable: true,
      opacity: 1,
      stroked: true,
      filled: true,
      radiusScale: 1,
      radiusMinPixels: 7,
      radiusMaxPixels: 20,
      lineWidthMinPixels: 1,
      lineWidthMaxPixels: 3,
      getPosition: (d) => d.coordinates,
      getFillColor: (d) => d.color,
      getLineColor: (d) => d.lineColor,
    }),
    new TripsLayer({
      id: "trips-layer",
      data: tripsData,
      getPath: (d) => d.path,
      getColor: colors.path,
      opacity: 0.8,
      widthMinPixels: 4,
      rounded: true,
      trailLength: 200,
      currentTime: time,
    }),
  ];

  const handlePlay = () => {
    if (!startNode || !endNode || !pathfindingState.current.graph) {
      showSnack("Please set both start and end nodes first.", "warning");
      return;
    }

    setPlaybackOn(!playbackOn);
    if (!playbackOn) {
      try {
        pathfindingState.current.start("astar");
        setTime(0);
        setAnimationEnded(false);
        waypoints.current = [];
        timer.current = 0;
        showSnack("Pathfinding started. Animation beginning.", "success");
      } catch (error) {
        console.error("Error in pathfinding:", error);
        showSnack(
          `An error occurred during pathfinding: ${error.message}`,
          "error"
        );
      }
    }
  };

  const animate = (time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      setTime((prevTime) => {
        if (prevTime >= timer.current) {
          setAnimationEnded(true);
          setPlaybackOn(false);
          return prevTime;
        }
        return prevTime + deltaTime / 100;
      });

      if (!animationEnded) {
        const updatedNodes = pathfindingState.current.nextStep();
        for (const updatedNode of updatedNodes) {
          updateWaypoints(updatedNode, updatedNode.referer);
        }

        if (pathfindingState.current.finished) {
          setAnimationEnded(true);
          setPlaybackOn(false);
        }
      }
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  const updateWaypoints = (node, refererNode) => {
    if (!node || !refererNode) return;
    const distance = Math.hypot(
      node.lon - refererNode.lon,
      node.lat - refererNode.lat
    );
    const timeAdd = distance * 50000;

    waypoints.current = [
      ...waypoints.current,
      {
        path: [
          [refererNode.lon, refererNode.lat],
          [node.lon, node.lat],
        ],
        timestamps: [timer.current, timer.current + timeAdd],
      },
    ];

    timer.current += timeAdd;
    setTripsData(waypoints.current);
  };

  useEffect(() => {
    if (playbackOn && !animationEnded) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [playbackOn, animationEnded]);

  const handleLocationChange = (location) => {
    setViewState({
      ...viewState,
      longitude: location.coordinates[0],
      latitude: location.coordinates[1],
      zoom: 12,
      transitionDuration: 2000,
      transitionInterpolator: new FlyToInterpolator(),
    });
    setMenuAnchor(null);
  };

  const showSnack = (message, type = "error") => {
    setSnack({ open: true, message, type });
  };

  const handleClearPath = () => {
    setStartNode(null);
    setEndNode(null);
    setTripsData([]);
    setSelectionRadius([]);
    pathfindingState.current.reset();
    setPlaybackOn(false);
    setTime(0);
    setAnimationEnded(false);
    waypoints.current = [];
    timer.current = 0;
    showSnack("Path cleared. You can set new start and end nodes.", "info");
  };

  return (
    <>
      <DeckGL
        initialViewState={viewState}
        controller={true}
        layers={layers}
        onClick={handleMapClick}
      >
        <MapGL
          reuseMaps
          mapLib={maplibregl}
          mapStyle={MAP_STYLE}
          preventStyleDiffing={true}
        />
      </DeckGL>

      <div className="mt-80">
        <div className="side">
          <Button
            id="locations-button"
            aria-controls="locations-menu"
            aria-haspopup="true"
            onClick={(e) => setMenuAnchor(e.currentTarget)}
            variant="contained"
            style={{ backgroundColor: "#404156", color: "#fff" }}
          >
            Locations
          </Button>
          <Menu
            id="locations-menu"
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={() => setMenuAnchor(null)}
            MenuListProps={{
              sx: { backgroundColor: "#404156" },
            }}
          >
            {LOCATIONS.map((location) => (
              <MenuItem
                key={location.name}
                onClick={() => handleLocationChange(location)}
              >
                {location.name}
              </MenuItem>
            ))}
          </Menu>
        </div>
        <IconButton
          onClick={handlePlay}
          style={{ backgroundColor: "#46B780", width: 60, height: 60 }}
          size="large"
        >
          {playbackOn ? (
            <Pause
              style={{ color: "#fff", width: 26, height: 26 }}
              fontSize="inherit"
            />
          ) : (
            <PlayArrow
              style={{ color: "#fff", width: 26, height: 26 }}
              fontSize="inherit"
            />
          )}
        </IconButton>
        <div className="side">
          <Button
            onClick={handleClearPath}
            style={{
              color: "#fff",
              backgroundColor: "#404156",
              paddingInline: 30,
              paddingBlock: 7,
            }}
            variant="contained"
          >
            Clear path
          </Button>
        </div>
      </div>

      <div className="nav-right">
        <Tooltip title="Open settings">
          <IconButton
            onClick={() => {
              /* Implement open settings logic */
            }}
            style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }}
            size="large"
          >
            <Settings
              style={{ color: "#fff", width: 24, height: 24 }}
              fontSize="inherit"
            />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cinematic mode">
          <IconButton
            className="btn-cinematic"
            onClick={() => {
              /* Implement cinematic mode toggle */
            }}
            style={{ backgroundColor: "#2A2B37", width: 36, height: 36 }}
            size="large"
          >
            <Movie
              style={{ color: "#fff", width: 24, height: 24 }}
              fontSize="inherit"
            />
          </IconButton>
        </Tooltip>
      </div>

      <div className="loader-container">
        <Fade
          in={loading}
          style={{
            transitionDelay: loading ? "50ms" : "0ms",
          }}
          unmountOnExit
        >
          <CircularProgress color="inherit" />
        </Fade>
      </div>

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack({ ...snack, open: false })}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.type}
          style={{ width: "100%", color: "#fff" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CityVisualization;
