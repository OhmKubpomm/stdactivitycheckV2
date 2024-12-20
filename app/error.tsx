/* eslint-disable react-hooks/rules-of-hooks */
"use client";

import { Button as MuiButton } from "@mui/material";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import Errorpage from "@/public/Image/Pagenotfound.svg";

const page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errMsg = searchParams.get("error");

  // Define animation variants

  return (
    <div className="bg-white py-6 sm:py-0">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <div className="flex flex-col items-center justify-center gap-8 sm:gap-12">
          <div className="flex flex-col items-center justify-center sm:items-start md:py-24 lg:py-32 ">
            <p className="mb-4 text-sm font-semibold uppercase text-indigo-500 md:text-base">
              Error {errMsg}
            </p>
            <h1 className="mb-2 text-center text-2xl font-bold text-gray-800 sm:text-left md:text-3xl">
              หน้านี้ไม่พร้อมใช้งาน
            </h1>

            <p className="mb-8 text-center text-gray-500 sm:text-left md:text-lg">
              หน้าที่คุณหาไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้งในภายหลัง
            </p>
            <Image
              src={Errorpage}
              loading="lazy"
              sizes="100vw"
              style={{ width: "auto", height: "auto" }}
              width={200}
              height={100}
              quality={60}
              alt="Photo by Jeremy Cai"
            />
            <MuiButton
              className="custom-button mt-8"
              variant="contained"
              onClick={() => router.back()}
            >
              ย้อนกลับ
            </MuiButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
