"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";

import { DeleteForm } from "@/actions/ActivityAction";
import { Trash2 } from "lucide-react";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";

const DeleteBtn = ({ formId }: { formId: number }) => {
  async function handleDelete(formId: number) {
    try {
      const res = await DeleteForm(formId);
      if (res.error) {
        toast({
          title: "Error",
          description: res.error,
        });
      } else {
        toast({
          style: {
            background: "green",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          },
          title: "ลบตำแหน่งแผนที่สำเร็จ",
          description: "ตำแหน่งแผนที่ถูกลบออกจากระบบของคุณแล้ว",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "มีบางอย่างผิดปกติ กรุณาลองใหม่อีกครั้ง",
      });
    }
  }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="items-center">
        <DropdownMenuLabel>
          <Trash2 color="red" />
        </DropdownMenuLabel>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งแผนที่
          </AlertDialogTitle>
          <AlertDialogDescription>
            การดำเนินการนี้จะลบตำแหน่งแผนที่ลงในบัญชีของคุณจากเซิร์ฟเวอร์ของเรา
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction>
            <Button
              className=" w-full bg-gradient-to-r from-primary-500 to-yellow-500 text-white "
              type="button" // Ensure it's a button to avoid form submission
              onClick={() => handleDelete(formId)}
            >
              ตกลง
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
export default DeleteBtn;
