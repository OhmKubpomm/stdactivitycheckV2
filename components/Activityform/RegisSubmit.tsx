"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { joinActivity } from "@/actions/ActivityAction"; // ฟังก์ชัน server action ที่สร้างไว้
import { ImSpinner2 } from "react-icons/im";
import { HiCursorClick } from "react-icons/hi";
import { checkUserWithinRange } from "@/actions/mapActions"; // ฟังก์ชันตรวจสอบระยะใน server

interface RegisSubmitProps {
  activityId: string;
  regisStartTime: string;
  regisEndTime: string;
  activityLocation: string;
}

const RegisSubmit: React.FC<RegisSubmitProps> = ({
  activityId,
  regisStartTime,
  regisEndTime,
  activityLocation,
}) => {
  const [loading, setLoading] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [isNotStarted, setIsNotStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");

  const formatTimeLeft = (timeDifference: number) => {
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    return `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`;
  };

  // ตรวจสอบช่วงเวลาลงทะเบียน
  useEffect(() => {
    const updateTimeStatus = () => {
      const currentTime = new Date().getTime();
      const startTimeDate = new Date(regisStartTime).getTime();
      const endTimeDate = new Date(regisEndTime).getTime();

      if (currentTime < startTimeDate) {
        setIsNotStarted(true);
        setTimeLeft(
          `เริ่มในอีก ${formatTimeLeft(startTimeDate - currentTime)}`
        );
      } else if (currentTime > endTimeDate) {
        setIsExpired(true);
        setTimeLeft("หมดเวลาแล้ว");
      } else {
        setIsNotStarted(false);
        setIsExpired(false);
        setTimeLeft(
          `เหลือเวลาอีก ${formatTimeLeft(endTimeDate - currentTime)}`
        );
      }
    };

    updateTimeStatus();
    const timer = setInterval(updateTimeStatus, 1000);

    return () => clearInterval(timer);
  }, [regisStartTime, regisEndTime]);

  // ตรวจสอบตำแหน่งของผู้ใช้เมื่อกดปุ่มเข้าร่วมกิจกรรม
  const handleJoinActivity = useCallback(async () => {
    if (isExpired) {
      toast({
        title: "หมดเวลาแล้ว",
        description:
          "คุณไม่สามารถเข้าร่วมกิจกรรมนี้ได้เนื่องจากหมดเวลาลงทะเบียนแล้ว",
        variant: "destructive",
      });
      return;
    }

    if (isNotStarted) {
      toast({
        title: "กิจกรรมยังไม่เริ่ม",
        description: "กรุณารอจนกว่าจะถึงเวลาลงทะเบียน",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // ตรวจสอบตำแหน่งผู้ใช้เมื่อกดปุ่ม
        const { isWithinRange } = await checkUserWithinRange(
          userLocation,
          100,
          activityLocation
        );

        if (!isWithinRange) {
          toast({
            title: "คุณอยู่ไกลเกินไป!",
            description:
              "คุณไม่สามารถเข้าร่วมกิจกรรมนี้ได้เนื่องจากคุณอยู่ไกลเกินไป",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        try {
          const response = await joinActivity(
            activityId,
            userLocation.lat,
            userLocation.lng
          );

          if (response.success) {
            toast({
              title: "เข้าร่วมกิจกรรมสำเร็จ",
              description: "คุณได้เข้าร่วมกิจกรรมเรียบร้อยแล้ว",
              variant: "default",
            });
          } else {
            toast({
              title: "เกิดข้อผิดพลาด",
              description: response.message,
              variant: "destructive",
            });
          }
        } catch (error) {
          toast({
            title: "ข้อผิดพลาด",
            description: "ไม่สามารถเข้าร่วมกิจกรรมได้",
            variant: "destructive",
          });
        } finally {
          setLoading(false);
        }
      },
      () => {
        setLoading(false);
        toast({
          title: "ไม่สามารถเข้าถึงตำแหน่งได้",
          description: "กรุณาเปิดการเข้าถึงตำแหน่งของคุณในเบราว์เซอร์",
          variant: "destructive",
        });
      }
    );
  }, [activityId, isExpired, isNotStarted, activityLocation]);

  return (
    <div className="flex flex-col items-center justify-center bg-background p-8">
      <div className="mb-4 text-lg font-bold">{timeLeft}</div>
      <Button
        onClick={handleJoinActivity}
        disabled={loading || isExpired || isNotStarted}
        className="bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
      >
        {!loading && (
          <>
            <HiCursorClick className="mr-2" />
            เข้าร่วมกิจกรรม
          </>
        )}
        {loading && <ImSpinner2 className="animate-spin" />}
      </Button>
    </div>
  );
};

export default RegisSubmit;
