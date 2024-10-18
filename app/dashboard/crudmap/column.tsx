"use client";

import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, Trash2 } from "lucide-react";
import { useMyContext } from "@/context/provider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
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
import { deleteMap } from "@/actions/mapActions";
import { useToast } from "@/components/ui/use-toast";

export type Map = {
  _id: string;
  MapName: string;
};

const ActionCell = ({ Map }: { Map: any }) => {
  const { setEditMap } = useMyContext();
  const { toast } = useToast();
  async function handleDelete(mapId: any) {
    try {
      const res = await deleteMap(mapId);
      if (res.error) {
        toast({
          title: "Error",
          description: res.error,
        });
      } else {
        toast({
          style: {
            background: "green",
            color: "white",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
          },
          title: "ลบตำแหน่งแผนที่สำเร็จ",
          description: "ตำแหน่งแผนที่ถูกลบออกจากระบบของคุณแล้ว",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "มีบางอย่างผิดปกติ กรุณาลองใหม่อีกครั้ง",
      });
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>ตัวเลือก</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(Map._id)}
        >
          คัดลอก
        </DropdownMenuItem>

        <DropdownMenuItem onClick={() => setEditMap(Map)}>
          <Link href="/dashboard/crudmap/EditMap">แก้ไข</Link>
        </DropdownMenuItem>
        {/* ปุ่มลบ */}
        <DropdownMenuSeparator />

        <AlertDialog>
          <AlertDialogTrigger className="items-center">
            <DropdownMenuLabel>
              <Trash2 color="red" />
            </DropdownMenuLabel>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                คุณแน่ใจหรือไม่ว่าต้องการลบตำแหน่งแผนที่
              </AlertDialogTitle>
              <AlertDialogDescription>
                การดำเนินการนี้จะลบตำแหน่งแผนที่ลงในบัญชีของคุณจากเซิร์ฟเวอร์ของเรา
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
              <AlertDialogAction>
                <Button
                  className=" w-full bg-gradient-to-r from-primary-500 to-yellow-500 text-white "
                  type="button" // Ensure it's a button to avoid form submission
                  onClick={() => handleDelete(Map._id)}
                >
                  ตกลง
                </Button>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Map>[] = [
  // ปุ่มเลือกทั้งหมด

  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },

  // ฟิลด์แผนที่
  {
    accessorKey: "_id",

    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          รหัสแผนที่
          <ArrowUpDown className="ml-2 size-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "MapName",
    header: "ชื่อตำแหน่ง",
  },

  {
    id: "actions",
    cell: ({ row }) => <ActionCell Map={row.original} />,
  },
];
