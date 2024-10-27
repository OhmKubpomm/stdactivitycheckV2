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
  ActivityEndTime: Date;
  ActivitySubmissions: number;
  ActivityDescription: string;
  ActivityContent: string;
  ActivityVisits: number;
  ActivityType: string;
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
  type: string;
  shareUrl: string;
  location: string;
  time: string;
  coordinates: number[] | null;
  startTime: string;
  endTime: string;
  regisStartTime: string;
  regisEndTime: string;
  activityEndTime: string | null;
  bookingStatus: "booked" | "pending" | "failed";
  registrationStatus: "pending" | "failed" | "registered";
  questionnaireStatus: "pending" | "completed" | "not_required";
  completionStatus: "completed" | "incomplete";
  canSubmitQuestionnaire: boolean;
}

export interface DashboardDataType {
  user: {
    name: string;
    email: string;
    activitiesParticipated: {
      activityId: string;
      bookingStatus: "pending" | "booked" | "failed";
      registrationStatus: "pending" | "registered" | "failed";
      questionnaireStatus: "pending" | "completed" | "not_required";
      completionStatus: "incomplete" | "completed";
    }[];
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

const mapActivityType = (activityType: string) => {
  switch (activityType) {
    case "กิจกรรมบังคับ":
      return "mandatory";
    case "กิจกรรมบังคับเลือก":
      return "mandatoryElective";
    case "กิจกรรมเลือกเข้าร่วม":
      return "elective";
    default:
      return "unknown";
  }
};

export async function getDashboardData(): Promise<DashboardDataType> {
  const session = await auth();
  if (!session?.user?._id) throw new Error("User not authenticated");

  const user = (await User.findById(session.user._id).populate({
    path: "activitiesParticipated.activityId",
    model: "ActivityForms",
  })) as UserType;

  if (!user) throw new Error("User not found");

  const activities = (await ActivityForm.find({ published: true }).sort({
    startTime: 1,
  })) as ActivityType[];

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

  const completedActivities = {
    mandatory: 0,
    mandatoryElective: 0,
    elective: 0,
  };

  user.activitiesParticipated.forEach((participation: any) => {
    if (participation.completionStatus === "completed") {
      const rawActivityType = participation.activityId?.ActivityType;
      const activityType = mapActivityType(rawActivityType);

      if (activityType === "mandatory") {
        completedActivities.mandatory++;
      } else if (activityType === "mandatoryElective") {
        completedActivities.mandatoryElective++;
      } else if (activityType === "elective") {
        completedActivities.elective++;
      }
    }
  });

  return {
    user: {
      name: user.name,
      email: user.email,
      activitiesParticipated: user.activitiesParticipated.map(
        (participation) => ({
          activityId: participation.activityId?._id.toString() || "",
          bookingStatus: participation.bookingStatus || "pending",
          registrationStatus: participation.registrationStatus || "pending",
          questionnaireStatus: participation.questionnaireStatus || "pending",
          completionStatus: participation.completionStatus || "incomplete",
        })
      ),
      userType: user.userType,
      completedActivities,
    },
    activities: await Promise.all(
      activities.map(async (activity: ActivityType) => {
        const activityMap = maps.find(
          (map: MapType) => map.name === activity.ActivityFormname
        );

        const activityEndTime = new Date(activity.ActivityEndTime);
        const now = new Date();
        const oneDayAfterEnd = new Date(
          activityEndTime.getTime() + 24 * 60 * 60 * 1000
        );

        const startDate = new Date(activity.startTime);
        const endDate = new Date(activity.endTime);
        const regisStartDate = activity.regisStartTime
          ? new Date(activity.regisStartTime)
          : null;
        const regisEndDate = activity.regisEndTime
          ? new Date(activity.regisEndTime)
          : null;
        const userParticipation = user.activitiesParticipated.find(
          (p) => p.activityId?._id.toString() === activity._id.toString()
        );

        let questionnaireStatus =
          userParticipation?.questionnaireStatus || "pending";
        let completionStatus =
          userParticipation?.completionStatus || "incomplete";

        if (now > oneDayAfterEnd) {
          questionnaireStatus = "not_required";
          completionStatus = "incomplete";
        }

        return {
          id: activity._id.toString(),
          name: activity.ActivityFormname,
          date: startDate.toISOString(),
          participants: activity.ActivitySubmissions,
          maxParticipants: activity.ActivitySubmissions + 100,
          description: activity.ActivityDescription,
          content: activity.ActivityContent,
          visits: activity.ActivityVisits,
          type: mapActivityType(activity.ActivityType),
          shareUrl: activity.ActivityShareurl,
          location: activity.ActivityLocation,
          time: `${formatThaiTime(startDate)} - ${formatThaiTime(endDate)}`,
          coordinates: activityMap ? activityMap.Maplocation.coordinates : null,
          startTime: startDate.toISOString(),
          endTime: endDate.toISOString(),
          regisStartTime: regisStartDate
            ? regisStartDate.toISOString()
            : "ไม่ระบุเวลา",
          regisEndTime: regisEndDate
            ? regisEndDate.toISOString()
            : "ไม่ระบุเวลา",
          activityEndTime:
            activity.ActivityEndTime instanceof Date &&
            !isNaN(activity.ActivityEndTime.getTime())
              ? activity.ActivityEndTime.toISOString()
              : null,
          bookingStatus: userParticipation?.bookingStatus || "pending",
          registrationStatus:
            userParticipation?.registrationStatus || "pending",
          questionnaireStatus,
          completionStatus,
          canSubmitQuestionnaire:
            activity.ActivityEndTime instanceof Date &&
            !isNaN(activity.ActivityEndTime.getTime())
              ? now <=
                new Date(
                  activity.ActivityEndTime.getTime() + 24 * 60 * 60 * 1000
                )
              : false,
        };
      })
    ),
    activityRequirements,
  };
}
