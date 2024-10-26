"use server";
import { auth } from "@/auth";
import ActivityForm from "@/models/ActivityForm";
import { formSchema, formSchemaType } from "@/schemas/form";
import connectdatabase from "@/utils/connectdatabase";
import { revalidatePath } from "next/cache";
import User from "@/models/Usermodel";
import Formsubs from "@/models/FormSubmissions";
import mongoose, { Document, ObjectId } from "mongoose";
import { checkUserWithinRange } from "@/actions/mapActions";
connectdatabase();

// Interface สำหรับ Formsub
interface FormSubmission extends Document {
  userId: ObjectId;
  formId: ObjectId;
  createdAt: Date;
  Formsubcontent: string;
}

interface Participation {
  activityId: mongoose.Schema.Types.ObjectId; // ชนิดของ activityId
  bookingStatus: string;
  registrationStatus: string;
  questionnaireStatus: string;
  completionStatus: string;
}

// Interface สำหรับ Activity
export interface Activity {
  _id: string;
  ActivityFormname: string;
  ActivityDescription?: string;
  ActivityType?: string;
  startTime?: Date;
  endTime?: Date;
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

// ฟังก์ชันตรวจสอบสิทธิ์แอดมิน
async function checkAdminPermission() {
  const session = await auth();
  if (!session) throw new Error("ไม่พบผู้ใช้งาน");

  const user = await User.findById(session?.user?._id);
  if (!user) throw new Error("ไม่พบผู้ใช้งาน");

  if (user.role !== "admin") {
    throw new Error("คุณไม่มีสิทธิ์ในการเข้าถึงข้อมูลนี้");
  }

  return user;
}

export async function GetFormStats() {
  try {
    await checkAdminPermission();

    const stats = await ActivityForm.aggregate([
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
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการดึงสถิติแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    throw new Error("ไม่สามารถดึงสถิติแบบความต้องการผู้เข้าร่วมกิจกรรมได้");
  }
}

export async function CreateForm(data: formSchemaType) {
  try {
    const user = await checkAdminPermission();

    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("ข้อมูลแบบความต้องการผู้เข้าร่วมกิจกรรมไม่ถูกต้อง");
    }

    const { ActivityFormname, ActivityDescription } = data;

    const newActivityForm = new ActivityForm({
      userId: user._id,
      ActivityFormname,
      ActivityDescription,
    });

    await newActivityForm.save();

    revalidatePath("/");

    return {
      ...newActivityForm._doc,
      _id: newActivityForm._id.toString(),
    };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการสร้างแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    throw new Error("ไม่สามารถสร้างแบบความต้องการผู้เข้าร่วมกิจกรรมได้");
  }
}

export async function GetForms() {
  try {
    await checkAdminPermission();

    const activityForms = await ActivityForm.find()
      .sort({ createdAt: -1 })
      .exec();
    return activityForms;
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการดึงแบบความต้องการผู้เข้าร่วมกิจกรรมทั้งหมด:",
      error
    );
    throw new Error("ไม่สามารถดึงแบบความต้องการผู้เข้าร่วมกิจกรรมทั้งหมดได้");
  }
}

export async function GetFormById(id: Object) {
  try {
    await checkAdminPermission();

    const form = await ActivityForm.findById(id);
    if (!form) throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมกิจกรรม");

    return { ...form._doc, _id: form._doc._id.toString() };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการดึงแบบความต้องการผู้เข้าร่วมกิจกรรมตาม ID:",
      error
    );
    throw new Error("ไม่สามารถดึงแบบความต้องการผู้เข้าร่วมกิจกรรมตาม ID ได้");
  }
}

export async function UpdateFormContent(id: number, jsonContent: string) {
  try {
    await checkAdminPermission();

    const updateData: any = { ActivityContent: jsonContent };

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedForm)
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการอัปเดต");

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการอัปเดตเนื้อหาแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    throw new Error(
      "ไม่สามารถอัปเดตเนื้อหาแบบความต้องการผู้เข้าร่วมกิจกรรมได้"
    );
  }
}

