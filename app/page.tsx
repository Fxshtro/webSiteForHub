"use client"
import Image from "next/image";
import IconStates from "./components/icoState";
import PieIco from "./components/pie"
import Card from "./components/card"
import Lenta from "./components/slider"
import ManagerCard from "./components/manager"

import "./globals.css";
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function Home() {
  return (
      <main >
      <div className="overflow-x-hidden"> 
        <div className="container h-[575px] flex relative !mt-[85px] !mb-[90px]">
          <div className=" xl:w-[59.5%] w-full">
            <h1 className="w-full text-center
            leading-11 pt-[20px] mt-[108px] [text-shadow:0px_4px_14px_#00000025]
            bg-gradient-to-r from-[#ffffff] from-40% to-[#9a7bd4] to-90% bg-clip-text text-transparent
            ">
              СТУДЕНЧЕСКИЙ
              <br/>
              <span className="md:text-[40px] text-[20px] font-bold">ЦИФРОВОЙ ХАБ</span>
            </h1>
              <div className="w-1/2 h-[3px] mt-1.5 mx-auto bg-gradient-to-l from-[#00000000] via-[#ffffffa0] to-[#00000000]"></div>
              <p className="mt-10 text-[24px] text-center w-full font-light leading-7">Открытая площадка для студенческих лабораторий.<br/><span className="font-medium">Исследуй, создавай, достигай вместе с нами!</span></p>
            <div className="mt-7 w-full flex flex-row justify-center">
              <button className="text-[24px] font-medium [text-shadow:0px_4px_5px_#00000025]
              bg-gradient-to-r from-[#31235C] via-[#6347b8] to[#31235C] px-[66px] py-[25px] rounded-3xl [box-shadow:0px_0px_137px_#ffffff44,_inset_0px_0px_27px_#ffffff70]
              ">ПРИСОЕДИНИТЬСЯ К ХАБУ</button>
            </div>
          </div>
          <Image 
            src="/figureV4.png" 
            width={1000}
            height={1280}
            alt=""
            className="absolute -top-100 -right-70 -z-1"
          />
        </div>  
        <div className="container h-[1100px]">
          <div className="flex items-start">

            <div className="flex w-[50%]">
              <div className="glass max-w-[490px] px-[25px] pt-[13px] pb-[22px] ml-22.5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -top-4 -left-4 -z-3"></div>
                <p className="flex relative mb-3 z-1">
                  <span className="font-black text-[48px] font-Unbounded ml-10">О ХАБЕ</span>
                  <Image src="/logo.svg" width={95} height={45} alt="" className="ml-4"/>
                </p>
                <p className="relative text-[32px] leading-10 z-1"><span className="font-extrabold ">Хаб</span> — это экосистема студенческих лабораторий Южного Университета “ИУБиП”</p>
              </div>
            </div>
            
            <div className="w-[50%]">
              <div className="glass max-w-[520px] px-[25px] pt-[20px] pb-[20px] ml-12.5 mt-[165px]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-4 -right-4 -z-3"></div>
                <p className="relative text-[32px] font-light leading-9 z-1 text-justify">
                  Мы <span className="font-extrabold ">объединяем</span>  студентов, интересующихся разработкой,
                  дизайном и другими цифровыми направлениями, чтобы дать
                  им возможность <span className="font-extrabold ">работать</span> над реальными проектами,
                  <span className="font-extrabold ">получать опыт и создавать портфолио.</span>
                </p>
              </div>
            </div>

          </div>

            <Image 
              src="/glists.svg" 
              width={2000}
              height={1}
              alt=""
              className="absolute left-1/2 transform -translate-x-1/2 top-[725px] -z-3"
            />
          
          <div className="mt-25 flex justify-center"><IconStates/></div>
          <h1 className="text-center mt-[30px]">
            СТАТИСТИКА
          </h1>
            <div className="mb-20 lineClass"></div>
            <div className="h-[338px] flex flex-wrap justify-center items-start gap-10">
              <div className="!bg-[#E9E3E620] !rounded-2xl text-[26px] px-[75px] py-[11.5px] 
              glass custom-before
              ">
                <div className="z-1">100+ участников</div>
                
                <Image 
                  src="/icoHumans.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -left-12.5 -top-8.5 -z-3"
                />
              </div>
              <div className="!bg-[#E9E3E620] !rounded-2xl transform translate-y-13 text-[26px] px-[75px] py-[11.5px] 
              glass custom-before
              ">
                <div className="z-1">20+ направлений</div>
                <Image 
                  src="/pazzle.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -top-18 left-1/2 transform -translate-x-1/2 -z-3"
                />
              </div>
              <div className="!bg-[#E9E3E620] !rounded-2xl text-[26px] px-[75px] py-[11.5px] 
              glass custom-before
              ">
                <div className="z-1">... активных проектов</div>
                
                <Image 
                  src="/lists.svg" 
                  width={95}
                  height={1}
                  alt=""
                  className="absolute -right-15 -top-15 -z-3"
                />
              </div>
              <div className="!bg-[#E9E3E620] !rounded-2xl text-[26px] px-[75px] py-[11.5px] 
              glass custom-before
              ">
                <div className="z-1">... партнеров-работодателей</div>
                
                <Image 
                  src="/laptop.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -left-12.5 -top-10 -z-3"
                />
              </div>
              <div className="!bg-[#E9E3E620] !rounded-2xl text-[26px] px-[75px] py-[11.5px] 
              glass custom-before
              ">
                <div className="z-1">5 лабораторий</div>
                
                <Image 
                  src="/lab.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -right-13 -top-13 -z-3"
                />
              </div>
            </div>
        </div>
        <div className="container h-[1226px]">
          <div className="mt-[58px] flex justify-center"><PieIco/></div>
          <h1 className="w-full text-center mt-[30px]">
            НАШИ ЛАБОРАТОРИИ
          </h1>
          <div className="lineClass mb-10"></div>
          <div className="flex justify-center">
            <div className="max-w-[570px] glass ![box-shadow:inset_0px_0px_15px_#ffffff96] px-[25px] pt-[20px] pb-[23px] mb-10">
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -left-3 -top-3 -z-3"></div>
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-3 -right-3 -z-3"></div>
              <p className="relative text-[24px] font-bold leading-8 z-1">
                Каждая лаборатория — это команда и своя экспертиза. Выбери направление по душе.
              </p>
            </div>
          </div>
          <div className="h-[827px] w-[1250px] mx-auto">
            <div className="flex flex-wrap justify-center items-start gap-x-[93px] gap-y-[57px]">
              <Card name="Legal Tech" participants={10} project={12} img="/labLegal.png"/>
              <Card name="IT-лаборатория" participants={24} project={26} img="/labIT.png"/>
              <Card name="Inno Travel" participants={13} project={4} img="/labTravel.png"/>
              <Card name="Finprocess Tech" participants={6} project={7} img="/labFinprocess.png"/>
              <Card name="Psy Tech" participants={9} project={1} img="/labPsy.png"/>
            </div>
          </div>

          <Image 
              src="/glistsMylo.svg" 
              width={2200}
              height={1}
              alt=""
              className="absolute left-1/2 transform -translate-x-1/2 top-[2170px] -z-3"
            />

        </div>
        <div className="containerSlider">
          <div className="w-full flex justify-center">
            <Image src="/Star.png" width={125} height={125} alt=""/>
          </div>
          <h1 className="text-center">Наши достижения</h1>
          <div className="lineClass "></div>
          <div className="h-full w-full relative">
            <div>
              <div className="absolute -left-10 -top-20 z-2 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] h-30 w-100 -rotate-20"></div>
              <div className="absolute left-0 top-0 z-1 h-full w-80 bg-gradient-to-r from-[#ffffff12] to-[#00000000] blur-lg"></div>
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-2 bg-black h-[120%] w-10"></div>
              <div className="absolute -left-10 -bottom-20 z-2 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] h-30 w-100 rotate-20"></div>

              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-2 bg-black h-[120%] w-10"></div>
              <div className="absolute -right-10 -top-20 z-2 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] h-30 w-100 rotate-20"></div>
              <div className="absolute right-0 top-0 z-1 h-full w-80 bg-gradient-to-l from-[#ffffff12] to-[#00000000] blur-lg"></div>
              <div className="absolute -right-10 -bottom-20 z-2 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] h-30 w-100 -rotate-20"></div>
            </div>
            <Lenta/>
          </div>
        </div>
        <div className="container">
          <div className="w-full flex justify-center">
            <Image src="/show.png" width={100} height={125} alt="" className="z-1"/>
          </div>
          <h1 className="text-center mt-5">Руководство</h1>
          <div className="lineClass"></div>
          <div className="flex justify-center mt-[70px] gap-[128px]">
            <ManagerCard/>
            <ManagerCard/>
          </div>
        </div>
      </div>
      </main>
  );
}

