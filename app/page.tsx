import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (!session) {
    redirect("/Signin");
    return null; // เพื่อป้องกันการเข้าถึงโค้ดส่วนล่าง
  }

  // ตรวจสอบบทบาทของผู้ใช้จาก session
  const userRole = session?.user?.role;

  if (userRole === "admin") {
    redirect("/dashboard/cruduser");
  } else if (userRole === "user") {
    redirect("/dashboard/cruduser/Dashboard");
  } else {
    // เผื่อกรณีที่ไม่มีบทบาทที่ชัดเจน
    redirect("/Signin");
  }

  // คำสั่งนี้จะไม่ถูกเรียก แต่จำเป็นสำหรับ TypeScript
  return null;
}
