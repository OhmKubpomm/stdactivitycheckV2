"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import {
  createFeedback,
  checkFeedbackEligibility,
} from "@/actions/feedbackActions";
import { DashboardActivityType } from "@/actions/DashboardAction";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  activityId: z.string({
    required_error: "กรุณาเลือกกิจกรรม",
  }),
  rating: z
    .string()
    .refine(
      (val) =>
        !isNaN(parseInt(val)) && parseInt(val) >= 1 && parseInt(val) <= 5,
      {
        message: "กรุณาเลือกความรู้สึกของคุณ",
      }
    ),
  comment: z.string().min(5, {
    message: "ความคิดเห็นต้องมีอย่างน้อย 5 ตัวอักษร",
  }),
});

interface FeedbackFormProps {
  activities: DashboardActivityType[];
  userFeedbackActivities: string[];
}

const emojis = [
  { value: "1", label: "😞", description: "แย่มาก" },
  { value: "2", label: "🙁", description: "แย่" },
  { value: "3", label: "😐", description: "ปานกลาง" },
  { value: "4", label: "🙂", description: "ดี" },
  { value: "5", label: "😄", description: "ดีมาก" },
];

export function FeedbackForm({
  activities,
  userFeedbackActivities,
}: FeedbackFormProps) {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      activityId: "",
      rating: "",
      comment: "",
    },
  });

  const filteredActivities = useMemo(
    () =>
      activities.filter((activity) =>
        activity.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [activities, searchTerm]
  );

  useEffect(() => {
    const checkEligibility = async () => {
      const activityId = form.getValues("activityId");
      if (activityId) {
        const result = await checkFeedbackEligibility(activityId);
        setIsEligible(result.eligible);
        if (!result.eligible) {
          toast({
            title: "ไม่สามารถส่งข้อเสนอแนะได้",
            description: result.error,
            variant: "destructive",
            className: "bg-red-100 border-red-400 text-red-800",
          });
        }
      }
    };

    checkEligibility();
  }, [form, toast]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!isEligible) {
      toast({
        title: "ไม่สามารถส่งข้อเสนอแนะได้",
        description: "คุณไม่มีสิทธิ์ส่งข้อเสนอแนะสำหรับกิจกรรมนี้",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800",
      });
      return;
    }

    try {
      const result = await createFeedback(values);
      if (result.error) {
        toast({
          title: "เกิดข้อผิดพลาด",
          description: result.error,
          variant: "destructive",
          className: "bg-red-100 border-red-400 text-red-800",
        });
      } else {
        toast({
          title: "สำเร็จ",
          description: "ส่งข้อเสนอแนะเรียบร้อยแล้ว",
          className: "bg-green-100 border-green-400 text-green-800",
        });
        form.reset();
      }
    } catch (error) {
      console.error("Error submitting feedback:", error);
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถส่งข้อเสนอแนะได้ กรุณาลองอีกครั้ง",
        variant: "destructive",
        className: "bg-red-100 border-red-400 text-red-800",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="activityId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>กิจกรรม</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="border-2 border-indigo-300 bg-white focus:border-indigo-500">
                    <SelectValue placeholder="เลือกกิจกรรม" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="border-2 border-indigo-300 bg-white">
                  <Input
                    placeholder="ค้นหากิจกรรม..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 border-indigo-300 focus:border-indigo-500"
                  />
                  {filteredActivities.map((activity) => (
                    <SelectItem
                      key={activity.id}
                      value={activity.id}
                      disabled={userFeedbackActivities.includes(activity.id)}
                    >
                      {activity.name}
                      {userFeedbackActivities.includes(activity.id) &&
                        " (ส่งข้อเสนอแนะแล้ว)"}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-indigo-700">
                ความรู้สึกของคุณ
              </FormLabel>
              <div className="grid grid-cols-5 gap-2 rounded-lg border-2 border-indigo-300 bg-white p-4">
                {emojis.map((emoji) => (
                  <motion.button
                    key={emoji.value}
                    type="button"
                    onClick={() => field.onChange(emoji.value)}
                    className={cn(
                      "flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200",
                      field.value === emoji.value
                        ? "bg-indigo-100 border-2 border-indigo-500"
                        : "hover:bg-indigo-50"
                    )}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="mb-1 text-4xl">{emoji.label}</span>
                    <span className="text-xs text-gray-600">
                      {emoji.description}
                    </span>
                  </motion.button>
                ))}
              </div>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="comment"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-lg font-semibold text-indigo-700">
                ความคิดเห็น
              </FormLabel>
              <FormControl>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Textarea
                    placeholder="แชร์ความคิดเห็นของคุณที่นี่..."
                    className="min-h-[120px] resize-none rounded-lg border-2 border-indigo-300 bg-white focus:border-indigo-500"
                    {...field}
                  />
                </motion.div>
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              type="submit"
              className={cn(
                "w-full rounded-lg px-6 py-3 font-bold text-white shadow-lg transition duration-200 ease-in-out",
                isEligible
                  ? "bg-gradient-to-r from-orange-500 to-orange-600 hover:scale-105 hover:from-red-600 hover:to-orange-700"
                  : "bg-gray-400 cursor-not-allowed"
              )}
              disabled={!isEligible}
            >
              ส่งข้อเสนอแนะ
            </Button>
          </motion.div>
        </AnimatePresence>
      </form>
    </Form>
  );
}
