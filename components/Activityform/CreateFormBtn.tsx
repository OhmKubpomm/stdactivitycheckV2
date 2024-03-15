/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import { formSchema, formSchemaType } from "@/schemas/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Loader2, FilePlus2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { CreateForm } from "@/actions/ActivityAction";

import { useRouter } from "next/navigation";

function CreateFormBtn() {
  const router = useRouter();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
  });

  async function onSubmit(values: formSchemaType) {
    try {
      const form = await CreateForm(values);
      const formId = form._id;
      toast({
        title: "สำเร็จ",
        description: "ฟอร์มถูกสร้างเรียบร้อยแล้ว",
      });
      router.push(`/dashboard/crudactivityform/builder/${formId}`);
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถสร้างฟอร์มได้ในขณะนี้",
        variant: "destructive",
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant={"outline"}
          className="border-primary/20 hover:border-primary group flex h-[190px] flex-col items-center justify-center gap-4 border border-dashed hover:cursor-pointer"
        >
          <FilePlus2 className="text-muted-foreground group-hover:text-primary size-8" />
          <p className="text-muted-foreground group-hover:text-primary text-xl font-bold">
            สร้างฟอร์มใหม่
          </p>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>สร้างฟอร์ม</DialogTitle>
          <DialogDescription>
            สร้างฟอร์มใหม่เพื่อเริ่มรวบรวมข้อมูล
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="ActivityFormname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ชื่อฟอร์ม</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ActivityDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>รายละเอียด</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            onClick={form.handleSubmit(onSubmit)}
            disabled={form.formState.isSubmitting}
            className="mt-4 w-full bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          >
            {!form.formState.isSubmitting && <span>ยืนยัน</span>}
            {form.formState.isSubmitting && (
              <Loader2 className="animate-spin" />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateFormBtn;
