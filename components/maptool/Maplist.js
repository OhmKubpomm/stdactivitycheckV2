"use client";
import React from "react";
import Mapcard from "@/components/maptool/Mapcard";
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
const Maplist = ({ allMap, totalPage }) => {
  return (
    <>
      <Card className="card-wrapper">
        <Title>จัดการข้อมูล แผนที่</Title>

        <Link href="/dashboard/crudmap/AddMap">
          <Badge color="blue" icon={PersonAddAltRoundedIcon}>
            เพิ่มข้อมูลแผนที่
          </Badge>
        </Link>
        <div>
          <Searchform />
        </div>
        <Table className="mt-5">
          <TableHeader>
            <TableRow>
              <TableHead>ไอดี</TableHead>
              <TableHead>ที่อยู่</TableHead>

              <TableHead>ตั้งค่า</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allMap.map((Map) => {
              return <Mapcard key={Map._id} Map={Map} />;
            })}
          </TableBody>
        </Table>

        <Pagination totalPage={totalPage} />
      </Card>
    </>
  );
};

export default Maplist;
