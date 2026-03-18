'use client';
import Image from "next/image";

export default function PieIco() {
    return (
        <div className="relative">
            <div className="w-[81px] h-[81px] rounded-full bg-gradient-to-t from-[#5929b1] to-[#6e32de]"></div>
            <div className="absolute left-3.5 top-3 border-l-2 border-t-2 border-[#80808093] backdrop-blur-lg 
            block w-[81px] h-[81px] bg-[#653ABB12] rounded-full"></div>
            <div className="absolute left-3.5 top-3 border-b-2 border-r-2 border-[#64646425]
            block w-[81px] h-[81px] rounded-full"></div>
            <Image src="/Pie_Element.png" width={65} height={1} alt="" role="presentation" className="z-1 absolute top-[4px] left-[44px]"/>
        </div>
    );
}