"use server";
import connectdatabase from "@/utils/connectdatabase";
import Map from "@/models/Mapmodel";
import { revalidatePath } from "next/cache";

connectdatabase();
export async function createLocation(data) {
  try {
    const newMap = new Map({
      ...data, // ฟิลด์ Maplocation ควรอยู่ใน newMap
    });

    await newMap.save();
    revalidatePath("/");

    return {
      ...newMap._doc,
      _id: newMap._id.toString(),
      msg: "เพิ่มข้อมูลสำเร็จ",
    };
  } catch (error) {
    console.error("Error saving Maplocation:", error); // ดูว่ามีข้อผิดพลาดอะไรบ้าง
    return { error: error.message };
  }
}

export async function getallMap() {
  try {
    const allMap = await Map.find();

    const newData = allMap.map((Map) => ({
      ...Map._doc,
      _id: Map._doc._id.toString(),
    }));

    return { allMap: newData };
  } catch (error) {
    return { error: error.message };
  }
}

export async function updateMap({ MapAddress, id }) {
  try {
    const map = await Map.findByIdAndUpdate(
      id,
      {
        MapAddress,
      },
      { new: true }
    );

    revalidatePath("/");

    return { ...map._doc, _id: map._id.toString(), msg: "แก้ไขข้อมูลสำเร็จ" };
  } catch (error) {
    return { error: error.message };
  }
}

export async function deleteMap(mapId) {
  try {
    const map = await Map.findByIdAndDelete(mapId, { new: true });
    revalidatePath("/");

    return { ...map._doc, _id: map._id.toString() };
  } catch (error) {
    return { error: error.message };
  }
}
