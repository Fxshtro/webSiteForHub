"use client";

import { useState } from "react";

import Image from "next/image";
import "../globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function EntrancePage() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(true);

  return (
    <main className="h-full">
      <div className="overflow-x-hidden overflow-y-hidden h-full">
        <div className="absolute top-0 left-0 -z-10 h-full w-full bg-gradient-to-b from-[#5F2FC3] from-10% to-black"></div>
        <div className="containerWider relative flex min-h-screen">
          <div className="xl:w-[48%]">
            <Image
              src="/figureV4Fliped.svg"
              width={1000}
              height={1280}
              alt=""
              role="presentation"
              className="absolute -z-1 -top-50 -left-40 lg:-top-100 md:-top-50 sm:-left-70"
            />
          </div>

          <div className="flex w-full flex-col items-center justify-center xl:w-[52%]">
            <div className="mt-[40px] flex h-full sm:w-[600px] flex-col justify-between px-5 pt-15 pb-8 sm:h-auto sm:px-0 sm:block">
              <div>
                <div className="flex w-full flex-col items-center">
                  <p className="mb-1 text-center text-[44px] font-black uppercase font-Unbounded sm:w-[420px] sm:text-[64px]">
                    вход
                  </p>
                  <p className="pt-2 text-center text-[20px] leading-8 border-t-2 border-white sm:w-[420px] sm:text-[24px]">
                    Совершите вход, чтобы продолжить работу на сайте.
                  </p>
                </div>

                <div>
                  <p className="ml-5 mb-1 text-[26px]">Логин</p>
                  <input
                    id="login"
                    name="login"
                    type="text"
                    autoComplete="username"
                    required
                    aria-label="Логин"
                    aria-required="true"
                    className="w-full rounded-3xl border-2 bg-[#68686823] px-[23] py-[14px] text-[22px] backdrop-blur-md placeholder:text-[22px] sm:text-[32px]"
                    placeholder="login"
                  />
                </div>

                <div className="mt-3">
                  <p className="ml-5 mb-1 text-[26px]">Пароль</p>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={isPasswordVisible ? "password" : "text"}
                      autoComplete="current-password"
                      required
                      aria-label="Пароль"
                      aria-required="true"
                      aria-invalid={false}
                      className="w-full rounded-3xl border-2 bg-[#68686823] px-[23] py-[14px] pr-20 text-[22px] backdrop-blur-md placeholder:text-[22px] sm:text-[32px]"
                      placeholder="password"
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                      aria-label={isPasswordVisible ? "Показать пароль" : "Скрыть пароль"}
                      aria-pressed={!isPasswordVisible}
                      className="absolute top-1/2 right-[12px] min-h-[55px] -translate-y-1/2 cursor-pointer rounded-[15px] border-2 border-[#ffffff] bg-[#2e2e2ed3] p-[6px] backdrop-blur-md hover:bg-[#3e3e3ed3] focus:outline-none focus:ring-2 focus:ring-blue-500 sm:right-[14px] sm:!w-[55px] !w-[45px] sm:p-[10px]"
                    >
                      <Image
                        src={isPasswordVisible ? "/eye.svg" : "/eyeOpened.svg"}
                        width={55}
                        height={55}
                        alt=""
                        className="w-full h-full"
                      />
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <div className="mt-6 flex items-center justify-center sm:justify-normal">
                  <input
                    id="remember-me"
                    type="checkbox"
                    name="remember-me"
                    className="h-[35px] w-[35px] appearance-none rounded-xl border-2 border-white bg-transparent checked:bg-white checked:bg-[url('/galk.svg')] checked:bg-center checked:bg-no-repeat checked:bg-[length:20px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    aria-describedby="remember-me-description"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        e.currentTarget.click();
                      }
                    }}
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 select-none text-[22px] sm:text-[26px] cursor-pointer"
                  >
                    Запомнить меня
                  </label>
                  <span id="remember-me-description" className="sr-only">
                    Оставаться авторизованным на этом устройстве
                  </span>
                </div>
                <button
                  type="submit"
                  aria-label="Войти в систему"
                  className="mt-10 w-full rounded-3xl bg-gradient-to-r from-[#31235C] via-[#553e99] to-[#31235C] py-3 text-[25px] font-medium [text-shadow:0px_4px_5px_#00000025] [box-shadow:0px_0px_137px_#ffffff3e,_inset_0px_0px_27px_#ffffff70] 
                  hover:[box-shadow:0px_0px_150px_#ffffff56,_inset_0px_0px_35px_#ffffff95] active:[box-shadow:0px_0px_150px_#0000006f,_inset_0px_0px_35px_#00000062] sm:py-1 sm:text-[46px] sm:rounded-2xl sm:rounded-3xl"
                >
                  Войти
                </button>
              </div>
            </div>
          </div>

          <Image
            src="/glists.svg"
            width={2300}
            height={1}
            alt=""
            role="presentation"
            className="absolute -z-3 left-1/2 -bottom-10 -translate-x-1/2 rotate-180 scale-120 lg:-bottom-60 md:-bottom-40 max-sm:scale-150"
          />
        </div>
      </div>
    </main>
  );
}
