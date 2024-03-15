"use server";
import { config } from "@/utils/authOptions";
import ActivityForm from "@/models/ActivityForm";
import { formSchema, formSchemaType } from "@/schemas/form";
import connectdatabase from "@/utils/connectdatabase";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import User from "@/models/Usermodel";
import Formsubs from "@/models/FormSubmissions";

connectdatabase();

export async function GetFormStats() {
  const session = await getServerSession(config);

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
    const session = await getServerSession(config);
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
  const session = await getServerSession(config);
  const user = await User.findById(session?.user?._id);
  if (!session) throw new Error("ไม่พบผู้ใช้งาน");

  // ดึงและคืนค่าฟอร์มกิจกรรมสำหรับผู้ใช้
  try {
    const activityForms = await ActivityForm.find({
      userId: user.id,
    })
      .sort({ createdAt: -1 })
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
    const session = await getServerSession(config);
    const userId = session?.user?._id;

    if (!session) throw new Error("ไม่พบผู้ใช้งาน");

    // ตรวจสอบว่าผู้ใช้งานมีอยู่จริงหรือไม่
    const userExists = await User.exists({ _id: userId });
    if (!userExists) throw new Error("ไม่พบผู้ใช้งาน");

    // ใช้เลขประจำตัว id ในการค้นหาฟอร์มโดยตรง
    const form = await ActivityForm.findById(id);
    return { ...form._doc, _id: form._doc._id.toString() };
  } catch (error) {
    console.error("ไม่สามารถค้นหาฟอร์มกิจกรรมได้:", error);
    return { error };
  }
}

// Update form content
export async function UpdateFormContent(id: number, jsonContent: string) {
  try {
    const session = await getServerSession(config);
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id, userId: user._id }, // Match the form by its ID and the user's ID
      { ActivityContent: jsonContent }, // Update the content field
      { new: true } // Return the updated document
    );

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error("Failed to find activity forms:", error);
    throw error;
  }
}

export async function PublishForm(id: number) {
  try {
    const session = await getServerSession(config);
    const user = await User.findById(session?.user?._id);
    if (!session) throw new Error("User not found");

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id, userId: user._id },
      { published: true },
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
    const form = await ActivityForm.findOneAndUpdate(
      { ActivityShareurl: formUrl }, // Match document by shared URL
      { $inc: { ActivityVisits: 1 } }, // Increment visits counter
      { new: true } // Return updated document with only the content field
    );

    // Check if the form is null and handle the case
    if (!form) {
      console.error("No form found with the given URL:", formUrl);
      // Handle according to your application's needs, e.g., return null, throw an error, or return a default value
      return { ActivityContent: null }; // or throw new Error("Form not found");
    }
    return { ActivityContent: form.ActivityContent };
  } catch (error) {
    console.error("Error updating form visits:", error);
    throw error;
  }
}

export async function SubmitForm(formUrl: string, content: string) {
  try {
    const form = await ActivityForm.findOne({
      ActivityShareurl: formUrl,
      published: true,
    });

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
    });

    // บันทึก submission ใหม่
    await formSubmission.save();
    // บันทึกการเปลี่ยนแปลงฟอร์ม
    await form.save();

    return {
      ...formSubmission._doc,
      _id: formSubmission._id.toString(),
      formId: formSubmission._id.toString(),
    };
  } catch (error) {
    console.error("Error updating form visits:", error);
    throw error;
  }
}

export async function GetFormWithSubmissions(id: number) {
  const session = await getServerSession(config);
  const user = await User.findById(session?.user?._id);
  if (!session) throw new Error("User not found");

  // หาฟอร์มที่ตรงกับ ID และ userID ของผู้ใช้งาน
  const form = await ActivityForm.findOne({
    _id: id,
    userId: user?.id,
  }).lean(); // ใช้ .lean() เพื่อรับข้อมูลเป็น plain JavaScript object

  if (!form) {
    return null; // หรือจัดการกรณีที่ไม่พบข้อมูลตามที่ต้องการ
  }

  // ค้นหา submissions ที่เกี่ยวข้องกับฟอร์มนี้
  const submissions = await Formsubs.find({
    formId: form._id,
  }).lean(); // ใช้ form._id เพื่ออ้างอิง

  // รวมข้อมูล submissions กลับเข้าไปใน object ฟอร์ม
  form.FormSubmissions = submissions;
  if (!submissions) {
    return null; // หรือจัดการกรณีที่ไม่พบข้อมูลตามที่ต้องการ
  }
  return { ...form };
}

// ลบฟอร์ม
export async function DeleteForm(id: number) {
  try {
    const session = await getServerSession(config);
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
