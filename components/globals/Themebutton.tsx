'use client'
import { Button } from 'antd'
import {useTheme} from 'next-themes'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState,useEffect } from 'react';
const Themebutton = () => {
    const {resolvedTheme, setTheme} = useTheme()
    const [mounted, setMounted] = useState(false)
    useEffect(() => setMounted(true), [])
    if(!mounted) {
        return null
    }
  return (
    <Button
    className='flex items-center justify-center rounded-lg gap-2'
     onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
        {resolvedTheme === 'dark' ?(
            <LightModeIcon  className='h-5 w-5 text-orange-500'/>
        )  : (
            <DarkModeIcon className='h-5 w-5 text-slate-800'/>
        )}
    </Button>
  )
}

export default Themebutton