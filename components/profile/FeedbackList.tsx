"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { FeedbackDataTable } from "@/components/globals/feedback-datatable";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Link from "next/link";

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

export function FeedbackList({
  feedbacks,
  itemsPerPage,
  totalCount,
  totalPage,
}: {
  feedbacks: Feedback[];
  itemsPerPage: number;
  totalCount: number;
  totalPage: number;
}) {
  const columns: ColumnDef<Feedback>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="เลือกทั้งหมด"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="เลือกแถว"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "userId.name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ผู้ใช้
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
      accessorKey: "comment",
      header: "ความคิดเห็น",
    },
    {
      accessorKey: "createdAt",
      header: "วันที่สร้าง",
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

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>จัดการข้อมูลแบบสอบถาม</CardTitle>
        <Link href="/dashboard/crudfeedback/AddFeedback" passHref>
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="mr-2 size-4" /> เพิ่มข้อมูล
          </Button>
        </Link>
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
  );
}
