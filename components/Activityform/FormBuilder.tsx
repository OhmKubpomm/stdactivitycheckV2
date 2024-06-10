/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "@/components/Activityform/PreviewDialogBtn";
import PublishFormBtn from "@/components/Activityform/PublishFormBtn";
import SaveFormBtn from "@/components/Activityform/SaveFormBtn";
import Designer from "@/components/Activityform/Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "@/components/Activityform/DragOverlayWrapper";
import useDesigner from "@/hooks/useDesigner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";

import Confetti from "react-confetti";
import { Loader2, ArrowLeftCircle, ArrowRightCircle } from "lucide-react";
import ActivityForm from "@/models/ActivityForm";

function FormBuilder({ form }: { form: typeof ActivityForm }) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10, // 10px
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    // Check if form.ActivityContent is defined before parsing
    const elements = form.ActivityContent
      ? JSON.parse(form.ActivityContent)
      : [];

    setElements(elements);
    setSelectedElement(null);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, isReady, setSelectedElement]);

  if (!isReady) {
    return (
      <div className="flex size-full flex-col items-center justify-center">
        <Loader2 className="size-12 animate-spin" />
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/submit/${form.ActivityShareurl}`;

  if (form.published) {
    return (
      <>
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className="flex size-full flex-col items-center justify-center">
          <div className="max-w-md">
            <h1 className="text-primary mb-10 border-b pb-2 text-center text-4xl font-bold">
              🎊🎊 ฟอร์มได้เผยแพร่แล้ว 🎊🎊
            </h1>
            <h2 className="text-2xl">แชร์ฟอร์มนี้</h2>
            <h3 className="text-muted-foreground border-b pb-10 text-xl">
              ใครที่มีลิงก์นี้สามารถดูและกรอกข้อมูลได้เลย
            </h3>
            <div className="my-4 flex w-full flex-col items-center gap-2 border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="mt-2 w-full"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({
                    title: "คัดลอกลิงก์!",
                    description: "คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว",
                  });
                }}
              >
                คัดลอกลิงก์
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/"} className="gap-2">
                  <ArrowLeftCircle />
                  กลับหน้าหลัก
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link
                  href={`/dashboard/crudactivityform/forms/${form._id}`}
                  className="gap-2"
                >
                  รายละเอียดฟอร์ม
                  <ArrowRightCircle />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex w-full flex-col">
        <nav className="flex items-center justify-between gap-3 border-b-2 p-4">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">ชื่อฟอร์ม:</span>
            {form.ActivityFormname}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form._id} />

                <PublishFormBtn id={form._id} />
              </>
            )}
          </div>
        </nav>

        <div className="bg-accent relative flex h-[200px] w-full grow items-center justify-center overflow-y-auto bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default FormBuilder;
