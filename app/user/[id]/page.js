"use server";
import { getoneUser } from "@/actions/userActions";

import UsercardOne from "@/components/profile/UsercardOne";
import React from "react";

const GetoneuserDetails = async ({ params: { id }, searchParams }) => {
  const User = await getoneUser(id);

  return <div>{User && <UsercardOne User={User} />}</div>;
};

export default GetoneuserDetails;
