import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return <div className="mx-auto flex w-full grow flex-col">{children}</div>;
}

export default layout;
