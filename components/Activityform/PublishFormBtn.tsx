import { PublishForm } from "@/actions/ActivityAction";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { FaSpinner } from "react-icons/fa";
import { MdOutlinePublish } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useDesigner from "@/hooks/useDesigner";

function PublishFormBtn({ id }: { id: number }) {
  const { elements } = useDesigner();
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  async function publishForm() {
    try {
      const dateFieldElement = elements.find((el) => el.type === "DateField");
      const endTime = dateFieldElement?.extraAttributes?.endTime; // ตรวจสอบว่ามี endTime หรือไม่

      await PublishForm(id, endTime); // ส่ง endTime ไปยัง API หากมี
      toast({
        title: "สำเร็จ",
        description: "แบบฟอร์มของคุณพร้อมให้บริการแก่สาธารณะแล้ว",
      });
      router.refresh();
    } catch (error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดบางอย่าง",
      });
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="gap-2 bg-gradient-to-r from-indigo-400 to-cyan-400 text-white">
          <MdOutlinePublish className="size-4" />
          เผยแพร่
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>คุณแน่ใจแล้วใช่หรือไม่</AlertDialogTitle>
          <AlertDialogDescription>
            การดำเนินการนี้ไม่สามารถยกเลิกได้ หลังจากเผยแพร่แล้วคุณจะไม่สามารถ
            แก้ไขแบบฟอร์มนี้ <br />
            <br />
            <span className="font-medium">
              การเผยแพร่แบบฟอร์มนี้จะเป็นการเปิดเผยต่อสาธารณะ
              และคุณจะสามารถรวบรวมผลงานได้
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            onClick={(e) => {
              e.preventDefault();
              startTransition(publishForm);
            }}
            className=" bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          >
            ดำเนินการ {loading && <FaSpinner className="animate-spin" />}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
