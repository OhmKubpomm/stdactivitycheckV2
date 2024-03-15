/* eslint-disable tailwindcss/no-custom-classname */
import React from "react";
import { Button } from "@/components/ui/button";

import { ScanEye } from "lucide-react";
import useDesigner from "@/hooks/useDesigner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FormElements } from "@/components/Activityform/FormElements";

function PreviewDialogBtn() {
  const { elements } = useDesigner();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="gap-2">
          <ScanEye className="size-6" />
          ตัวอย่างแบบฟอร์ม
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-screen max-h-screen w-screen max-w-full grow flex-col gap-0 p-0">
        <div className="border-b px-4 py-2">
          <p className="text-muted-foreground text-lg font-bold">
            แสดงตัวอย่างแบบฟอร์ม
          </p>
          <p className="text-muted-foreground text-sm">
            นี่คือลักษณะของแบบฟอร์มของคุณสำหรับหน้าผู้ใช้
          </p>
        </div>
        <div className="bg-accent flex grow flex-col items-center justify-center overflow-y-auto bg-[url(/paper.svg)] p-4 dark:bg-[url(/paper-dark.svg)]">
          <div className="flex size-full max-w-[620px] grow flex-col gap-4 overflow-y-auto rounded-2xl bg-background p-8">
            {elements.map((element) => {
              const FormComponent = FormElements[element.type].formComponent;
              return (
                <FormComponent key={element.id} elementInstance={element} />
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;
