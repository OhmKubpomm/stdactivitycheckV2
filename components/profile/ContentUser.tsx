"use client";

import React from "react";
import Link from "next/link";
type Props = {
  User: {
    _id: Object;
  };
};

const ContentUser = ({ User }: Props) => {
  return (
    <div>
      <Link href={`/user/${User._id}`}>ข้อมูลเดี่ยว</Link>
    </div>
  );
};

export default ContentUser;
