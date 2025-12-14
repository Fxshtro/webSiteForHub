'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ParticipantsSidebar from "../participants-sidebar";
import { Participant } from "../../types/laboratory";

interface NavItemProps {
  label: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  dropdownContent?: string;
  href?: string;
  isActive?: boolean;
}

function NavItem({ label, isHovered, onMouseEnter, onMouseLeave, dropdownContent, href, isMobile, isActive }: NavItemProps & { isMobile?: boolean }) {
  const content = (
    <span className={`relative inline-block cursor-pointer transition-colors ${isActive ? 'text-[#6c97f5]' : ''}`}>{label}</span>
  );

  return (
    <div 
      className="relative"
      onMouseEnter={!isMobile ? onMouseEnter : undefined}
      onMouseLeave={!isMobile ? onMouseLeave : undefined}
    >
      {href ? <Link href={href}>{content}</Link> : content}
      {(isHovered || isActive) && (
        <div className="absolute bottom-[-13px] left-0 right-0 h-[6px] rounded-full overflow-visible slider-track pointer-events-none">
          <div className="slider-ball pointer-events-none"></div>
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

// Пример данных участников (в будущем будет загружаться из БД)
const mockParticipants: Participant[] = [
  {
    id: '1',
    name: 'Иванов Иван',
    role: 'student',
    roleLabel: 'Студент',
    specialization: 'Frontend разработка',
    laboratoryId: 'lab-1',
    joinedAt: new Date(),
    status: 'active',
  },
  {
    id: '2',
    name: 'Петрова Мария',
    role: 'leader',
    roleLabel: 'Руководитель',
    specialization: 'Fullstack разработка',
    laboratoryId: 'lab-1',
    joinedAt: new Date(),
    status: 'active',
  },
  {
    id: '3',
    name: 'Сидоров Алексей',
    role: 'student',
    roleLabel: 'Студент',
    specialization: 'Backend разработка',
    laboratoryId: 'lab-1',
    joinedAt: new Date(),
    status: 'active',
  },
  {
    id: '4',
    name: 'Козлова Анна',
    role: 'mentor',
    roleLabel: 'Ментор',
    specialization: 'UI/UX дизайн',
    laboratoryId: 'lab-1',
    joinedAt: new Date(),
    status: 'active',
  },
  {
    id: '5',
    name: 'Морозов Дмитрий',
    role: 'student',
    roleLabel: 'Студент',
    specialization: 'Mobile разработка',
    laboratoryId: 'lab-1',
    joinedAt: new Date(),
    status: 'active',
  },
];

export default function MainHeader() {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isParticipantsSidebarOpen, setIsParticipantsSidebarOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isLaboratoriesPage = pathname === '/laboratories';

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  return (
    <header className="header w-full top-0 left-0 z-1000 fixed mb-10">
      <div className="relative w-full">
        <div className="container h-14 md:h-21">
          <div className="flex justify-between items-center h-full">
            <Link href="/">
              <Image src="/image/icon.svg" alt="ITHub Logo" width={65} height={15} className="md:w-24"/>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-x-[clamp(10px,8vw,200px)] font-light text-sm md:text-xl !ml-4 !mr-4">
              <NavItem 
                label="Лаборатории"
                isHovered={hoveredItem === 'labs'}
                onMouseEnter={() => setHoveredItem('labs')}
                onMouseLeave={() => setHoveredItem(null)}
                dropdownContent="Лаборатории — это специализированные пространства для разработки и исследований в области информационных технологий. Здесь студенты работают над проектами, изучают новые технологии и создают инновационные решения."
                href="/laboratories"
                isMobile={isMobile}
                isActive={isLaboratoriesPage}
              />
              <NavItem 
                label="Достижения"
                isHovered={hoveredItem === 'achievements'}
                onMouseEnter={() => setHoveredItem('achievements')}
                onMouseLeave={() => setHoveredItem(null)}
                isMobile={isMobile}
              />
              <NavItem 
                label="Руководство"
                isHovered={hoveredItem === 'management'}
                onMouseEnter={() => setHoveredItem('management')}
                onMouseLeave={() => setHoveredItem(null)}
                isMobile={isMobile}
              />
            </div>

            {/* Mobile Burger Menu Button */}
            {isMobile && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="backdrop-blur-md bg-[#6c97f51a] !px-2 !py-1 text-white rounded-full 
                shadow-[0_0_20px_#6c97f539] flex items-center justify-center cursor-pointer"
                aria-label="Меню"
              >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isMobileMenuOpen ? 'hidden' : 'block'}
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={isMobileMenuOpen ? 'block' : 'hidden'}
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
              </button>
            )}

            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              {isLaboratoriesPage && (
                <div
                  className="backdrop-blur-md bg-[#6c97f51a] !px-2 !py-0.5 text-white rounded-full 
                  shadow-[0_0_20px_#6c97f539] flex items-center justify-center gap-3 text-sm md:text-xl cursor-pointer min-w-[80px]"
                  onClick={() => setIsParticipantsSidebarOpen(true)}
                >
                  {mockParticipants.length}
                  <Image src="/image/profile.svg" alt="" width={19} height={20}/>
                </div>
              )}
              {!isLaboratoriesPage && (
                <Link href="/"
                    className="backdrop-blur-md bg-[#6c97f51a] !px-2 !py-0.5 text-white rounded-full 
                    shadow-[0_0_20px_#6c97f539] flex items-center justify-center gap-3 text-sm md:text-xl min-w-[80px]">
                  Вход
                  <Image src="/image/profile.svg" alt="" width={19} height={20}/>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobile && (
        <div 
          className={`fixed top-14 left-0 right-0 z-[1001] overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
          }`}
          style={{
            background: "rgba(18, 25, 39, 0.95)",
            backdropFilter: "blur(60px) saturate(180%)",
            WebkitBackdropFilter: "blur(60px) saturate(180%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
        <div className="container py-4" style={{ paddingBottom: '20px', paddingLeft: '20px', paddingRight: '20px' }}>
          <div className="flex flex-col gap-4">
            <Link 
              href="/laboratories"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-white font-light text-lg py-2 ${isLaboratoriesPage ? 'text-[#6c97f5]' : ''}`}
            >
              Лаборатории
            </Link>
            <Link 
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white font-light text-lg py-2"
            >
              Достижения
            </Link>
            <Link 
              href="#"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white font-light text-lg py-2"
            >
              Руководство
            </Link>
            {isLaboratoriesPage && (
              <div
                className="backdrop-blur-md bg-[#6c97f51a] !px-4 !py-2 text-white rounded-full 
                shadow-[0_0_20px_#6c97f539] flex items-center justify-center gap-3 text-lg cursor-pointer mt-2 mb-4"
                onClick={() => {
                  setIsParticipantsSidebarOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                {mockParticipants.length}
                <Image src="/image/profile.svg" alt="" width={19} height={20}/>
              </div>
            )}
            {!isLaboratoriesPage && (
              <Link 
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="backdrop-blur-md bg-[#6c97f51a] !px-4 !py-2 text-white rounded-full 
                shadow-[0_0_20px_#6c97f539] flex items-center justify-center gap-3 text-lg mt-2 mb-4"
              >
                Вход
                <Image src="/image/profile.svg" alt="" width={19} height={20}/>
              </Link>
            )}
          </div>
        </div>
        </div>
      )}
      
      {isLaboratoriesPage && (
        <ParticipantsSidebar
          participants={mockParticipants}
          isOpen={isParticipantsSidebarOpen}
          onClose={() => setIsParticipantsSidebarOpen(false)}
          laboratoryName="Участники лаборатории"
        />
      )}
    </header>
  );
}

