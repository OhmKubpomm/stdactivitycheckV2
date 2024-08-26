import { GetFormContentByUrl } from "@/actions/ActivityAction";
import { FormElementInstance } from "@/components/Activityform/FormElements";
import FormSubmitComponent from "@/components/Activityform/FormSubmitComponent";
import React from "react";

async function SubmitPage({
  params,
}: {
  params: {
    formUrl: string;
  };
}) {
  // ดึงข้อมูลฟอร์มจาก API
  const form = await GetFormContentByUrl(params.formUrl);

  if (!form || !form.ActivityContent) {
    throw new Error("form not found");
  }

  // แปลง JSON ที่เก็บอยู่ใน `ActivityContent` ให้เป็น JavaScript Object
  const formContent = JSON.parse(form.ActivityContent) as FormElementInstance[];

  // แปลง `endTime` ให้เป็น ISO string ถ้ามีค่า
  const endTime = form.endTime
    ? new Date(form.endTime).toISOString()
    : undefined;

  // ส่งข้อมูลไปยังคอมโพเนนต์
  return (
    <FormSubmitComponent
      formUrl={params.formUrl}
      content={formContent}
      endTime={endTime} // ส่ง `endTime` ไปยัง FormSubmitComponent
    />
  );
}

export default SubmitPage;
