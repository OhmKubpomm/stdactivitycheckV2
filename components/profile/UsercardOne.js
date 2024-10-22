"use client";
import React from "react";
import Link from "next/link";

import { useMyContext } from "@/context/provider";
import Image from "next/image";

import {
  Card,
  Badge,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from "@tremor/react";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";
const UsercardOne = ({ User }) => {
  const { setEditUser } = useMyContext();

  return (
    <>
      <div>
        <Card>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>ชื่อผู้ใช้งาน</TableHeaderCell>
                <TableHeaderCell>รูปภาพ</TableHeaderCell>
                <TableHeaderCell>อีเมล</TableHeaderCell>
                <TableHeaderCell>รหัสผ่าน</TableHeaderCell>
                <TableHeaderCell>ชื่อ</TableHeaderCell>
                <TableHeaderCell>นามสกุล</TableHeaderCell>
                <TableHeaderCell>วันเกิด</TableHeaderCell>
                <TableHeaderCell>ที่อยู่</TableHeaderCell>
                <TableHeaderCell>เบอร์โทร</TableHeaderCell>
                <TableHeaderCell>ประเภทนักศึกษา</TableHeaderCell>
                <TableHeaderCell>สิทธิ์การใช้งาน</TableHeaderCell>
                <TableHeaderCell>ตั้งค่า</TableHeaderCell>
              </TableRow>
            </TableHead>

            <TableBody>
              <TableRow>
                <TableCell>{User?.name}</TableCell>
                <TableCell className="table-cell">
                  {User?.image ? (
                    <Image
                      src={User?.image}
                      alt={User?.image}
                      sizes="100vw"
                      width={100}
                      height={100}
                      className=" opacity-0 transition-opacity"
                      onLoad={(image) => {
                        image.target.classList.remove("opacity-0");
                      }}
                      quality={60}
                    />
                  ) : (
                    // You can put some placeholder here when image is not available
                    <div>No Image</div>
                  )}
                </TableCell>
                <TableCell>{User?.email}</TableCell>
                <TableCell>{User?.password}</TableCell>
                <TableCell>{User?.Firstname}</TableCell>
                <TableCell>{User?.Lastname}</TableCell>
                <TableCell>{User?.Date}</TableCell>
                <TableCell>{User?.Address}</TableCell>
                <TableCell>{User?.Telephone}</TableCell>
                <TableCell>{User?.userType}</TableCell>
                <TableCell>{User?.role}</TableCell>
                <TableCell className="table-cell">
                  <Link
                    href="/dashboard/cruduser/EditUser"
                    onClick={() => setEditUser(User)}
                  >
                    <Badge color="yellow" icon={ModeEditRoundedIcon}>
                      แก้ไข
                    </Badge>
                  </Link>
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
