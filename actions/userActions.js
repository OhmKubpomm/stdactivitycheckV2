"use server";
import connectdatabase from "@/utils/connectdatabase";
import User from "@/models/Usermodel";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
connectdatabase();
export async function createUser(data) {
  try {
    // Hash the password first
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // Create a new User object with the hashed password
    const newUser = new User({
      ...data,
      password: hashedPassword,
    });

    await newUser.save();
    revalidatePath("/"); // ใช้ในการ refresh หน้าเว็บ
    return (
      { ...newUser._doc, _id: newUser._id.toString() },
      { msg: "เพิ่มข้อมูลสำเร็จ" }
    );
  } catch (error) {
    return { error: error.message };
  }
}
export async function getallUser(searchParams = {}) {
  try {
    const allUser = await User.find().lean();

    const newData = allUser.map((user) => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      Firstname: user.Firstname,
      Lastname: user.Lastname,
      Date: user.Date,
      Address: user.Address,
      Telephone: user.Telephone,
      image: user.image,
      userType: user.userType,
      role: user.role,
    }));

    return {
      allUser: newData,
      count: newData.length,
      totalPage: Math.ceil(newData.length / 10), // Assuming 10 items per page
    };
  } catch (error) {
    console.error("Error in getallUser:", error);
    return { error: error.message };
  }
}

export async function updateUser({
  name,
  email,
  password,
  Firstname,
  Lastname,
  Date,
  Address,
  Telephone,
  image,
  userType,
  id,
}) {
  try {
    const user = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
        password,
        Firstname,
        Lastname,
        Date,
        Address,
        Telephone,
        userType,
        image,
      },
      { new: true }
    );

    revalidatePath("/");

    return { ...user._doc, _id: user._id.toString(), msg: "แก้ไขข้อมูลสำเร็จ" };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteUser(userId) {
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { role: "inactive" },
      { new: true }
    );

    if (!user) {
      throw new Error("User not found");
    }

    revalidatePath("/");

    return { ...user._doc, _id: user._id.toString() };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getoneUser(userId) {
  try {
    const user = await User.findById(userId);
    return { ...user._doc, _id: user._doc._id.toString() };
  } catch (error) {
    return { error: error.message };
  }
}
