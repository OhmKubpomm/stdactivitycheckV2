import React from "react";
import { FeedbackForm } from "@/components/form/FeedbackForm";
import { getDashboardData } from "@/actions/DashboardAction";
import { getUserFeedbackActivities } from "@/actions/feedbackActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/auth";

export default async function AddFeedbackPage() {
  const { activities = [] } = await getDashboardData();
  const session = await auth();
  const userFeedbackActivities = session?.user?._id
    ? await getUserFeedbackActivities(session.user._id)
    : [];

  // ตรวจสอบว่า activities เป็น array หรือไม่
  const validActivities = Array.isArray(activities) ? activities : [];

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
            activities={validActivities}
            userFeedbackActivities={userFeedbackActivities}
          />
        </CardContent>
      </Card>
    </div>
  );
}
