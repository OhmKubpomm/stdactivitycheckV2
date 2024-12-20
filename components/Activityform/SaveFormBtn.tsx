import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "@/hooks/useDesigner";
import { UpdateFormContent } from "@/actions/ActivityAction";
import { toast } from "@/components/ui/use-toast";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [isPending, startTransition] = useTransition();

  const updateFormContent = async () => {
    if (!elements || elements.length === 0) {
      toast({
        title: "ผิดพลาด",
        description: "ไม่พบข้อมูลแบบความต้องการผู้เข้าร่วมกิจกรรมที่จะบันทึก",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonElements = JSON.stringify(elements);

      await UpdateFormContent(id, jsonElements);
      toast({
        title: "สำเร็จ",
        description: "แบบความต้องการผู้เข้าร่วมกิจกรรมได้รับการบันทึกแล้ว",
      });
    } catch (error) {
      console.error("Error saving form:", error);
      toast({
        title: "ผิดพลาด",
        description:
          error instanceof Error
            ? error.message
            : "มีบางอย่างผิดปกติในการบันทึกแบบความต้องการผู้เข้าร่วมกิจกรรม",
        variant: "destructive",
      });
    }
  };

  return (
    <Button
      variant={"outline"}
      className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
      disabled={isPending}
      onClick={() => {
        startTransition(() => {
          updateFormContent();
        });
      }}
    >
      <HiSaveAs className="size-4" />
      บันทึก
      {isPending && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
