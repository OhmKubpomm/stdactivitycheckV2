"use client";

import React, { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  ArrowUpDown,
  MoreHorizontal,
  TrendingUp,
  Users,
  Star,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { FeedbackDataTable } from "@/components/globals/feedback-datatable";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export type Feedback = {
  _id: string;
  userId: {
    name: string;
  };
  activityId: {
    ActivityFormname: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
};

export type ChartData = {
  date: string;
  count: number;
  averageRating: number;
};

export function FeedbackList({
  feedbacks,
  itemsPerPage,
  totalCount,
  totalPage,
  chartData,
}: {
  feedbacks: Feedback[];
  itemsPerPage: number;
  totalCount: number;
  totalPage: number;
  chartData: ChartData[];
}) {
  const columns: ColumnDef<Feedback>[] = [
    {
      accessorKey: "userId.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ผู้ให้แบบสอบถาม
            <ArrowUpDown className="ml-2 size-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "activityId.ActivityFormname",
      header: "กิจกรรม",
    },
    {
      accessorKey: "rating",
      header: "คะแนน",
    },
    {
      accessorKey: "createdAt",
      header: "วันที่ให้แบบสอบถาม",
      cell: ({ row }) => {
        return format(new Date(row.getValue("createdAt")), "dd/MM/yyyy HH:mm");
      },
    },
    {
      id: "actions",
      cell: ({ row, table }) => {
        const feedback = row.original;
        const meta = table.options.meta as {
          handleDelete: (id: string) => void;
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="size-8 p-0">
                <span className="sr-only">เปิดเมนู</span>
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>การดำเนินการ</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(feedback._id)}
              >
                คัดลอกรหัสแบบสอบถาม
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => meta.handleDelete(feedback._id)}>
                ลบแบบสอบถาม
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const averageRating = useMemo(() => {
    const totalRating = feedbacks.reduce(
      (sum, feedback) => sum + feedback.rating,
      0
    );
    return totalRating / feedbacks.length || 0;
  }, [feedbacks]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              จำนวนแบบสอบถามทั้งหมด
            </CardTitle>
            <TrendingUp className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              จำนวนผู้ให้แบบสอบถาม
            </CardTitle>
            <Users className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{feedbacks.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">คะแนนเฉลี่ย</CardTitle>
            <Star className="text-muted-foreground size-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageRating.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="w-full">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>จัดการแบบสอบถาม</CardTitle>
        </CardHeader>
        <CardContent>
          <FeedbackDataTable
            columns={columns}
            data={feedbacks}
            itemsPerPage={itemsPerPage}
            totalCount={totalCount}
            totalPage={totalPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}
