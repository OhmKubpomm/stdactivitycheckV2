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

export async function getMapLocations() {
  try {
    const locations = await Map.find({}, "MapName");
    return locations.map((location) => ({
      value: location._id.toString(), // แปลง ObjectId เป็น string
      label: location.MapName,
    }));
  } catch (error) {
    console.error("Error fetching map locations:", error);
    throw new Error("ไม่สามารถดึงข้อมูลสถานที่ได้");
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

export async function updateMap({ id, MapName, MapAddress, Maplocation }) {
  try {
    const map = await Map.findByIdAndUpdate(
      id,
      {
        MapName,
        MapAddress,
        Maplocation,
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

export async function checkUserWithinRange(
  userLocation,
  maxDistanceInMeters,
  activityLocation
) {
  try {
    // ค้นหาตำแหน่งที่เชื่อมโยงกับชื่อสถานที่ของกิจกรรมใน Map โดยใช้ MapName
    const mapData = await Map.findOne({ MapName: activityLocation });

    if (!mapData || !mapData.Maplocation) {
      throw new Error("ไม่พบตำแหน่งสำหรับสถานที่นี้");
    }

    // ตรวจสอบว่าผู้ใช้ใกล้กับตำแหน่งใน Maplocation หรือไม่
    const result = await Map.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [userLocation.lng, userLocation.lat], // ตำแหน่งของผู้ใช้
          },
          distanceField: "distance", // ระยะห่างระหว่างผู้ใช้กับตำแหน่งใน Map
          maxDistance: maxDistanceInMeters, // ระยะทางสูงสุดที่ต้องการตรวจสอบ (เช่น 20 เมตร)
          spherical: true, // ใช้ spherical geolocation เพื่อความแม่นยำ
        },
      },
      {
        $match: {
          _id: mapData._id, // กรองข้อมูลให้ตรงกับ Map ที่ค้นพบตามชื่อกิจกรรม (MapName)
        },
      },
    ]);

    const isWithinRange = result.length > 0; // ถ้ามีข้อมูลแสดงว่าผู้ใช้อยู่ในระยะที่กำหนด
    return { isWithinRange };
  } catch (error) {
    console.error("Error checking user location:", error);
    return { error: "Error checking user location" };
  }
}
