"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImShare } from "react-icons/im";
import { toast } from "@/components/ui/use-toast";

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
      <Input value={shareLink} readOnly />
      <Button
        className="w-[250px]"
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
    </div>
  );
}

export default FormLinkShare;
