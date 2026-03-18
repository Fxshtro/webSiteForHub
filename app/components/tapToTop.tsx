"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      onClick={() => {
        window.scrollTo({ top: 0 });
      }}
      className={`fixed bottom-10 -z-3 -right-0 z-100 h-[68px] w-[170px] select-none rounded-l-full bg-[#ffffff] duration-100
            ${isVisible ? "-right-23" : "-right-50"}
            md:scale-100 scale-70 cursor-pointer
            sm:hover:right-0`}
    >
      <div className="z-101 h-full w-[70px] rounded-full bg-white [box-shadow:0px_0px_10px_#0000008a]"></div>
      <Image
        src="/ArrowForTapToTop.svg"
        width={35}
        height={35}
        alt="top"
        className="absolute top-[18px] right-29.5"
        loading="lazy"
        sizes="35px"
      />
      <p className="absolute top-[20px] right-4 text-xl font-bold font-jost text-black">GoToUp</p>
    </div>
  );
}
