'use client';

import { useState, useEffect } from "react";

interface SimpleCardProps {
    text?: string;
    src?: string;
}

export default function SimpleCard({ text, src }: SimpleCardProps) {
    const [isHovering, setIsHovering] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [hasHover, setHasHover] = useState(true);

    useEffect(() => {
        const checkDevice = () => {
            const hasHoverSupport = window.matchMedia('(hover: hover)').matches;
            const isSmallScreen = window.innerWidth < 768;
            setHasHover(hasHoverSupport);
            setIsMobile(isSmallScreen);
        };
        
        checkDevice();
        
        const hoverMediaQuery = window.matchMedia('(hover: hover)');
        const handleHoverChange = () => {
            setHasHover(hoverMediaQuery.matches);
        };
        
        hoverMediaQuery.addEventListener('change', handleHoverChange);
        window.addEventListener('resize', checkDevice);
        
        return () => {
            window.removeEventListener('resize', checkDevice);
            hoverMediaQuery.removeEventListener('change', handleHoverChange);
        };
    }, []);

    const handleMouseEnter = () => {
        if (hasHover && !isMobile) {
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (hasHover && !isMobile) {
            setIsHovering(false);
        }
    };

    const shouldHover = isHovering && hasHover && !isMobile;

    return (
        <div 
            style={{
                background: "rgba(42, 51, 90, 0.2)",
                backdropFilter: shouldHover ? "blur(20px)" : "blur(15px)",
                WebkitBackdropFilter: shouldHover ? "blur(20px)" : "blur(15px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                transform: shouldHover ? "scale(1.05)" : "scale(1)",
                transition: "transform 0.3s ease, box-shadow 0.3s ease",
                zIndex: shouldHover ? 10 : 1,
                boxShadow: shouldHover
                    ? "0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 40px rgba(78, 99, 167, 0.3)"
                    : "0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2)",
            }}
            className="!pl-1 !pr-1 !pt-1 md:rounded-[55px] rounded-b-4xl rounded-t-[55px] overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {!isMobile && hasHover && !isHovering && (
                <div 
                    style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.02) 25%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.02) 75%, transparent 100%)",
                        backgroundSize: "200% 100%",
                        animation: "glassShimmer 6s ease-in-out infinite",
                        pointerEvents: "none",
                        borderRadius: "inherit",
                    }}
                />
            )}
            
            <img 
                src={src || "/image/Точечный рисунок.bmp"} 
                alt="Неправильно введен путь картинки" 
                loading="lazy"
                decoding="async"
                style={{ 
                    width: "100%",
                }}
                className="bg-[#777777] rounded-[52px] object-cover relative z-10 !h-[240px] md:!h-[306px]"
            />
            <div className="text-lg md:text-3xl !px-4 md:!px-8 !pb-4 md:!pb-8 !pt-4 md:!pt-5 text-white relative z-10">
                {text || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur rerum corporis rem magni doloribus dolor!"}
            </div>
        </div>
    );
}

