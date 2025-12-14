'use client';

import Image from "next/image";
import { Participant } from "../types/laboratory";
import { useEffect, useState } from "react";

interface ParticipantsSidebarProps {
  participants: Participant[];
  isOpen: boolean;
  onClose: () => void;
  laboratoryName?: string;
}

export default function ParticipantsSidebar({ 
  participants, 
  isOpen, 
  onClose,
  laboratoryName 
}: ParticipantsSidebarProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Определяем размер экрана только на клиенте
  useEffect(() => {
    setMounted(true);
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Закрытие по клавише Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Блокируем скролл body когда панель открыта
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Overlay для закрытия при клике на сайт (только на десктопе слева от панели) */}
      {isOpen && (
        <div
          className="fixed top-0 left-0 h-full z-[9998] hidden md:block"
          style={{
            width: 'calc(100% - 500px)',
          }}
          onClick={onClose}
        />
      )}
      
      <div
        className="fixed top-0 right-0 h-full w-full md:w-[500px] lg:w-[600px] z-[9999]"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
         {/* Разделительная линия */}
        <div
          className="h-full w-full overflow-y-auto participants-scroll relative"
          style={{
            background: "rgba(18, 25, 39, 0.2)",
            backdropFilter: "blur(100px) saturate(200%)",
            WebkitBackdropFilter: "blur(100px) saturate(200%)",
            borderLeft: "1px solid rgba(255, 255, 255, 0.15)",
            padding: '24px',
            boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)",
          }}
        >
          {/* Градиентный overlay для эффекта стекла */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "linear-gradient(135deg, rgba(255, 255, 255, 0.068) 0%, transparent 50%, rgba(0, 0, 0, 0.05) 100%)",
            }}
          />
          <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header */}
          <div 
            className="mb-8 pb-6 border-b border-white/10 relative"
            style={{ paddingRight: (mounted && isMobile) ? '48px' : '0' }}
          >
            {mounted && isMobile && (
              <button
                onClick={onClose}
                className="absolute top-0 right-0 flex items-center justify-center cursor-pointer"
                style={{
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  background: 'rgba(108, 151, 245, 0.1)',
                  padding: '8px',
                  color: 'white',
                  borderRadius: '50%',
                  boxShadow: '0 0 20px rgba(108, 151, 245, 0.23)',
                  border: 'none',
                  width: '36px',
                  height: '36px',
                }}
                aria-label="Закрыть"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            
            <h2 
              className="text-xl md:text-2xl font-semibold text-white mb-2"
              style={{ marginRight: '0' }}
            >
              {laboratoryName || 'Участники лаборатории'}
            </h2>
            <p className="text-sm text-white/60">
              {participants.length} {participants.length === 1 ? 'участник' : participants.length < 5 ? 'участника' : 'участников'}
            </p>
          </div>

          {/* Search */}
          {participants.length > 0 && (
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Поиск участников..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full !mt-6 !px-4 !py-3 rounded-2xl text-white placeholder-white/40 bg-white/5 border border-white/10 focus:outline-none focus:border-[#6c97f566] focus:ring-2 focus:ring-[#6c97f533] transition-all"
                  style={{
                    background: "rgba(42, 53, 83, 0.15)",
                    backdropFilter: "blur(30px) saturate(200%)",
                    WebkitBackdropFilter: "blur(30px) saturate(200%)",
                  }}
                />
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="absolute !mt-3 right-4 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
            </div>
          )}

          {/* Participants List */}
          {(() => {
            const filteredParticipants = participants.filter((participant) => {
              if (!searchQuery.trim()) return true;
              const query = searchQuery.toLowerCase();
              return (
                participant.name.toLowerCase().includes(query) ||
                participant.roleLabel.toLowerCase().includes(query) ||
                participant.specialization?.toLowerCase().includes(query) ||
                participant.email?.toLowerCase().includes(query)
              );
            });

            return filteredParticipants.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center h-[60vh] py-10">
                <div 
                  className="w-20 h-20 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(42, 53, 83, 0.15)",
                    backdropFilter: "blur(30px) saturate(200%)",
                    WebkitBackdropFilter: "blur(30px) saturate(200%)",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-white/40"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <p className="text-base text-white/60">
                  {searchQuery ? 'Ничего не найдено' : 'Участники пока не добавлены'}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-4 !pt-6">
                {filteredParticipants.map((participant) => (
                <div
                  key={participant.id}
                  className="participant-item flex items-center gap-4 !p-4 rounded-xl cursor-pointer group transition-all border border-white/12 hover:border-[#6c97f566]"
                  style={{
                    background: "rgba(42, 53, 83, 0.15)",
                    backdropFilter: "blur(30px) saturate(200%)",
                    WebkitBackdropFilter: "blur(30px) saturate(200%)",
                    boxShadow: "0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(108, 151, 245, 0.25), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)';
                    e.currentTarget.style.background = 'rgba(42, 53, 83, 0.25)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 0 rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.background = 'rgba(42, 53, 83, 0.15)';
                  }}
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-full overflow-hidden bg-white/10 flex items-center justify-center border-2 border-white/10 group-hover:border-white/20 transition-colors">
                    {participant.avatar ? (
                      <Image
                        src={participant.avatar}
                        alt={participant.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-semibold text-white/90">
                        {participant.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0 flex flex-col gap-1">
                    <p className="text-base font-medium text-white truncate">
                      {participant.name}
                    </p>
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="text-sm text-white/70">
                        {participant.roleLabel}
                      </span>
                      {participant.specialization && (
                        <>
                          <span className="text-white/30">•</span>
                          <span className="text-sm text-white/60 truncate">
                            {participant.specialization}
                          </span>
                        </>
                      )}
                    </div>
                    {participant.email && (
                      <p className="text-xs text-white/50 truncate mt-1">
                        {participant.email}
                      </p>
                    )}
                  </div>

                  {/* Arrow indicator */}
                  <div 
                    className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ width: '20px', height: '20px' }}
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-white/40"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
                ))}
              </div>
            );
          })()}
          </div>
        </div>
      </div>
    </>
  );
}
