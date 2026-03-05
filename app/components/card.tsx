'use client';
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Card() {
    return (
        <div className="w-[354px] h-[353px] bg-[#00000020] border-l-1 border-t-1 border-[#ffffff67] rounded-4xl 
        px-[12px] pt-[12px] pb-[12px] relative [box-shadow:0px_0px_15px_#00000025] -z-2
        ">
            <div className="absolute inset-0 border-b-1 border-r-1 border-[#ffffff27] rounded-4xl backdrop-blur-sm -z-1 [box-shadow:inset_0px_0px_15px_#00000042]"></div>
            <div className="w-full h-[198px] bg-[#ffffff69] rounded-3xl"></div>
            <p className="text-[24px] font-bold text-center mt-[10px]">name</p>
            <ul className="text-[20px] font-bold">
                <li className="ml-5"> · ... участников</li>
                <li className="ml-5"> · ... активных проектов</li>
            </ul>
            <div className="absolute bottom-[13px] right-[13px] w-[69px] h-[42px] bg-[#00000020] border-l-1 border-t-1 border-[#ffffff67] rounded-4xl px-[15px] py-[15px] [box-shadow:0px_0px_15px_#00000025]">
                <div className="absolute inset-0 border-b-1 border-r-1 border-[#ffffff27] rounded-4xl backdrop-blur-sm -z-1 [box-shadow:inset_0px_0px_15px_#00000042]"></div>
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8.5px] border-l-transparent border-r-[8.5px] border-r-transparent border-t-[9px] border-t-white"></div>
            </div>
        </div>
    );
}

