'use client';

import { useState, useEffect, useMemo } from "react";

interface CardProps {
    text?: string;
    src?: string;
    align?: 'left' | 'right';
}

export default function Card({text, src, align = 'left'}: CardProps) {
    const [isOpened, setIsOpened] = useState(false);
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
        if (hasHover && !isMobile && !isOpened) {
            setIsHovering(true);
        }
    };

    const handleMouseLeave = () => {
        if (hasHover && !isMobile) {
            setIsHovering(false);
        }
    };

    const handleClick = () => {
        setIsOpened(!isOpened);
    };

    const cardStyles = useMemo(() => {
        const shouldHover = isHovering && hasHover && !isMobile && !isOpened;
        return {
            background: "rgba(42, 51, 90, 0.2)",
            backdropFilter: shouldHover || isOpened ? "blur(20px)" : "blur(15px)",
            WebkitBackdropFilter: shouldHover || isOpened ? "blur(20px)" : "blur(15px)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            position: "relative" as const,
            width: isOpened ? "100%" : "auto",
            maxWidth: isOpened ? (isMobile ? "100%" : "calc(1440px - 60px)") : "584px",
            transform: shouldHover ? "scale(1.05)" : "scale(1)",
            transformOrigin: align === 'right' ? "top right" : "top left",
            transition: isOpened 
                ? "width 0.4s ease, max-width 0.4s ease, transform 0.3s ease, box-shadow 0.3s ease"
                : "transform 0.3s ease, box-shadow 0.3s ease",
            zIndex: isOpened ? 50 : (shouldHover ? 10 : 1),
            contain: "layout style paint" as const,
            boxShadow: shouldHover
                ? "0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2), 0 0 40px rgba(78, 99, 167, 0.3)"
                : "0 0 0 1px rgba(255, 255, 255, 0.05), 0 8px 32px rgba(0, 0, 0, 0.2)",
        };
    }, [isOpened, isHovering, isMobile, hasHover, align]);

    return (
        <div 
            style={cardStyles} 
            className="!pl-1 !pr-1 !pt-1 md:rounded-[55px] rounded-b-4xl rounded-t-[55px] overflow-hidden"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
        >
            {!isOpened && !isMobile && hasHover && !isHovering && (
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
                        contain: "strict" as const,
                    }}
                />
            )}
            
            <img 
                src={isOpened ? (src || "/image/Точечный рисунок2.bmp") : (src || "/image/Точечный рисунок.bmp")} 
                alt="Неправильно введен путь картинки" 
                loading="lazy"
                decoding="async"
                style={{ 
                    width: "100%",
                    transition: "height 0.4s ease",
                    maxHeight: isOpened && isMobile ? "300px" : "none",
                    contain: "layout style paint" as const,
                }}
                className={`bg-[#777777] rounded-[52px] object-cover relative z-10 ${isOpened ? (isMobile ? '!h-[300px]' : '!h-[440px] md:!h-[506px]') : '!h-[240px] md:!h-[306px]'}`}
            />
            <div 
                className="text-lg md:text-3xl !px-4 md:!px-8 !pb-4 md:!pb-8 !pt-4 md:!pt-5 text-white relative z-10"
            >
                <div
                    style={{
                        opacity: isOpened ? 0 : 1,
                        maxHeight: isOpened ? 0 : "none",
                        overflow: "hidden",
                        transition: "opacity 0.2s ease, max-height 0.2s ease",
                        contain: "layout style" as const,
                    }}
                >
                    {text || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur rerum corporis rem magni doloribus dolor!"}
                </div>
                <div
                    style={{
                        opacity: isOpened ? 1 : 0,
                        maxHeight: isOpened ? "1000px" : 0,
                        overflow: "hidden",
                        transition: isOpened 
                            ? "opacity 0.25s ease 0.1s, max-height 0.3s ease 0.1s"
                            : "opacity 0.15s ease, max-height 0.15s ease",
                        marginTop: isOpened ? "16px" : 0,
                        contain: "layout style" as const,
                    }}
                >
                    {text || "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur rerum corporis rem magni doloribus dolor!"}
                    <div style={{ marginTop: "20px", fontSize: "0.9em", opacity: 0.8 }}>
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores, aspernatur vero. Accusamus saepe quidem nisi sit neque, 
                        quae perferendis facere modi, enim eos incidunt dolorem autem. Accusantium ratione nemo eum. 
                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Consequatur rerum corporis rem magni doloribus dolor!
                    </div>
                </div>
            </div>
        </div>
    );
}