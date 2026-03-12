"use client"
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useMenuStore } from "../store/menuStore";

interface HeaderProps {
  showAuthButton?: boolean;
}

export default function Header({ showAuthButton = true }: HeaderProps) {
  const { isActive, toggleMenu } = useMenuStore();

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isActive]);

  return (
    <>
      {/* Размытие */}
      <div onClick={toggleMenu} className={`${isActive ? "body-block" : ''} duration-100`}></div>

      {/* Бургер меню */}
      <div 
        className={`fixed transform left-0 top-0 ${
          isActive ? 'translate-y-0' : '-translate-y-80'
        } duration-200 text-[22px] w-full sm:h-[170px] h-[310px] bg-gradient-to-b z-1000
        from-[#00000076] to-[#000000a0] border-b-1 border-[#8585857a] backdrop-blur-sm z-100`}
      >
        <div className="absolute top-27.5 w-full flex sm:flex-row flex-col justify-center items-center gap-x-31 gap-y-2">
          <a className="hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Лаборатории</a>
          <a className="hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Достижения</a>
          <a className="hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Руководство</a>
          <Link onClick={toggleMenu} href="/auth" className="mt-2 bg-gradient-to-l from-[#7743d0] to-[#512e8f] hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56]
           px-[35px] py-[5px] rounded-3xl shadow-[#00000050] shadow-lg text-shadow-[#00000026] text-shadow-lg sm:hidden block">
            Вход
          </Link>
        </div>
      </div>

      {/* Хедер */}
      <header className="text-white p-5 bg-gradient-to-b z-1000
        from-[#00000076] to-[#000000a0] border-b-1 border-[#4a4a4a50] 
        h-[85px] w-full text-[22px] fixed backdrop-blur-sm
      ">
        <div className="containerWider flex justify-between">
          <div className="flex">
            <Link href="/main">
              <Image src="/logo.svg" width={95} height={45} alt="" className="cursor-pointer"/>
            </Link>
            <Link href="https://www.iubip.ru/">
              <Image src="/iubip-logo.svg" width={67} height={45} alt="" className="ml-3 cursor-pointer"/>
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <div className="absolute left-1/2 transform -translate-x-1/2 flex gap-31 xl:flex hidden">
              <a className="line hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Лаборатории</a>
              <a className="line hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Достижения</a>
              <a className="line hover:[text-shadow:0px_0px_10px_#ffffff]" href="">Руководство</a>
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <div 
              onClick={toggleMenu}
              className="w-[45px] h-[45px] mr-5 xl:hidden cursor-pointer rounded-full flex items-center justify-center" 
            >
              <div className="w-6 h-5 flex flex-col justify-between">
                <span className={`${
                  isActive ? "rotate-45 top-[8px] !w-[110%]" : "rotate-0 w-full"
                } duration-400 relative h-1 bg-white rounded-full`}></span>
                <span className={`${
                  isActive ? 'scale-0' : 'block'
                } duration-400 w-full h-1 bg-white rounded-full`}></span>
                <span className={`${
                  isActive ? "-rotate-45 top-[-8px] !w-[110%]" : "rotate-0 w-full"
                } duration-400 relative h-1 bg-white rounded-full`}></span>
              </div>
            </div>
          {showAuthButton && (        
            <Link 
              href="/auth" 
              className="bg-gradient-to-l from-[#7743d0] to-[#512e8f] hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56]
              px-[35px] py-[5px] rounded-3xl shadow-[#00000050] shadow-lg text-shadow-[#00000026] text-shadow-lg sm:flex hidden"
            >
              Вход
            </Link>
            )}
          </div>
        </div>
      </header>
    </>
  );
}