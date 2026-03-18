"use client"
import Image from "next/image";
import Link from "next/link";


export default function Footer() {
    return (
    <footer className="md:px-12 px-5 py-5 mt-[184px] mb-[67px] relative border-t-1 border-b-1 border-[#ffffff26] h-min-[135px] bg-[#ffffff10] [box-shadow:0px_0px_250px_#ffffff23]">
        <div className="containerWider flex flex-wrap-reverse items-start justify-between h-full">
            <p className="sm:mt-16 mt-4 xl:text-[24px] text-[18px] whitespace-nowrap">
              <a href="" className="font-hind hover:underline">Политика конфиденциальности</a>
              <span className="xl:hidden block">© 2026 Южный Университет (ИУБиП)</span>
            </p>
            <div className="absolute top-21 left-1/2 transform -translate-x-1/2 text-[24px] font-hind xl:block hidden">
              © 2026 Южный Университет (ИУБиП)
            </div>
            <div className="flex my-auto sm:w-auto w-full justify-center sm:pr-0 pr-10">
              <Link href="/main" className="flex my-auto" aria-hidden="true"
              onClick={() => {
                  window.scrollTo({ top: 0 });
                }}>
                <Image src="/logo.svg" width={144} height={45} alt="" className="cursor-pointer"/>
              </Link>
              <Link href="https://www.iubip.ru/" className="flex my-auto">
                <Image src="/iubip-logo.svg" width={100} height={45} alt="" aria-hidden="true" className="ml-3 cursor-pointer"/>
              </Link>
            </div>
        </div>
    </footer>
    );
}