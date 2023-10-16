import React from "react";
import { getallUser } from "@/actions/userActions";
import Userlist from "@/components/profile/Userlist";

const cruduserpage = async ({ params, searchParams }) => {
  const { allUser, totalPage } = await getallUser(searchParams);
  return (
    <>
      <div>{<Userlist allUser={allUser} totalPage={totalPage} />}</div>
    </>
  );
};

export default cruduserpage;
