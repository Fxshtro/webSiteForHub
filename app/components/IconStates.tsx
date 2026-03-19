"use client";
import Image from "next/image";

export default function IconStates() {
  return (
    <div className="relative">
      <div className="block w-[73px] h-[73px] bg-[#6E32DE] rounded-[20px] -rotate-15"></div>
      <div
        className="absolute left-3.5 top-3 border-l-2 border-t-2 border-[#80808093] backdrop-blur-lg 
            block w-[73px] h-[73px] bg-[#653ABB12] rounded-[23px]"
      ></div>
      <div
        className="absolute left-3.5 top-3 border-b-2 border-r-2 border-[#64646425]
            block w-[73px] h-[73px] rounded-[23px]"
      >
        <Image
          src="/images/decor/line.svg"
          width={55}
          height={1}
          alt=""
          role="presentation"
          className="z-1 absolute top-5.5 left-3.5"
          loading="lazy"
          sizes="55px"
        />
        <div className="absolute -right-2 -top-2 bg-gradient-to-l from-[#6E32DE] to-[#3F1D7E] h-2.5 w-2.5 rounded-full"></div>
      </div>
    </div>
  );
}
