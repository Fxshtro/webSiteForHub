import "./globals.css";
import Image from 'next/image'
import {Jost, Unbounded} from 'next/font/google'

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
  return (
    <html lang="en">
      <body>
        <div className="absolute bg-gradient-to-b from-[#5F2FC3] to-black w-full h-[1350px] -z-10"></div>
        <header className="text-white p-5 bg-gradient-to-b z-1000
        from-[#00000076] to-[#000000a0] border-b-1 border-[#4a4a4a50] 
        h-[85px] w-full text-[22px] fixed backdrop-blur-sm
        ">
        <div className="container flex justify-between ">
          <div className="flex">
            <Image src="/logo.svg" width={95} height={45} alt=""/>
            <Image src="/iubip-logo.svg" width={67} height={45} alt="" className="ml-3"/>
          </div>
          <div className="flex flex-col justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-31">
              <a className="line" href="">Лаборатории</a>
              <a className="line" href="">Достижения</a>
              <a className="line" href="">Руководство</a>
            </div>
          </div>
          <div className="flex flex-col justify-center">
            <button className="bg-gradient-to-l from-[#7743d0] to-[#512e8f]
             px-[35px] py-[5px] rounded-3xl shadow-[#00000050] shadow-lg text-shadow-[#00000026] text-shadow-lg">Вход</button>
          </div>
        </div>
        </header>
        {children}
      </body>
    </html>
  );
}
