import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Image,
  SimpleGrid,
  Title,
  Text,
  Group,
  Stack,
} from "@mantine/core";
import { FaMapMarkedAlt, FaImages } from "react-icons/fa";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TripMap = ({
  pictures,
  callerType,
  onJoinTrip,
  onCancelRequest,
  startingLocation,
  destinationLocation,
}) => {
  const [showPictures, setShowPictures] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const previewMapRef = useRef(null);
  const fullMapRef = useRef(null);
  const previewMap = useRef(null);
  const fullMap = useRef(null);
  const apiKey = import.meta.env.VITE_ApiKey;

  useEffect(() => {
    if (previewMapRef.current && !previewMap.current) {
      initMap(previewMapRef.current, previewMap);
    }
  }, []);

  useEffect(() => {
    if (showFullMap && fullMapRef.current && !fullMap.current) {
      initMap(fullMapRef.current, fullMap);
    }
  }, [showFullMap]);

  const initMap = async (container, mapInstance) => {
    if (!apiKey) {
      toast.error(
        "API key is missing. Please check your environment variables."
      );
      return;
    }

    mapInstance.current = new maplibregl.Map({
      container,
      style: `https://api.maptiler.com/maps/basic-v2/style.json?key=${apiKey}`,
      center: [0, 0],
      zoom: 2,
    });

    mapInstance.current.addControl(
      new maplibregl.NavigationControl(),
      "top-right"
    );

    mapInstance.current.on("load", async () => {
      try {
        const [startCoords, destCoords] = await Promise.all([
          getCoordinates(startingLocation),
          getCoordinates(destinationLocation),
        ]);

        const bounds = new maplibregl.LngLatBounds();
        bounds.extend(startCoords);
        bounds.extend(destCoords);
        mapInstance.current?.fitBounds(bounds, { padding: 50 });

        // Start marker with click and popup
        const startMarker = new maplibregl.Marker({ color: "green" })
          .setLngLat(startCoords)
          .setPopup(new maplibregl.Popup().setText(startingLocation))
          .addTo(mapInstance.current);
        startMarker.getElement().addEventListener("click", () => {
          mapInstance.current.flyTo({ center: startCoords, zoom: 10 });
        });

        // Destination marker with click and popup
        const destMarker = new maplibregl.Marker({ color: "red" })
          .setLngLat(destCoords)
          .setPopup(new maplibregl.Popup().setText(destinationLocation))
          .addTo(mapInstance.current);
        destMarker.getElement().addEventListener("click", () => {
          mapInstance.current.flyTo({ center: destCoords, zoom: 10 });
        });

        // Styled line between the two points
        mapInstance.current?.addSource("route", {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [startCoords, destCoords],
            },
          },
        });

        mapInstance.current?.addLayer({
          id: "route-line",
          type: "line",
          source: "route",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#FF5733",
            "line-width": 5,
            "line-dasharray": [2, 4],
            "line-opacity": 0.8,
          },
        });
      } catch (err) {
        toast.error(err.message || "Error loading map.");
      }
    });
  };

  const getCoordinates = async (location) => {
    const res = await fetch(
      `https://api.maptiler.com/geocoding/${encodeURIComponent(
        location
      )}.json?key=${apiKey}`
    );
    const data = await res.json();
    if (data.features && data.features.length > 0) {
      return data.features[0].center;
    } else {
      throw new Error(`No result for ${location}`);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 16,
        border: "1px solid #e2e8f0", // light gray border
        borderRadius: 8,
        boxShadow: "0 1px 3px rgb(0 0 0 / 0.1), 0 1px 2px rgb(0 0 0 / 0.06)", // subtle shadow
        display: "flex",
        flexDirection: "column",
        height: "100%",
        maxWidth: 800,
        margin: "0 auto",
      }}
    >
      {/* Toggle Section */}
      <Group position="apart" mb="md" style={{ width: "100%" }}>
        <Title order={4} color="#1a202c">
          {showPictures ? "Trip Pictures" : "Trip Map"}
        </Title>
        <Button
          variant="light"
          color="blue"
          size="xs"
          onClick={() => setShowPictures((prev) => !prev)}
          leftIcon={showPictures ? <FaMapMarkedAlt /> : <FaImages />}
        >
          {showPictures ? "Show Map" : "Show Pictures"}
        </Button>
      </Group>

      {/* Content Section */}
      <div style={{ flex: 1, overflowY: "auto", width: "100%" }}>
        {showPictures ? (
          <SimpleGrid cols={2} spacing="xs">
            {pictures.map((url, idx) => (
              <Image
                key={idx}
                src={url}
                alt={`Trip picture ${idx + 1}`}
                radius="md"
                withPlaceholder
                style={{ borderRadius: 8, objectFit: "cover" }}
              />
            ))}
          </SimpleGrid>
        ) : (
          <div
            style={{
              width: "100%",
              height: 400,
              minHeight: 300,
              borderRadius: 8,
              overflow: "hidden",
              cursor: "pointer",
              border: "1px solid #cbd5e0", // light border
            }}
            ref={previewMapRef}
            onClick={() => setShowFullMap(true)}
          />
        )}
      </div>

      {/* Fullscreen map popup */}
      {showFullMap && (
        <div
          onClick={() => setShowFullMap(false)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            ref={fullMapRef}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "90%",
              height: "80%",
              border: "4px solid #3182ce", // blue border for clarity
              borderRadius: 12,
              boxShadow: "0 0 15px rgba(49,130,206,0.6)",
            }}
          />
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default TripMap;
