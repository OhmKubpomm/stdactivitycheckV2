"use server";

import { auth } from "@/auth";
import User from "@/models/Usermodel";
import ActivityForm from "@/models/ActivityForm";
import Map from "@/models/Mapmodel";

// Define types for our models
interface UserType {
  name: string;
  email: string;
  activitiesParticipated: any[];
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
  ActivityType: string;
  ActivityShareurl: string;
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
  type: string;
  shareUrl: string;
  location: string;
  time: string;
  coordinates: number[] | null;
}

export interface DashboardDataType {
  user: {
    name: string;
    email: string;
    activitiesParticipated: number;
  };
  activities: DashboardActivityType[];
}

export async function getDashboardData(): Promise<DashboardDataType> {
  const session = await auth();
  if (!session?.user?._id) throw new Error("User not authenticated");

  const user = (await User.findById(session.user._id).populate(
    "activitiesParticipated"
  )) as UserType;
  if (!user) throw new Error("User not found");

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

  return {
    user: {
      name: user.name,
      email: user.email,
      activitiesParticipated: user.activitiesParticipated.length,
    },
    activities: await Promise.all(
      activities.map(async (activity: ActivityType) => {
        // Find the corresponding map for this activity
        const activityMap = maps.find(
          (map: MapType) => map.name === activity.ActivityFormname
        );

        return {
          id: activity._id.toString(),
          name: activity.ActivityFormname,
          date: activity.startTime
            ? activity.startTime.toISOString()
            : "ไม่ระบุวันที่",
          participants: activity.ActivitySubmissions,
          maxParticipants: activity.ActivitySubmissions + 100, // Assuming a max capacity
          description: activity.ActivityDescription,
          content: activity.ActivityContent,
          visits: activity.ActivityVisits,
          type: activity.ActivityType,
          shareUrl: activity.ActivityShareurl,
          location: activityMap ? activityMap.MapAddress : "ไม่ระบุสถานที่",
          time: `${formatThaiTime(activity.startTime)} - ${formatThaiTime(
            activity.endTime
          )}`,
          coordinates: activityMap ? activityMap.Maplocation.coordinates : null,
        };
      })
    ),
  };
}
