import React from "react";
import { getallUser } from "@/actions/userActions";
import Userlist from "@/components/profile/Userlist";

const cruduserpage = async ({ params, searchParams = {} }) => {
  const { allUser, count, totalPage } = await getallUser(searchParams);
  return (
    <>
      <Userlist allUser={allUser} totalCount={count} totalPage={totalPage} />
    </>
  );
};

export default cruduserpage;
