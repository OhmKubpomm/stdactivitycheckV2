"use server";
import { auth } from "@/utils/auth";
import ActivityForm from "@/models/ActivityForm";
import { formSchema, formSchemaType } from "@/schemas/form";
import connectdatabase from "@/utils/connectdatabase";

import { revalidatePath } from "next/cache";
import User from "@/models/Usermodel";
import Formsubs from "@/models/FormSubmissions";
import { Document, ObjectId } from "mongoose";

connectdatabase();

// Interface สำหรับ Formsub
interface FormSubmission extends Document {
  userId: ObjectId;
  formId: ObjectId;
  createdAt: Date;
  Formsubcontent: string;
}

// Interface สำหรับ User
interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  image?: string;
  Firstname?: string;
  Lastname?: string;
  Date?: string;
  Telephone?: string;
  Address?: string;
  role: string;
  provider: string;
}

export async function GetFormStats() {
  const session = await auth();

  const userId = session?.user?._id ?? null;
  if (!userId) throw new Error("User not found");
  const stats = await ActivityForm.aggregate([
    { $match: { userId } },
    {
      $group: {
        _id: null,
        visits: { $sum: "$ActivityVisits" },
        submissions: { $sum: "$ActivitySubmissions" },
      },
    },
  ]);

  const visits = stats[0]?.visits || 0;
  const submissions = stats[0]?.submissions || 0;

  let submissionRate = 0;

  if (visits > 0) {
    submissionRate = (submissions / visits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return {
    visits,
    submissions,
    submissionRate,
    bounceRate,
  };
}

// สร้างฟอร์มใหม่
export async function CreateForm(data: formSchemaType) {
  try {
    // สมมติว่า formSchema.safeParse(data) เป็นฟังก์ชันที่ใช้สำหรับการตรวจสอบความถูกต้องของฟอร์ม และคืนค่าออบเจ็กต์ที่มีคุณสมบัติ success
    // หากฟอร์มไม่ถูกต้อง ให้โยนข้อผิดพลาด
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("ฟอร์มไม่ถูกต้อง");
    }

    // สมมติว่า currentUser() เป็นฟังก์ชันที่คืนค่าข้อมูลผู้ใช้งานปัจจุบัน
    // หากไม่พบผู้ใช้งาน ให้โยนข้อผิดพลาด
    const session = await auth();
    if (!session) throw new Error("ไม่พบผู้ใช้งาน");

    // แยกค่า name และ description จาก data
    const { ActivityFormname, ActivityDescription } = data;

    // สร้างออบเจ็กต์ฟอร์มใหม่ด้วยข้อมูลที่ให้มา
    const newActivityForm = new ActivityForm({
      userId: session?.user?._id, // สมมติว่า user.id เป็น ID ของผู้ใช้งาน
      ActivityFormname,
      ActivityDescription,
    });

    // บันทึกฟอร์มใหม่ลงใน MongoDB
    await newActivityForm.save();

    // สมมติว่า revalidatePath("/") เป็นฟังก์ชันที่ใช้ในการรีเฟรชหน้าหรือทำการอื่น ๆ
    // นี่เป็นตัวอย่างเพื่อแสดงตัวอย่างการใช้งานหลังจากบันทึกฟอร์ม
    revalidatePath("/");

    // คืนค่าข้อมูลฟอร์มใหม่พร้อมแปลง _id เป็นสตริง
    return {
      ...newActivityForm._doc,
      _id: newActivityForm._id.toString(),
    };
  } catch (Error) {
    // คืนค่าข้อความของข้อผิดพลาด
  }
}

// ดึงฟอร์มทั้งหมด
export async function GetForms() {
  const session = await auth();
  if (!session) throw new Error("ไม่พบผู้ใช้งาน");

  const user = await User.findById(session?.user?._id);
  if (!user) throw new Error("ไม่พบผู้ใช้งาน");

  // ตรวจสอบว่าเป็น admin หรือไม่
  if (user.role !== "admin") {
    throw new Error("คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้");
  }

  // ดึงและคืนค่าฟอร์มกิจกรรมทั้งหมด (ไม่กรองด้วย userId)
  try {
    const activityForms = await ActivityForm.find()
      .sort({ createdAt: -1 }) // เรียงจากใหม่ไปเก่า
      .exec();
    return activityForms;
  } catch (error) {
    console.error("ไม่สามารถค้นหาฟอร์มกิจกรรมได้:", error);
    throw error;
  }
}

// ดึงฟอร์มตาม ID
export async function GetFormById(id: Object) {
  try {
    const session = await auth();
    if (!session) throw new Error("ไม่พบผู้ใช้งาน");

    const user = await User.findById(session?.user?._id);
    if (!user) throw new Error("ไม่พบผู้ใช้งาน");

    // ตรวจสอบว่าเป็น admin หรือไม่
    if (user.role !== "admin") {
      throw new Error("คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้");
    }

    // ดึงฟอร์มตาม ID โดยไม่สนใจว่าใครเป็นผู้สร้าง
    const form = await ActivityForm.findById(id);
    if (!form) throw new Error("ไม่พบฟอร์มกิจกรรม");

    return { ...form._doc, _id: form._doc._id.toString() };
  } catch (error) {
    console.error("ไม่สามารถค้นหาฟอร์มกิจกรรมได้:", error);
    throw error;
  }
}

// Update form content
export async function UpdateFormContent(
  id: number,
  jsonContent: string,
  endTime: Date | undefined
) {
  try {
    const session = await auth();
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const updateData: any = { ActivityContent: jsonContent };
    if (endTime) {
      updateData.endTime = endTime;
    }

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id, userId: user._id }, // Match the form by its ID and the user's ID
      updateData, // Update the content field and endTime if provided
      { new: true } // Return the updated document
    );

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error("Failed to find activity forms:", error);
    throw error;
  }
}

