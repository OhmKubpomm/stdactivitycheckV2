"use client";
import React, { useTransition } from "react";
import Link from "next/link";

import { useMyContext } from "@/context/provider";

import {  Popconfirm, message } from "antd";
import { deleteUser } from "@/actions/userActions";
import {
  Card,
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Title,
  Badge,
} from "@tremor/react";
import { TrashIcon } from "@heroicons/react/solid";
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';

import Image from "next/image";


const Usercard = ({ User }) => {
  const { setEditUser } = useMyContext();
  const [messageApi, contextHolder] = message.useMessage();

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
  };

  const cancel = () => {
    startTransition(() => handleDelete(User._id, false));
  };

  return (
    <>
      <TableBody>
        <TableRow className="table-row">
          <TableCell className="table-cell">
            <Text>{User?.name}</Text>
          </TableCell>
          <TableCell className="table-cell">
          {User?.image ? (
  <Image 
    src={User?.image}
    alt="User profile picture"
    sizes="100vw"
    width={100}
    height={100}
    
    quality={60}
    className="transition-opacity opacity-0 duration-[2s]"
    onLoadingComplete={(image) => { image.classList.remove('opacity-0'); }}
  />
) : (
  // You can put some placeholder here when image is not available
  <div>No Image</div>
)}

          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.email}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.password}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.Firstname}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.Lastname}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.Date}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.Address}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.Telephone}</Text>
          </TableCell>
          <TableCell className="table-cell">
            <Text>{User?.role}</Text>
          </TableCell>
          <TableCell className="table-cell" >
     
              <Link
                href="/dashboard/cruduser/EditUser"
             
                onClick={() => setEditUser(User)}
              >
 <Badge color="yellow" icon={ModeEditRoundedIcon} >

 
                แก้ไข
               
                </Badge>
              </Link>
           
          </TableCell>
          <TableCell className="table-cell">
           
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
                  onClick={() => startTransition(() => handleDelete(User._id))}
                >
                  delete
                </button>
               
              </Popconfirm>
            
                </Badge>
            
          </TableCell>
        </TableRow>
      </TableBody>
    </>
  );
};

export default Usercard;
