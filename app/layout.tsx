import Provider from "@/context/provider"
import './globals.css'
import Headers from '@/components/Headers'
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
    <html lang="th">
     <body>
          <Provider>
            <Headers />
          {children}
          </Provider>
      </body>
    </html>
  )
}
