import "./globals.css";
import Card from "./components/card";
import Slider from "./components/slider";

export default function Home() {
  return (
    <main>  
      <div className="start__bg absolute left-0 right-0 container-bg">
        <div className="relative -top-30">
          <img src="/image/background-image.svg" alt="" style={{width: '100%', height: 'auto', display: 'block',}}/>
          <div className="absolute opacity-96 inset-0 bg-gradient-to-b from-[#1A2136] to-black"></div>
        </div>
      </div>

      <div className="start">
        <div className="start__content container flex relative md:h-200 h-[90vh] ">
          <div style={{marginLeft: '15px', paddingRight: '25px', maxWidth: '700px', width: '100%'}} className="container flex flex-col md:block h-full">
            <div className="md:block flex-grow md:flex-grow-0">
              <div className="!pt-38 md:!pt-52 title-ad text-3xl md:text-7xl font-semibold !-mt-15 md:!-mt-10 ">
                СТУДЕНЧЕСКИЙ <br></br><a className="text-xl md:text-5xl">ЦИФРОВОЙ ХАБ</a>
              </div>
              <div style={{marginTop: '60px'}} className="font-extralight text-lg md:text-2xl">Цифровая экосистема для управления проектами и объединения участников студенческого хаба</div>
            </div>
            <div style={{marginTop: '60px', border: '4px solid #4e4e4e'}} 
            className="join text-sm text-center md:p-0 md:text-2xl flex- font-normal hover:cursor-pointer bg-[#0a0c14] inline-block rounded-2xl">
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
            <div className="text-xl md:text-4xl max-w-150 relative -top-1 !mr-7 md:-top-20 font-semibold">Единая цифровая экосистема для студенческих проектов</div>
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
      position: "relative"
    }} 
    className="text-lg md:text-4xl relative -top-10 md:-top-24 !py-0 !px-7 md:!px-11 !pt-10 !pb-10 rounded-2xl md:rounded-3xl text-white overflow-hidden"
  >
  {/*свечение*/}
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
  Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
  Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
  quae perferendis facere modi, enim eos incidunt dolorem autem. 
  Accusantium ratione nemo eum.
</div>
              <div className="flex justify-end">
                <div className=" !w-15 !h-15 md:!w-25 md:!h-25 rounded-2xl md:rounded-3xl relative -top-24 md:-top-48 -z-10 bg-white/50 left-1"></div>
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
          <div className="absolute -z-1000">
            <div className="relative -top-30 md:-top-260">
              <img src="/image/background-image2.svg" alt=""/>
            </div>
          </div>
          <div className="image_project !mt-12 md:!mt-24">
            <div className="container">
                <Card text="" src=""/>
              <div className="!mt-10 md:!mt-19 flex justify-end">
                <Card text="" src=""/>
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