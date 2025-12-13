'use client';

import Image from "next/image";
import { useState } from "react";

interface NavItemProps {
  label: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  dropdownContent?: string;
}

function NavItem({ label, isHovered, onMouseEnter, onMouseLeave, dropdownContent }: NavItemProps) {
  return (
    <div 
      className="relative"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <a href="" className="relative inline-block">{label}</a>
      {isHovered && (
        <div className="absolute bottom-[-13px] left-0 right-0 h-[6px] rounded-full overflow-visible slider-track">
          <div className="slider-ball"></div>
        </div>
      )}
      {isHovered && dropdownContent && (
        <div 
          className="absolute top-full left-1/2 !mt-[28px] w-[200px] md:w-[440px] rounded-b-3xl !p-5 z-50 dropdown-slide-up"
          style={{
            background: "rgba(42, 53, 83, 0.26)",
            backdropFilter: "blur(60px) saturate(180%)",
            WebkitBackdropFilter: "blur(60px) saturate(180%)",
          }}
        >
          <p className="text-xs md:text-sm text-white leading-relaxed">
            {dropdownContent}
          </p>
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <header className="header w-full top-0 left-0 z-1000 fixed mb-10">
      <div className="relative w-full">
        <div className="container h-14 md:h-21">
          <div className="flex justify-between items-center h-full">
            <Image src="/image/icon.svg" alt="ITHub Logo" width={65} height={15} className="md:w-24"/>
            <div className="flex gap-x-[clamp(10px,8vw,200px)] font-light text-sm md:text-xl !ml-4 !mr-4">
              <NavItem 
                label="Лаборатории"
                isHovered={hoveredItem === 'labs'}
                onMouseEnter={() => setHoveredItem('labs')}
                onMouseLeave={() => setHoveredItem(null)}
                dropdownContent="Лаборатории — это специализированные пространства для разработки и исследований в области информационных технологий. Здесь студенты работают над проектами, изучают новые технологии и создают инновационные решения."
              />
              <NavItem 
                label="Достижения"
                isHovered={hoveredItem === 'achievements'}
                onMouseEnter={() => setHoveredItem('achievements')}
                onMouseLeave={() => setHoveredItem(null)}
              />
              <NavItem 
                label="Руководство"
                isHovered={hoveredItem === 'management'}
                onMouseEnter={() => setHoveredItem('management')}
                onMouseLeave={() => setHoveredItem(null)}
              />
            </div>
            <a href=""
                className="backdrop-blur-md bg-[#6c97f51a] !px-2 !py-0.5 text-white rounded-full 
                shadow-[0_0_20px_#6c97f539] flex items-center gap-3 text-sm md:text-xl">
              Вход
              <Image src="/image/profile.svg" alt="" width={19} height={20}/>
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}

