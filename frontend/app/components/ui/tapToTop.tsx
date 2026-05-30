"use client";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

export default function ScrollToTop(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const syncVisibility = (): void => {
      setIsVisible(window.scrollY > window.innerHeight);
      frameRef.current = null;
    };

    const handleScroll = (): void => {
      if (frameRef.current !== null) return;

      frameRef.current = window.requestAnimationFrame(syncVisibility);
    };

    syncVisibility();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const handleScrollToTop = useCallback((): void => {
    window.scrollTo({ top: 0 });
  }, []);

  return (
    <button
      type="button"
      onClick={handleScrollToTop}
      aria-label="Вернуться наверх"
      className={`fixed bottom-10 -z-3 -right-0 z-100 h-[68px] w-[170px] select-none rounded-l-full bg-[#ffffff] duration-100
            ${isVisible ? "-right-23" : "-right-50"}
            md:scale-100 scale-70 cursor-pointer
            sm:hover:right-0`}
    >
      <div className="z-101 h-full w-[70px] rounded-full bg-white [box-shadow:0px_0px_10px_#0000008a]"></div>
      <Image
        src="/icons/ArrowForTapToTop.svg"
        width={35}
        height={35}
        alt=""
        role="presentation"
        className="absolute top-[18px] right-29.5"
        loading="lazy"
        sizes="35px"
      />
      <p className="absolute top-[20px] right-4 text-xl font-bold font-jost text-black">GoToUp</p>
    </button>
  );
}
