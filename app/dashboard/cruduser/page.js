import AddUserForm from "@/components/form/AddUserForm";
import React from "react";
import { getallUser } from "@/actions/userActions";
import Userlist from "@/components/profile/Userlist";



const cruduserpage = async ({params, searchParams}) => {

  const { allUser } = await getallUser(searchParams);
  return (
    <>
      <div>{<Userlist allUser={allUser} />}</div>
    </>
  );
};

export default cruduserpage;
