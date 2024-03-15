"use client";

import React, { useContext, useState } from "react";
import { SessionProvider } from "next-auth/react";
import DesignerContextProvider from "./DesignerContext";

const Context = React.createContext();

export const useMyContext = () => useContext(Context);

export const Provider = ({ children }) => {
  const [editUser, setEditUser] = useState();
  const [editMap, setEditMap] = useState();

  const value = { editUser, setEditUser, editMap, setEditMap };

  return (
    <Context.Provider value={value}>
      <DesignerContextProvider>
        <SessionProvider>{children}</SessionProvider>
      </DesignerContextProvider>
    </Context.Provider>
  );
};
