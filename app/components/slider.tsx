'use client';

import { useState, useEffect, useRef } from 'react';

const sliderData = [
  `Карточка 1. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
   Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
   Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi.
   Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore.`,

  `Карточка 2. Aliquam erat volutpat. Integer tincidunt cursus risus nec interdum.
   Suspendisse potenti. Sed malesuada, elit at semper placerat,
   ante nibh gravida tortor, eget dictum elit urna ut arcu.
   Nunc feugiat purus eu massa feugiat dapibus eget nec sapien.`,

  `Карточка 3. Proin at lorem id turpis vehicula blandit. 
   Pellentesque sit amet metus metus. Nam ac dui sit amet risus laoreet placerat. 
   Morbi eget vulputate metus. Vivamus condimentum, lacus quis gravida tincidunt.`,

  `Карточка 4. Cras ultricies ligula sed magna dictum porta. 
   Vivamus magna justo, lacinia eget consectetur sed, convallis at tellus. 
   Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.`,

  `Карточка 5. Donec rutrum congue leo eget malesuada. 
   Nulla porttitor accumsan tincidunt. Mauris blandit aliquet elit, 
   eget tincidunt nibh pulvinar a. Sed porttitor lectus nibh.`,

  `Карточка 6. Vestibulum ac diam sit amet quam vehicula elementum sed sit amet dui.
   Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.
   Proin eget tortor risus. Cras ultricies ligula sed magna dictum porta.`,

  `Карточка 7. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a.
   Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere.
   Donec sollicitudin molestie malesuada. Sed porttitor lectus nibh.`
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

  const CARD_WIDTH = !isMobile ? 584 : (windowWidth > 0 && windowWidth < 360 ? Math.max(240, windowWidth - 80) : 280);

  const [index, setIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState(0);
  const [stage, setStage] = useState(0);
  const [animationProgress, setAnimationProgress] = useState(0);
  const [arrowsDisabled, setArrowsDisabled] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const indexUpdatedRef = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startAnimation = (dir: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(dir);
    setStage(1);
    setAnimationProgress(0);
    indexUpdatedRef.current = false;
  };

  const next = () => startAnimation(1);
  const prev = () => startAnimation(-1);

  const getCard = (offset: number) => {
    const idx = (index + offset) % sliderData.length;
    return sliderData[idx < 0 ? idx + sliderData.length : idx];
  };

  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const totalDuration = 650;
    const shrinkDuration = 100;
    const slideDuration = 300;
    const growDuration = 150;
    const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

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
        setArrowsDisabled(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        const timeoutDuration = Math.max(0, totalDuration - 1000);
        if (timeoutDuration > 0) {
          timeoutRef.current = setTimeout(() => {
            setArrowsDisabled(false);
            timeoutRef.current = null;
          }, timeoutDuration);
        } else {
          setArrowsDisabled(false);
        }
        return;
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isAnimating, direction]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const getContainerTransform = () => {
    const cardGap = isMobile ? 15 : 30;
    const baseOffset = -(CARD_WIDTH + cardGap) * 2 - (CARD_WIDTH / 2) + (CARD_WIDTH / 2) + (isMobile ? -(CARD_WIDTH / 2) : 0);
    
    if (stage === 2 && isAnimating && animationProgress >= 1) {
      const slideProgress = Math.min(1, animationProgress - 1);
      const slideOffset = -direction * (CARD_WIDTH + cardGap) * slideProgress;
      const compensation = indexUpdatedRef.current ? direction * (CARD_WIDTH + cardGap) : 0;
      return `translateX(calc(50% + ${baseOffset + compensation + slideOffset}px))`;
    }
    
    return `translateX(calc(50% + ${baseOffset}px))`;
  };

  const getCardStyle = (offset: number) => {
    const isCenter = offset === 0;
    const willBeCenter = offset === direction;
    const isNewCenter = indexUpdatedRef.current ? isCenter : willBeCenter;
    
    let opacity = 0.45;
    let scale = 0.75;
    let blurAmount = 80;
    let backgroundOpacity = 0.5;
    let transitionDuration = 'none';
    let transitionTiming = 'linear';
    
    if (!isAnimating) {
      if (isCenter) {
        opacity = 1;
        scale = 1;
        blurAmount = 60;
        backgroundOpacity = 0.33;
      }
    } else if (stage === 1 && isCenter) {
      const p = animationProgress;
      opacity = 1 - 0.55 * p;
      scale = 1 - 0.25 * p;
      blurAmount = 60 + 20 * p;
      backgroundOpacity = 0.33 + 0.17 * p;
      transitionDuration = '0.15s';
      transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
    } else if (stage === 2 && (isCenter || willBeCenter)) {
      opacity = 0.45;
      scale = 0.75;
      blurAmount = 80;
      backgroundOpacity = 0.5;
    } else if (stage === 3) {
      if (isNewCenter) {
        const p = Math.max(0, Math.min(1, animationProgress - 2));
        opacity = 0.45 + 0.55 * p;
        scale = 0.75 + 0.25 * p;
        blurAmount = 80 - 20 * p;
        backgroundOpacity = 0.5 - 0.17 * p;
        transitionDuration = '0.25s';
        transitionTiming = 'cubic-bezier(0.4, 0, 0.2, 1)';
      } else if (isCenter && !indexUpdatedRef.current) {
        opacity = 0.45;
        scale = 0.75;
        blurAmount = 80;
        backgroundOpacity = 0.5;
      }
    }
    
    const transition = transitionDuration !== 'none' 
      ? `opacity ${transitionDuration} ${transitionTiming}, transform ${transitionDuration} ${transitionTiming}, backdrop-filter ${transitionDuration} ${transitionTiming}, -webkit-backdrop-filter ${transitionDuration} ${transitionTiming}, background ${transitionDuration} ${transitionTiming}`
      : 'none';
    
    return {
      opacity,
      transform: `scale(${scale})`,
      background: `rgba(42, 51, 90, ${backgroundOpacity})`,
      backdropFilter: `blur(${blurAmount}px) saturate(180%)`,
      WebkitBackdropFilter: `blur(${blurAmount}px) saturate(180%)`,
      transition,
    };
  };

  const visibleOffsets = [-2, -1, 0, 1, 2];

  const cardWidthPx = CARD_WIDTH;
  const cardHeightPx = isMobile ? 200 : 380;
  const cardPadding = isMobile ? 20 : 50;
  const cardBorderRadius = isMobile ? 30 : 80;
  const cardFontSize = isMobile ? 14 : 24;
  const cardGap = isMobile ? 15 : 30;
  const arrowFontSize = isMobile ? 40 : 68;
  const arrowOffset = isMobile ? 30 : 64;
  const edgeOffset = isMobile ? 0 : 20;

  return (
    <div style={{ position: "relative", padding: isMobile ? "40px 0" : "80px 0" }}>
      <div className={isMobile ? "" : "container"} style={{ position: "relative", padding: isMobile ? "0 10px" : undefined }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            position: "relative",
            width: "100%",
            justifyContent: "center",
            overflow: "visible",
            marginLeft: isMobile ? "0" : `-${cardWidthPx / 2}px`,
            marginRight: isMobile ? "0" : `-${cardWidthPx / 2}px`,
            paddingLeft: isMobile ? "0" : `${cardWidthPx / 2}px`,
            paddingRight: isMobile ? "0" : `${cardWidthPx / 2}px`,
          }}
        >
          <button
            onClick={prev}
            disabled={isAnimating || arrowsDisabled}
            style={{
              position: "absolute",
              left: isMobile ? `${edgeOffset}px` : `calc(50% - ${cardWidthPx / 2 + arrowOffset}px + ${cardWidthPx / 2}px)`,
              fontSize: `${arrowFontSize}px`,
              color: "white",
              background: "transparent",
              border: "none",
              cursor: (isAnimating || arrowsDisabled) ? "default" : "pointer",
              zIndex: 10,
              transition: "opacity 0.3s ease",
              opacity: (isAnimating || arrowsDisabled) ? 0 : 1,
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
            disabled={isAnimating || arrowsDisabled}
            style={{
              position: "absolute",
              right: isMobile ? `${edgeOffset}px` : `calc(50% - ${cardWidthPx / 2 + arrowOffset}px - ${cardWidthPx / 2}px)`,
              fontSize: `${arrowFontSize}px`,
              color: "white",
              background: "transparent",
              border: "none",
              cursor: (isAnimating || arrowsDisabled) ? "default" : "pointer",
              zIndex: 10,
              transition: "opacity 0.3s ease",
              opacity: (isAnimating || arrowsDisabled) ? 0 : 1,
            }}
          >
            ›
          </button>
          {!isMobile && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: `calc(${cardWidthPx / 2}px - 450px)`,
              right: `calc(-${cardWidthPx / 2}px - 450px)`,
              bottom: 0,
              background: 'linear-gradient(to right, rgb(4, 5, 8) 0%, rgba(4, 5, 8, 0.267) 5%, rgba(4, 5, 8, 0.089) 10%, rgba(4, 5, 8, 0) 20%, rgba(4, 5, 8, 0) 80%, rgba(4, 5, 8, 0.089) 90%, rgba(4, 5, 8, 0.267) 95%, rgb(4, 5, 8) 100%)',
              pointerEvents: 'none',
              zIndex: 5
            }}></div>
          )}
        </div>
      </div>
    </div>
  );
}