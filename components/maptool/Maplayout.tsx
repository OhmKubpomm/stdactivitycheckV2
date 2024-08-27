/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
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
import { MapPin, Loader2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { createLocation } from "@/actions/mapActions";

import { useToast } from "@/components/ui/use-toast";

const heroIcon = L.icon({
  iconUrl: "/icon/map-marker.svg",
  iconSize: [50, 50],
});

const LocationMarker = ({
  position,
  setAddress,
}: {
  position: number[];
  setAddress: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const map = useMap();
  const [localAddress, setLocalAddress] = useState<string>(
    "Fetching address..."
  );
  const markerRef = useRef<L.Marker | null>(null);

  // Function to fetch and set the address and extract details
  const updateAddress = async (latlng: number[]) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng[0]},${latlng[1]}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
      );
      const data = await response.json();
      if (!data.results || data.results.length === 0)
        throw new Error("Address not found");

      const formattedAddress = data.results[0].formatted_address;
      setAddress(formattedAddress); // Set the full address
      setLocalAddress(formattedAddress); // Optionally, set the detailed address
      markerRef.current?.bindPopup(formattedAddress).openPopup();
    } catch (error) {
      console.error(error);
      const errorMessage = "Error fetching address";
      setAddress(errorMessage);
      setLocalAddress(errorMessage);
      markerRef.current?.bindPopup(errorMessage).openPopup();
    }
  };

  useEffect(() => {
    if (!position) return;
    if (!markerRef.current) {
      markerRef.current = L.marker([position[0], position[1]], {
        icon: heroIcon,
      }).addTo(map);
    } else {
      markerRef.current.setLatLng([position[0], position[1]]);
    }
    map.setView(L.latLng(position[0], position[1]), map.getZoom());

    updateAddress(position);

    return () => {
      // Cleanup the marker when component unmounts or position changes
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, [position, map, setAddress]); // Removed setLocalAddress to minimize dependencies

  return null;
};

const MapLayout = () => {
  const autocompleteInput = useRef(null);
  const [position, setPosition] = useState([13, 100]);
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();

  const API_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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
          if (location) {
            setPosition([location.lat(), location.lng()]);
          }
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
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_URL}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete; // Execute callback after script is loaded
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [API_URL, position]);

  const locateUser = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        toast({
          style: {
            background: "green",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          },
          title: "เพิ่มตำแหน่งแผนที่สำเร็จ",
          description: "ตำแหน่งแผนที่ถูกเพิ่มลงในระบบของคุณแล้ว",
        });
      },
      () => {
        toast({
          title: "Error",
          description: "ไม่สามารถเข้าถึงตำแหน่งของคุณได้",
        });
      }
    );
  };
  const handleAction = async () => {
    try {
      const formData = {
        MapAddress: address,
        Maplocation: {
          type: "Point",
          coordinates: [position[1], position[0]], // [longitude, latitude] ต้องตรงกับ Schema
        },
      };

      console.log("FormData being sent:", formData);

      const res = await createLocation(formData);

      if (res.error) {
        toast({
          title: "Error",
          description: res.error,
        });
      } else {
        toast({
          style: {
            background: "green",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          },
          title: "เพิ่มตำแหน่งแผนที่สำเร็จ",
          description: "ตำแหน่งแผนที่ถูกเพิ่มลงในระบบของคุณแล้ว",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "มีบางอย่างผิดปกติ กรุณาลองใหม่อีกครั้ง",
      });
    }
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "row",
          position: "relative",
          gap: "20px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <form onSubmit={handleAction} className="space-y-8">
          <Card
            style={{
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "20px",
              boxSizing: "border-box",
            }}
          >
            <CardHeader>
              <CardTitle>เพิ่มตำแหน่งแผนที่</CardTitle>
              <CardDescription>
                ค้นหาตำแหน่งที่ต้องการเพิ่มแผนที่
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Label htmlFor="name">ค้นหาตำแหน่ง</Label>

              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              >
                <Input
                  ref={autocompleteInput}
                  name="MapAddress"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ค้นหาตำแหน่ง"
                  style={{
                    flex: 1,
                    border: "none",
                    padding: "10px",
                    borderRadius: "4px",
                  }}
                />
                <Button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault(); // Prevent form submission
                    locateUser(); // Remove the argument from the locateUser function call
                  }}
                  style={{
                    position: "absolute",
                    right: "0",
                    top: "0",
                    bottom: "0",
                    border: "none",

                    padding: "10px",
                  }}
                >
                  <MapPin />
                </Button>
              </div>
            </CardContent>

            <CardFooter>
              <AlertDialog>
                <AlertDialogTrigger className=" w-full ">
                  <Button
                    className=" w-full bg-gradient-to-r from-primary-500 to-yellow-500 text-white "
                    type="button"
                  >
                    เพิ่มตำแหน่งแผนที่
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      คุณแน่ใจหรือไม่ว่าต้องการเพิ่มตำแหน่งแผนที่
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      การดำเนินการนี้จะเพิ่มตำแหน่งแผนที่ลงในบัญชีของคุณจากเซิร์ฟเวอร์ของเรา
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction>
                      <Button
                        className=" w-full bg-primary-500 text-white "
                        type="button" // Ensure it's a button to avoid form submission
                        onClick={handleAction} // Directly call handleAction here
                      >
                        ตกลง
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        </form>

        <MapContainer
          center={[position[0], position[1]]}
          zoom={13}
          scrollWheelZoom={false}
          style={{
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            borderRadius: "8px",
            boxSizing: "border-box",
            width: "80%", // Full width on smaller screens
            height: "500px", // Fixed height, adjust as needed
            zIndex: 1,
          }}
        >
          <TileLayer
            url="http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
            subdomains={["mt0", "mt1", "mt2", "mt3"]}
          />
          <LocationMarker position={position} setAddress={setAddress} />
        </MapContainer>
      </div>
    </>
  );
};

export default MapLayout;
