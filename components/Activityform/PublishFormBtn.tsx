/* eslint-disable camelcase */
/* eslint-disable no-undef */
"use client";

import { PublishForm } from "@/actions/ActivityAction";
import { useRouter } from "next/navigation";
import React, { useState, useTransition, useRef, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { th } from "date-fns/locale";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  Libraries,
} from "@react-google-maps/api";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [activityType, setActivityType] = useState<string>("");
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [activityLocation, setActivityLocation] = useState<string>("");
  const [mapLocation, setMapLocation] = useState<{ lat: number; lng: number }>({
    lat: 13.7563,
    lng: 100.5018,
  }); // Default to Bangkok
  const [isCustomLocation, setIsCustomLocation] = useState(false);

  const mapRef = useRef<google.maps.Map | null>(null);

  const libraries: Libraries = ["places"];

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const {
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "th" }, // Restrict to Thailand
      types: ["establishment", "geocode"],
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      setActivityLocation(address); // ใช้ชื่อที่ผู้ใช้เลือกจาก suggestions
      setMapLocation({ lat, lng });
      setIsCustomLocation(false);
      if (mapRef.current) {
        mapRef.current.panTo({ lat, lng });
        mapRef.current.setZoom(15);
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  const handleMapClick = async (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setMapLocation({ lat, lng });

      // ไม่เปลี่ยนชื่อสถานที่เมื่อคลิกบนแผนที่
      // แต่ถ้า activityLocation ว่างเปล่า ให้ใส่ข้อความแจ้งเตือน
      if (!activityLocation) {
        setActivityLocation(`กรุณาระบุชื่อสถานที่สำหรับตำแหน่งนี้`);
        toast({
          title: "กรุณาระบุชื่อสถานที่",
          description: "โปรดป้อนชื่อสถานที่สำหรับตำแหน่งที่เลือก",
        });
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setActivityLocation(newValue);
    setValue(newValue); // อัปเดต value สำหรับ usePlacesAutocomplete
  };

  async function publishForm() {
    try {
      if (
        !startTime ||
        !endTime ||
        !activityType ||
        !activityLocation ||
        !mapLocation
      ) {
        toast({
          title: "ข้อมูลไม่ครบถ้วน",
          description: "กรุณากรอกข้อมูลให้ครบทุกช่อง",
          variant: "destructive",
        });
        return;
      }

      const result = await PublishForm(
        id,
        startTime.toISOString(),
        endTime.toISOString(),
        activityType,
        activityLocation,
        mapLocation.lng,
        mapLocation.lat
      );

      if (result.success) {
        toast({
          title: "สำเร็จ",
          description: "กิจกรรมของคุณได้รับการเผยแพร่แล้ว",
        });
        router.refresh();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description:
          error instanceof Error
            ? error.message
            : "เกิดข้อผิดพลาดในการเผยแพร่กิจกรรม",
        variant: "destructive",
      });
    }
  }

  const DateTimePicker = ({ value, onChange, label }: any) => {
    const [date, setDate] = useState<Date | undefined>(value);
    const [isOpen, setIsOpen] = useState(false);
    const scrollRefs = useRef<(HTMLDivElement | null)[]>([]);

    useEffect(() => {
      if (isOpen && date) {
        scrollRefs.current.forEach((ref, index) => {
          if (ref) {
            const value =
              index === 0
                ? date.getHours()
                : index === 1
                ? date.getMinutes()
                : date.getSeconds();
            ref.scrollTop = value * 32; // 32px is the height of each time item
          }
        });
      }
    }, [isOpen, date]);

    const handleDateChange = (newDate: Date | undefined) => {
      setDate(newDate);
      if (newDate) {
        const newDateTime = new Date(newDate);
        newDateTime.setHours(date ? date.getHours() : 0);
        newDateTime.setMinutes(date ? date.getMinutes() : 0);
        newDateTime.setSeconds(date ? date.getSeconds() : 0);
        onChange(newDateTime);
      }
    };

    const handleTimeChange = (
      type: "hours" | "minutes" | "seconds",
      value: number
    ) => {
      if (date) {
        const newDate = new Date(date);
        if (type === "hours") newDate.setHours(value);
        if (type === "minutes") newDate.setMinutes(value);
        if (type === "seconds") newDate.setSeconds(value);
        setDate(newDate);
        onChange(newDate);
      }
    };

    const TimeColumn = ({
      type,
      value,
      onChange,
    }: {
      type: "hours" | "minutes" | "seconds";
      value: number;
      onChange: (value: number) => void;
    }) => {
      const max = type === "hours" ? 23 : 59;

      return (
        <div className="flex flex-col items-center">
          <div className="mb-1 text-sm font-medium">
            {type === "hours" ? "ชม." : type === "minutes" ? "นาที" : "วินาที"}
          </div>
          <div
            className="scrollbar-hide h-[160px] overflow-y-auto"
            ref={(el) =>
              (scrollRefs.current[
                type === "hours" ? 0 : type === "minutes" ? 1 : 2
              ] = el)
            }
          >
            {Array.from({ length: max + 1 }, (_, i) => (
              <div
                key={i}
                className={`cursor-pointer rounded px-3 py-2 ${
                  i === value
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-secondary"
                }`}
                onClick={() => onChange(i)}
              >
                {i.toString().padStart(2, "0")}
              </div>
            ))}
          </div>
        </div>
      );
    };

    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={`w-full justify-start text-left font-normal ${
                !date && "text-muted-foreground"
              }`}
            >
              <CalendarIcon className="mr-2 size-4" />
              {date ? (
                format(date, "d MMMM yyyy HH:mm:ss", { locale: th })
              ) : (
                <span>เลือกวันที่และเวลา</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto rounded-t-lg bg-background p-0"
            align="start"
          >
            <div className="p-3">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateChange}
                locale={th}
                initialFocus
              />
            </div>
            <div className="bg-secondary/10 border-t border-border p-3 backdrop-blur-sm">
              <div className="flex justify-between space-x-4">
                <TimeColumn
                  type="hours"
                  value={date ? date.getHours() : 0}
                  onChange={(value) => handleTimeChange("hours", value)}
                />
                <TimeColumn
                  type="minutes"
                  value={date ? date.getMinutes() : 0}
                  onChange={(value) => handleTimeChange("minutes", value)}
                />
                <TimeColumn
                  type="seconds"
                  value={date ? date.getSeconds() : 0}
                  onChange={(value) => handleTimeChange("seconds", value)}
                />
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white">
          <MdOutlinePublish className="size-4" />
          เผยแพร่กิจกรรม
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>ยืนยันการเผยแพร่กิจกรรม</AlertDialogTitle>
          <AlertDialogDescription>
            กรุณาตรวจสอบรายละเอียดก่อนเผยแพร่
            เมื่อเผยแพร่แล้วจะไม่สามารถแก้ไขได้
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>ประเภทกิจกรรม</Label>
            <RadioGroup onValueChange={setActivityType} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="กิจกรรมบังคับ" id="mandatory" />
                <Label htmlFor="mandatory">กิจกรรมบังคับ</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="กิจกรรมบังคับเลือก"
                  id="mandatoryElective"
                />
                <Label htmlFor="mandatoryElective">กิจกรรมบังคับเลือก</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="กิจกรรมเลือกเข้าร่วม" id="elective" />
                <Label htmlFor="elective">กิจกรรมเลือกเข้าร่วม</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="activityLocation">สถานที่จัดกิจกรรม</Label>
            <div className="flex space-x-2">
              <Input
                id="activityLocation"
                placeholder="ระบุสถานที่จัดกิจกรรม"
                value={activityLocation}
                onChange={handleInputChange}
              />
              <Button onClick={() => handleSelect(activityLocation)}>
                ยืนยันตำแหน่ง
              </Button>
            </div>
            {status === "OK" && !isCustomLocation && (
              <ul className="mt-2 max-h-48 overflow-auto rounded-md border border-gray-200 bg-white">
                {data.map(({ place_id, description }) => (
                  <li
                    key={place_id}
                    className="cursor-pointer p-2 hover:bg-gray-100"
                    onClick={() => handleSelect(description)}
                  >
                    {description}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="h-64 w-full">
            <GoogleMap
              center={mapLocation}
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "100%" }}
              onClick={handleMapClick}
              onLoad={(map) => {
                mapRef.current = map;
              }}
            >
              <Marker position={mapLocation} />
            </GoogleMap>
          </div>
          <DateTimePicker
            value={startTime}
            onChange={setStartTime}
            label="วันและเวลาเริ่มต้น"
          />
          <DateTimePicker
            value={endTime}
            onChange={setEndTime}
            label="วันและเวลาสิ้นสุด"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              loading ||
              !activityType ||
              !startTime ||
              !endTime ||
              !activityLocation ||
              !mapLocation
            }
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
            className="bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          >
            เผยแพร่ {loading && <FaSpinner className="ml-2 animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
