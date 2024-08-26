"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "@/components/ui/use-toast";
import QRCode from "qrcode.react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

function FormLinkShare({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;

  return (
    <div className="flex grow items-center gap-4">
      <Input
        value={shareLink}
        className="rounded-lg border px-4 py-2 text-gray-700 focus:outline-none focus:ring focus:ring-blue-500 md:flex-1"
        readOnly
      />
      <Button
        className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white shadow transition-all hover:bg-blue-700 md:w-auto"
        onClick={() => {
          navigator.clipboard.writeText(shareLink);
          toast({
            title: "คัดลอกลิงก์!",
            description: "คัดลอกลิงก์ไปยังคลิปบอร์ดแล้ว",
          });
        }}
      >
        <ImShare className="mr-2 size-4" />
        แชร์ฟอร์มนี้
      </Button>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full rounded-lg bg-green-600 px-4 py-2 text-white shadow transition-all hover:bg-green-700 md:w-auto">
            สร้าง QR Code
          </Button>
        </DialogTrigger>
        <DialogContent className="flex flex-col items-center rounded-lg bg-gray-100 p-6 shadow-md">
          <QRCode value={shareLink} size={200} className="rounded-lg" />
          <p className="mt-4 text-gray-700">แสกนเพื่อเข้าถึงฟอร์มนี้</p>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default FormLinkShare;
