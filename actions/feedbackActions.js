"use server";

import connectdatabase from "@/utils/connectdatabase";
import Feedback from "@/models/Feedbackmodel";
import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
connectdatabase();

export async function createFeedback(data) {
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

    revalidatePath("/");
    return {
      ...savedFeedback._doc,
      _id: savedFeedback._id.toString(),
      msg: "เพิ่มข้อเสนอแนะสำเร็จ",
    };
  } catch (error) {
    console.error("Error creating feedback:", error);
    return { error: error.message || "เกิดข้อผิดพลาดในการสร้างข้อเสนอแนะ" };
  }
}

export async function getAllFeedback(searchParams) {
  const search = searchParams.search || "";
  const limit = searchParams.limit * 1 || 12;
  const page = searchParams.page * 1 || 1;
  const skip = searchParams.skip * 1 || limit * (page - 1);

  try {
    const allFeedback = await Feedback.find({ comment: { $regex: search } })
      .populate("userId", "name")
      .populate("activityId", "ActivityFormname")
      .limit(limit)
      .skip(skip);

    const count = await Feedback.find({ comment: { $regex: search } }).count();
    const totalPage = Math.ceil(count / limit);

    const newData = allFeedback.map((feedback) => ({
      ...feedback._doc,
      _id: feedback._doc._id.toString(),
    }));

    return { allFeedback: newData, count, totalPage };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateFeedback({ id, rating, comment }) {
  try {
    const feedback = await Feedback.findByIdAndUpdate(
      id,
      { rating, comment },
      { new: true }
    );

    revalidatePath("/feedback");

    return {
      ...feedback._doc,
      _id: feedback._id.toString(),
      msg: "แก้ไขข้อเสนอแนะสำเร็จ",
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteFeedback(feedbackId) {
  try {
    const feedback = await Feedback.findByIdAndDelete(feedbackId);
    revalidatePath("/feedback");

    return {
      ...feedback._doc,
      _id: feedback._id.toString(),
      msg: "ลบข้อเสนอแนะสำเร็จ",
    };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getOneFeedback(feedbackId) {
  try {
    const feedback = await Feedback.findById(feedbackId)
      .populate("userId", "name")
      .populate("activityId", "ActivityFormname");
    return { ...feedback._doc, _id: feedback._doc._id.toString() };
  } catch (error) {
    return { error: error.message };
  }
}
