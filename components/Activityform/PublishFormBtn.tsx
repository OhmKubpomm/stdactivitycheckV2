"use client";

import { PublishForm } from "@/actions/ActivityAction";
import { getMapLocations } from "@/actions/mapActions";
import { useRouter } from "next/navigation";
import React, { useState, useTransition, useEffect } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
import Select from "react-select";
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

function PublishFormBtn({ id }: { id: number }) {
  const [loading, startTransition] = useTransition();
  const router = useRouter();
  const [activityType, setActivityType] = useState<string>("");
  const [startDateTime, setStartDateTime] = useState<string>("");
  const [endDateTime, setEndDateTime] = useState<string>("");
  const [activityLocation, setActivityLocation] = useState<string>("");
  const [mapLocations, setMapLocations] = useState<
    { value: string; label: string }[]
  >([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState(true);

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoadingLocations(true);
      try {
        const locations = await getMapLocations();
        if (Array.isArray(locations) && locations.length > 0) {
          setMapLocations(locations);
        } else {
          setMapLocations([]);
          toast({
            title: "ข้อมูลสถานที่",
            description: "ไม่พบข้อมูลสถานที่",
          });
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
        setMapLocations([]);
        toast({
          title: "ข้อผิดพลาด",
          description: "ไม่สามารถดึงข้อมูลสถานที่ได้",
          variant: "destructive",
        });
      } finally {
        setIsLoadingLocations(false);
      }
    };

    fetchLocations();
  }, []);

  async function publishForm() {
    try {
      if (
        !startDateTime ||
        !endDateTime ||
        !activityType ||
        !activityLocation.trim()
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
        new Date(startDateTime).toISOString(),
        new Date(endDateTime).toISOString(),
        activityType,
        activityLocation,
        0,
        0
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
            <Label>สถานที่จัดกิจกรรม</Label>
            <Select
              options={mapLocations}
              isLoading={isLoadingLocations}
              isDisabled={isLoadingLocations}
              placeholder={
                isLoadingLocations ? "กำลังโหลดข้อมูล..." : "เลือกสถานที่..."
              }
              onChange={(selectedOption: any) =>
                setActivityLocation(selectedOption?.label || "")
              }
              noOptionsMessage={() => "ไม่พบสถานที่"}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDateTime">วันและเวลาเริ่มต้น</Label>
            <Input
              type="datetime-local"
              id="startDateTime"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="endDateTime">วันและเวลาสิ้นสุด</Label>
            <Input
              type="datetime-local"
              id="endDateTime"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
            />
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            disabled={
              loading ||
              !activityType ||
              !startDateTime ||
              !endDateTime ||
              !activityLocation.trim()
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
