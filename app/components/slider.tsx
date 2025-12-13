'use client';

import { useState, useEffect, useRef } from 'react';

const sliderData = [
  `Первая карточка. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
   Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
   Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
   Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.`,

  `Вторая карточка. Aliquam erat volutpat. Integer tincidunt cursus risus nec interdum.
   Suspendisse potenti. Sed malesuada, elit at semper placerat,
   ante nibh gravida tortor, eget dictum elit urna ut arcu.
   Nunc feugiat purus eu massa feugiat dapibus eget nec sapien.`,

  `Третья карточка (центральная). Proin at lorem id turpis vehicula blandit. 
   Pellentesque sit amet metus metus. Nam ac dui sit amet risus laoreet placerat. 
   Morbi eget vulputate metus. Vivamus condimentum, lacus quis gravida tincidunt.`,

  `Четвертая карточка. Cras ultricies ligula sed magna dictum porta. 
   Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. 
   Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.`,

  `Пятая карточка. Donec rutrum congue leo eget malesuada. 
   Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, 
   eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh.`
];

export default function Slider() {
  const [isMobile, setIsMobile] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  
  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width < 768);
      setWindowWidth(width);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const CARD_WIDTH = isMobile ? 280 : 584;
  const VISIBLE_WIDTH = isMobile ? 140 : 292;

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const [stage, setStage] = useState(0); // 0: idle, 1: shrink, 2: slide, 3: grow
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0);
  const indexUpdatedRef = useRef(false);

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setStage(1);
    setAnimationProgress(0);
    indexUpdatedRef.current = false;
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setStage(1);
    setAnimationProgress(0);
    indexUpdatedRef.current = false;
  };

  const getCard = (offset: number) => {
    const realIndex = ((index + offset) % sliderData.length + sliderData.length) % sliderData.length;
    return sliderData[realIndex];
  };

  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const totalDuration = 900;
    const shrinkDuration = 150;
    const slideDuration = 400;
    const growDuration = 200;
    
    // Easing function for smooth acceleration and deceleration
    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      
      if (elapsed < shrinkDuration) {
        setStage(1);
        const stageProgress = elapsed / shrinkDuration;
        setAnimationProgress(stageProgress);
      } else if (elapsed < shrinkDuration + slideDuration) {
        setStage(2);
        const rawProgress = (elapsed - shrinkDuration) / slideDuration;
        const easedProgress = easeInOutCubic(rawProgress);
        setAnimationProgress(1 + easedProgress);
        
        // Update index near end of slide stage to apply new positioning in time
        if (!indexUpdatedRef.current && rawProgress > 0.75) {
          setIndex(prev => prev + direction);
          indexUpdatedRef.current = true;
        }
      } else if (elapsed < totalDuration) {
        setStage(3);
        const stageProgress = (elapsed - shrinkDuration - slideDuration) / growDuration;
        setAnimationProgress(2 + stageProgress);
        
        if (!indexUpdatedRef.current) {
          setIndex(prev => prev + direction);
          indexUpdatedRef.current = true;
        }
      } else {
        setIsAnimating(false);
        setDirection(0);
        setStage(0);
        setAnimationProgress(0);
        indexUpdatedRef.current = false;
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, direction]);

  const getContainerTransform = () => {
    const cardGap = isMobile ? 15 : 30;
    const card0Position = (CARD_WIDTH + cardGap) * 2;
    const baseOffset = -card0Position - (CARD_WIDTH / 2);
    
    if (stage === 2 && isAnimating && animationProgress >= 1) {
      const slideProgress = Math.min(1, animationProgress - 1);
      const slideOffset = -direction * (CARD_WIDTH + cardGap) * slideProgress;

      if (indexUpdatedRef.current) {
        const compensationOffset = direction * (CARD_WIDTH + cardGap);
        return `translateX(calc(50% + ${baseOffset}px + ${compensationOffset}px + ${slideOffset}px))`;
      }
      
      return `translateX(calc(50% + ${baseOffset}px + ${slideOffset}px))`;
    }
    
    return `translateX(calc(50% + ${baseOffset}px))`;
  };

  const getCardStyle = (offset: number) => {
    const isCurrentCenter = offset === 0;
    const willBeNewCenter = offset === direction;
    
    let opacity = 0.45;
    let scale = 0.75;
    let blurAmount = 80;
    let backgroundOpacity = 0.5;
    
    if (!isAnimating) {
      if (isCurrentCenter) {
        opacity = 1;
        scale = 1;
        blurAmount = 60;
        backgroundOpacity = 0.33;
      }
    } else {
      if (stage === 1) {
        if (isCurrentCenter) {
          const progress = animationProgress;
          opacity = 1 - (1 - 0.45) * progress;
          scale = 1 - (1 - 0.75) * progress;
          blurAmount = 60 + (80 - 60) * progress;
          backgroundOpacity = 0.33 + (0.5 - 0.33) * progress;
        }
      } else if (stage === 2) {
        if (isCurrentCenter || willBeNewCenter) {
          opacity = 0.45;
          scale = 0.75;
          blurAmount = 80;
          backgroundOpacity = 0.5;
        }
      } else if (stage === 3) {
        // After index update, new center card is at offset === 0
        const isNewCenter = indexUpdatedRef.current ? isCurrentCenter : willBeNewCenter;
        
        if (isNewCenter) {
          const progress = Math.max(0, Math.min(1, animationProgress - 2));
          opacity = 0.45 + (1 - 0.45) * progress;
          scale = 0.75 + (1 - 0.75) * progress;
          blurAmount = 80 - (80 - 60) * progress;
          backgroundOpacity = 0.5 - (0.5 - 0.33) * progress;
        } else if (isCurrentCenter && !indexUpdatedRef.current) {
          opacity = 0.45;
          scale = 0.75;
          blurAmount = 80;
          backgroundOpacity = 0.5;
        }
      }
    }
    
    let transitionDuration = 'none';
    let transitionTiming = 'linear';
    if (isAnimating) {
      if (stage === 1) {
        transitionDuration = '0.15s';
        transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
      } else if (stage === 3) {
        transitionDuration = '0.25s';
        transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
    
    return {
      opacity,
      transform: `scale(${scale})`,
      background: `rgba(42, 51, 90, ${backgroundOpacity})`,
      backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
      transition: transitionDuration !== 'none' 
        ? `opacity ${transitionDuration} ${transitionTiming}, transform ${transitionDuration} ${transitionTiming}, backdrop-filter ${transitionDuration} ${transitionTiming}, -webkit-backdrop-filter ${transitionDuration} ${transitionTiming}, background ${transitionDuration} ${transitionTiming}`
        : 'none',
    };
  };

  const visibleOffsets = [-2, -1, 0, 1, 2];

  const cardWidthPx = isMobile ? 280 : 584;
  const cardHeightPx = isMobile ? 200 : 380;
  const cardPadding = isMobile ? 20 : 50;
  const cardBorderRadius = isMobile ? 30 : 80;
  const cardFontSize = isMobile ? 14 : 24;
  const cardGap = isMobile ? 15 : 30;
  const arrowFontSize = isMobile ? 40 : 68;
  const arrowOffset = isMobile ? 30 : 64;
  const edgeOffset = 20;

  return (
    <div style={{ position: "relative", padding: isMobile ? "40px 0" : "80px 0" }}>
      <div className={isMobile ? "" : "container"} style={{ position: "relative" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <button
            onClick={prev}
            disabled={isAnimating}
            style={{
              position: "absolute",
              left: isMobile ? `${edgeOffset}px` : `calc(50% - ${cardWidthPx / 2 + arrowOffset}px)`,
              fontSize: `${arrowFontSize}px`,
              color: "white",
              background: "transparent",
              border: "none",
              cursor: isAnimating ? "default" : "pointer",
              zIndex: 10,
              transition: "opacity 0.3s ease",
              opacity: isAnimating ? 0.6 : 1,
            }}
          >
            ‹
          </button>

        <div
          ref={containerRef}
          style={{
            display: "flex",
            gap: `${cardGap}px`,
            transform: getContainerTransform(),
            transition: "none",
            willChange: isAnimating ? "transform" : "auto",
            paddingTop: isMobile ? "10px" : "20px"
          }}
        >
          {visibleOffsets.map((offset) => {
            const text = getCard(offset);
            const style = getCardStyle(offset);

            return (
              <div
                key={`${offset}-${index}-${stage}-${animationProgress.toFixed(2)}`}
                style={{
                  width: `${cardWidthPx}px`,
                  height: `${cardHeightPx}px`,
                  padding: `${cardPadding}px`,
                  borderRadius: `${cardBorderRadius}px`,
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.05),
                    0 12px 40px rgba(0,0,0,0.3),
                    inset 0 0 0 1px rgba(255,255,255,0.05)
                  `,
                  color: "white",
                  lineHeight: "1.6",
                  fontSize: `${cardFontSize}px`,
                  ...style,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                  flexShrink: 0,
                }}
              >
                {text}
              </div>
            );
          })}
        </div>

          <button
            onClick={next}
            disabled={isAnimating}
            style={{
              position: "absolute",
              right: isMobile ? `${edgeOffset}px` : `calc(50% - ${cardWidthPx / 2 + arrowOffset}px)`,
              fontSize: `${arrowFontSize}px`,
              color: "white",
              background: "transparent",
              border: "none",
              cursor: isAnimating ? "default" : "pointer",
              zIndex: 10,
              transition: "opacity 0.3s ease",
              opacity: isAnimating ? 0.6 : 1,
            }}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
}