"use client";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import {
  FormElementInstance,
  FormElements,
} from "@/components/Activityform/FormElements";
import { Button } from "@/components/ui/button";
import { HiCursorClick } from "react-icons/hi";
import { toast } from "@/components/ui/use-toast";
import { ImSpinner2 } from "react-icons/im";
import { SubmitForm } from "@/actions/ActivityAction";
import { checkUserWithinRange } from "@/actions/mapActions";

function FormSubmitComponent({
  formUrl,
  content,
  startTime,
  endTime,
  activityLocation,
}: {
  content: FormElementInstance[];
  formUrl: string;
  startTime?: string;
  endTime?: string;
  activityLocation: string;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [isExpired, setIsExpired] = useState(false);
  const [isNotStarted, setIsNotStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

  useEffect(() => {
    const updateTimeStatus = () => {
      const currentTime = new Date().getTime();
      const startTimeDate = startTime ? new Date(startTime).getTime() : 0;
      const endTimeDate = endTime ? new Date(endTime).getTime() : Infinity;

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
  }, [startTime, endTime]);

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

  useEffect(() => {
    const checkUserLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          // ส่ง ActivityLocation ไปยัง API
          const { isWithinRange } = await checkUserWithinRange(
            userLocation,
            100, // ระยะที่ต้องการตรวจสอบ
            activityLocation // ส่ง ActivityLocation ที่ได้รับจาก props
          );

          setIsWithinRange(isWithinRange ?? false);

          if (!isWithinRange) {
            toast({
              title: "คุณอยู่ไกลเกินไป!",
              description:
                "คุณไม่สามารถเข้าถึงแบบความต้องการผู้เข้าร่วมกิจกรรมนี้ได้เนื่องจากคุณอยู่ไกลเกินไป",
              variant: "destructive",
            });
          }
        },
        () => {
          toast({
            title: "พบข้อผิดพลาด",
            description: "ไม่สามารถเข้าถึงตำแหน่งของคุณได้",
            variant: "destructive",
          });
          setIsWithinRange(false);
        }
      );
    };

    checkUserLocation();
  }, [activityLocation]);

  const validateForm: () => boolean = useCallback(() => {
    let isValid = true;
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
        isValid = false;
      }
    }

    return isValid;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    if (isExpired) {
      toast({
        title: "แบบความต้องการผู้เข้าร่วมกิจกรรมหมดเวลาแล้ว",
        description:
          "ไม่สามารถส่งแบบความต้องการผู้เข้าร่วมกิจกรรมได้ เนื่องจากแบบความต้องการผู้เข้าร่วมกิจกรรมนี้หมดเวลาแล้ว",
        variant: "destructive",
      });
      return;
    }

    if (isNotStarted) {
      toast({
        title: "แบบความต้องการผู้เข้าร่วมกิจกรรมยังไม่เปิดให้ทำ",
        description:
          "กรุณารอจนกว่าจะถึงเวลาเริ่มต้นของแบบความต้องการผู้เข้าร่วมกิจกรรม",
        variant: "destructive",
      });
      return;
    }

    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "ข้อผิดพลาด",
        description:
          "โปรดตรวจสอบแบบความต้องการผู้เข้าร่วมกิจกรรมเพื่อแก้ไขข้อผิดพลาด",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
      toast({
        title: "ส่งแบบแบบความต้องการผู้เข้าร่วมกิจกรรมสำเร็จ",
        description: "ขอบคุณสำหรับการส่งแบบความต้องการผู้เข้าร่วมกิจกรรม",
        variant: "default",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("Form submission period has ended")) {
          toast({
            title: "แบบความต้องการผู้เข้าร่วมกิจกรรมหมดเวลาแล้ว",
            description:
              "ไม่สามารถส่งแบบความต้องการผู้เข้าร่วมกิจกรรมได้ เนื่องจากแบบความต้องการผู้เข้าร่วมกิจกรรมนี้หมดเวลาแล้ว",
            variant: "destructive",
          });
          setIsExpired(true);
        } else {
          toast({
            title: "ข้อผิดพลาด",
            description: error.message || "เกิดข้อผิดพลาดบางอย่าง",
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ",
          variant: "destructive",
        });
      }
    }
  };

  if (isWithinRange === false) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold text-red-500">
            คุณไม่สามารถเข้าถึงแบบความต้องการผู้เข้าร่วมกิจกรรมนี้ได้
          </h1>
          <p>
            คุณไม่ได้อยู่ในพื้นที่ที่กำหนด
            จึงไม่สามารถส่งแบบความต้องการผู้เข้าร่วมกิจกรรมนี้ได้
          </p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold">
            ส่งแบบความต้องการผู้เข้าร่วมกิจกรรมแล้ว
          </h1>
          <p>
            ขอบคุณที่ส่งแบบความต้องการผู้เข้าร่วมกิจกรรม
            คุณสามารถปิดหน้านี้ได้เลย
          </p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold text-red-500">
            แบบความต้องการผู้เข้าร่วมกิจกรรมนี้หมดเวลาแล้ว
          </h1>
          <p>
            คุณไม่สามารถส่งแบบแบบความต้องการผู้เข้าร่วมกิจกรรมนี้ได้เนื่องจากแบบความต้องการผู้เข้าร่วมกิจกรรมหมดเวลาแล้ว
          </p>
          {endTime && (
            <p>
              หมดเวลาเมื่อ:{" "}
              {new Date(endTime).toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok",
              })}
            </p>
          )}
        </div>
      </div>
    );
  }

  if (isNotStarted) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold text-yellow-500">
            แบบความต้องการผู้เข้าร่วมกิจกรรมนี้ยังไม่เปิดให้ทำ
          </h1>
          <p>
            กรุณารอจนกว่าจะถึงเวลาเริ่มต้นของแบบความต้องการผู้เข้าร่วมกิจกรรม
          </p>
          {startTime && (
            <p>
              เริ่มเวลา:{" "}
              {new Date(startTime).toLocaleString("th-TH", {
                timeZone: "Asia/Bangkok",
              })}
            </p>
          )}
          <p className="text-lg font-bold">{timeLeft}</p>
        </div>
      </div>
    );
  }

  if (isWithinRange === null) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <ImSpinner2 className="mx-auto animate-spin text-3xl text-blue-500" />
          <p className="text-center">กำลังตรวจสอบตำแหน่งของคุณ...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex size-full items-center justify-center p-8">
      <div
        key={renderKey}
        className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700"
      >
        <div className="mb-4 text-lg font-bold text-blue-500">{timeLeft}</div>
        {content.map((element) => {
          const FormElement = FormElements[element.type].formComponent;
          return (
            <FormElement
              key={element.id}
              elementInstance={element}
              submitValue={submitValue}
              isInvalid={formErrors.current[element.id]}
              defaultValue={formValues.current[element.id]}
            />
          );
        })}
        <Button
          className="mt-8 bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          onClick={() => {
            startTransition(submitForm);
          }}
          disabled={pending || isExpired || isNotStarted}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              ส่งสำรองที่นั่ง
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
