import './globals.css'
import 'katex/dist/katex.min.css'
import { Metadata } from 'next'
import { Space_Mono } from 'next/font/google'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Nullity - Developer Portfolio',
  description: 'Personal portfolio showcasing development projects and technical expertise',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={`${spaceMono.variable} font-sans`}>{children}</body>
    </html>
  )
}