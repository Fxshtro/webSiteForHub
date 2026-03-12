"use client"
import {Jost, Unbounded} from 'next/font/google'
import Header from "../components/header";
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

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
    const isActive = useMenuStore((state) => state.isActive);

    return (
    <html lang="en" className="h-full">
        <body className={`${isActive ? "overflow-hidden" : ""} h-full`}>
            <Header showAuthButton={false}/>
            {children}
        </body>
    </html>
    );
}