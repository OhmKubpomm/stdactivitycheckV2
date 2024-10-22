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
  ActivitySubmissions: number;
  ActivityDescription: string;
  ActivityContent: string;
  ActivityVisits: number;
  ActivityType: "mandatory" | "mandatoryElective" | "elective";
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
  type: "mandatory" | "mandatoryElective" | "elective";
  shareUrl: string;
  location: string;
  time: string;
  coordinates: number[] | null;
  status: "upcoming" | "ongoing" | "past";
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

export async function getDashboardData(): Promise<DashboardDataType> {
  const session = await auth();
  if (!session?.user?._id) throw new Error("User not authenticated");

  const user = (await User.findById(session.user._id).populate(
    "activitiesParticipated"
  )) as UserType;
  if (!user) throw new Error("User not found");

  const currentDate = new Date();
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

  user.activitiesParticipated.forEach((activity: any) => {
    if (activity.ActivityType === "กิจกรรมบังคับ") {
      completedActivities.mandatory++;
    } else if (activity.ActivityType === "กิจกรรมบังคับเลือก") {
      completedActivities.mandatoryElective++;
    } else if (activity.ActivityType === "กิจกรรมเลือกเข้าร่วม") {
      completedActivities.elective++;
    }
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      activitiesParticipated: user.activitiesParticipated.map((activity) =>
        activity._id.toString()
      ),
      userType: user.userType,
      completedActivities,
    },
    activities: await Promise.all(
      activities.map(async (activity: ActivityType) => {
        const activityMap = maps.find(
          (map: MapType) => map.name === activity.ActivityFormname
        );

        // Convert to Bangkok time
        const startDate = new Date(activity.startTime);
        startDate.setHours(startDate.getHours() + 7); // Add 7 hours for Bangkok time
        const endDate = new Date(activity.endTime);
        endDate.setHours(endDate.getHours() + 7); // Add 7 hours for Bangkok time

        return {
          id: activity._id.toString(),
          name: activity.ActivityFormname,
          date: startDate.toISOString(),
          participants: activity.ActivitySubmissions,
          maxParticipants: activity.ActivitySubmissions + 100,
          description: activity.ActivityDescription,
          content: activity.ActivityContent,
          visits: activity.ActivityVisits,
          type: activity.ActivityType,
          shareUrl: activity.ActivityShareurl,
          location: activity.ActivityLocation,
          time: `${formatThaiTime(startDate)} - ${formatThaiTime(endDate)}`,
          coordinates: activityMap ? activityMap.Maplocation.coordinates : null,
          status:
            startDate > currentDate
              ? "upcoming"
              : endDate < currentDate
              ? "past"
              : "ongoing",
        };
      })
    ),

    activityRequirements,
  };
}
