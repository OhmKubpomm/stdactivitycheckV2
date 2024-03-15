/* eslint-disable tailwindcss/no-custom-classname */
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
import { formatDistance, format } from "date-fns";
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

  if (!form) {
    throw new Error("ไม่พบแบบฟอร์ม");
  }

  const { ActivityVisits, ActivitySubmissions } = form;

  let submissionRate = 0;

  if (ActivityVisits > 0) {
    submissionRate = (ActivitySubmissions / ActivityVisits) * 100;
  }

  const bounceRate = 100 - submissionRate;

  return (
    <>
      <div className="border-muted border-b py-10">
        <div className="container flex justify-between">
          <h1 className="truncate text-4xl font-bold">
            {form.ActivityFormname}
          </h1>
          <VisitBtn shareUrl={form.ActivityShareurl} />
        </div>
      </div>
      <div className="border-muted border-b py-4">
        <div className="container flex items-center justify-between gap-2">
          <FormLinkShare shareUrl={form.ActivityShareurl} />
        </div>
      </div>
      <div className="container grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="จำนวนการเข้าชมทั้งหมด"
          icon={<LuView className="text-blue-600" />}
          helperText="จำนวนการเข้าชมแบบฟอร์มทั้งหมด"
          value={ActivityVisits?.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-blue-600"
        />

        <StatsCard
          title="จำนวนการส่งแบบฟอร์มทั้งหมด"
          icon={<FaWpforms className="text-yellow-600" />}
          helperText="จำนวนการส่งแบบฟอร์มทั้งหมด"
          value={ActivitySubmissions?.toLocaleString() || ""}
          loading={false}
          className="shadow-md shadow-yellow-600"
        />

        <StatsCard
          title="อัตราการส่งแบบฟอร์ม"
          icon={<HiCursorClick className="text-green-600" />}
          helperText="จำนวนการเข้าชมที่ส่งแบบฟอร์ม"
          value={submissionRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-green-600"
        />

        <StatsCard
          title="อัตราการเลิกเข้าชม"
          icon={<LogOut className="text-red-600" />}
          helperText="จำนวนการเข้าชมที่ออกโดยไม่มีการกระทำ"
          value={bounceRate.toLocaleString() + "%" || ""}
          loading={false}
          className="shadow-md shadow-red-600"
        />
      </div>

      <div className="container pt-10">
        <SubmissionsTable id={form._id} />
      </div>
    </>
  );
}

export default FormDetailPage;

type Row = { [key: string]: string } & {
  submittedAt: Date;
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
      submittedAt: new Date(submission.createdAt),
    };
  });

  // ตรวจสอบว่ามีข้อมูลในตาราง หรือไม่
  if (rows.length === 0) {
    return <div>ไม่พบการส่งแบบฟอร์ม</div>;
  }

  return (
    <>
      <h1 className="my-4 text-2xl font-bold">การส่งแบบฟอร์ม</h1>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.id} className="uppercase">
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-muted-foreground text-right uppercase">
                ส่งเมื่อ
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {columns.map((column) => (
                  <RowCell
                    key={column.id}
                    type={column.type}
                    value={row[column.id]}
                  />
                ))}
                <TableCell className="text-muted-foreground text-right">
                  {formatDistance(row.submittedAt, new Date(), {
                    addSuffix: true,
                  })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

function RowCell({ type, value }: { type: ElementsType; value: string }) {
  let node: ReactNode = value;

  switch (type) {
    case "DateField":
      {
        if (!value) break;
        const date = new Date(value);
        node = <Badge>{format(date, "dd/MM/yyyy")}</Badge>;
      }
      break;
    case "CheckboxField":
      {
        const checked = value === "true";
        node = <Checkbox checked={checked} disabled />;
      }
      break;
  }

  return <TableCell>{node}</TableCell>;
}
