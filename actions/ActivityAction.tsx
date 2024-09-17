"use server";
import { auth } from "@/auth";
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
    console.error("เกิดข้อผิดพลาดในการดึงสถิติฟอร์ม:", error);
    throw new Error("ไม่สามารถดึงสถิติฟอร์มได้");
  }
}

export async function CreateForm(data: formSchemaType) {
  try {
    const user = await checkAdminPermission();

    const validation = formSchema.safeParse(data);
    if (!validation.success) {
      throw new Error("ข้อมูลฟอร์มไม่ถูกต้อง");
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
    console.error("เกิดข้อผิดพลาดในการสร้างฟอร์ม:", error);
    throw new Error("ไม่สามารถสร้างฟอร์มได้");
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
    console.error("เกิดข้อผิดพลาดในการดึงฟอร์มทั้งหมด:", error);
    throw new Error("ไม่สามารถดึงฟอร์มทั้งหมดได้");
  }
}

export async function GetFormById(id: Object) {
  try {
    await checkAdminPermission();

    const form = await ActivityForm.findById(id);
    if (!form) throw new Error("ไม่พบฟอร์มกิจกรรม");

    return { ...form._doc, _id: form._doc._id.toString() };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงฟอร์มตาม ID:", error);
    throw new Error("ไม่สามารถดึงฟอร์มตาม ID ได้");
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

    if (!updatedForm) throw new Error("ไม่พบฟอร์มที่ต้องการอัปเดต");

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการอัปเดตเนื้อหาฟอร์ม:", error);
    throw new Error("ไม่สามารถอัปเดตเนื้อหาฟอร์มได้");
  }
}

export async function PublishForm(
  id: number,
  startTime: string,
  endTime: string,
  activityType: string,
  activityLocation: string
) {
  try {
    await checkAdminPermission();

    const updateData = {
      published: true,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      ActivityType: activityType,
      ActivityLocation: activityLocation,
    };

    const updatedForm = await ActivityForm.findOneAndUpdate(
      { _id: id },
      updateData,
      { new: true }
    );

    if (!updatedForm) throw new Error("ไม่พบฟอร์มที่ต้องการเผยแพร่");

    return { ...updatedForm._doc, _id: updatedForm._doc._id.toString() };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการเผยแพร่ฟอร์ม:", error);
    throw new Error("ไม่สามารถเผยแพร่ฟอร์มได้");
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
      throw new Error("ไม่พบฟอร์มที่ต้องการ");
    }

    return {
      ActivityContent: form.ActivityContent,
      startTime: form.startTime,
      endTime: form.endTime,
    };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงเนื้อหาฟอร์มตาม URL:", error);
    throw new Error("ไม่สามารถดึงเนื้อหาฟอร์มตาม URL ได้");
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
      throw new Error("ไม่พบฟอร์มที่ต้องการส่ง");
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

    if (!user.activitiesParticipated.includes(form._id)) {
      user.activitiesParticipated.push(form._id);
      await user.save();
    }

    return {
      ...formSubmission._doc,
      _id: formSubmission._id.toString(),
      userId: formSubmission.userId.toString(),
      formId: formSubmission.formId.toString(),
    };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการส่งฟอร์ม:", error);
    throw new Error("ไม่สามารถส่งฟอร์มได้");
  }
}

export async function GetFormWithSubmissions(id: number) {
  try {
    await checkAdminPermission();

    const form = await ActivityForm.findOne({ _id: id }).lean();
    if (!form) {
      throw new Error("ไม่พบฟอร์มที่ต้องการ");
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
    console.error("เกิดข้อผิดพลาดในการดึงฟอร์มพร้อมการส่ง:", error);
    throw new Error("ไม่สามารถดึงฟอร์มพร้อมการส่งได้");
  }
}

export async function DeleteForm(id: number) {
  try {
    await checkAdminPermission();

    const deletedForm = await ActivityForm.findOneAndDelete({ _id: id });

    if (!deletedForm) throw new Error("ไม่พบฟอร์มที่ต้องการลบ");

    return { ...deletedForm._doc, _id: deletedForm._doc._id.toString() };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการลบฟอร์ม:", error);
    throw new Error("ไม่สามารถลบฟอร์มได้");
  }
}

export async function CloneForm(formData: FormData) {
  try {
    const user = await checkAdminPermission();

    const formId = formData.get("formId");
    if (!formId) throw new Error("ไม่พบ ID ของฟอร์ม");

    const originalForm = await ActivityForm.findOne({ _id: formId });
    if (!originalForm) throw new Error("ไม่พบฟอร์มต้นฉบับ");

    const clonedForm = new ActivityForm({
      userId: user._id,
      ActivityFormname: `${originalForm.ActivityFormname} (สำเนา)`,
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
      ...clonedForm._doc,
      _id: clonedForm._id.toString(),
    };
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการโคลนฟอร์ม:", error);
    throw new Error("ไม่สามารถโคลนฟอร์มได้");
  }
}
