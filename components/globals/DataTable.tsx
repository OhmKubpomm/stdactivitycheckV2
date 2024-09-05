"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useMyContext } from "@/context/provider";
import { deleteUser } from "@/actions/userActions";
import { deletePhoto } from "@/actions/UploadimageActions";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Pencil, Trash2, Search, ChevronUp, ChevronDown } from "lucide-react";
import { toast } from "@/components/ui/use-toast";

interface Column {
  key: string;
  label: string;
}

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
}

interface DataTableProps {
  columns: Column[];
  data: User[];
  itemsPerPage?: number;
  totalCount: number; // Add totalCount to the prop types
  totalPage: number;
}

export function DataTable({ columns, data, itemsPerPage = 5 }: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const { setEditUser } = useMyContext();

  const filteredData = useMemo(() => {
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      if (!sortColumn) return 0;
      const aValue = a[sortColumn as keyof User];
      const bValue = b[sortColumn as keyof User];
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }
      return 0;
    });
  }, [filteredData, sortColumn, sortDirection]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortColumn, sortDirection]);

  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const handleDelete = async (userId: string, imageId: string | undefined) => {
    try {
      await deleteUser(userId);
      if (imageId) {
        await deletePhoto(userId, imageId);
      }
      toast({
        title: "ลบข้อมูลสำเร็จ",
        description: "ข้อมูลผู้ใช้ถูกลบออกจากระบบแล้ว",
      });
    } catch (error) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบข้อมูลผู้ใช้ได้",
        variant: "destructive",
      });
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-500";
      case "user":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          placeholder="ค้นหา..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Button
          variant="outline"
          className="bg-orange-500 text-white hover:bg-orange-600"
        >
          <Search className="size-4" />
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className="cursor-pointer"
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center">
                    {column.label}
                    {sortColumn === column.key &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="ml-2 size-4" />
                      ) : (
                        <ChevronDown className="ml-2 size-4" />
                      ))}
                  </div>
                </TableHead>
              ))}
              <TableHead>การดำเนินการ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item._id}>
                {columns.map((column) => (
                  <TableCell key={column.key}>
                    {column.key === "image" ? (
                      item[column.key] ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Image
                                src={item[column.key] as string}
                                alt={item.name || "User image"}
                                width={50}
                                height={50}
                                className="rounded-full object-cover"
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <Image
                                src={item[column.key] as string}
                                alt={item.name || "User image"}
                                width={200}
                                height={200}
                                className="rounded-lg object-cover"
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="flex size-12 items-center justify-center rounded-full bg-gray-200">
                          <span className="text-xl text-gray-500">
                            {item.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )
                    ) : column.key === "password" ? (
                      "••••••••"
                    ) : column.key === "role" ? (
                      <Badge
                        className={`${getRoleBadgeColor(item.role)} text-white`}
                      >
                        {item.role}
                      </Badge>
                    ) : (
                      item[column.key as keyof User]
                    )}
                  </TableCell>
                ))}
                <TableCell>
                  <div className="flex space-x-2">
                    <Link href="/dashboard/cruduser/EditUser">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setEditUser(item)}
                        className="bg-blue-500 text-white hover:bg-blue-600"
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-red-500 text-white hover:bg-red-600"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>ยืนยันการลบข้อมูล</AlertDialogTitle>
                          <AlertDialogDescription>
                            คุณแน่ใจหรือไม่ที่ต้องการลบข้อมูลผู้ใช้นี้?
                            การกระทำนี้ไม่สามารถย้อนกลับได้
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item._id, item.image)}
                            className="bg-red-500 text-white hover:bg-red-600"
                          >
                            ลบข้อมูล
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div>
          แสดง {paginatedData.length} จาก {sortedData.length} รายการ
        </div>
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className={
                  currentPage === 1 ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => setCurrentPage(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
