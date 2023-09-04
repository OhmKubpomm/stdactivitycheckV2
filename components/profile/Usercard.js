'use client'
import React,{useTransition} from 'react'
import Link from 'next/link'
import AddUserForm from '../form/AddUserForm';
import EditUserForm from '../form/EditUserForm';
import { useMyContext } from '@/context/provider';

import { Button, Popconfirm, message } from 'antd';
import { deleteUser } from '@/actions/userActions';
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




const Usercard = ({ User }) => {

 
    const {setEditUser} = useMyContext();
    const [messageApi, contextHolder] = message.useMessage();

    let [isPending, startTransition] = useTransition()


    async function handleDelete(userId, isConfirmed) {
        if (isConfirmed) {
            await deleteUser(userId);
            message.success('Delete successful');
        } else {
            message.success('Cancel successful');
        }
    }

    const confirm = async () => {
        startTransition(() => handleDelete(User._id, true));
    };

    const cancel = () => {
       
        startTransition(() => handleDelete(User._id, false));
    };



    return(
        <>     
          

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
                            <TableCell><Link href="/dashboard/cruduser/EditUser" onClick={() => setEditUser(User)}>แก้ไข</Link></TableCell>
                            <TableCell>


                                <Popconfirm
                                    title="ลบข้อมูล"
                                    description="ยืนยันการลบข้อมูล"
                                    onConfirm={confirm}
                                    onCancel={cancel}
                                    onOpenChange={() => console.log('open change')}
                                >
                                    <button type="primary" onClick={() => startTransition(() => handleDelete(User._id))}>delete</button>
                                </Popconfirm>
                            </TableCell>
                        </TableRow>
                    </TableBody>
              
              
 
       
            </>
    )
};

export default Usercard;
