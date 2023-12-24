// Use client-side rendering since Leaflet and Google Maps are browser APIs.
"use client";
import React, { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input"; // Ensure these paths are correct
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import L from "leaflet";

const heroIcon = L.icon({
  iconUrl: "/icon/map-marker.svg",
  iconSize: [50, 50],
});

const LocationMarker = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom());
      L.marker(position, { icon: heroIcon })
        .addTo(map)
        .bindPopup("New location!")
        .openPopup();
    }
  }, [position, map]);

  return null;
};

const MapLayout = () => {
  const autocompleteInput = useRef(null);
  const [position, setPosition] = useState([13, 100]);

  useEffect(() => {
    // Function to initialize Google Places Autocomplete
    const initializeAutocomplete = () => {
      // Ensure the input exists and the Google Places library has loaded
      if (!autocompleteInput.current || !window.google?.maps?.places) return;

      const autocomplete = new window.google.maps.places.Autocomplete(
        autocompleteInput.current
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          const location = place.geometry.location;
          setPosition([location.lat(), location.lng()]);
        }
      });
    };

    // Function to load the Google Maps script dynamically
    const loadGoogleMapsScript = () => {
      // Check if the script is already loaded
      if (document.getElementById("google-maps-script") || window.google) {
        initializeAutocomplete(); // Initialize Autocomplete if script is already loaded
        return;
      }

      const script = document.createElement("script");

      script.id = "google-maps-script"; // Unique identifier
      script.type = "text/javascript";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete; // Execute callback after script is loaded
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, []);

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition([position.coords.latitude, position.coords.longitude]);
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "stretch",
        gap: "20px",
      }}
    >
      <Card
        style={{
          flex: "1 1 350px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <CardHeader>
            <CardTitle>Add Map Location</CardTitle>
            <CardDescription>
              Deploy your new project in one-click.
            </CardDescription>
          </CardHeader>
          <CardContent style={{ marginTop: "20px" }}>
            <Label htmlFor="name">Search Location</Label>
            <Input
              ref={autocompleteInput}
              id="name"
              placeholder="Enter a location"
              style={{
                padding: "10px",
                margin: "10px 0",
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <Button
              onClick={locateUser}
              style={{
                display: "block",
                width: "100%",
                padding: "10px",
                background: "#007BFF",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Use Current Location
            </Button>
          </CardContent>
        </div>
        <CardFooter style={{ marginTop: "20px" }}>
          <Button variant="outline" style={{ marginRight: "10px" }}>
            Cancel
          </Button>
          <Button>Deploy</Button>
        </CardFooter>
      </Card>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={false}
        style={{
          width: "100%",
          height: "400px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          borderRadius: "8px",
        }}
      >
        <TileLayer
          url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={["mt0", "mt1", "mt2", "mt3"]}
        />
        <LocationMarker position={position} />
      </MapContainer>
    </div>
  );
};

export default MapLayout;
