import React from "react";
import { FeedbackForm } from "@/components/form/FeedbackForm";
import {
  getDashboardData,
  DashboardActivityType,
} from "@/actions/DashboardAction";
import { getUserFeedbackActivities } from "@/actions/feedbackActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";

export default async function AddFeedbackPage() {
  const { activities = [], user } = await getDashboardData();
  const session = await auth();
  const userFeedbackActivities = session?.user?._id
    ? await getUserFeedbackActivities(session.user._id)
    : [];

  const eligibleActivities = activities.filter(
    (activity: DashboardActivityType) =>
      user.activitiesParticipated.some(
        (participation) =>
          participation.activityId === activity.id &&
          participation.registrationStatus === "registered" &&
          participation.questionnaireStatus !== "completed"
      )
  );

  return (
    <div className="container mx-auto py-10">
      <Card className="mx-auto max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">
            ทำแบบสอบถามกิจกรรม
          </CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackForm
            activities={eligibleActivities}
            userFeedbackActivities={userFeedbackActivities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
