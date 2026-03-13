"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useMenuStore } from "../store/menuStore";

interface HeaderProps {
  showAuthButton?: boolean;
}

export default function Header({ showAuthButton = true }: HeaderProps) {
  const { isActive, toggleMenu } = useMenuStore();

  useEffect(() => {
    if (isActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isActive]);

  return (
    <>
      {/* Размытие */}
      <div
        onClick={toggleMenu}
        className={`${isActive ? "body-block" : ""} duration-100`}
      ></div>

      {/* Бургер меню */}
      <div
        className={`fixed top-0 left-0 z-100 h-[310px] w-full text-[22px]
        bg-gradient-to-b from-[#00000076] to-[#000000a0] border-b-1 border-[#8585857a] backdrop-blur-sm
        transform transition-duration-200
        ${isActive ? "translate-y-0" : "-translate-y-80"}
        sm:h-[170px]`}
      >
        <div className="absolute top-27.5 flex w-full flex-col items-center justify-center gap-y-2 sm:flex-row sm:gap-x-31">
          <Link
            onClick={toggleMenu}
            href="/main#laboratories"
            className="hover:[text-shadow:0px_0px_10px_#ffffff]"
          >
            Лаборатории
          </Link>
          <Link
            onClick={toggleMenu}
            href="/main#achievements"
            className="hover:[text-shadow:0px_0px_10px_#ffffff]"
          >
            Достижения
          </Link>
          <Link
            onClick={toggleMenu}
            href="/main#leadership"
            className="hover:[text-shadow:0px_0px_10px_#ffffff]"
          >
            Руководство
          </Link>
          <Link
            onClick={toggleMenu}
            href="/auth"
            className="mt-2 block px-[35px] py-[5px] text-shadow-lg
            bg-gradient-to-l from-[#7743d0] to-[#512e8f] rounded-3xl
            shadow-[#00000050] shadow-lg text-shadow-[#00000026]
            hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56]
            sm:hidden"
          >
            Вход
          </Link>
        </div>
      </div>

      {/* Хедер */}
      <header className="fixed z-1000 h-[85px] w-full text-[22px] text-white p-5
      bg-gradient-to-b from-[#00000076] to-[#000000a0] border-b-1 border-[#4a4a4a50] backdrop-blur-sm">
        <div className="containerWider flex justify-between">
          <div className="flex">
            <Link href="/main">
              <Image
                src="/logo.svg"
                width={95}
                height={45}
                alt=""
                className="cursor-pointer"
                onClick={() => {
                  window.scrollTo({ top: 0 });
                }}
              />
            </Link>
            <Link href="https://www.iubip.ru/">
              <Image
                src="/iubip-logo.svg"
                width={67}
                height={45}
                alt=""
                className="ml-3 cursor-pointer"
              />
            </Link>
          </div>

          <div className="flex flex-col justify-center">
            <div className="absolute left-1/2 flex -translate-x-1/2 gap-31 xl:flex hidden">
              <Link
                className="line hover:[text-shadow:0px_0px_10px_#ffffff]"
                href="/main#laboratories"
              >
                Лаборатории
              </Link>
              <Link
                className="line hover:[text-shadow:0px_0px_10px_#ffffff]"
                href="/main#achievements"
              >
                Достижения
              </Link>
              <Link
                className="line hover:[text-shadow:0px_0px_10px_#ffffff]"
                href="/main#leadership"
              >
                Руководство
              </Link>
            </div>
          </div>

          <div className="flex flex-row justify-center">
            <div
              onClick={toggleMenu}
              className="mr-5 flex h-[45px] w-[45px] cursor-pointer items-center justify-center rounded-full xl:hidden"
            >
              <div className="flex h-5 w-6 flex-col justify-between">
                <span
                  className={`${
                    isActive
                      ? "rotate-45 top-[8px] !w-[110%]"
                      : "rotate-0 w-full"
                  } duration-400 relative h-1 bg-white rounded-full`}
                ></span>
                <span
                  className={`${
                    isActive ? "scale-0" : "block"
                  } duration-400 w-full h-1 bg-white rounded-full`}
                ></span>
                <span
                  className={`${
                    isActive
                      ? "-rotate-45 top-[-8px] !w-[110%]"
                      : "rotate-0 w-full"
                  } duration-400 relative h-1 bg-white rounded-full`}
                ></span>
              </div>
            </div>
            {showAuthButton && (
              <Link
                href="/auth"
                className="hidden px-[35px] py-[5px] text-shadow-lg
                bg-gradient-to-l from-[#7743d0] to-[#512e8f] rounded-3xl
                shadow-[#00000050] shadow-lg text-shadow-[#00000026]
                hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56]
                sm:flex"
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
