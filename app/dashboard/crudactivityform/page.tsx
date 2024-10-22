/* eslint-disable tailwindcss/no-custom-classname */
import { GetFormStats, GetForms, CloneForm } from "@/actions/ActivityAction";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Key, ReactNode, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Separator } from "@/components/ui/separator";
import CreateFormBtn from "@/components/Activityform/CreateFormBtn";

import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ActivityForm from "@/models/ActivityForm";
import connectdatabase from "@/utils/connectdatabase";
import {
  Users,
  CheckCircle,
  MousePointerSquareDashed,
  LogOut,
  Book,
  PenLine,
  ArrowRightCircle,
  Eye,
  Copy,
  ChevronDown,
} from "lucide-react";
import DeleteBtn from "@/components/Activityform/DeleteBtn";
connectdatabase();
interface CloneFormButtonProps {
  formId: string;
  formName: string;
}

export default function Home() {
  return (
    <div className="container pt-4">
      <Suspense fallback={<StatsCards loading={true} />}>
        <CardStatsWrapper />
      </Suspense>
      <Separator className="my-6" />
      <h2 className="col-span-2 text-4xl font-bold">จัดการแบบฟอร์ม</h2>
      <Separator className="my-6" />
      <div className="gric-cols-1 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <CreateFormBtn />
        <Suspense
          fallback={[1, 2, 3, 4].map((el) => (
            <FormCardSkeleton key={el} />
          ))}
        >
          <FormCards />
        </Suspense>
      </div>
    </div>
  );
}

async function CardStatsWrapper() {
  const stats = await GetFormStats();
  return <StatsCards loading={false} data={stats} />;
}

interface StatsCardProps {
  data?: Awaited<ReturnType<typeof GetFormStats>>;
  loading: boolean;
}

function StatsCards(props: StatsCardProps) {
  const { data, loading } = props;

  return (
    <div className="grid w-full grid-cols-1 gap-4 pt-8 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="จำนวนการเข้าชมทั้งหมด"
        icon={<Users className="text-orange-600" />}
        helperText={`จำนวนผู้เข้าชมทั้งหมดจากทุกแบบฟอร์ม`}
        value={data?.visits?.toLocaleString() || "ไม่มีข้อมูล"}
        loading={loading}
        className="shadow-md shadow-orange-600"
      />

      <StatsCard
        title="จำนวนการส่งแบบฟอร์มทั้งหมด"
        icon={<CheckCircle className="text-yellow-600" />}
        helperText={`จำนวนการส่งแบบฟอร์มสำเร็จทั้งหมดจากทุกแบบฟอร์ม`}
        value={data?.submissions?.toLocaleString() || "ไม่มีข้อมูล"}
        loading={loading}
        className="shadow-md shadow-yellow-600"
      />

      <StatsCard
        title="จำนวนผู้ใช้งานที่ทำแบบฟอร์มแล้ว"
        icon={<MousePointerSquareDashed className="text-green-600" />}
        helperText={`มีผู้ทำแบบฟอร์มแล้วจำนวน ${data?.submissions} คน จากผู้เข้าชมทั้งหมด ${data?.visits} คน`}
        value={`${data?.submissions?.toLocaleString() || "ไม่มีข้อมูล"} คน`}
        loading={loading}
        className="shadow-md shadow-green-600"
      />

      <StatsCard
        title="จำนวนผู้ใช้ที่ออกจากแบบฟอร์ม"
        icon={<LogOut className="text-red-600" />}
        helperText={`มีผู้ใช้จำนวน ${
          data?.visits - data?.submissions
        } คน ที่ออกจากหน้าแบบฟอร์มโดยไม่ส่ง`}
        value={`${
          (data?.visits - data?.submissions)?.toLocaleString() || "ไม่มีข้อมูล"
        } คน`}
        loading={loading}
        className="shadow-md shadow-red-600"
      />
    </div>
  );
}

