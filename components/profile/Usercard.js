"use client";
import React, { useTransition } from "react";
import Link from "next/link";
import { deletePhoto } from "@/actions/UploadimageActions";

import { useMyContext } from "@/context/provider";

import { Popconfirm, message } from "antd";
import { deleteUser } from "@/actions/userActions";
import {

  TableRow,

  TableCell,
  Text,

  Badge,
} from "@tremor/react";
import { TrashIcon } from "@heroicons/react/solid";
import ModeEditRoundedIcon from "@mui/icons-material/ModeEditRounded";

import Image from "next/image";

const Usercard = ({ User }) => {
  const { setEditUser } = useMyContext();


  let [isPending, startTransition] = useTransition();

  async function handleDelete(userId, isConfirmed) {
    if (isConfirmed) {
      await deleteUser(userId);
      message.success("Delete successful");
    } else {
      message.success("Cancel successful");
    }
  }

  const confirm = async () => {
    startTransition(() => handleDelete(User._id, true));
    deletePhoto(User?._id, User?.image, true);
  };

  const cancel = () => {
    startTransition(() => handleDelete(User._id, false));
    deletePhoto(User?._id, User?.image, false);
  };

  return (
    <TableRow className="container">
  
     
        <TableCell >
          <Text>{User?.name}</Text>
        </TableCell>
        <TableCell >
          {User?.image ? (
            <Image
            loading="lazy"
              src={User?.image}
              alt={User?.image}
              sizes="100vw"
              width={100}
              height={100}
              quality={60}
              className="transition-opacity opacity-0 duration-[2s]"
              onLoadingComplete={(image) => {
                image.classList.remove("opacity-0");
              }}
            />
          ) : (
            // You can put some placeholder here when image is not available
            <div>No Image</div>
          )}
        </TableCell>
        <TableCell >
          <Text>{User?.email}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.password}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.Firstname}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.Lastname}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.Date}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.Address}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.Telephone}</Text>
        </TableCell>
        <TableCell >
          <Text>{User?.role}</Text>
        </TableCell>
        <TableCell >
          <Link
            href="/dashboard/cruduser/EditUser"
            onClick={() => setEditUser(User)}
          >
            <Badge color="yellow" icon={ModeEditRoundedIcon}>
              แก้ไข
            </Badge>
          </Link>
        </TableCell>
        <TableCell >
          <Badge color="red" icon={TrashIcon}>
            <Popconfirm
              title="ลบข้อมูล"
              description="ยืนยันการลบข้อมูล"
              onConfirm={confirm}
              onCancel={cancel}
              onOpenChange={() => console.log("open change")}
            >
              <button
                type="primary"
                onClick={() => {
                  startTransition(() => handleDelete(User._id));
                  deletePhoto(User?._id, User?.image);
                }}
              >
                delete
              </button>
            </Popconfirm>
          </Badge>
        </TableCell>

    </TableRow>
   
  
  );
};

export default Usercard;
