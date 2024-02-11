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
      <h1>จัดการข้อมูลแผนที่</h1>
      <div>
        <Button>
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