export async function PublishForm(
  id: number,
  startTime: string,
  endTime: string,
  regisStartTime: string,
  regisEndTime: string,
  activityType: string,
  activityLocation: string,
  longitude: number,
  latitude: number
) {
  try {
    const session = await auth();
    if (!session) throw new Error("ไม่พบผู้ใช้งาน");

    const regisEndDate = new Date(regisEndTime);

    // คำนวณ ActivityEndTime (2 วันถัดจาก regisEndTime)
    const activityEndTime = new Date(regisEndDate);
    activityEndTime.setDate(activityEndTime.getDate() + 2);

    const updateData = {
      published: true,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      regisStartTime: new Date(regisStartTime),
      regisEndTime: new Date(regisEndTime),
      ActivityEndTime: activityEndTime,
      ActivityType: activityType,
      ActivityLocation: activityLocation,
    };

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedForm)
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการเผยแพร่");

    revalidatePath("/");

    return { success: true, data: updatedForm };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการเผยแพร่แบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    return {
      success: false,
      error: "ไม่สามารถเผยแพร่แบบความต้องการผู้เข้าร่วมกิจกรรมได้",
    };
  }
}

export async function GetFormContentByUrl(formUrl: string) {
  try {
    const form = await ActivityForm.findOneAndUpdate(
      { ActivityShareurl: formUrl },
      { $inc: { ActivityVisits: 1 } },
      { new: true }
    );

    if (!form) {
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการ");
    }

    return {
      ActivityContent: form.ActivityContent,
      startTime: form.startTime,
      endTime: form.endTime,
      regisStartTime: form.regisStartTime,
      regisEndTime: form.regisEndTime,
      ActivityEndTime: form.ActivityEndTime,
      ActivityLocation: form.ActivityLocation,
    };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการดึงเนื้อหาแบบความต้องการผู้เข้าร่วมกิจกรรมตาม URL:",
      error
    );
    throw new Error(
      "ไม่สามารถดึงเนื้อหาแบบความต้องการผู้เข้าร่วมกิจกรรมตาม URL ได้"
    );
  }
}

export async function SubmitForm(formUrl: string, content: string) {
  try {
    const session = await auth();
    if (!session) throw new Error("ไม่พบผู้ใช้งาน");

    const user = await User.findById(session?.user?._id);
    if (!user) throw new Error("ไม่พบผู้ใช้งาน");

    const form = await ActivityForm.findOne({
      ActivityShareurl: formUrl,
      published: true,
    });

    if (!form) {
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการส่ง");
    }

    if (isNaN(form.ActivitySubmissions)) {
      form.ActivitySubmissions = 0;
    }

    form.ActivitySubmissions += 1;

    const formSubmission = new Formsubs({
      Formsubcontent: content,
      formId: form._id,
      userId: user._id,
    });

    await formSubmission.save();
    await form.save();

    // ตรวจสอบว่าผู้ใช้เข้าร่วมกิจกรรมนี้หรือยัง โดยตรวจสอบว่ามี activityId หรือไม่ก่อนเรียก toString()
    const hasParticipated = user.activitiesParticipated.some(
      (participation: Participation) =>
        participation.activityId?.toString() === form._id.toString()
    );

    if (!hasParticipated) {
      user.activitiesParticipated.push({
        activityId: form._id, // บันทึก activityId ตามโครงสร้างใหม่
        bookingStatus: "booked",
        registrationStatus: "pending",
        questionnaireStatus: "pending",
        completionStatus: "incomplete",
      });
      await user.save();
    }

    return {
      ...formSubmission._doc,
      _id: formSubmission._id.toString(),
      userId: formSubmission.userId.toString(),
      formId: formSubmission.formId.toString(),
    };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการส่งแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    throw new Error("ไม่สามารถส่งแบบความต้องการผู้เข้าร่วมกิจกรรมได้");
  }
}

export async function GetFormWithSubmissions(id: number) {
  try {
    await checkAdminPermission();

    const form = await ActivityForm.findOne({ _id: id }).lean();
    if (!form) {
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการ");
    }

    const submissions = (await Formsubs.find({
      formId: form._id,
    }).lean()) as FormSubmission[];

    const submissionsWithUserNames = await Promise.all(
      submissions.map(async (submission) => {
        const user = (await User.findById(submission.userId).lean()) as IUser;
        return {
          ...submission,
          userSendName: user?.name || "ไม่ทราบชื่อผู้ใช้",
        };
      })
    );

    form.FormSubmissions = submissionsWithUserNames;

    return { ...form };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการดึงแบบความต้องการผู้เข้าร่วมกิจกรรมพร้อมการส่ง:",
      error
    );
    throw new Error(
      "ไม่สามารถดึงแบบความต้องการผู้เข้าร่วมกิจกรรมพร้อมการส่งได้"
    );
  }
}

