import React from "react";
import { getallMap } from "@/actions/mapActions";
import { columns } from "./column";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { DataTable } from "@/components/globals/data-table";

const Crudmappage = async () => {
  const { allMap } = await getallMap();
  return (
    <div>
      <h3 className="scroll-m-20 text-2xl  tracking-tight">
        จัดการข้อมูลแผนที่
      </h3>
      <div>
        <Button className=" bg-gradient-to-r from-primary-500 to-yellow-500 text-white ">
          <Link href="/dashboard/crudmap/AddMap">เพิ่มข้อมูลแผนที่</Link>
        </Button>
      </div>
      <div>
        <DataTable columns={columns} data={allMap} />
      </div>
    </div>
  );
};

export default Crudmappage;
