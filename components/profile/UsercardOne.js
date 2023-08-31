"use client";
import React from "react";
import Link from "next/link";

import { useMyContext } from "@/context/provider";

import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";

const UsercardOne = ({ User }) => {
  const { setEditUser } = useMyContext();



  return (
   
    <>  
   
   <div>

 
    <Card>
      <Table >
        
        <TableHead>
          <TableRow>
            <TableHeaderCell>ชื่อผู้ใช้งาน</TableHeaderCell>
            <TableHeaderCell>อีเมล</TableHeaderCell>
            <TableHeaderCell>รหัสผ่าน</TableHeaderCell>
            <TableHeaderCell>ชื่อ</TableHeaderCell>
            <TableHeaderCell>นามสกุล</TableHeaderCell>
            <TableHeaderCell>วันเกิด</TableHeaderCell>
            <TableHeaderCell>ที่อยู่</TableHeaderCell>
            <TableHeaderCell>เบอร์โทร</TableHeaderCell>
            <TableHeaderCell>สิทธิ์การใช้งาน</TableHeaderCell>
            <TableHeaderCell>ตั้งค่า</TableHeaderCell>
          </TableRow>
        </TableHead>
        
        <TableBody>
          <TableRow>
            <TableCell>{User?.name}</TableCell>
            <TableCell>{User?.email}</TableCell>
            <TableCell>{User?.password}</TableCell>
            <TableCell>{User?.Firstname}</TableCell>
            <TableCell>{User?.Lastname}</TableCell>
            <TableCell>{User?.Date}</TableCell>
            <TableCell>{User?.Address}</TableCell>
            <TableCell>{User?.Telephone}</TableCell>
            <TableCell>{User?.role}</TableCell>
            <TableCell>
            <Link href="/dashboard/cruduser/EditUser" onClick={() => setEditUser(User)}>แก้ไข</Link>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Card>
  </div>
    </>
  );
};

export default UsercardOne;