export async function DeleteForm(id: number) {
  try {
    await checkAdminPermission();

    const deletedForm = await ActivityForm.findOneAndDelete({ _id: id });

    if (!deletedForm)
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมที่ต้องการลบ");
    revalidatePath("/");
    return { ...deletedForm._doc, _id: deletedForm._doc._id.toString() };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการลบแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    throw new Error("ไม่สามารถลบแบบความต้องการผู้เข้าร่วมกิจกรรมได้");
  }
}

export async function CloneForm(formData: FormData) {
  try {
    const user = await checkAdminPermission();

    const formId = formData.get("formId") as string;
    if (!formId)
      throw new Error("ไม่พบ ID ของแบบความต้องการผู้เข้าร่วมกิจกรรม");

    const newFormName = formData.get("newFormName") as string;
    const useOriginalName = formData.get("useOriginalName") === "true";

    const originalForm = await ActivityForm.findOne({ _id: formId });
    if (!originalForm)
      throw new Error("ไม่พบแบบความต้องการผู้เข้าร่วมกิจกรรมต้นฉบับ");

    const clonedForm = new ActivityForm({
      userId: user._id,
      ActivityFormname: useOriginalName
        ? `${originalForm.ActivityFormname} (สำเนา)`
        : newFormName || `${originalForm.ActivityFormname} (สำเนา)`,
      ActivityDescription: originalForm.ActivityDescription,
      ActivityContent: originalForm.ActivityContent,
      ActivityType: originalForm.ActivityType,
      published: false,
      ActivityVisits: 0,
      ActivitySubmissions: 0,
      startTime: originalForm.startTime,
      endTime: originalForm.endTime,
    });

    await clonedForm.save();

    revalidatePath("/");

    return {
      success: true,
      message: "แบบแบบความต้องการผู้เข้าร่วมกิจกรรมถูกคัดลอกเรียบร้อยแล้ว",
      newFormId: clonedForm._id.toString(),
    };
  } catch (error) {
    console.error(
      "เกิดข้อผิดพลาดในการโคลนแบบความต้องการผู้เข้าร่วมกิจกรรม:",
      error
    );
    return {
      success: false,
      message: "ไม่สามารถโคลนแบบความต้องการผู้เข้าร่วมกิจกรรมได้",
    };
  }
}

// เข้าร่วมกิจกรรมตามตำแหน่งผู้ใช้
export async function joinActivity(
  activityId: string,
  latitude: number,
  longitude: number
) {
  const session = await auth();
  if (!session?.user?._id) throw new Error("User not authenticated");

  const user = await User.findById(session.user._id);
  const activity = await ActivityForm.findById(activityId);

  if (!activity) throw new Error("Activity not found");

  // ตรวจสอบว่าผู้ใช้สำรองที่นั่งแล้วหรือยัง
  const participation = user.activitiesParticipated.find(
    (participation: Participation) =>
      participation.activityId?.toString() === activityId.toString()
  );

  if (!participation || participation.bookingStatus !== "booked") {
    return { success: false, message: "คุณยังไม่ได้สำรองที่นั่ง" };
  }

  const now = new Date();
  const regisStartTime = new Date(activity.regisStartTime);
  const regisEndTime = new Date(activity.regisEndTime);

  if (now < regisStartTime || now > regisEndTime) {
    return { success: false, message: "หมดเวลาลงทะเบียน" };
  }

  // ใช้พารามิเตอร์ latitude และ longitude จากฝั่ง client ในการตรวจสอบระยะทาง
  const userLocation = { lat: latitude, lng: longitude };

  const { isWithinRange } = await checkUserWithinRange(
    userLocation,
    100, // ระยะทางที่กำหนด
    activity.ActivityLocation
  );

  if (!isWithinRange) {
    return { success: false, message: "คุณอยู่นอกระยะพื้นที่ที่กำหนด" };
  }

  // อัปเดตสถานะการเข้าร่วมกิจกรรมของผู้ใช้
  participation.registrationStatus = "registered"; // เปลี่ยนสถานะเป็น "registered" เมื่อเข้าร่วมกิจกรรม

  await user.save();
  return { success: true };
}
