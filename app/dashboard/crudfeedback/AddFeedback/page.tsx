import React from "react";
import { FeedbackForm } from "@/components/form/FeedbackForm";

import { getDashboardData } from "@/actions/DashboardAction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AddFeedbackPage() {
  const { activities = [] } = await getDashboardData();
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
          <FeedbackForm activities={validActivities} />
        </CardContent>
      </Card>
    </div>
  );
}
