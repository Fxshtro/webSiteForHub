'use client';

import "./globals.css";
import Card from "./components/card";
import Slider from "./components/slider";
import { useState, useEffect } from "react";

export default function Home() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Вычисляем margin и padding динамически
  const calculateMargin = () => {
    if (windowWidth === 0) return -400; // начальное значение
    
    // На мобильных устройствах используем меньший отрицательный margin для видимости картинок
    if (isMobile) {
      return -100; // Меньший отрицательный margin на мобильных
    }
    
    // Когда ширина экрана меньше 1440px + 800px (400px с каждой стороны), уменьшаем margin
    const maxMargin = 400;
    const minWidth = 1440;
    const totalPadding = 800; // 400px с каждой стороны
    const threshold = minWidth + totalPadding;
    
    if (windowWidth >= threshold) {
      return -maxMargin;
    } else if (windowWidth <= minWidth) {
      return 0;
    } else {
      // Линейная интерполяция
      const ratio = (windowWidth - minWidth) / (threshold - minWidth);
      return -maxMargin * (1 - ratio);
    }
  };

  const marginValue = calculateMargin();
  const paddingValue = isMobile ? 100 : Math.max(0, -marginValue);
  return (
    <main>  
      <div className="container">
      <div className="start__bg absolute left-0 right-0 container-bg">
        <div className="relative -top-30">
          <img src="/image/background-image.svg" alt="" style={{width: '100%', height: 'auto', display: 'block',}}/>
          <div className="absolute opacity-96 bg-gradient-to-b from-[#2b3655] to-[#040508]" style={{top: 0, bottom: 0, left: '50%', width: '100vw', transform: 'translateX(-50%)'}}></div>
        </div>
      </div>

      <div className="start" style={{position: 'relative'}}>
        <div className="start__content container flex relative md:h-200 h-[94vh] ">
          <div style={{marginLeft: '-10px', paddingRight: '25px', maxWidth: '700px', width: '100%'}} className="container flex flex-col md:block h-full">
            <div className="md:block flex-grow md:flex-grow-0">
              <div className="!pt-38 md:!pt-60 title-ad text-3xl md:text-7xl font-semibold !-mt-15 md:!-mt-10 leading-none">
                СТУДЕНЧЕСКИЙ <br className="!mb-0 md:!mb-[-1em]"></br><a className="text-xl md:text-5xl block -mt-2 md:-mt-4">ЦИФРОВОЙ ХАБ</a>
              </div>
              <div style={{marginTop: '60px'}} className="font-extralight text-lg md:text-2xl">
                Цифровая экосистема для управления проектами и объединения участников студенческого хаба
              </div>
            </div>
            <div style={{
              marginTop: '60px', 
              marginBottom: '20px',
              border: '4px solid #4e4e4e',
              boxShadow: '0 0 10px rgba(78, 99, 167, 0.2), 0 0 20px rgba(78, 99, 167, 0.1)',
              transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
              contain: 'layout style paint',
            }} 
            className="join text-sm text-center md:p-0 md:text-2xl flex- font-normal hover:cursor-pointer bg-[#101725] inline-block rounded-3xl"
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#6c97f55e';
              e.currentTarget.style.boxShadow = '0 0 20px rgba(78, 99, 167, 0.507), 0 0 40px rgba(78, 99, 167, 0.356)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 0 10px rgba(78, 99, 167, 0.2), 0 0 20px rgba(78, 99, 167, 0.1)';
              e.currentTarget.style.borderColor = '#4e4e4e';
            }}>
              ПРИСОЕДИНИТЬСЯ К ХАБУ
            </div>
          </div>
        </div>
        <div className="figure-container" style={{ position: 'absolute', top: '-300px', right: '-500px', zIndex: '-1', pointerEvents: 'none'
        }}>
          <img src="/image/figure.svg" alt="" className="!w-350 !h-300 md:!w-350 md:!h-325"/>
        </div>
      </div>

      <div className="transfer">
          <div className="!mt-10 md:!mt-0 !ml-7 md:!ml-23">
            <div className="section-number relative top-12 text-[6rem] md:text-[17rem]">01</div>
            <div className="text-xl md:text-4xl max-w-150 relative -top-1 !mr-7 md:-top-20 font-semibold">
              Единая цифровая экосистема для студенческих проектов
              </div>
          </div>

          <div className="transfer__row flex !mt-13 md:items-stretch">
            <div className="md:w-[49%] flex-shrink-0 absolute md:relative md:min-h-200 -left-30 md:left-0 md:self-stretch" style={{overflow: 'visible'}}>
              <div className="h-full w-full md:flex md:items-center md:justify-center" style={{position: 'relative', overflow: 'visible'}}>
                <img style={{
                  transform: 'scale(1.5)', 
                  width: '100%', 
                  objectFit: 'cover', 
                  objectPosition: 'center', 
                  position: 'absolute',
                  top: '-100px',
                  left: '-10px'
                }} 
                className="opacity-65 md:opacity-100 md:scale-150 md:!top-10 md:!-left-80 !max-h-100 md:!max-h-none w-full md:h-full" 
                src="/image/figure2.svg" alt=""/>
              </div>
            </div>
            <div className="md:w-[50%] flex-shrink-0 w-full">
              <div className="flex justify-start">
                <div className="relative -left-1 top-3.5 md:top-0 !w-15 !h-15 md:!w-25 md:!h-25 rounded-2xl md:rounded-3xl bg-white/50"></div>
              </div>
              <div style={{ position: "relative", width: "100%" }}>
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
                  className="text-lg md:text-4xl relative -top-10 md:-top-24 !py-0 !px-7 md:!px-11 !pt-10 !pb-10 rounded-2xl md:rounded-3xl text-white break-words overflow-wrap-anywhere"
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
                  <div style={{ position: "relative", zIndex: 1, wordWrap: "break-word", overflowWrap: "break-word", wordBreak: "break-word" }}>
                    <div
                      style={{
                        opacity: isExpanded ? 0 : 1,
                        transition: "opacity 0.3s ease-in-out",
                        position: isExpanded ? "absolute" : "relative",
                        pointerEvents: "none",
                        width: "100%",
                        visibility: isExpanded ? "hidden" : "visible",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
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
                        visibility: isExpanded ? "visible" : "hidden",
                        wordWrap: "break-word",
                        overflowWrap: "break-word",
                        wordBreak: "break-word"
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
            <div className="section-number relative top-12 text-[6rem] md:text-[17rem]">02</div>
            <div className="text-xl md:text-4xl max-w-150 relative -top-1 !mr-7 md:-top-20 font-semibold">Лаборатории</div>
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
          <div className="relative" style={{overflow: 'hidden', contain: 'layout style', marginLeft: `${marginValue}px`, marginRight: `${marginValue}px`, paddingLeft: `${paddingValue}px`, paddingRight: `${paddingValue}px`}}>
            <div className="absolute top-0 left-0 right-0 pointer-events-none z-0 md:!ml-7 md:!mr-7" style={{bottom: 'auto'}}>
              <div className="absolute left-10 md:-left-90 top-[-290px] md:top-[50px] scale-120 md:scale-180 opacity-15">
                <img src="/image/figure.svg" alt="" className="!w-200 !h-200 md:!w-300 md:!h-300" style={{
                  maxWidth: '100vw', 
                  height: 'auto', 
                  transform: 'rotate(-60deg) translateX(-200px)'
                }}/>
              </div>
              <div className="absolute right-40 md:-right-50 top-[-100px] md:top-[350px] scale-120 md:scale-150 opacity-15">
                <img src="/image/figure.svg" alt="" className="!w-200 !h-200 md:!w-300 md:!h-300" style={{
                  maxWidth: '100vw', 
                  height: 'auto', 
                  transform: 'rotate(10deg) translateX(200px)'
                }}/>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to right, rgb(4, 5, 8) 0%, rgba(4, 5, 8, 0.705) 5%, rgba(4, 5, 8, 0.507) 10%, rgba(4, 5, 8, 0.2) 15%, rgba(4, 5, 8, 0) 20%, rgba(4, 5, 8, 0) 80%, rgba(4, 5, 8, 0.2) 85%, rgba(4, 5, 8, 0.507) 90%, rgba(4, 5, 8, 0.705) 95%, rgb(4, 5, 8) 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }}></div>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(to top, rgb(4, 5, 8) 0%, rgba(4, 5, 8, 0.705) 5%, rgba(4, 5, 8, 0.507) 10%, rgba(4, 5, 8, 0.2) 15%, rgba(4, 5, 8, 0) 20%, rgba(4, 5, 8, 0) 80%, rgba(4, 5, 8, 0) 85%, rgba(4, 5, 8, 0.2) 90%, rgba(4, 5, 8, 0.35) 95%, rgba(4, 5, 8, 0.6) 100%)',
              pointerEvents: 'none',
              zIndex: 1
            }}></div>
            <div className="relative z-10" style={{ paddingBottom: isMobile ? '50px' : '200px' }}>
              <div className="!ml-7 md:!ml-23">
                <div className="section-number md:!mt-25 relative top-12 text-[6rem] md:text-[17rem]">03</div>
                <div className="text-xl md:text-4xl max-w-150 w-30 md:w-85 text-center relative -top-1 !mr-7 md:-top-20 font-semibold">Достижения</div>
              </div>
              <Slider/>
            </div>
          </div>
          <div className="relative overflow-hidden" style={{ height: isMobile ? '300px' : '900px', marginLeft: `${marginValue}px`, marginRight: `${marginValue}px`, paddingLeft: `${paddingValue}px`, paddingRight: `${paddingValue}px` }}>
            <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none z-0" style={{overflow: 'hidden'}}>
            <div className="absolute left-1/2" style={{ transform: 'translateX(-50%) rotate(30deg) scaleX(-1) scale(2.6)', bottom: isMobile ? '-270px' : '-650px'}}>
            <img src="/image/figure.svg" alt="" className="!w-150 !h-150 md:!w-270 md:!h-270 opacity-15" style={{maxWidth: '100vw', height: 'auto', display: 'block'}}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
