import React from 'react'
import Usercard from '@/components/profile/Usercard'
import Link from 'next/link'
import { Title } from "@tremor/react";
import { Card, Table, TableHead, TableRow, TableHeaderCell, TableBody, TableCell, Text, Badge } from "@tremor/react";
import Searchform from '@/components/globals/Searchform';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import Pagination from '@/components/globals/Paginationform';
const Userlist = ({allUser,totalPage}) => {
    return (
        <>
       
        <Card  >
            
        <Title>จัดการข้อมูล User</Title>
     
        <Link href="/dashboard/cruduser/AddUser"><Badge color="blue" icon={PersonAddAltRoundedIcon}>เพิ่มข้อมูล</Badge></Link>
        <div><Searchform/></div>
                <Table className='container justify-self-auto mt-5'>
                    
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
                            <TableHeaderCell>สิทธิ์การใช้งาน</TableHeaderCell>
                            <TableHeaderCell>ตั้งค่า</TableHeaderCell>
                          
                        </TableRow>
                    </TableHead>

                    
            {allUser.map((User) => {
                return <Usercard key={User._id} User={User} />
            })}
            </Table>
            <Pagination totalPage={totalPage} />
                    </Card>
              
       </>
    )
}

export default Userlist 