export function StatsCard({
  title,
  value,
  icon,
  helperText,
  loading,
  className,
}: {
  title: string;
  value: string;
  helperText: string;
  className: string;
  loading: boolean;
  icon: ReactNode;
}) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-muted-foreground text-sm font-medium">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {loading && (
            <Skeleton>
              <span className="opacity-0">0</span>
            </Skeleton>
          )}
          {!loading && value}
        </div>
        <p className="text-muted-foreground pt-1 text-xs">{helperText}</p>
      </CardContent>
    </Card>
  );
}

function FormCardSkeleton() {
  return <Skeleton className="border-primary-/20 h-[190px] w-full border-2" />;
}

async function FormCards() {
  const forms = await GetForms();
  return (
    <>
      {forms.map((form: { id: Key | null | undefined }) => (
        <FormCard key={form.id} form={form} />
      ))}
    </>
  );
}

function FormCard({ form }: { form: typeof ActivityForm }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span className="truncate font-bold">{form.ActivityFormname}</span>
          {form.published && (
            <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
              เผยแพร่แล้ว
            </Badge>
          )}
          {!form.published && (
            <Badge className="bg-orange-500 text-white">แบบร่าง</Badge>
          )}
        </CardTitle>
        <CardDescription className="text-muted-foreground flex items-center justify-between text-sm">
          {formatDistance(form.createdAt, new Date(), {
            addSuffix: true,
          })}
          {form.published && (
            <span className="flex items-center gap-2">
              <Eye className="text-muted-foreground" />
              <span>{form.ActivityVisits?.toLocaleString() ?? "0"}</span>
              <Book className="text-muted-foreground" />
              <span>{form.ActivitySubmissions?.toLocaleString() ?? "0"}</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-muted-foreground h-[20px] truncate text-sm">
        {form.ActivityDescription || "ไม่มีคำอธิบาย"}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        {form.published && (
          <Button
            asChild
            className="text-md w-full gap-4 bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          >
            <Link href={`/dashboard/crudactivityform/forms/${form.id}`}>
              ดูแบบฟอร์ม <ArrowRightCircle />
            </Link>
          </Button>
        )}
        {!form.published && (
          <Button
            variant={"secondary"}
            asChild
            className="text-md w-full gap-4  bg-gradient-to-r from-primary-500 to-yellow-500 text-white"
          >
            <Link href={`/dashboard/crudactivityform/builder/${form.id}`}>
              แก้ไขแบบฟอร์มนี้ <PenLine />
            </Link>
          </Button>
        )}
        <div className="flex w-full gap-2">
          <DeleteBtn formId={form.id} />
          <CloneFormButton formId={form.id} formName={form.ActivityFormname} />
        </div>
      </CardFooter>
    </Card>
  );
}

function CloneFormButton({ formId, formName }: CloneFormButtonProps) {
  return (
    <form action={CloneForm} className="w-full">
      <input type="hidden" name="formId" value={formId} />
      <details className="group w-full">
        <summary className="flex cursor-pointer list-none items-center justify-between rounded-lg bg-gradient-to-r from-primary-500 to-yellow-500 px-4 py-2 text-white shadow-lg transition-all hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
          <div className="flex items-center space-x-2">
            <Copy className="size-5" />
            <span className="font-medium">คัดลอกแบบฟอร์มนี้</span>
          </div>
          <ChevronDown className="size-5 transition-transform group-open:rotate-180" />
        </summary>
        <div className="mt-3 space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="space-y-2">
            <Label
              htmlFor={`newFormName-${formId}`}
              className="text-sm font-medium text-gray-700"
            >
              ชื่อแบบฟอร์มใหม่
            </Label>
            <Input
              id={`newFormName-${formId}`}
              name="newFormName"
              placeholder="ใส่ชื่อแบบฟอร์มใหม่"
              defaultValue={`${formName} (สำเนา)`}
              className="w-full"
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-primary-500 to-yellow-500 text-white transition-all hover:from-green-600 hover:to-teal-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          >
            ยืนยันการคัดลอก
          </Button>
        </div>
      </details>
    </form>
  );
}
