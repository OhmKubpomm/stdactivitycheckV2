/* eslint-disable no-unused-vars */
"use client";
import React, { useTransition } from "react";
import Link from "next/link";

import { useMyContext } from "@/context/provider";

import { Popconfirm, message } from "antd";
import { deleteUser } from "@/actions/userActions";
import { Text, Badge } from "@tremor/react";
import { TableRow, TableCell } from "@/components/ui/table";
import { TrashIcon } from "@heroicons/react/solid";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";

const Mapcard = ({ Map }) => {
  const { setEditMap } = useMyContext();

  const [isPending, startTransition] = useTransition();

  async function handleDelete(mapId, isConfirmed) {
    if (isConfirmed) {
      await deleteUser(mapId);
      message.success("Delete successful");
    } else {
      message.success("Cancel successful");
    }
  }

  const confirm = async () => {
    startTransition(() => handleDelete(Map._id, true));
  };

  const cancel = () => {
    startTransition(() => handleDelete(Map._id, false));
  };

  return (
    <TableRow>
      <TableCell>{Map?._id}</TableCell>
      <TableCell>{Map?.MapAddress}</TableCell>

      <TableCell>
        <Link href="/dashboard/crudmap/EditMap" onClick={() => setEditMap(Map)}>
          <Badge color="yellow" icon={ModeEditRoundedIcon}>
            แก้ไข
          </Badge>
        </Link>
      </TableCell>
      <TableCell>
        <Badge color="red" icon={TrashIcon}>
          <Popconfirm
            title="ลบข้อมูล"
            description="ยืนยันการลบข้อมูล"
            onConfirm={confirm}
            onCancel={cancel}
            onOpenChange={() => console.log("open change")}
          ></Popconfirm>
        </Badge>
      </TableCell>
    </TableRow>
  );
};

export default Mapcard;
