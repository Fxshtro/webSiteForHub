export default function Card({text, src}) {
    return (
        <div 
            style={{ background: "rgba(42, 51, 90, 0.2)", backdropFilter: "blur(60px) saturate(180%)", WebkitBackdropFilter: "blur(60px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                boxShadow: `
                    0 0 0 1px rgba(255, 255, 255, 0.05),
                    0 8px 32px rgba(0, 0, 0, 0.2),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.05)
                `, position: "relative"
            }} 
            className="max-w-[584px] !pl-1 !pr-1 !pt-1 md:rounded-[55px] rounded-b-4xl rounded-t-[55px] overflow-hidden"
        >
            <div style={{position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
                    background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)",
                    pointerEvents: "none", borderRadius: "inherit" }} />
            
            <img src={src || "/image/Точечный рисунок.bmp"} alt="Неправильно введен путь картинки" 
                style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)"}}
                className="!w-[584px] !h-[240px] md:!h-[306px] bg-[#777777] rounded-[52px] object-cover relative z-10" 
            />
            <div className="text-lg md:text-3xl !px-4 md:!px-8 !pb-4 md:!pb-8 !pt-4 md:!pt-5 text-white relative z-10">
                {text || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur rerum corporis rem magni doloribus dolor!"}
            </div>
        </div>
    );
}