export async function PublishForm(id: number, endTime?: Date) {
  try {
    const session = await auth();
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const updateData: any = { published: true };
    if (endTime) {
      updateData.endTime = endTime; // บันทึก endTime ลงในฐานข้อมูล
    }

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id, userId: user._id },
      updateData,
      { new: true }
    );

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error("Failed to find activity forms:", error);
    throw error;
  }
}

export async function GetFormContentByUrl(formUrl: string) {
  try {
    // ดึงข้อมูล `endTime` และ `ActivityContent` จากฐานข้อมูล
    const form = await ActivityForm.findOneAndUpdate(
      { ActivityShareurl: formUrl }, // Match document by shared URL
      { $inc: { ActivityVisits: 1 } }, // Increment visits counter
      { new: true } // Return updated document
    );

    // ตรวจสอบว่ามีฟอร์มหรือไม่
    if (!form) {
      console.error("No form found with the given URL:", formUrl);
      return { ActivityContent: null, endTime: null }; // ส่งกลับ endTime เป็น null
    }

    // ส่ง `ActivityContent` และ `endTime` กลับไป
    return {
      ActivityContent: form.ActivityContent,
      endTime: form.endTime, // ดึง `endTime` มาจากฐานข้อมูล
    };
  } catch (error) {
    console.error("Error updating form visits:", error);
    throw error;
  }
}

export async function SubmitForm(formUrl: string, content: string) {
  try {
    const session = await auth();
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const form = await ActivityForm.findOne({
      ActivityShareurl: formUrl,
      published: true,
    });

    if (!form) {
      throw new Error("Form not found");
    }

    // Check if ActivitySubmissions is a valid number
    if (isNaN(form.ActivitySubmissions)) {
      form.ActivitySubmissions = 0;
    }

    // Increment submissions count
    form.ActivitySubmissions += 1;

    // สร้าง submission ใหม่
    const formSubmission = new Formsubs({
      Formsubcontent: content,
      formId: form._id,
      userId: user._id,
    });

    // บันทึก submission ใหม่
    await formSubmission.save();
    // บันทึกการเปลี่ยนแปลงฟอร์ม
    await form.save();

    return {
      ...formSubmission._doc,
      _id: formSubmission._id.toString(),
      userId: formSubmission.userId.toString(),
      formId: formSubmission.formId.toString(),
    };
  } catch (error) {
    console.error("Error submitting form:", error);
    throw error;
  }
}

export async function GetFormWithSubmissions(id: number) {
  const session = await auth();
  if (!session) throw new Error("ไม่พบผู้ใช้งาน");

  const user = await User.findById(session?.user?._id);
  if (!user) throw new Error("ไม่พบผู้ใช้งาน");

  // ตรวจสอบว่าเป็น admin หรือไม่
  if (user.role !== "admin") {
    throw new Error("คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้");
  }

  // ดึงฟอร์มตาม ID โดยไม่กรองด้วย userId
  const form = await ActivityForm.findOne({ _id: id }).lean();
  if (!form) {
    return null;
  }

  // ดึง submission ทั้งหมดที่เกี่ยวข้องกับฟอร์มนั้น
  const submissions = (await Formsubs.find({
    formId: form._id,
  }).lean()) as FormSubmission[];

  // ดึงชื่อผู้ใช้สำหรับแต่ละ submission
  const submissionsWithUserNames = await Promise.all(
    submissions.map(async (submission) => {
      const user = (await User.findById(submission.userId).lean()) as IUser;
      return {
        ...submission,
        userSendName: user?.name || "Unknown User",
      };
    })
  );

  form.FormSubmissions = submissionsWithUserNames;

  return { ...form };
}

// ลบฟอร์ม
export async function DeleteForm(id: number) {
  try {
    const session = await auth();
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const deletedForm = await ActivityForm.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    return { ...deletedForm._doc, _id: deletedForm._doc._id.toString() };
  } catch (error) {
    console.error("Failed to find activity forms:", error);
    throw error;
  }
}
