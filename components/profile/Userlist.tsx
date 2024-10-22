"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/globals/DataTable";

interface User {
  _id: string;
  name: string;
  image?: string;
  email: string;
  password: string;
  Firstname: string;
  Lastname: string;
  Date: string;
  Address: string;
  Telephone: string;
  role: string;
  userType: string;
}

interface UserlistProps {
  allUser: User[];
  totalCount: number;
  totalPage: number;
}

const Userlist: React.FC<UserlistProps> = ({
  allUser,
  totalCount,
  totalPage,
}) => {
  const columns = [
    { key: "name", label: "ชื่อผู้ใช้งาน" },
    { key: "image", label: "รูปภาพ" },
    { key: "email", label: "อีเมล" },
    { key: "password", label: "รหัสผ่าน" },
    { key: "Firstname", label: "ชื่อ" },
    { key: "Lastname", label: "นามสกุล" },
    { key: "Date", label: "วันเกิด" },
    { key: "Address", label: "ที่อยู่" },
    { key: "Telephone", label: "เบอร์โทร" },
    { key: "userType", label: "ประเภทนักศึกษา" },
    { key: "role", label: "สิทธิ์การใช้งาน" },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>จัดการข้อมูล User</CardTitle>
        <Link href="/dashboard/cruduser/AddUser" passHref>
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="mr-2 size-4" /> เพิ่มข้อมูล
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={allUser}
          itemsPerPage={5}
          totalCount={totalCount}
          totalPage={totalPage}
          showActions={true}
        />
      </CardContent>
    </Card>
  );
};

export default Userlist;
