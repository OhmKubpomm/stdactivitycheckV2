import Provider from "@/context/provider"
import './globals.css'
import Headers from '@/components/globals/Headers'
import { Suspense } from 'react'
import { Kanit } from 'next/font/google'


export const metadata = {
  title: 'STDACTIVITYCHECK',
  description: 'Generated by ohm',
}

// If loading a variable font, you don't need to specify the font weight
const kanit = Kanit({

  weight: '400',
  subsets: ['thai'],
  display: 'swap',
})
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={kanit.className} suppressHydrationWarning>
      

       
          <Provider>
    
            
          
          
          <body>
          <Headers/>
        {children}
        </body>
          </Provider>
      
    </html>
  )
}