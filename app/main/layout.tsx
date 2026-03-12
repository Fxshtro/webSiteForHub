// app/layout.tsx
"use client"
import {Jost, Unbounded} from 'next/font/google'
import Header from "../components/header";
import Footer from "../components/footer";
import { useMenuStore } from "../store/menuStore";
import "../globals.css"

const jost = Jost({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

const unbounded = Unbounded({
  subsets: ['latin'],
  variable: '--font-jost',
  display: 'swap',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isActive = useMenuStore((state) => state.isActive);

  return (
    <html lang="en">
      <body>
        <Header/>
        {children}
        <Footer/>
      </body>
    </html>
  );
}