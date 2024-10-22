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

    // Calculate chart data
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const chartData = await Feedback.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
          averageRating: { $avg: "$rating" },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          date: "$_id",
          count: 1,
          averageRating: { $round: ["$averageRating", 2] },
        },
      },
    ]);

    return {
      feedbacks: JSON.parse(JSON.stringify(feedbacks)),
      count,
      totalPage,
      chartData,
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

    // Check if the user has already submitted feedback for this activity
    const existingFeedback = await Feedback.findOne({
      userId: session.user._id,
      activityId: data.activityId,
    });

    if (existingFeedback) {
      return { error: "คุณได้ส่งข้อเสนอแนะสำหรับกิจกรรมนี้แล้ว" };
    }

    const newFeedback = new Feedback({
      ...data,
      userId: session.user._id,
    });

    const savedFeedback = await newFeedback.save();

    // Convert the MongoDB document to a plain JavaScript object
    const plainFeedback = JSON.parse(JSON.stringify(savedFeedback));

    revalidatePath("/feedback");
    return {
      ...plainFeedback,
      msg: "เพิ่มข้อเสนอแนะสำเร็จ",
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    throw new Error("เกิดข้อผิดพลาดในการสร้างข้อเสนอแนะ");
  }
}

export async function getUserFeedbackActivities(userId: string) {
  try {
    const feedbacks = await Feedback.find({ userId });
    return feedbacks.map((feedback: any) => feedback.activityId.toString());
  } catch (error) {
    console.error("Error fetching user feedback activities:", error);
    throw new Error(
      "เกิดข้อผิดพลาดในการดึงข้อมูลกิจกรรมที่ผู้ใช้ให้ข้อเสนอแนะ"
    );
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
