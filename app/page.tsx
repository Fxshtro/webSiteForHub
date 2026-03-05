import Image from "next/image";
import "./globals.css";

import IconStates from "./components/icoState";
import PieIco from "./components/pie"
import Card from "./components/card"

export default function Home() {
  return (
      <main >
      <div className="overflow-x-hidden"> 
        <div className="container h-[575px] flex relative !mt-[85px]">
          <div className="w-[59.5%]">
            <h1 className="w-full font-unbounded2 text-center [text-shadow:0px_4px_14px_#00000025] 
            text-[40px] leading-11 pt-[20px] mt-[108px] font-bold
            bg-gradient-to-r from-[#ffffff] from-40% to-[#9a7bd4] to-90% bg-clip-text text-transparent">
              <span className="text-[64px] font-black">СТУДЕНЧЕСКИЙ</span>
              <br/>ЦИФРОВОЙ ХАБ
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
              <div className="max-w-[490px] bg-[#00000020] border-l-1 border-t-1 border-[#ffffff67] rounded-4xl 
              px-[25px] pt-[13px] pb-[22px] relative ml-22.5 [box-shadow:0px_0px_15px_#00000025]
              ">
                <div className="absolute inset-0 border-b-1 border-r-1 border-[#ffffff27] rounded-4xl backdrop-blur-sm z-0 [box-shadow:inset_0px_0px_15px_#00000042]"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -top-4 -left-4 -z-1"></div>
                <p className="flex relative mb-3 z-1">
                  <span className="font-black text-[48px] font-unbounded2 ml-10">О ХАБЕ</span>
                  <Image src="/logo.svg" width={95} height={45} alt="" className="ml-4"/>
                </p>
                <p className="relative text-[32px] leading-10 z-1"><span className="font-extrabold ">Хаб</span> — это экосистема студенческих лабораторий Южного Университета “ИУБиП”</p>
              </div>
            </div>
            
            <div className="w-[50%]">
              <div className="max-w-[520px] bg-[#00000020] border-l-1 border-t-1 border-[#ffffff67] rounded-4xl 
              px-[25px] pt-[20px] pb-[20px] relative ml-12.5 mt-[165px] [box-shadow:0px_0px_15px_#00000025]
              ">
              <div className="absolute inset-0 border-b-1 border-r-1 border-[#ffffff27] rounded-4xl backdrop-blur-sm z-0 [box-shadow:inset_0px_0px_15px_#00000042]"></div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-4 -right-4 -z-1"></div>
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
              className="absolute left-1/2 transform -translate-x-1/2 top-[635px] -z-2"
            />
          
          <div className="mt-25 flex justify-center"><IconStates/></div>
          <h1 className="w-full font-unbounded2 text-center [text-shadow:0px_4px_14px_#00000025] leading-11 pt-[13px] pb-[5px] mt-[30px] 
            gradient-fiol text-[64px] font-black">
            СТАТИСТИКА
          </h1>
            <div className="w-[400px] h-[3px] mt-7 mx-auto bg-gradient-to-l from-[#00000000] via-[#ffffffa0] to-[#00000000] mb-20"></div>
            <div className="h-[338px] flex flex-wrap justify-center items-start gap-10">
              <div className="bg-[#E9E3E620] rounded-2xl text-[26px] px-[95px] py-[13.5px] relative border-l-1 border-t-1 border-[#ffffff3b]">
                <div className="z-1">100+ участников</div>
                <div className="absolute left-0 top-0 backdrop-blur-lg h-full w-full rounded-2xl border-r-1 border-b-1 border-[#ffffff21] text-[26px] px-[75px] py-[11.5px] -z-1"></div>
                <Image 
                  src="/icoHumans.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -left-12.5 -top-8.5 -z-2"
                />
              </div>
              <div className="bg-[#E9E3E620] rounded-2xl transform translate-y-13 text-[26px] px-[75px] py-[11.5px] relative border-l-1 border-t-1 border-[#ffffff3b]">
                <div className="z-1">20+ направлений</div>
                <div className="absolute left-0 top-0 backdrop-blur-lg h-full w-full rounded-2xl border-r-1 border-b-1 border-[#ffffff21] text-[26px] px-[75px] py-[11.5px] -z-1"></div>
                <Image 
                  src="/pazzle.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -top-18 left-1/2 transform -translate-x-1/2 -z-2"
                />
              </div>
              <div className="bg-[#E9E3E620] rounded-2xl text-[26px] px-[75px] py-[11.5px] relative border-l-1 border-t-1 border-[#ffffff3b]">
                <div className="z-1">... активных проектов</div>
                <div className="absolute left-0 top-0 backdrop-blur-lg h-full w-full rounded-2xl border-r-1 border-b-1 border-[#ffffff21] text-[26px] px-[75px] py-[11.5px] -z-1"></div>
                <Image 
                  src="/lists.svg" 
                  width={95}
                  height={1}
                  alt=""
                  className="absolute -right-15 -top-15 -z-2"
                />
              </div>
              <div className="bg-[#E9E3E620] rounded-2xl text-[26px] px-[75px] py-[11.5px] relative border-l-1 border-t-1 border-[#ffffff3b]">
                <div className="z-1">... партнеров-работодателей</div>
                <div className="absolute left-0 top-0 backdrop-blur-lg h-full w-full rounded-2xl border-r-1 border-b-1 border-[#ffffff21] text-[26px] px-[75px] py-[11.5px] -z-1"></div>
                <Image 
                  src="/laptop.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -left-12.5 -top-10 -z-2"
                />
              </div>
              <div className="bg-[#E9E3E620] rounded-2xl text-[26px] px-[75px] py-[11.5px] relative border-l-1 border-t-1 border-[#ffffff3b]">
                <div className="z-1">5 лабораторий</div>
                <div className="absolute left-0 top-0 backdrop-blur-lg h-full w-full rounded-2xl border-r-1 border-b-1 border-[#ffffff21] text-[26px] px-[75px] py-[11.5px] -z-1"></div>
                <Image 
                  src="/lab.svg" 
                  width={85}
                  height={1}
                  alt=""
                  className="absolute -right-13 -top-13 -z-2"
                />
              </div>
            </div>
        </div>
        <div className="container h-[1226px]">
          <div className="mt-[58px] flex justify-center"><PieIco/></div>
          <h1 className="w-full font-unbounded2 text-center [text-shadow:0px_4px_14px_#00000025] leading-11 pt-[13px] pb-[5px] mt-[30px] 
            gradient-fiol text-[64px] font-black">
            НАШИ ЛАБОАРАТОРИИ
          </h1>
          <div className="w-[400px] h-[3px] mt-7 mx-auto bg-gradient-to-l from-[#00000000] via-[#ffffffa0] to-[#00000000] mb-10"></div>
          <div className="flex justify-center">
            <div className="max-w-[570px] bg-[#00000020] border-l-1 border-t-1 border-[#ffffff67] rounded-4xl 
            px-[25px] pt-[20px] pb-[23px] relative [box-shadow:0px_0px_15px_#00000025] [box-shadow:inset_0px_0px_15px_#ffffff96] mb-10
            ">
              <div className="absolute inset-0 border-b-1 border-r-1 border-[#ffffff27] rounded-4xl backdrop-blur-sm z-0 [box-shadow:inset_0px_0px_15px_#00000042]"></div>
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-br from-[#ffffff] to-75% absolute -left-3 -top-3 -z-1"></div>
              <div className="w-[44px] h-[40px] rounded-full bg-gradient-to-tl from-[#ffffff] to-75% absolute -bottom-3 -right-3 -z-1"></div>
              <p className="relative text-[24px] font-bold leading-8 z-1">
                Каждая лаборатория — это команда и своя экспертиза. Выбери направление по душе.
              </p>
            </div>
          </div>
          <div className="h-[827px] w-[1250px] mx-auto">
            <div className="flex flex-wrap justify-center items-start gap-x-[93px] gap-y-[57px]">
              <Card/>
              <Card/>
              <Card/>
              <Card/>
              <Card/>
            </div>
          </div>
        </div>
        <div className="h-1000"></div>
      </div>
      </main>
  );
}

