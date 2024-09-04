"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import L from "leaflet";
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
import { createLocation } from "@/actions/mapActions";
import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";

type Position = [number, number];
type Location = {
  MapAddress: string;
  Maplocation: {
    type: string;
    coordinates: [number, number];
  };
};

const customIcon = L.icon({
  iconUrl: "/icon/map-marker.svg",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const LocationMarker: React.FC<{
  position: Position;
  setPosition: React.Dispatch<React.SetStateAction<Position>>;
}> = ({ position, setPosition }) => {
  const map = useMap();

  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [map, position]);

  return <Marker position={position} icon={customIcon} />;
};

export default function MapLayout() {
  const autocompleteInput = useRef<HTMLInputElement>(null);
  const [position, setPosition] = useState<Position>([13.7563, 100.5018]); // Bangkok coordinates
  const [address, setAddress] = useState<string>("");
  const { toast } = useToast();
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopularLocations, setShowPopularLocations] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const API_URL = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    const initializeAutocomplete = () => {
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
    };

    const loadGoogleMapsScript = () => {
      if (document.getElementById("google-maps-script") || window.google) {
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
  }, [API_URL]);

  const updateAddress = async (latlng: Position) => {
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
  };

  useEffect(() => {
    updateAddress(position);
  }, [position]);

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
      const newLocation: Location = {
        MapAddress: address,
        Maplocation: {
          type: "Point",
          coordinates: [position[1], position[0]],
        },
      };

      const res = await createLocation(newLocation);

      if ("error" in res) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: res.error,
          variant: "destructive",
        });
      } else {
        setLocations([...locations, newLocation]);
        toast({
          title: "เพิ่มตำแหน่งสำเร็จ",
          description: "ตำแหน่งใหม่ถูกบันทึกลงในระบบแล้ว",
        });
        setIsAlertDialogOpen(false);
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มตำแหน่งได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">เพิ่มตำแหน่งแผนที่</h1>
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
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ป้อนที่อยู่หรือชื่อสถานที่"
                  className="pr-10"
                  onFocus={() => setShowPopularLocations(true)}
                  onBlur={() =>
                    setTimeout(() => setShowPopularLocations(false), 200)
                  }
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
              <AnimatePresence>
                {showPopularLocations && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="mt-2"
                  >
                    <h3 className="mb-2 text-sm font-semibold">
                      สถานที่ยอดนิยม
                    </h3>
                    <ul className="space-y-2">
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setAddress("กรุงเทพมหานคร")}
                        >
                          <MapPin className="mr-2 size-4" />
                          กรุงเทพมหานคร
                        </Button>
                      </li>
                      <li>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setAddress("เชียงใหม่")}
                        >
                          <MapPin className="mr-2 size-4" />
                          เชียงใหม่
                        </Button>
                      </li>
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
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
                    เพิ่มตำแหน่งแผนที่
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>ยืนยันการเพิ่มตำแหน่ง</AlertDialogTitle>
                    <AlertDialogDescription>
                      คุณต้องการเพิ่มตำแหน่งนี้ลงในระบบใช่หรือไม่?
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
                      ยืนยันการเพิ่มตำแหน่ง
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
              <MapContainer
                center={[position[0], position[1]]}
                zoom={13}
                scrollWheelZoom={false}
                style={{
                  width: "100%", // Full width on smaller screens
                  height: "100%", // Fixed height, adjust as needed
                  zIndex: 1,
                }}
                zoomControl={false}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <LocationMarker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
