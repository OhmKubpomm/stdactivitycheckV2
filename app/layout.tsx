import Provider from "@/context/provider"
import './globals.css'
import Headers from '@/components/globals/Headers'
export const metadata = {
  title: 'Next.js',
  description: 'Generated by Next.js',
}



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
     <body>
          <Provider>
            <Headers />
          {children}
          </Provider>
      </body>
    </html>
  )
}
