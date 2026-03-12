"use client"
import Image from "next/image";
import IconStates from "../components/icoState";
import PieIco from "../components/pie"
import Card from "../components/card"
import Lenta from "../components/slider"
import ManagerCard from "../components/manager"

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


export default function Home() {
  return (
      <main >
      <div className="absolute bg-gradient-to-b from-[#5F2FC3] to-black w-full h-[1350px] -z-10"></div>
      <div className="overflow-x-hidden"> 
        <div className="container md:h-[575px] flex relative !mt-[85px] !mb-[90px]">
          <div className="xl:w-[59.5%] w-full">
            <h1 className="w-full text-center
            md:leading-11 leading-6 pt-[20px] mt-[108px] [text-shadow:0px_4px_14px_#00000025]
            bg-gradient-to-r from-[#ffffff] from-40% to-[#9a7bd4] to-90% bg-clip-text text-transparent
            ">
              СТУДЕНЧЕСКИЙ
              <br/>
              <span className="xl:text-[40px] md:text-[30px] text-[20px] font-bold">ЦИФРОВОЙ ХАБ</span>
            </h1>
              <div className="md:w-1/2 w-[200px] h-[3px] mt-1.5 mx-auto bg-gradient-to-l from-[#00000000] via-[#ffffffa0] to-[#00000000]"></div>
              <p className="mt-10 md:text-[24px] text-[17px] text-center w-full font-light leading-7">Открытая площадка для студенческих лабораторий.<br/><span className="font-medium">Исследуй, создавай, достигай вместе с нами!</span></p>
            <div className="md:mt-7 sm:mt-14 mt-20 w-full flex flex-row justify-center">
              <button className="sm:text-[24px] text-[17px] font-medium [text-shadow:0px_4px_5px_#00000025]
              backdrop-blur-lg
              hover:[box-shadow:0px_0px_150px_#ffffffa2,_inset_0px_0px_35px_#ffffff95] active:[box-shadow:0px_0px_150px_#0000006f,_inset_0px_0px_35px_#00000062] duration-200
              bg-gradient-to-r from-[#31235C] via-[#6347b8] to[#31235C] px-[66px] px-[42px] md:py-[25px] py-[25px] sm:rounded-3xl rounded-2xl [box-shadow:0px_0px_137px_#ffffff44,_inset_0px_0px_27px_#ffffff70]
              ">ПРИСОЕДИНИТЬСЯ К ХАБУ</button>
            </div>
          </div>
          <Image 
            src="/figureV4.svg" 
            width={1000}
            height={1280}
            alt=""
            className="absolute md:-top-100 -top-50 sm:-right-70 -right-40 -z-1"
          />
        </div>  
        <div className="container">
          <div className="md:flex items-start">

            <div className="flex md:w-[50%]">
              <div className="glass md:max-w-[490px] px-[25px] pt-[13px] pb-[22px] md:ml-22.5 sm:ml-12.5 ml-4 md:mr-0 sm:mr-12.5  mr-4 md:mb-22.5 mb-12">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -top-4 -left-4 -z-3"></div>
                <p className="flex relative mb-3 z-1">
                  <span className="font-black xl:text-[48px] md:text-[30px] text-[28px] font-Unbounded xl:ml-10 ml-5">О ХАБЕ</span>
                  <Image src="/logo.svg" width={95} height={45} alt="" className="md:w-[95px] w-[70px] md:ml-4 ml-2"/>
                </p>
                <p className="relative xl:text-[32px] md:text-[25px] text-[20px] xl:leading-9 z-1"><span className="font-extrabold ">Хаб</span> — это экосистема студенческих лабораторий Южного Университета “ИУБиП”</p>
              </div>
            </div>
            
            <div className="md:w-[50%]">
              <div className="glass md:max-w-[520px] px-[25px] pt-[20px] pb-[20px] sm:ml-12.5 ml-4 sm:mr-12.5  mr-4 md:mt-[165px]">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-4 -right-4 -z-3"></div>
                <p className="relative xl:text-[32px] md:text-[25px] text-[20px] font-light xl:leading-9 z-1 md:text-justify">
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
            <div className="flex flex-wrap justify-center items-start gap-x-10 xl:gap-y-23 gap-y-16 px-10">
              <div className="!bg-[#E9E3E620] !rounded-2xl md:md:text-[26px] text-[16px] text-[16px] text-center md:px-[75px] px-[55px] py-[11.5px] 
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
              <div className="!bg-[#E9E3E620] !rounded-2xl xl:transform xl:translate-y-13 md:text-[26px] text-[16px] text-center md:px-[75px] px-[55px] py-[11.5px] 
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
              <div className="!bg-[#E9E3E620] !rounded-2xl md:text-[26px] text-[16px] text-center md:px-[75px] px-[55px] py-[11.5px] 
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
              <div className="!bg-[#E9E3E620] !rounded-2xl md:text-[26px] text-[16px] text-center md:px-[75px] px-[55px] py-[11.5px] 
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
              <div className="!bg-[#E9E3E620] !rounded-2xl md:text-[26px] text-[16px] text-center md:px-[75px] px-[55px] px-[55px] py-[11.5px] 
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
        <div className="container overflow-visible relative">
          <div className="mt-20">
          <div className="flex justify-center overflow-visible"><PieIco/></div>
          <h1 className="w-full text-center mt-[30px]">
            НАШИ ЛАБОРАТОРИИ
          </h1>
          <div className="lineClass mb-10"></div>
          <div className="flex justify-center px-4">
            <div className="max-w-[570px] glass ![box-shadow:inset_0px_0px_15px_#ffffff96] px-[25px] pt-[20px] pb-[23px] mb-10">
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -left-3 -top-3 -z-3"></div>
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-3 -right-3 -z-3"></div>
              <p className="relative xl:text-[32px] md:text-[25px] text-[20px] font-bold leading-8 z-1">
                Каждая лаборатория — это команда и своя экспертиза. Выбери направление по душе.
              </p>
            </div>
          </div>
          <div className="mx-auto">
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
              className="min-w-[600px] xl:max-w-[2000px] md:max-w-[1000px] absolute left-1/2 transform -translate-x-1/2 top-[360px] -z-3"
            />

          </div>
        </div>
        <div className="containerSlider">
          <div className="w-full flex justify-center mt-20 relative z-3">
            <Image src="/Star.png" width={125} height={125} alt=""/>
          </div>
          <h1 className="text-center relative z-3">Наши достижения</h1>
          <div className="lineClass "></div>
          <div className="h-full w-full relative">
            <div>
              <div className="absolute -left-10 -top-20 z-2 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] h-30 w-100 -rotate-20"></div>
              <div className="absolute left-0 top-0 z-1 h-full md:w-80 w-30 bg-gradient-to-r mmd:from-[#ffffff12] from-[#ffffff0c] to-[#00000000] blur-lg"></div>
              <div className="absolute -left-10 top-1/2 transform -translate-y-1/2 z-2 bg-black h-[120%] w-10"></div>
              <div className="absolute -left-10 -bottom-20 z-2 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] h-30 w-100 rotate-20"></div>

              <div className="absolute -right-10 top-1/2 transform -translate-y-1/2 z-2 bg-black h-[120%] w-10"></div>
              <div className="absolute -right-10 -top-20 z-2 bg-gradient-to-b from-[#000000] from-50% to-[#00000000] h-30 w-100 rotate-20"></div>
              <div className="absolute right-0 top-0 z-1 h-full md:w-80 w-30 bg-gradient-to-l md:from-[#ffffff12] from-[#ffffff0c] to-[#00000000] blur-lg"></div>
              <div className="absolute -right-10 -bottom-20 z-2 bg-gradient-to-t from-[#000000] from-50% to-[#00000000] h-30 w-100 -rotate-20"></div>
            </div>
            <Lenta/>
          </div>
        </div>
        <div className="container">
          <div className="w-full flex justify-center relative z-3">
            <Image src="/show.png" width={100} height={125} alt="" className="z-1"/>
          </div>
          <h1 className="text-center mt-5 relative z-3">Руководство</h1>
          <div className="lineClass"></div>
          <div className="flex flex-wrap justify-center !mt-[70px] gap-x-[128px] gap-y-[60px]">
            <ManagerCard/>
            <ManagerCard/>
          </div>
        </div>
      </div>
      </main>
  );
}

