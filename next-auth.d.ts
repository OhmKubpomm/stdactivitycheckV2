// ตัวอย่างไฟล์ types/next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  /**
   * เพิ่มการประกาศ Type สำหรับ 'user' ใน 'session'
   */
  interface User {
    id?: string;
    _id?: string; // หากคุณใช้ _id เป็น primary key ใน MongoDB
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string;
  }

  /**
   * ขยาย Type สำหรับ 'session' ให้รวม 'user' ที่มี Type ที่ขยายแล้ว
   */

  // eslint-disable-next-line no-unused-vars
  interface Session {
    user?: User;
    role?: string;
  }
}
