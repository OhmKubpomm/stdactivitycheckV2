import React, { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { HiSaveAs } from "react-icons/hi";
import useDesigner from "@/hooks/useDesigner";
import { UpdateFormContent } from "@/actions/ActivityAction";
import { toast } from "@/components/ui/use-toast";
import { FaSpinner } from "react-icons/fa";

function SaveFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();

  const updateFormContent = async () => {
    try {
      const jsonElements = JSON.stringify(elements);
      if (!jsonElements) {
        console.error("No form elements to save", jsonElements);
        return; // Or handle the error appropriately
      }
      await UpdateFormContent(id, jsonElements);
      toast({
        title: "สำเร็จ",
        description: "ฟอร์มได้รับการบันทึกแล้ว",
      });
    } catch (error) {
      toast({
        title: "ผิดพลาด",
        description: "มีบางอย่างผิดปกติในการบันทึกฟอร์ม",
        variant: "destructive",
      });
    }
  };
  return (
    <Button
      variant={"outline"}
      className="gap-2"
      disabled={loading}
      onClick={() => {
        startTransition(updateFormContent);
      }}
    >
      <HiSaveAs className="size-4" />
      บันทึก
      {loading && <FaSpinner className="animate-spin" />}
    </Button>
  );
}

export default SaveFormBtn;
