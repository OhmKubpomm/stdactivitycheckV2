/* eslint-disable tailwindcss/no-custom-classname */
"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  format,
  startOfWeek,
  addDays,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
  parseISO,
} from "date-fns";
import { th } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ArrowRight,
  Calendar as CalendarIcon,
  MapPin,
  Clock,
  ChevronRight,
  Activity,
  Award,
  Star,
  QrCode,
  CheckCircle,
  Link as LinkIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import {
  getDashboardData,
  DashboardDataType,
  DashboardActivityType,
} from "@/actions/DashboardAction";
import QRCode from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { DataTable } from "@/components/globals/DataTable";

const isValidDate = (date: string | Date | null | undefined): boolean => {
  return date ? !isNaN(new Date(date).getTime()) : false;
};

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ElementType;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
}) => (
  <Card className="border-none bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
    <CardContent className="flex items-center justify-between p-6">
      <div>
        <p className="text-sm text-gray-600">{title}</p>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
      </div>
      <div className={`bg-gray-${color} rounded-full p-3`}>
        <Icon className="size-6 text-white" />
      </div>
    </CardContent>
  </Card>
);

const ActivityCard = ({ activity }: { activity: DashboardActivityType }) => {
  const [showQR, setShowQR] = useState(false);
  const shareLink = `${window.location.origin}/submit/${activity.shareUrl}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="relative"
      onMouseEnter={() => setShowQR(true)}
      onMouseLeave={() => setShowQR(false)}
    >
      <Card className="border-none bg-white transition-all duration-300 hover:bg-gray-50 hover:shadow-lg">
        <CardHeader>
          <CardTitle className="text-lg text-gray-800">
            {activity.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 text-sm text-gray-600">
            {isValidDate(activity.date)
              ? format(parseISO(activity.date), "dd/MM/yyyy")
              : "ไม่ระบุวันที่"}
          </p>
          <p className="mb-2 text-sm text-gray-600">{activity.time}</p>
          <Badge
            variant={
              activity.type === "mandatory"
                ? "destructive"
                : activity.type === "mandatoryElective"
                ? "secondary"
                : "default"
            }
            className={`${
              activity.type === "mandatory"
                ? "bg-red-500"
                : activity.type === "mandatoryElective"
                ? "bg-yellow-500"
                : "bg-green-500"
            } text-white`}
          >
            {activity.type === "mandatory"
              ? "กิจกรรมบังคับ"
              : activity.type === "mandatoryElective"
              ? "กิจกรรมบังคับเลือก"
              : "กิจกรรมเลือกเข้าร่วม"}
          </Badge>
        </CardContent>
        <AnimatePresence>
          {showQR && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-2 right-2"
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gray-600 text-white hover:bg-gray-700">
                    <QrCode className="mr-2 size-4" />
                    เข้าร่วมกิจกรรม
                  </Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md sm:max-w-md">
                  <DialogTitle className="mb-4 text-xl font-bold text-gray-800">
                    เข้าร่วมกิจกรรม: {activity.name}
                  </DialogTitle>
                  <div className="flex w-full flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="flex flex-col items-center">
                      <QRCode
                        value={shareLink}
                        size={150}
                        className="rounded-lg"
                      />
                      <DialogDescription className="mt-2 text-center text-sm text-gray-600">
                        แสกนเพื่อเข้าร่วมกิจกรรมนี้
                      </DialogDescription>
                    </div>
                    <div className="flex flex-col items-center space-y-2">
                      <Button
                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                        onClick={() => window.open(shareLink, "_blank")}
                      >
                        <LinkIcon className="mr-2 size-4" />
                        เปิดลิงก์เข้าร่วม
                      </Button>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => navigator.clipboard.writeText(shareLink)}
                      >
                        คัดลอกลิงก์
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardDataType | null>(
    null
  );
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedActivity, setSelectedActivity] =
    useState<DashboardActivityType | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [showAllRemaining, setShowAllRemaining] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const data = await getDashboardData();

      setDashboardData(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const activitiesByDate = useMemo(() => {
    if (!dashboardData) return new Map();
    const map = new Map();
    dashboardData.activities.forEach((activity) => {
      if (isValidDate(activity.date)) {
        const dateString = parseISO(activity.date).toDateString();
        if (!map.has(dateString)) {
          map.set(dateString, []);
        }
        map.get(dateString).push(activity);
      }
    });
    return map;
  }, [dashboardData]);

  useEffect(() => {
    if (dashboardData) {
      const dateActivities =
        activitiesByDate.get(selectedDate.toDateString()) || [];
      setSelectedActivity(dateActivities.length > 0 ? dateActivities[0] : null);
    }
  }, [selectedDate, activitiesByDate, dashboardData]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => addMonths(prevMonth, 1));
  };

  const renderCalendar = () => {
    const monthStart = startOfWeek(currentMonth);
    const days = [];
    for (let i = 0; i < 42; i++) {
      const day = addDays(monthStart, i);
      const isCurrentMonth = isSameMonth(day, currentMonth);
      const isSelected = isSameDay(day, selectedDate);
      const hasActivity = dashboardData?.activities.some((activity) =>
        isSameDay(parseISO(activity.date), day)
      );

      days.push(
        <motion.div
          key={day.toString()}
          className={`cursor-pointer rounded-full p-2 text-center transition-all duration-200 hover:bg-gray-300 ${
            isCurrentMonth ? "text-gray-800" : "text-gray-400"
          } ${isSelected ? "bg-gray-400 text-white" : ""} ${
            hasActivity ? "font-bold" : ""
          }`}
          onClick={() => handleDateSelect(day)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          {format(day, "d")}
          {hasActivity && (
            <div className="mx-auto mt-1 size-1 rounded-full bg-gray-600"></div>
          )}
        </motion.div>
      );
    }

    return (
      <div className="grid grid-cols-7 gap-1">
        {["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"].map((day) => (
          <div key={day} className="text-center font-bold text-gray-600">
            {day}
          </div>
        ))}
        {days}
      </div>
    );
  };
  const renderActivityType = (type: string) => {
    switch (type) {
      case "mandatory":
        return "กิจกรรมบังคับ";
      case "mandatoryElective":
        return "กิจกรรมบังคับเลือก";
      case "elective":
        return "กิจกรรมเลือกเข้าร่วม";
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 text-gray-800">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Activity className="size-12 text-gray-600" />
        </motion.div>
      </div>
    );
  }

  if (!dashboardData) return null;

  const { user, activities, activityRequirements } = dashboardData;

  const ongoingActivities = activities.filter(
    (activity) => activity.status === "ongoing"
  );

  const upcomingActivities = activities
    .filter((activity) => activity.status === "upcoming")
    .slice(0, 3);

  const remainingActivities = activities.filter(
    (activity) => !user.activitiesParticipated.includes(activity.id)
  );

  const columns = [
    { key: "name", label: "ชื่อกิจกรรม" },
    { key: "type", label: "ประเภท" },
  ];

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-4 text-gray-800 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 text-center text-3xl font-bold sm:mb-12 sm:text-4xl"
          >
            ระบบบันทึกกิจกรรมนักศึกษา
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            <StatCard
              title="กิจกรรมบังคับ"
              value={`${user.completedActivities.mandatory} / ${activityRequirements.mandatory}`}
              icon={Activity}
              color="500"
            />
            <StatCard
              title="กิจกรรมบังคับเลือก"
              value={`${user.completedActivities.mandatoryElective} / ${activityRequirements.mandatoryElective}`}
              icon={Award}
              color="600"
            />
            <StatCard
              title="กิจกรรมเลือกเข้าร่วม"
              value={`${user.completedActivities.elective} / ${activityRequirements.elective}`}
              icon={Star}
              color="600"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-3">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="border-none bg-white shadow-lg lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 sm:text-2xl">
                    กิจกรรมที่กำลังดำเนินการ
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[300px] pr-4 sm:h-[400px]">
                    <AnimatePresence>
                      {ongoingActivities.map((activity) =>
                        user.activitiesParticipated.includes(
                          activity.id
                        ) ? null : (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="mb-4 rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 hover:shadow-md"
                          >
                            <h3 className="mb-2 text-lg font-semibold text-gray-800">
                              {activity.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isValidDate(activity.date)
                                ? format(parseISO(activity.date), "dd/MM/yyyy")
                                : "ไม่ระบุวันที่"}
                            </p>
                            <p className="text-sm text-gray-600">
                              {activity.time}
                            </p>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button className="mt-2 bg-gray-600 text-white hover:bg-gray-700">
                                  <QrCode className="mr-2 size-4" />
                                  เข้าร่วมกิจกรรม
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md sm:max-w-md">
                                <DialogTitle className="mb-4 text-xl font-bold text-gray-800">
                                  เข้าร่วมกิจกรรม: {activity.name}
                                </DialogTitle>
                                <div className="flex w-full flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                  <div className="flex flex-col items-center">
                                    <QRCode
                                      value={`${window.location.origin}/submit/${activity.shareUrl}`}
                                      size={150}
                                      className="rounded-lg"
                                    />
                                    <DialogDescription className="mt-2 text-center text-sm text-gray-600">
                                      แสกนเพื่อเข้าร่วมกิจกรรมนี้
                                    </DialogDescription>
                                  </div>
                                  <div className="flex flex-col items-center space-y-2">
                                    <Button
                                      className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                      onClick={() =>
                                        window.open(
                                          `${window.location.origin}/submit/${activity.shareUrl}`,
                                          "_blank"
                                        )
                                      }
                                    >
                                      <LinkIcon className="mr-2 size-4" />
                                      เปิดลิงก์เข้าร่วม
                                    </Button>
                                    <Button
                                      className="w-full"
                                      variant="outline"
                                      onClick={() =>
                                        navigator.clipboard.writeText(
                                          `${window.location.origin}/submit/${activity.shareUrl}`
                                        )
                                      }
                                    >
                                      คัดลอกลิงก์
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </motion.div>
                        )
                      )}
                    </AnimatePresence>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>

            {/* Calendar and Selected Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="lg:col-span-2"
            >
              <Card className="border-none bg-white shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-xl text-gray-800 sm:text-2xl">
                    {format(currentMonth, "MMMM yyyy", { locale: th })}
                  </CardTitle>
                  <div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handlePrevMonth}
                      className="text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    >
                      <ArrowLeft className="size-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleNextMonth}
                      className="text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    >
                      <ArrowRight className="size-5" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-7 lg:gap-6">
                    <div className="lg:col-span-4">{renderCalendar()}</div>
                    <div className="lg:col-span-3">
                      <AnimatePresence mode="wait">
                        {selectedActivity ? (
                          <motion.div
                            key={selectedActivity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="space-y-4"
                          >
                            <h3 className="text-xl font-semibold text-gray-800 sm:text-2xl">
                              {selectedActivity.name}
                            </h3>
                            <p className="text-gray-600">
                              {selectedActivity.description}
                            </p>
                            <div className="flex items-center text-gray-600">
                              <CalendarIcon className="mr-2 size-5 text-gray-500" />
                              <span>
                                {format(
                                  parseISO(selectedActivity.date),
                                  "dd/MM/yyyy"
                                )}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Clock className="mr-2 size-5 text-gray-500" />
                              <span>{selectedActivity.time}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="mr-2 size-5 text-gray-500" />
                              <span>{selectedActivity.location}</span>
                            </div>
                            <Badge
                              variant={
                                selectedActivity.type === "mandatory"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={`${
                                selectedActivity.type === "mandatory"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              } text-white`}
                            >
                              {selectedActivity.type}
                              {renderActivityType(selectedActivity.type)}
                            </Badge>
                            {!user.activitiesParticipated.includes(
                              selectedActivity.id
                            ) && (
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button className="mt-2 bg-gray-600 text-white hover:bg-gray-700">
                                    <QrCode className="mr-2 size-4" />
                                    เข้าร่วมกิจกรรม
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="flex flex-col items-center rounded-lg bg-white p-6 shadow-md sm:max-w-md">
                                  <DialogTitle className="mb-4 text-xl font-bold text-gray-800">
                                    เข้าร่วมกิจกรรม: {selectedActivity.name}
                                  </DialogTitle>
                                  <div className="flex w-full flex-col items-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                                    <div className="flex flex-col items-center">
                                      <QRCode
                                        value={`${window.location.origin}/submit/${selectedActivity.shareUrl}`}
                                        size={150}
                                        className="rounded-lg"
                                      />
                                      <DialogDescription className="mt-2 text-center text-sm text-gray-600">
                                        แสกนเพื่อเข้าร่วมกิจกรรมนี้
                                      </DialogDescription>
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                      <Button
                                        className="w-full bg-blue-600 text-white hover:bg-blue-700"
                                        onClick={() =>
                                          window.open(
                                            `${window.location.origin}/submit/${selectedActivity.shareUrl}`,
                                            "_blank"
                                          )
                                        }
                                      >
                                        <LinkIcon className="mr-2 size-4" />
                                        เปิดลิงก์เข้าร่วม
                                      </Button>
                                      <Button
                                        className="w-full"
                                        variant="outline"
                                        onClick={() =>
                                          navigator.clipboard.writeText(
                                            `${window.location.origin}/submit/${selectedActivity.shareUrl}`
                                          )
                                        }
                                      >
                                        คัดลอกลิงก์
                                      </Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            )}
                            {user.activitiesParticipated.includes(
                              selectedActivity.id
                            ) && (
                              <div className="flex items-center text-green-500">
                                <CheckCircle className="mr-2 size-5" />
                                <span>คุณได้เข้าร่วมกิจกรรมนี้แล้ว</span>
                              </div>
                            )}
                          </motion.div>
                        ) : (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-gray-600"
                          >
                            เลือกวันที่เพื่อดูรายละเอียดกิจกรรม
                          </motion.p>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="border-none bg-white shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-gray-800 sm:text-2xl">
                  กิจกรรมที่กำลังจะมาถึง
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                  <AnimatePresence>
                    {upcomingActivities.map((activity) => (
                      <ActivityCard key={activity.id} activity={activity} />
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <Card className="border-none bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-800 sm:text-2xl">
                  กิจกรรมที่ผู้ใช้ทำทั้งหมด
                </CardTitle>
                <Dialog
                  open={showAllCompleted}
                  onOpenChange={setShowAllCompleted}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    >
                      ดูทั้งหมด <ChevronRight className="ml-2 size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl">
                    <DialogTitle>กิจกรรมที่ผู้ใช้ทำทั้งหมด</DialogTitle>
                    <DialogDescription>
                      รายการกิจกรรมทั้งหมดที่คุณได้ทำ
                    </DialogDescription>
                    <DataTable
                      columns={columns}
                      data={activities.filter((activity) =>
                        user.activitiesParticipated.includes(activity.id)
                      )}
                      showActions={false}
                      itemsPerPage={10}
                      totalCount={user.activitiesParticipated.length}
                      totalPage={Math.ceil(
                        user.activitiesParticipated.length / 10
                      )}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {activities
                      .filter((activity) =>
                        user.activitiesParticipated.includes(activity.id)
                      )
                      .slice(0, 3)
                      .map((activity) => (
                        <motion.div
                          key={activity.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 hover:shadow-md sm:flex-row sm:items-center"
                        >
                          <div>
                            <h3 className="font-semibold text-gray-800">
                              {activity.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {isValidDate(activity.date)
                                ? format(parseISO(activity.date), "dd/MM/yyyy")
                                : "ไม่ระบุวันที่"}{" "}
                              | {activity.time}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                            <Badge
                              variant={
                                activity.type === "mandatory"
                                  ? "destructive"
                                  : "secondary"
                              }
                              className={`${
                                activity.type === "mandatory"
                                  ? "bg-red-500"
                                  : "bg-green-500"
                              } text-white`}
                            >
                              {activity.type}
                            </Badge>
                            <CheckCircle className="size-5 text-green-500" />
                          </div>
                        </motion.div>
                      ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.2 }}
          >
            <Card className="border-none bg-white shadow-lg">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-xl text-gray-800 sm:text-2xl">
                  กิจกรรมที่ยังไม่ได้ทำ
                </CardTitle>
                <Dialog
                  open={showAllRemaining}
                  onOpenChange={setShowAllRemaining}
                >
                  <DialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                    >
                      ดูทั้งหมด <ChevronRight className="ml-2 size-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl">
                    <DialogTitle>กิจกรรมที่ยังไม่ได้ทำ</DialogTitle>
                    <DialogDescription>
                      รายการกิจกรรมทั้งหมดที่คุณยังไม่ได้ทำ
                    </DialogDescription>
                    <DataTable
                      columns={columns}
                      data={remainingActivities}
                      showActions={false}
                      itemsPerPage={10}
                      totalCount={remainingActivities.length}
                      totalPage={Math.ceil(remainingActivities.length / 10)}
                    />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <AnimatePresence>
                    {remainingActivities.slice(0, 3).map((activity) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className="flex flex-col justify-between rounded-lg bg-gray-50 p-4 transition-all duration-300 hover:bg-gray-100 hover:shadow-md sm:flex-row sm:items-center"
                      >
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {activity.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {isValidDate(activity.date)
                              ? format(parseISO(activity.date), "dd/MM/yyyy")
                              : "ไม่ระบุวันที่"}{" "}
                            | {activity.time}
                          </p>
                        </div>
                        <div className="mt-2 flex items-center space-x-2 sm:mt-0">
                          <Badge
                            variant={
                              activity.type === "mandatory"
                                ? "destructive"
                                : "secondary"
                            }
                            className={`${
                              activity.type === "mandatory"
                                ? "bg-red-500"
                                : "bg-green-500"
                            } text-white`}
                          >
                            {activity.type}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </TooltipProvider>
  );
}
