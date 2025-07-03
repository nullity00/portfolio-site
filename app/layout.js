import './globals.css'

export const metadata = {
  title: 'yAcademy Proxies Research',
  description: 'Comprehensive guide to smart contract proxy patterns and security',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}