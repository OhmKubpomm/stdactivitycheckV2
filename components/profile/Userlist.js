"use client";
import React from "react";
import Usercard from "@/components/profile/Usercard";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, Title, Badge } from "@tremor/react";
import Searchform from "@/components/globals/Searchform";
import PersonAddAltRoundedIcon from "@mui/icons-material/PersonAddAltRounded";
import Pagination from "@/components/globals/Paginationform";
const Userlist = ({ allUser, totalPage }) => {
  return (
    <>
      <Card className="card-wrapper">
        <Title>จัดการข้อมูล User</Title>

        <Link href="/dashboard/cruduser/AddUser">
          <Badge color="blue" icon={PersonAddAltRoundedIcon}>
            เพิ่มข้อมูล
          </Badge>
        </Link>
        <div>
          <Searchform />
        </div>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>ชื่อผู้ใช้งาน</TableHead>
              <TableHead>รูปภาพ</TableHead>
              <TableHead>อีเมล</TableHead>
              <TableHead>รหัสผ่าน</TableHead>
              <TableHead>ชื่อ</TableHead>
              <TableHead>นามสกุล</TableHead>
              <TableHead>วันเกิด</TableHead>
              <TableHead>ที่อยู่</TableHead>
              <TableHead>เบอร์โทร</TableHead>
              <TableHead>สิทธิ์การใช้งาน</TableHead>
              <TableHead>ตั้งค่า</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allUser.map((User) => {
              return <Usercard key={User._id} User={User} />;
            })}
          </TableBody>
        </Table>

        <Pagination totalPage={totalPage} />
      </Card>
    </>
  );
};

export default Userlist;
