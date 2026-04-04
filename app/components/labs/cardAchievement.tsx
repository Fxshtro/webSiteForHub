"use client";

import Image from "next/image";

export interface CardAchievementProps {
  description: string;
  date: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  imageSizes?: string;
  compact?: boolean;
}

export default function CardAchievement({
  description,
  date,
  imageSrc,
  imageAlt = "",
  className = "max-w-[676px] mx-auto",
  imageSizes = "676px",
  compact = false,
}: CardAchievementProps): React.JSX.Element {
  return (
    <div
      className={`glass rounded-2xl w-full p-[10px] hover:![box-shadow:0px_0px_50px_#ffffff1a,_inset_0px_0px_50px_#ffffff1e] duration-200 ${className}`}
    >
      <div
        className={`relative w-full overflow-hidden rounded-t-3xl rounded-b-md bg-[#BDBDBD] ${
          compact ? "h-[134px]" : "h-[191px]"
        }`}
      >
        {imageSrc ? (
          <Image src={imageSrc} alt={imageAlt} fill className="object-cover" sizes={imageSizes} />
        ) : null}
      </div>
      <p
        className={`text-[16px] font-semibold leading-6 ${
          compact ? "pt-5 px-6 pb-5" : "pt-[30px] px-[40px] pb-[30px]"
        }`}
      >
        {description}
      </p>
      <div className="flex justify-end mb-[6px]">
        <p className="text-[16px] mr-[13px] text-[#FFFFFF50] font-medium font-unbounded leading-6">{date}</p>
      </div>
    </div>
  );
}
