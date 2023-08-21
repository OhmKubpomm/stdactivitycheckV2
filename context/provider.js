'use client'
import { ThemeProvider } from 'next-themes'
import React,{useContext,useState} from 'react'
import {SessionProvider} from 'next-auth/react'



const Context = React.createContext();
export const useMyContext = () => useContext(Context);

export const Provider = ({children}) => {

    const [editPost,seteditPost] = useState();
    const value ={editPost,seteditPost}

    return (
        <Context.Provider value={value}>

        <ThemeProvider attribute='class'>
    <SessionProvider>
        {children}
        </SessionProvider>
        </ThemeProvider>

        </Context.Provider>
)
}
