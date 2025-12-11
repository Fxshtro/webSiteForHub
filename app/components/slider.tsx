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
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
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
  const [stage, setStage] = useState(0); // 0: начальное, 1: уменьшение, 2: скольжение, 3: увеличение
  const containerRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number | null>(null);
  const [animationProgress, setAnimationProgress] = useState(0); // 0-1 прогресс анимации

  const next = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(1);
    setStage(1);
    setAnimationProgress(0);
  };

  const prev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setDirection(-1);
    setStage(1);
    setAnimationProgress(0);
  };

  const getCard = (offset: number) => {
    const realIndex = ((index + offset) % sliderData.length + sliderData.length) % sliderData.length;
    return sliderData[realIndex];
  };

  // Плавная анимация с requestAnimationFrame
  useEffect(() => {
    if (!isAnimating) return;

    let startTime: number | null = null;
    const totalDuration = 700; // Общее время анимации
    const shrinkDuration = 100; // Уменьшение: 300ms
    const slideDuration = 200;  // Скольжение: 400ms
    const growDuration = 200;   // Увеличение: 400ms

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      
      if (elapsed < shrinkDuration) {
        // Стадия 1: уменьшение
        setStage(1);
        const stageProgress = elapsed / shrinkDuration;
        setAnimationProgress(stageProgress);
      } else if (elapsed < shrinkDuration + slideDuration) {
        // Стадия 2: скольжение
        setStage(2);
        const stageProgress = (elapsed - shrinkDuration) / slideDuration;
        setAnimationProgress(1 + stageProgress); // 1-2
      } else if (elapsed < totalDuration) {
        // Стадия 3: увеличение
        setStage(3);
        const stageProgress = (elapsed - shrinkDuration - slideDuration) / growDuration;
        setAnimationProgress(2 + stageProgress); // 2-3
      } else {
        // Завершение анимации
        setIndex(prev => prev + direction);
        setIsAnimating(false);
        setDirection(0);
        setStage(0);
        setAnimationProgress(0);
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

  // Получаем смещение для контейнера с учетом анимации
  const getContainerTransform = () => {
    const baseOffset = -(CARD_WIDTH * 2.5);
    
    if (stage >= 2 && animationProgress > 1) {
      // Плавное скольжение на основе прогресса анимации
      const slideProgress = Math.min(1, animationProgress - 1);
      const slideOffset = -direction * CARD_WIDTH * slideProgress;
      return `translateX(calc(50% + ${baseOffset}px + ${slideOffset}px))`;
    }
    
    return `translateX(calc(50% + ${baseOffset}px))`;
  };

  // Определяем свойства для каждой карточки
  const getCardStyle = (offset: number) => {
    const isCurrentCenter = offset === 0;
    const willBeNewCenter = offset === direction;
    
    let opacity = 0.45;
    let scale = 0.75;
    
    if (!isAnimating) {
      if (isCurrentCenter) {
        opacity = 1;
        scale = 1;
      }
    } else {
      // Анимация уменьшения
      if (stage === 1) {
        if (isCurrentCenter) {
          const progress = animationProgress;
          opacity = 1 - (1 - 0.45) * progress;
          scale = 1 - (1 - 0.75) * progress;
        }
      }
      // Анимация скольжения
      else if (stage === 2) {
        if (isCurrentCenter || willBeNewCenter) {
          opacity = 0.45;
          scale = 0.75;
        }
      }
      // Анимация увеличения
      else if (stage === 3) {
        if (isCurrentCenter) {
          opacity = 0.45;
          scale = 0.75;
        } else if (willBeNewCenter) {
          const progress = Math.max(0, Math.min(1, animationProgress - 2));
          opacity = 0.45 + (1 - 0.45) * progress;
          scale = 0.75 + (1 - 0.75) * progress;
          
          console.log(`New center card (offset ${offset}): progress=${progress.toFixed(2)}, opacity=${opacity.toFixed(2)}, scale=${scale.toFixed(2)}`);
        }
      }
    }
    
    return {
      opacity,
      transform: `scale(${scale})`,
      transition: isAnimating ? `all ${stage === 3 ? 0.4 : stage === 1 ? 0.3 : 0.4}s cubic-bezier(0.34, 1.56, 0.64, 1)` : 'none',
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
  const arrowOffset = isMobile ? 30 : 80;

  return (
    <div style={{ position: "relative", padding: isMobile ? "40px 0" : "80px 0", overflow: "hidden" }}>
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
        {/* Левая стрелка */}
        <button
          onClick={prev}
          disabled={isAnimating}
          style={{
            position: "absolute",
            left: `calc(50% - ${cardWidthPx / 2 + arrowOffset}px)`,
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

        {/* Контейнер карточек */}
        <div
          ref={containerRef}
          style={{
            display: "flex",
            gap: `${cardGap}px`,
            transform: getContainerTransform(),
            transition: stage >= 2 && animationProgress > 1 
              ? "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)"
              : "none",
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
                  background: "rgba(42, 51, 90, 0.33)",
                  backdropFilter: "blur(60px) saturate(180%)",
                  WebkitBackdropFilter: "blur(60px) saturate(180%)",
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

        {/* Правая стрелка */}
        <button
          onClick={next}
          disabled={isAnimating}
          style={{
            position: "absolute",
            right: `calc(50% - ${cardWidthPx / 2 + (isMobile ? 20 : 50)}px)`,
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
  );
}