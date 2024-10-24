"use client";

import {
  ElementsType,
  FormElement,
  FormElementInstance,
} from "@/components/Activityform/FormElements";
import { Label } from "@/components/ui/label";

import { RiSeparator } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: RiSeparator,
    label: "เส้นแบ่งหัวข้อ",
  },
  designerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <Label>เส้นแบ่งหัวข้อ</Label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <Separator />;
}

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  return <p>ไม่มีคุณสมบัติสำหรับองค์ประกอบนี้</p>;
}
