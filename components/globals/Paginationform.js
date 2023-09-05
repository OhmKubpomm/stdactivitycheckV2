"use client";
import React from "react";
import useCustomRouter from "@/hooks/useCustomRouter";
import { Pagination } from "antd";

const Paginationform = ({ totalPage }) => {
  const { pushQuery, query } = useCustomRouter();
  const handleChange = (page) => {
    pushQuery({ page });
  };
  return (
    <div className="container justify-between">
      <Pagination
        current={query.page || 1}
        total={totalPage * 10} // 10 is the default page size
        onChange={handleChange}
        className=""
      />
    </div>
  );
};

export default Paginationform;
