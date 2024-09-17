"use server";

import connectdatabase from "@/utils/connectdatabase";
import Feedback from "@/models/Feedbackmodel";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";

import User from "@/models/Usermodel";
import ActivityForm from "@/models/ActivityForm";
connectdatabase();
interface SearchParams {
  page?: string;
  limit?: string;
}

export async function getFeedbacks(searchParams: SearchParams) {
  try {
    await User.init();
    await ActivityForm.init();
    const page = parseInt(searchParams.page || "1");
    const limit = parseInt(searchParams.limit || "10");
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find()
      .populate({
        path: "userId",
        model: User,
        select: "name",
      })
      .populate({
        path: "activityId",
        model: ActivityForm,
        select: "ActivityFormname",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const count = await Feedback.countDocuments();
    const totalPage = Math.ceil(count / limit);

    return {
      feedbacks: JSON.parse(JSON.stringify(feedbacks)),
      count,
      totalPage,
    };
  } catch (error) {
    console.error("Error fetching feedbacks:", error);
    throw new Error("เกิดข้อผิดพลาดในการดึงข้อมูลข้อเสนอแนะ");
  }
}

export async function createFeedback(data: any) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user._id) {
      throw new Error("User not authenticated");
    }

    const newFeedback = new Feedback({
      ...data,
      userId: session.user._id,
    });

    const savedFeedback = await newFeedback.save();

    revalidatePath("/feedback");
    return {
      ...savedFeedback._doc,
      _id: savedFeedback._id.toString(),
      msg: "เพิ่มข้อเสนอแนะสำเร็จ",
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error("เกิดข้อผิดพลาดในการสร้างข้อเสนอแนะ");
  }
}

export async function deleteFeedback(id: string) {
  try {
    const session = await auth();
    if (!session || !session.user || !session.user._id) {
      throw new Error("User not authenticated");
    }

    const deletedFeedback = await Feedback.findByIdAndDelete(id);
    if (!deletedFeedback) {
      throw new Error("Feedback not found");
    }

    revalidatePath("/feedback");
    return { msg: "ลบข้อเสนอแนะสำเร็จ" };
  } catch (error) {
    console.error("Error deleting feedback:", error);
    throw new Error("เกิดข้อผิดพลาดในการลบข้อเสนอแนะ");
  }
}
