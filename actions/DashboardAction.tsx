"use server";

import { auth } from "@/auth";
import User from "@/models/Usermodel";
import ActivityForm from "@/models/ActivityForm";
import Map from "@/models/Mapmodel";

// Define types for our models
interface UserType {
  _id: string;
  name: string;
  email: string;
  activitiesParticipated: any[];
  userType: "regular" | "transfer";
}

interface ActivityType {
  _id: string;
  ActivityFormname: string;
  startTime: Date;
  endTime: Date;
  regisStartTime: Date;
  regisEndTime: Date;
  ActivitySubmissions: number;
  ActivityDescription: string;
  ActivityContent: string;
  ActivityVisits: number;
  ActivityType: string; // แก้ให้เป็น string แทน enum เพื่อรองรับภาษาไทย
  ActivityShareurl: string;
  ActivityLocation: string;
}

interface MapType {
  name: string;
  MapAddress: string;
  Maplocation: {
    type: string;
    coordinates: number[];
  };
}

export interface DashboardActivityType {
  id: string;
  name: string;
  date: string;
  participants: number;
  maxParticipants: number;
  description: string;
  content: string;
  visits: number;
  type: string; // แก้ให้เป็น string เพื่อรองรับภาษาไทย
  shareUrl: string;
  location: string;
  time: string;
  coordinates: number[] | null;
  startTime: string;
  endTime: string;
  regisStartTime: string;
  regisEndTime: string;
}

export interface DashboardDataType {
  user: {
    name: string;
    email: string;
    activitiesParticipated: string[];
    userType: "regular" | "transfer";
    completedActivities: {
      mandatory: number;
      mandatoryElective: number;
      elective: number;
    };
  };
  activities: DashboardActivityType[];
  activityRequirements: {
    mandatory: number;
    mandatoryElective: number;
    elective: number;
  };
}

// ฟังก์ชัน mapping จากภาษาไทยเป็นภาษาอังกฤษ
const mapActivityType = (activityType: string) => {
  switch (activityType) {
    case "กิจกรรมบังคับ":
      return "mandatory";
    case "กิจกรรมบังคับเลือก":
      return "mandatoryElective";
    case "กิจกรรมเลือกเข้าร่วม":
      return "elective";

    default:
      return "unknown"; // ค่าไม่ตรง ให้แสดงเป็น unknown
  }
};

export async function getDashboardData(): Promise<DashboardDataType> {
  const session = await auth();
  if (!session?.user?._id) throw new Error("User not authenticated");

  const user = (await User.findById(session.user._id).populate({
    path: "activitiesParticipated.activityId", // ทำการ populate activityId
    model: "ActivityForms", // ต้องตรงกับชื่อโมเดลที่ใช้ใน mongoose.model()
  })) as UserType;
  console.log(
    "Populated Activities Participated:",
    user.activitiesParticipated
  );

  if (!user) throw new Error("User not found");

  console.log("User Activities Participated:", user.activitiesParticipated);

  const activities = (await ActivityForm.find({ published: true }).sort({
    startTime: 1,
  })) as ActivityType[];

  // Fetch all maps
  const maps = (await Map.find()) as MapType[];

  const formatThaiTime = (date: Date | null | undefined) => {
    if (!date) return "ไม่ระบุเวลา";
    return new Date(date).toLocaleString("th-TH", {
      timeZone: "Asia/Bangkok",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const activityRequirements =
    user.userType === "regular"
      ? { mandatory: 2, mandatoryElective: 5, elective: 5 }
      : { mandatory: 2, mandatoryElective: 2, elective: 2 };

  // นับจำนวนกิจกรรมที่ผู้ใช้เข้าร่วมแล้วตามประเภท
  const completedActivities = {
    mandatory: 0,
    mandatoryElective: 0,
    elective: 0,
  };

  user.activitiesParticipated.forEach((participation: any) => {
    const rawActivityType = participation.activityId?.ActivityType;
    const activityType = mapActivityType(rawActivityType); // แปลงค่าภาษาไทยเป็นภาษาอังกฤษ
    console.log("Raw Activity Type:", rawActivityType); // ตรวจสอบค่าที่ได้จากฐานข้อมูล
    console.log("Mapped Activity Type:", activityType); // ตรวจสอบค่าแปลง
    if (activityType === "mandatory") {
      completedActivities.mandatory++;
    } else if (activityType === "mandatoryElective") {
      completedActivities.mandatoryElective++;
    } else if (activityType === "elective") {
      completedActivities.elective++;
    }
  });

  console.log("Completed Activities:", completedActivities);

  return {
    user: {
      name: user.name,
      email: user.email,
      activitiesParticipated: user.activitiesParticipated.map((participation) =>
        participation.activityId ? participation.activityId._id.toString() : ""
      ),
      userType: user.userType,
      completedActivities,
    },
    activities: await Promise.all(
      activities.map(async (activity: ActivityType) => {
        const activityMap = maps.find(
          (map: MapType) => map.name === activity.ActivityFormname
        );

        const startDate = new Date(activity.startTime);
        const endDate = new Date(activity.endTime);
        const regisStartDate = activity.regisStartTime
          ? new Date(activity.regisStartTime)
          : null;
        const regisEndDate = activity.regisEndTime
          ? new Date(activity.regisEndTime)
          : null;

        return {
          id: activity._id.toString(),
          name: activity.ActivityFormname,
          date: startDate.toISOString(),
          participants: activity.ActivitySubmissions,
          maxParticipants: activity.ActivitySubmissions + 100,
          description: activity.ActivityDescription,
          content: activity.ActivityContent,
          visits: activity.ActivityVisits,
          type: mapActivityType(activity.ActivityType), // แปลง ActivityType ก่อนส่งไปยัง frontend
          shareUrl: activity.ActivityShareurl,
          location: activity.ActivityLocation,
          time: `เวลาเริ่มต้น${formatThaiTime(
            startDate
          )} - เวลาสิ้นสุด${formatThaiTime(endDate)}`,
          coordinates: activityMap ? activityMap.Maplocation.coordinates : null,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          regisStartTime: regisStartDate
            ? regisStartDate.toISOString()
            : "ไม่ระบุเวลา",
          regisEndTime: regisEndDate
            ? regisEndDate.toISOString()
            : "ไม่ระบุเวลา",
        };
      })
    ),
    activityRequirements,
  };
}
