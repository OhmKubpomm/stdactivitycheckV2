'use client'
import React from 'react'
import Link from 'next/link'
interface User {
    Firstname: string;
}

interface UsercardProps {
    User: User;
}



const Usercard = ({ User }: UsercardProps) => {
    return <div style={{display:'flex'}}>
        {User?.Firstname}
        <div>
            <Link href="    ">edit</Link>
        </div>
        </div>
};

export default Usercard;
