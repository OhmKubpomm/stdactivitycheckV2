/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { MapPin, X, Loader2, Navigation, Check } from "lucide-react";
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
import { createLocation, updateMap } from "@/actions/mapActions";
import { useToast } from "@/components/ui/use-toast";
import { useMyContext } from "@/context/provider";

// Import Leaflet types
import type { LatLngExpression, Icon, Map as LeafletMap } from "leaflet";
import "leaflet/dist/leaflet.css";
import { useMap, useMapEvents } from "react-leaflet";

// Dynamically import Leaflet components
const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

type Position = [number, number];
type Location = {
  MapAddress: string;
  Maplocation: {
    type: string;
    coordinates: [number, number];
  };
};

interface LocationMarkerProps {
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
  customIcon: Icon | null;
}

const LocationMarker: React.FC<LocationMarkerProps> = ({
  position,
  setPosition,
  customIcon,
}) => {
  const map = useMap() as LeafletMap;

  useMapEvents({
    click(e: { latlng: { lat: number; lng: number } }) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    if (map && map.setView) {
      map.setView(position as LatLngExpression, map.getZoom());
    }
  }, [map, position]);

  return customIcon ? <Marker position={position} icon={customIcon} /> : null;
};

export default function MapLayout({
  isEditing = false,
}: {
  isEditing?: boolean;
}) {
  const autocompleteInput = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<Position>([13.7563, 100.5018]); // Bangkok coordinates
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { editMap, setEditMap } = useMyContext();
  const [customIcon, setCustomIcon] = useState<Icon | null>(null);

  const API_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("leaflet").then((L) => {
        setCustomIcon(
          L.icon({
            iconUrl: "/Icon/map-marker.svg",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
            popupAnchor: [0, -30],
          })
        );
      });
    }
  }, []);

  useEffect(() => {
    if (isEditing && editMap?.MapAddress) {
      setAddress(editMap.MapAddress);
      if (editMap.Maplocation?.coordinates) {
        setPosition([
          editMap.Maplocation.coordinates[1],
          editMap.Maplocation.coordinates[0],
        ]);
      }
    }
  }, [isEditing, editMap]);

  const initializeAutocomplete = useCallback(() => {
    if (!autocompleteInput.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput.current
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        setPosition([
          place.geometry.location.lat(),
          place.geometry.location.lng(),
        ]);
        setAddress(place.formatted_address || "");
      }
    });
  }, []);

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      if (typeof window === "undefined") return;
      if (window.google && window.google.maps) {
        initializeAutocomplete();
        return;
      }

      const script = document.createElement("script");
      script.id = "google-maps-script";
      script.src = `https://maps.googleapis.com/maps/api/js?key=${API_URL}&libraries=places`;
      script.async = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    };

    loadGoogleMapsScript();
  }, [API_URL, initializeAutocomplete]);

  const updateAddress = useCallback(
    async (latlng: Position) => {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latlng[0]},${latlng[1]}&key=${API_URL}`
        );
        const data = await response.json();
        if (!data.results || data.results.length === 0)
          throw new Error("Address not found");

        const formattedAddress = data.results[0].formatted_address;
        setAddress(formattedAddress);
      } catch (error) {
        console.error(error);
        setAddress("Error fetching address");
      }
    },
    [API_URL]
  );

  useEffect(() => {
    updateAddress(position);
  }, [position, updateAddress]);

  const locateUser = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition([position.coords.latitude, position.coords.longitude]);
        setIsLoading(false);
        toast({
          title: "ตำแหน่งปัจจุบันถูกเพิ่มแล้ว",
          description: "แผนที่ได้รับการอัปเดตด้วยตำแหน่งของคุณ",
        });
      },
      () => {
        setIsLoading(false);
        toast({
          title: "ไม่สามารถระบุตำแหน่งได้",
          description:
            "กรุณาอนุญาตการเข้าถึงตำแหน่งของคุณหรือป้อนตำแหน่งด้วยตนเอง",
          variant: "destructive",
        });
      }
    );
  };

  const handleAction = async () => {
    setIsLoading(true);
    try {
      const locationData: Location = {
        MapAddress: address,
        Maplocation: {
          type: "Point",
          coordinates: [position[1], position[0]],
        },
      };

      let res;
      if (isEditing) {
        res = await updateMap({ id: editMap._id, ...locationData });
      } else {
        res = await createLocation(locationData);
      }

      if ("error" in res) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: res.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: isEditing ? "แก้ไขตำแหน่งสำเร็จ" : "เพิ่มตำแหน่งสำเร็จ",
          description: isEditing
            ? "ตำแหน่งแผนที่ถูกแก้ไขในระบบแล้ว"
            : "ตำแหน่งใหม่ถูกบันทึกลงในระบบแล้ว",
        });
        setIsAlertDialogOpen(false);
        if (isEditing && setEditMap) {
          setEditMap({ ...editMap, ...locationData });
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    if (isEditing && setEditMap) {
      setEditMap((prevMap: any) => ({
        ...prevMap,
        MapAddress: e.target.value,
      }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditing ? "แก้ไขตำแหน่งแผนที่" : "เพิ่มตำแหน่งแผนที่"}
      </h1>
      <div className="grid gap-6 md:grid-cols-[1fr,2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ค้นหาตำแหน่ง</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Input
                  ref={autocompleteInput}
                  value={address}
                  onChange={handleInputChange}
                  placeholder="ป้อนที่อยู่หรือชื่อสถานที่"
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setAddress("")}
                >
                  <X className="size-4" />
                  <span className="sr-only">ล้างการค้นหา</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>การดำเนินการ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                onClick={locateUser}
                variant="outline"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Navigation className="mr-2 size-4" />
                )}
                ระบุตำแหน่งปัจจุบัน
              </Button>
              <AlertDialog
                open={isAlertDialogOpen}
                onOpenChange={setIsAlertDialogOpen}
              >
                <AlertDialogTrigger asChild>
                  <Button
                    className="w-full bg-orange-500 text-white hover:bg-orange-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : (
                      <MapPin className="mr-2 size-4" />
                    )}
                    {isEditing ? "แก้ไขตำแหน่งแผนที่" : "เพิ่มตำแหน่งแผนที่"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      {isEditing
                        ? "ยืนยันการแก้ไขตำแหน่ง"
                        : "ยืนยันการเพิ่มตำแหน่ง"}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      คุณต้องการ{isEditing ? "แก้ไข" : "เพิ่ม"}
                      ตำแหน่งนี้ลงในระบบใช่หรือไม่?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <Separator className="my-4" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">ที่อยู่ที่เลือก:</p>
                    <p className="text-muted-foreground text-sm">{address}</p>
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleAction}
                      disabled={isLoading}
                      className="bg-orange-500 text-white hover:bg-orange-600"
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Check className="mr-2 size-4" />
                      )}
                      ยืนยัน{isEditing ? "การแก้ไข" : "การเพิ่ม"}ตำแหน่ง
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ตำแหน่งที่เลือก</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">{address}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>แผนที่</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[500px] w-full">
              {customIcon && (
                <MapContainer
                  center={position}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                  zoomControl={false}
                >
                  <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                  />
                  <LocationMarker
                    position={position}
                    setPosition={setPosition}
                    customIcon={customIcon}
                  />
                </MapContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
