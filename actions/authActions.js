"use server";
import { auth } from "@/auth";
import User from "@/models/Usermodel";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { generateToken, verifyToken } from "@/utils/token";
import sendEmail from "@/utils/sendEmail";

const BASE_URL = process.env.NEXTAUTH_URL;
const SALT_ROUNDS = 12; // กำหนดค่าความปลอดภัยที่เหมาะสม

async function getSession() {
  const session = await auth();
  if (!session) throw new Error("ไม่ได้รับอนุญาต");
  return session;
}

// อัปเดตข้อมูลผู้ใช้
export async function updateUser({ name, image }) {
  try {
    const session = await getSession();
    const updatedUser = await User.findByIdAndUpdate(
      session.user._id,
      { name, image },
      { new: true }
    ).select("-password");

    if (!updatedUser) throw new Error("ไม่พบผู้ใช้");

    return { msg: "อัปเดตสำเร็จ" };
  } catch (error) {
    return handleError(error);
  }
}

// ลงทะเบียนด้วยข้อมูลรับรอง
export async function signUpWithCredentials(data) {
  try {
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) throw new Error("อีเมลนี้ถูกใช้งานแล้ว");

    if (data.password) {
      // เข้ารหัสรหัสผ่านด้วย bcrypt
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    const token = generateToken({ user: data });

    await sendEmail({
      to: data.email,
      url: `${BASE_URL}/verify?token=${token}`,
      text: "ยืนยันอีเมลของคุณ",
    });

    return { msg: "ลงทะเบียนสำเร็จ กรุณายืนยันอีเมลของคุณ" };
  } catch (error) {
    return handleError(error);
  }
}

// ยืนยันด้วย token
export async function verifyWithCredentials(token) {
  try {
    const { user } = verifyToken(token);
    const existingUser = await User.findOne({ email: user.email });

    if (existingUser) return { msg: "ยืนยันอีเมลสำเร็จ" };

    const newUser = new User(user);
    await newUser.save();

    return { msg: "ลงทะเบียนสำเร็จ" };
  } catch (error) {
    return handleError(error);
  }
}

// เปลี่ยนรหัสผ่าน
export async function changePasswordWithCredentials({ oldPass, newPass }) {
  try {
    const session = await getSession();

    if (session.user.provider !== "credentials") {
      throw new Error(
        `บัญชีนี้ใช้ ${session.user.provider}. ไม่สามารถเปลี่ยนรหัสผ่านได้`
      );
    }

    const user = await User.findById(session.user._id);
    if (!user) throw new Error("ไม่พบผู้ใช้");

    const isValidOldPass = await bcrypt.compare(oldPass, user.password);
    if (!isValidOldPass) throw new Error("รหัสผ่านเก่าไม่ถูกต้อง");

    const hashedNewPass = await bcrypt.hash(newPass, SALT_ROUNDS);
    await User.findByIdAndUpdate(user._id, { password: hashedNewPass });

    return { msg: "เปลี่ยนรหัสผ่านสำเร็จ" };
  } catch (error) {
    return handleError(error);
  }
}

// ลืมรหัสผ่าน
export async function forgotPasswordWithCredentials({ email }) {
  try {
    const user = await User.findOne({ email });
    if (!user) throw new Error("ไม่พบผู้ใช้");

    if (user.provider !== "credentials") {
      throw new Error(
        `บัญชีนี้ใช้ ${user.provider}. ไม่สามารถรีเซ็ตรหัสผ่านได้`
      );
    }

    const token = generateToken({ userId: user._id });
    await sendEmail({
      to: email,
      url: `${BASE_URL}/reset_password?token=${token}`,
      text: "รีเซ็ตรหัสผ่านของคุณ",
    });

    return { msg: "กรุณาตรวจสอบอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน" };
  } catch (error) {
    return handleError(error);
  }
}

// รีเซ็ตรหัสผ่าน
export async function resetPasswordWithCredentials({ token, password }) {
  try {
    const { userId } = verifyToken(token);

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    return { msg: "รีเซ็ตรหัสผ่านสำเร็จ" };
  } catch (error) {
    return handleError(error);
  }
}

// จัดการข้อผิดพลาด
function handleError(error) {
  console.error(error);
  redirect(`/errors?error=${error.message}`);
}
