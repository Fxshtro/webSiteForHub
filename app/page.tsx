'use client';

import "./globals.css";
import Card from "./components/card";
import Slider from "./components/slider";
import { useState, useEffect } from "react";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  return (
    <main>  
      <div className="start__bg absolute left-0 right-0 container-bg">
        <div className="relative -top-30">
          <img src="/image/background-image.svg" alt="" style={{width: '100%', height: 'auto', display: 'block',}}/>
          <div className="absolute opacity-96 inset-0 bg-gradient-to-b from-[#1A2136] to-black"></div>
        </div>
      </div>

      <div className="start">
        <div className="start__content container flex relative md:h-200 h-[94vh] ">
          <div style={{marginLeft: '15px', paddingRight: '25px', maxWidth: '700px', width: '100%'}} className="container flex flex-col md:block h-full">
            <div className="md:block flex-grow md:flex-grow-0">
              <div className="!pt-38 md:!pt-52 title-ad text-3xl md:text-7xl font-semibold !-mt-15 md:!-mt-10 ">
                СТУДЕНЧЕСКИЙ <br></br><a className="text-xl md:text-5xl">ЦИФРОВОЙ ХАБ</a>
              </div>
              <div style={{marginTop: '60px'}} className="font-extralight text-lg md:text-2xl">
                Цифровая экосистема для управления проектами и объединения участников студенческого хаба
              </div>
            </div>
            <div style={{
              marginTop: '60px', 
              marginBottom: '20px',
              border: '4px solid #4e4e4e',
              animation: 'buttonGlow 3s ease-in-out infinite',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              contain: 'layout style paint',
            }} 
            className="join text-sm text-center md:p-0 md:text-2xl flex- font-normal hover:cursor-pointer bg-[#0a0c14] inline-block rounded-2xl"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6c97f55e';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 20px rgba(78, 99, 167, 0.507), 0 0 40px rgba(78, 99, 167, 0.356)';
              e.currentTarget.style.borderColor = '#4e4e4e';
            }}>
              ПРИСОЕДИНИТЬСЯ К ХАБУ
            </div>
          </div>
          <div className="figure-container" style={{ position: 'absolute', top: -300, right: '-500px', zIndex: '-1'
          }}>
            <img src="/image/figure.svg" alt="" className="!w-350 !h-300 md:!w-350 md:!h-325"/>
          </div>
        </div>
      </div>

      <div className="transfer">
        <div className="container">
          <div className="!mt-10 md:!mt-0 !ml-7 md:!ml-23">
            <div 
              style={{ background: 'linear-gradient(to bottom, #4E63A7 20%, #0000006c 65%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}} 
              className=" font-['Abril_Fatface'] relative top-12 text-[6rem] md:text-[17rem]">01
            </div>
            <div className="text-xl md:text-4xl max-w-150 relative -top-1 !mr-7 md:-top-20 font-semibold">
              Единая цифровая экосистема для студенческих проектов
              </div>
          </div>

          <div className="transfer__row flex !mt-13">
            <div className=" md:w-[40%] absolute md:relative -left-30">
              <img style={{transform: 'scale(1.5)', width: '100%', objectFit: 'cover', objectPosition: 'center', }} 
              className="relative opacity-65 md:opacity-100 md:scale-150 -top-10 md:top-20 -left-10 md:-left-20 !max-h-100 md:!max-h-250" 
              src="/image/figure2.svg" alt=""/>
            </div>
            <div className=" md:w-[60%]">
              <div className="flex justify-start">
                <div className="relative -left-1 top-3.5 md:top-0 !w-15 !h-15 md:!w-25 md:!h-25 rounded-2xl md:rounded-3xl bg-white/50"></div>
              </div>
              <div style={{ position: "relative" }}>
                {!isMobile && isExpanded && (
                  <div 
                    style={{ 
                      visibility: "hidden",
                      height: "180px",
                      pointerEvents: "none"
                    }}
                    className="text-lg md:text-4xl !py-0 !px-7 md:!px-11 !pt-10 !pb-10"
                  />
                )}
                <div 
                  style={{ 
                    background: "rgba(42, 51, 90, 0.2)",
                    backdropFilter: "blur(60px) saturate(180%)",
                    WebkitBackdropFilter: "blur(60px) saturate(180%)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                    boxShadow: `
                      0 0 0 1px rgba(255, 255, 255, 0.05),
                      0 8px 32px rgba(0, 0, 0, 0.2),
                      inset 0 0 0 1px rgba(255, 255, 255, 0.05)
                    `,
                    position: isMobile ? "relative" : (isExpanded ? "absolute" : "relative"),
                    width: "100%",
                    maxHeight: isExpanded ? (isMobile ? "none" : "1200px") : (isMobile ? "none" : undefined),
                    transition: isExpanded ? "max-height 0.5s ease-in-out" : "none",
                    overflow: isExpanded ? "hidden" : "visible",
                    zIndex: isExpanded && !isMobile ? 20 : 1
                  }} 
                  className="text-lg md:text-4xl relative -top-10 md:-top-24 !py-0 !px-7 md:!px-11 !pt-10 !pb-10 rounded-2xl md:rounded-3xl text-white"
                  onMouseEnter={() => !isMobile && setIsExpanded(true)}
                  onMouseLeave={() => !isMobile && setIsExpanded(false)}
                  onClick={() => isMobile && setIsExpanded(!isExpanded)}
                >
                  <div 
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                      pointerEvents: "none",
                      borderRadius: "inherit"
                    }}
                  />
                  {!isExpanded && (
                    <div 
                      style={{
                        position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.03) 75%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "glassShimmer 4s ease-in-out infinite",
                        pointerEvents: "none",
                        borderRadius: "inherit",
                        mixBlendMode: "overlay"
                      }}
                    />
                  )}
                  <div style={{ position: "relative", zIndex: 1 }}>
                    <div
                      style={{
                        opacity: isExpanded ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out",
                        position: isExpanded ? "absolute" : "relative",
                        pointerEvents: "none",
                        width: "100%",
                        visibility: isExpanded ? "hidden" : "visible"
                      }}
                    >
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                      Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
                      quae perferendis facere modi, enim eos incidunt dolorem autem. 
                      Accusantium ratione nemo eum.
                    </div>
                    <div
                      style={{
                        opacity: isExpanded ? 1 : 0,
                        transition: "opacity 0.3s ease-in-out",
                        position: isExpanded ? "relative" : "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        pointerEvents: "none",
                        width: "100%",
                        visibility: isExpanded ? "visible" : "hidden"
                      }}
                    >
                      Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                      Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
                      quae perferendis facere modi, enim eos incidunt dolorem autem. 
                      Accusantium ratione nemo eum. Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                      Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
                      quae perferendis facere modi, enim eos incidunt dolorem autem. 
                      Accusantium ratione nemo eum. Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
                      Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
                      quae perferendis facere modi, enim eos incidunt dolorem autem. 
                      Accusantium ratione nemo eum.
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <div 
                  className="!w-15 !h-15 md:!w-25 md:!h-25 rounded-2xl md:rounded-3xl relative -top-24 md:-top-48 -z-10 bg-white/50 left-1"
                  style={{
                    display: !isMobile && isExpanded ? "none" : "block"
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className="!ml-7 md:!ml-23">
            <div 
              style={{ background: 'linear-gradient(to bottom, #4E63A7 20%, #0000006c 65%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}} 
              className="md:!mt-25 font-['Abril_Fatface'] relative top-12 text-[6rem] md:text-[17rem]">02
            </div>
            <div className="text-xl md:text-4xl max-w-150 relative -top-1 !mr-7 md:-top-20 font-semibold">ИТ - Лаборатория</div>
          </div>
          <div className="absolute -z-1000 left-0 right-0">
            <div className="relative -top-30 md:-top-260 container-bg overflow-hidden">
              <img src="/image/background-image2.svg" alt="" style={{width: '100%', maxWidth: '1440px', height: 'auto', display: 'block', margin: '0 auto'}}/>
            </div>
          </div>
          <div className="image_project !mt-12 md:!mt-24">
            <div className="container">
                <Card text="" src=""/>
              <div className="!mt-10 md:!mt-19 flex justify-end">
                <Card text="" src="" align="right"/>
              </div>
              <div className="!mt-10 md:!mt-19">
                <Card text="" src=""/>
              </div>
            </div>
          </div>
          <div className="!ml-7 md:!ml-23">
            <div 
              style={{ background: 'linear-gradient(to bottom, #4E63A7 20%, #0000006c 65%)',
              WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent'}} 
              className="md:!mt-25 font-['Abril_Fatface'] relative top-12 text-[6rem] md:text-[17rem]">03
            </div>
            <div className="text-xl md:text-4xl max-w-150 w-30 md:w-85 text-center relative -top-1 !mr-7 md:-top-20 font-semibold">Проекты</div>
          </div>
            <Slider/>
        </div>
      </div>
    </main>
  );
}