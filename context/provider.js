'use client'
import { ThemeProvider } from 'next-themes'
import React,{useContext,useState} from 'react'
import {SessionProvider} from 'next-auth/react'



const Context = React.createContext();

export const useMyContext = () => useContext(Context);

export const Provider = ({children}) => {

    const [editUser,setEditUser] = useState();
    
    const value ={editUser,setEditUser}

    return (
        <ThemeProvider attribute='class'>
        <Context.Provider value={value}>

       
    <SessionProvider>
        {children}
        </SessionProvider>
        

        </Context.Provider>
        </ThemeProvider>
)
}
