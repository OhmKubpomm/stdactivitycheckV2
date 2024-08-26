"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function VisitBtn({ shareUrl }: { shareUrl: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // avoiding window not defined error
  }

  const shareLink = `${window.location.origin}/submit/${shareUrl}`;
  return (
    <Button
      className="w-full rounded-lg bg-gradient-to-r from-primary-500 to-yellow-500 text-white shadow transition-all  md:w-auto"
      onClick={() => {
        window.open(shareLink, "_blank");
      }}
    >
      ดูแบบฟอร์ม
    </Button>
  );
}

export default VisitBtn;
