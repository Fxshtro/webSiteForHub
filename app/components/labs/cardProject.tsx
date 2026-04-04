"use client";

interface CardProjectProps {
  title: string;
  description: string;
}

export default function CardProject({ title, description }: CardProjectProps) {
  return (
    <div className="glass !bg-gradient-to-b from-[#afafaf30] to-[#6f6f6f40] max-w-[474px] px-5 py-6 hover:![box-shadow:0px_0px_50px_#ffffff34,_inset_0px_0px_50px_#ffffff26] duration-200">
      <p className="font-unbounded text-[24px] mb-4 font-black">{title}</p>
      <p className="text-[16px]">{description}</p>

    <button className="glass custom-before hover:![box-shadow:0px_0px_10px_#ffffff34,_inset_0px_0px_10px_#ffffff26] duration-200 !rounded-2xl !bg-[#afafaf30] mt-4 px-[24px] py-[12px] text-[16px] uppercase font-black font-unbounded">подробнее</button>
      
    </div>
  );
}