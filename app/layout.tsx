import type { Metadata } from "next";
import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ITHub",
  description: "Iubip website",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link 
          href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Jost:ital,wght@0,100..900;1,100..900&display=swap" 
          rel="stylesheet"
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="wrapper">
          <div className="content">
            <header className="header w-full top-0 left-0 z-1000 fixed mb-10">
              <div className="container h-14 md:h-21">
                <div className="flex justify-between items-center h-full">
                  <Image src="/image/icon.svg" alt="ITHub Logo" width={65} height={15} className="md:w-24"/>
                  <div className="flex gap-x-[clamp(10px,8vw,200px)] font-light text-sm md:text-xl !ml-4 !mr-4">
                    <a href="">Лаборатории</a>
                    <a href="">Достижения</a>
                    <a href="">Руководство</a>
                  </div>
                  <a href=""
                      className="backdrop-blur-md bg-[#6c97f51a] !px-2 !py-0.5 text-white rounded-full 
                      shadow-[0_0_20px_#6c97f539] flex items-center gap-3 text-sm md:text-xl">
                    User123
                    <Image src="/image/profile.svg" alt="" width={19} height={20}/>
                  </a>
                </div>
              </div>
            </header>

            {children}

          </div>
        </div>
      </body>
    </html>
  );
}