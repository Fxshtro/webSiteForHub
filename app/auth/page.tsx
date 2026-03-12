"use client"
import Image from "next/image";

import '../globals.css';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function EntrancePage() {
  return (
    <main className="h-full">
      <div className="overflow-x-hidden overflow-y-hidden h-full">
        <div className="absolute left-0 top-0 bg-gradient-to-b from-[#5F2FC3] from-10% to-black w-full h-full -z-10"></div>
        <div className="containerWider h-full flex relative">

          <div className="xl:w-[48%]">
          <Image 
            src="/figureV4Fliped.svg" 
            width={1000}
            height={1280}
            alt=""
            className="absolute lg:-top-100 md:-top-50 sm:-left-70 -left-40 -z-1"
          />
          </div>

          <div className="xl:w-[52%] w-[100%] flex flex-col justify-center items-center">
            <div className="sm:w-[600px] sm:px-0 px-5 pt-15 pb-8 sm:h-auto h-full mt-[40px] sm:block flex flex-col justify-between">
            <div>
            <div className="w-full flex flex-col items-center">
              <p className="text-center sm:w-[420px] mb-1 sm:text-[64px] text-[44px] uppercase font-black font-Unbounded">вход</p>
              <p className="border-t-2 border-white sm:w-[420px] pt-2 text-center sm:text-[24px] text-[20px] leading-8">Совершите вход, чтобы продолжить работу на сайте.</p>
            </div>

              <div>
                <p className="text-[26px] ml-5 mb-1">Логин</p>
                <input className="w-full border-2 py-[14px] px-[23] rounded-3xl sm:text-[32px] text-[22px] 
                bg-[#68686823] backdrop-blur-md placeholder:text-[#d9d9d92c]" placeholder="login"/>
              </div>

              <div className="mt-3">
                <p className="text-[26px] ml-5 mb-1">Пароль</p>
                <div className="relative">
                  <input type="password" className="w-full border-2 py-[14px] px-[23] 
                  rounded-3xl sm:text-[32px] text-[22px] pr-20 placeholder:text-[#d9d9d92c] bg-[#68686823] backdrop-blur-md"  
                  placeholder="password"/>
                  <Image tabIndex={0} src="/eye.svg" width={55} height={55} alt="" 
                  className="absolute top-1/2 transform -translate-y-1/2 sm:right-[14px] right-[12px] sm:!w-[55px] !w-[45px]
                  cursor-pointer bg-[#2e2e2ed3] backdrop-blur-md border-2
                  border-[#ffffff] sm:p-[10px] p-[6px] rounded-[15px]"
                  />
                </div>

              </div>
            </div>
            <div>
              <div className="flex mt-6 items-center sm:justify-normal justify-center">
                  <input 
                    type="checkbox" 
                    className="w-[35px] h-[35px] appearance-none bg-transparent border-2 border-white rounded-xl 
                      checked:bg-white
                      checked:bg-[url('/galk.svg')]
                      checked:bg-center checked:bg-no-repeat checked:bg-[length:20px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.currentTarget.click();
                      }}}
                    />
                  <p className="ml-3 sm:text-[26px] text-[22px] select-none">Запомнить меня</p>
              </div>
              <button className="sm:text-[46px] text-[25px] font-medium [text-shadow:0px_4px_5px_#00000025] w-full mt-10
              bg-gradient-to-r from-[#31235C] via-[#553e99] to-[#31235C] sm:py-1 py-3 sm:rounded-3xl sm:rounded-2xl rounded-3xl [box-shadow:0px_0px_137px_#ffffff3e,_inset_0px_0px_27px_#ffffff70]
              hover:[box-shadow:0px_0px_150px_#ffffff56,_inset_0px_0px_35px_#ffffff95] active:[box-shadow:0px_0px_150px_#0000006f,_inset_0px_0px_35px_#00000062]
              ">Войти</button>
            </div>
            </div>
          </div>

          <Image 
            src="/glists.svg" 
            width={2300}
            height={1}
            alt=""
            className="absolute left-1/2 transform -translate-x-1/2 lg:-bottom-60 md:-bottom-40 -bottom-10 -z-3 rotate-180 scale-120 max-sm:scale-150"
          /> 
                     
        </div>
      </div>
    </main>
  );
}