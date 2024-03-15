/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import SidebarBtnElement from "@/components/Activityform/SidebarBtnElement";
import { FormElements } from "@/components/Activityform/FormElements";
import { Separator } from "@/components/ui/separator";

function FormElementsSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70">โปรดลากและวางองค์ประกอบ</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 place-items-center gap-2 md:grid-cols-2">
        <p className="text-muted-foreground col-span-1 my-2 place-self-start text-sm md:col-span-2">
          องค์ประกอบเค้าโครง
        </p>
        <SidebarBtnElement formElement={FormElements.TitleField} />
        <SidebarBtnElement formElement={FormElements.SubTitleField} />
        <SidebarBtnElement formElement={FormElements.ParagraphField} />
        <SidebarBtnElement formElement={FormElements.SeparatorField} />
        <SidebarBtnElement formElement={FormElements.SpacerField} />

        <p className="text-muted-foreground col-span-1 my-2 place-self-start text-sm md:col-span-2">
          องค์ประกอบสำหรับแบบฟอร์ม
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
        <SidebarBtnElement formElement={FormElements.NumberField} />
        <SidebarBtnElement formElement={FormElements.TextAreaField} />
        <SidebarBtnElement formElement={FormElements.DateField} />
        <SidebarBtnElement formElement={FormElements.SelectField} />
        <SidebarBtnElement formElement={FormElements.CheckboxField} />
      </div>
    </div>
  );
}

export default FormElementsSidebar;
