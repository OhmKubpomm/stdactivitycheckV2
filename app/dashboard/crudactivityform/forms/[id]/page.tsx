import { GetFormById, GetFormWithSubmissions } from "@/actions/ActivityAction";
import FormLinkShare from "@/components/Activityform/FormLinkShare";
import VisitBtn from "@/components/Activityform/VisitBtn";
import React, { ReactNode } from "react";
import { StatsCard } from "../../page";
import {
  FormElementInstance,
  ElementsType,
} from "@/components/Activityform/FormElements";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

import { LogOut } from "lucide-react";

import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { LuView } from "react-icons/lu";

import { Checkbox } from "@/components/ui/checkbox";

async function FormDetailPage({
  params,
}: {
  params: {
    id: string;
  };
}) {
  const { id } = params;
  const form = await GetFormById(Object(id));

  const { ActivityVisits, ActivitySubmissions } = form;

  let submissionRate = 0;

  if (ActivityVisits > 0) {
    submissionRate = (ActivitySubmissions / ActivityVisits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow">
        <div className="container mx-auto py-6">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <h1 className="max-w-2xl truncate text-3xl font-bold text-gray-800">
              {form.ActivityFormname}
            </h1>
            <div className="flex space-x-4">
              <FormLinkShare shareUrl={form.ActivityShareurl} />
              <VisitBtn shareUrl={form.ActivityShareurl} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="จำนวนการเข้าชม"
            icon={<LuView className="text-2xl text-blue-600" />}
            helperText="จำนวนการเข้าชมแบบฟอร์มทั้งหมด"
            value={ActivityVisits?.toLocaleString() || "0"}
            loading={false}
            className="rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
          />

          <StatsCard
            title="จำนวนการส่งแบบฟอร์ม"
            icon={<FaWpforms className="text-2xl text-yellow-600" />}
            helperText="จำนวนการส่งแบบฟอร์มทั้งหมด"
            value={ActivitySubmissions?.toLocaleString() || "0"}
            loading={false}
            className="rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
          />

          <StatsCard
            title="อัตราการส่งแบบฟอร์ม"
            icon={<HiCursorClick className="text-2xl text-green-600" />}
            helperText="เปอร์เซ็นต์ของผู้เข้าชมที่ส่งแบบฟอร์ม"
            value={submissionRate.toFixed(2) + "%"}
            loading={false}
            className="rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
          />

          <StatsCard
            title="อัตราการออกจากหน้า"
            icon={<LogOut className="text-2xl text-red-600" />}
            helperText="เปอร์เซ็นต์ของผู้เข้าชมที่ออกโดยไม่ส่งแบบฟอร์ม"
            value={bounceRate.toFixed(2) + "%"}
            loading={false}
            className="rounded-xl bg-white shadow-lg transition-shadow hover:shadow-xl"
          />
        </div>

        <div className="mt-12">
          <SubmissionsTable id={form._id} />
        </div>
      </div>
    </div>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
  userSendName: string;
};

async function SubmissionsTable({ id }: { id: number }) {
  const form = await GetFormWithSubmissions(id);

  if (!form) {
    throw new Error("ไม่พบแบบฟอร์ม");
  }
  const formElements = JSON.parse(
    form.ActivityContent
  ) as FormElementInstance[];

  const columns: {
    id: string;
    label: string;
    required: boolean;
    type: ElementsType;
  }[] = [];

  formElements.forEach((element) => {
    switch (element.type) {
      case "TextField":
      case "NumberField":
      case "TextAreaField":
      case "DateField":
      case "SelectField":
      case "CheckboxField":
        columns.push({
          id: element.id,
          label: element.extraAttributes?.label,
          required: element.extraAttributes?.required,
          type: element.type,
        });
        break;
      default:
        break;
    }
  });

  const rows: Row[] = form.FormSubmissions.map((submission: any) => {
    const content = submission.Formsubcontent
      ? JSON.parse(submission.Formsubcontent)
      : {};

    return {
      ...content,
      userSendName: submission.userSendName,
      submittedAt: submission.createdAt.toString(), // Convert Date to string
    };
  });

  if (rows.length === 0) {
    return (
      <div className="rounded-lg bg-white p-8 text-center shadow">
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">
          ไม่พบการส่งแบบฟอร์ม
        </h2>
        <p className="text-gray-600">ยังไม่มีผู้ใช้ส่งแบบฟอร์มนี้</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow">
      <div className="border-b border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-800">การส่งแบบฟอร์ม</h2>
        <p className="mt-1 text-gray-600">รายการการส่งแบบฟอร์มทั้งหมด</p>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
                >
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                ส่งเมื่อ
              </TableHead>
              <TableHead className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                ผู้ส่ง
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index} className="hover:bg-gray-50">
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                  {new Date(row.submittedAt).toLocaleString("th-TH", {
                    dateStyle: "full",
                    timeStyle: "short",
                  })}
                </TableCell>
                <TableCell className="whitespace-nowrap px-6 py-4 text-right text-sm text-gray-500">
                  {row.userSendName}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField": {
      if (!value) break;
      const date = new Date(value); // คอนเวิร์ตค่าให้เป็น Date object
      node = (
        <Badge variant="outline">
          {date.toLocaleString("th-TH", {
            dateStyle: "full",
            timeStyle: "short",
          })}{" "}
        </Badge>
      );
      break;
    }
    case "CheckboxField": {
      const checked = value === "true";
      node = <Checkbox checked={checked} disabled />;
      break;
    }
  }

  return <TableCell className="whitespace-nowrap px-6 py-4">{node}</TableCell>;
}
