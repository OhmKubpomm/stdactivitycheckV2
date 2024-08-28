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
import { checkUserWithinRange } from "@/actions/mapActions"; // Import Server Action นี้

function FormSubmitComponent({
  formUrl,
  content,
  endTime,
}: {
  content: FormElementInstance[];
  formUrl: string;
  endTime?: string;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());
  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();
  const [isExpired, setIsExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isWithinRange, setIsWithinRange] = useState<boolean | null>(null);

  useEffect(() => {
    if (endTime) {
      const updateTimeLeft = () => {
        const currentTime = new Date().getTime();
        const endTimeDate = new Date(endTime).getTime();
        const timeDifference = endTimeDate - currentTime;

        if (timeDifference <= 0) {
          setIsExpired(true);
          setTimeLeft("หมดเวลาแล้ว");
        } else {
          const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
          );
          const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

          setTimeLeft(
            `${days} วัน ${hours} ชั่วโมง ${minutes} นาที ${seconds} วินาที`
          );
        }
      };
      updateTimeLeft();
      const timer = setInterval(updateTimeLeft, 1000);

      return () => clearInterval(timer);
    }
  }, [endTime]);

  // ฟังก์ชันตรวจสอบตำแหน่งของผู้ใช้เมื่อโหลดฟอร์ม
  useEffect(() => {
    const checkUserLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const { isWithinRange } = await checkUserWithinRange(
            userLocation,
            100 // ระยะทางในเมตร
          );

          setIsWithinRange(isWithinRange ?? false);

          if (!isWithinRange) {
            toast({
              title: "คุณอยู่ไกลเกินไป!",
              description:
                "คุณไม่สามารถเข้าถึงฟอร์มนี้ได้เนื่องจากคุณอยู่ไกลเกินไป",
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
  }, []);

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    if (isExpired) {
      toast({
        title: "ฟอร์มหมดเวลาแล้ว",
        description: "ไม่สามารถส่งแบบฟอร์มได้ เนื่องจากฟอร์มนี้หมดเวลาแล้ว",
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
        description: "โปรดตรวจสอบแบบฟอร์มเพื่อแก้ไขข้อผิดพลาด",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes("Form submission period has ended")
      ) {
        toast({
          title: "ฟอร์มหมดเวลาแล้ว",
          description: "ไม่สามารถส่งแบบฟอร์มได้ เนื่องจากฟอร์มนี้หมดเวลาแล้ว",
          variant: "destructive",
        });
        setIsExpired(true);
      } else {
        toast({
          title: "ข้อผิดพลาด",
          description: "เกิดข้อผิดพลาดบางอย่าง",
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
            คุณไม่สามารถเข้าถึงฟอร์มนี้ได้
          </h1>
          <p>คุณไม่ได้อยู่ในพื้นที่ที่กำหนด จึงไม่สามารถส่งแบบฟอร์มนี้ได้</p>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold">ส่งแบบฟอร์มแล้ว</h1>
          <p>ขอบคุณที่ส่งแบบฟอร์ม คุณสามารถปิดหน้านี้ได้เลย</p>
        </div>
      </div>
    );
  }

  if (isExpired) {
    return (
      <div className="flex size-full items-center justify-center p-8">
        <div className="flex w-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded border bg-background p-8 shadow-xl shadow-blue-700">
          <h1 className="text-2xl font-bold text-red-500">
            ฟอร์มนี้หมดเวลาแล้ว
          </h1>
          <p>คุณไม่สามารถส่งแบบฟอร์มนี้ได้เนื่องจากฟอร์มหมดเวลาแล้ว</p>
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
        {endTime && (
          <div className="mb-4 text-lg font-bold text-red-500">
            เวลาที่เหลือ: {timeLeft}
          </div>
        )}
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
          disabled={pending || isExpired}
        >
          {!pending && (
            <>
              <HiCursorClick className="mr-2" />
              ส่ง
            </>
          )}
          {pending && <ImSpinner2 className="animate-spin" />}
        </Button>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
