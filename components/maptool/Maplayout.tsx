/* eslint-disable tailwindcss/no-custom-classname */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
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
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";

type Position = {
  lat: number;
  lng: number;
};

type Location = {
  MapName: string;
  MapAddress: string;
  Maplocation: {
    type: string;
    coordinates: [number, number];
  };
};

const mapContainerStyle = {
  width: "100%",
  height: "500px",
};

const libraries: "places"[] = ["places"];

export default function MapLayout({
  isEditing = false,
}: {
  isEditing?: boolean;
}) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [position, setPosition] = useState<Position>({
    lat: 13.7563,
    lng: 100.5018,
  });
  const [address, setAddress] = useState<string>("");
  const [placeName, setPlaceName] = useState<string>("");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);
  const { editMap, setEditMap } = useMyContext();
  const autocompleteInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editMap?.MapAddress) {
      setAddress(editMap.MapAddress);
      setPlaceName(editMap.MapName || "");
      if (editMap.Maplocation?.coordinates) {
        setPosition({
          lat: editMap.Maplocation.coordinates[1],
          lng: editMap.Maplocation.coordinates[0],
        });
      }
    }
  }, [isEditing, editMap]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const initializeAutocomplete = useCallback(() => {
    if (!autocompleteInput.current || !window.google?.maps?.places) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      autocompleteInput.current
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      if (place.geometry?.location) {
        setPosition({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        setAddress(place.formatted_address || "");
        setPlaceName(place.name || "");
      }
    });
  }, []);

  useEffect(() => {
    if (isLoaded) {
      initializeAutocomplete();
    }
  }, [isLoaded, initializeAutocomplete]);

  const updateAddress = useCallback(
    async (latlng: Position) => {
      if (!isLoaded) return;

      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          setAddress(results[0].formatted_address);
        } else {
          setAddress("Error fetching address");
        }
      });
    },
    [isLoaded]
  );

  useEffect(() => {
    updateAddress(position);
  }, [position, updateAddress]);

  const locateUser = () => {
    setIsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
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
      if (!placeName) {
        throw new Error("กรุณาระบุชื่อสถานที่");
      }
      const locationData: Location = {
        MapName: placeName,
        MapAddress: address,
        Maplocation: {
          type: "Point",
          coordinates: [position.lng, position.lat],
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
        description:
          error instanceof Error
            ? error.message
            : "ไม่สามารถดำเนินการได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">
        {isEditing ? "แก้ไขตำแหน่งแผนที่" : "เพิ่มตำแหน่งแผนที่"}
      </h1>
      <div className="grid gap-6 md:grid-cols-[1fr,2fr]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>ข้อมูลสถานที่</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label
                  htmlFor="placeName"
                  className="mb-2 block text-sm font-medium"
                >
                  ชื่อสถานที่
                </label>
                <div className="relative">
                  <Input
                    id="placeName"
                    ref={autocompleteInput}
                    value={placeName}
                    onChange={(e) => setPlaceName(e.target.value)}
                    placeholder="ป้อนชื่อสถานที่หรือที่อยู่"
                    className="pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => {
                      setPlaceName("");
                      setAddress("");
                    }}
                  >
                    <X className="size-4" />
                    <span className="sr-only">ล้างการค้นหา</span>
                  </Button>
                </div>
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
                    disabled={isLoading || !placeName || !address}
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
                    <p className="text-sm font-medium">ชื่อสถานที่:</p>
                    <p className="text-muted-foreground text-sm">{placeName}</p>
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
              <p className="text-sm text-gray-600">
                {address || "กรุณาเลือกตำแหน่งบนแผนที่"}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>แผนที่</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div id="map" className="h-[500px] w-full">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={position}
                zoom={13}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={(e) => {
                  if (e.latLng) {
                    setPosition({
                      lat: e.latLng.lat(),
                      lng: e.latLng.lng(),
                    });
                  }
                }}
              >
                <Marker position={position} />
              </GoogleMap>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
