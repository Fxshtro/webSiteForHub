"use client";

import Image from "next/image";
import { FALLBACK_IMAGE_SRC } from "../../constants/images";

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
  const coverSrc = imageSrc ?? FALLBACK_IMAGE_SRC;
  const coverAlt = imageSrc ? imageAlt : "Изображение-заглушка";
  const isFallbackPortraitSlot = compact && coverSrc === FALLBACK_IMAGE_SRC;

  return (
    <div
      className={`glass flex h-full w-full flex-col rounded-2xl p-[10px] duration-200 hover:![box-shadow:0px_0px_50px_#ffffff1a,_inset_0px_0px_50px_#ffffff1e] ${className}`}
    >
      {compact ? (
        <div className="flex h-full gap-4 p-2">
          <div className="relative h-[179px] w-[134px] shrink-0 overflow-hidden rounded-xl bg-[#BDBDBD] md:h-[205px] md:w-[154px]">
            {isFallbackPortraitSlot ? (
              <div className="absolute left-1/2 top-1/2 h-[134px] w-[179px] -translate-x-1/2 -translate-y-1/2 rotate-90 md:h-[154px] md:w-[205px]">
                <Image src={coverSrc} alt={coverAlt} fill quality={92} className="object-cover" sizes="(max-width: 767px) 134px, 154px" />
              </div>
            ) : (
              <Image src={coverSrc} alt={coverAlt} fill quality={92} className="object-cover" sizes="(max-width: 767px) 134px, 154px" />
            )}
          </div>
          <div className="flex min-w-0 flex-1 flex-col">
            <p className="text-[15px] font-semibold leading-5 break-words md:text-[16px] md:leading-6">{description}</p>
            <div className="mt-auto flex justify-end pt-3">
              <p className="text-[14px] text-[#FFFFFF50] font-medium font-unbounded leading-5 md:text-[16px] md:leading-6">
                {date}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="relative w-full overflow-hidden rounded-t-3xl rounded-b-md bg-[#BDBDBD] aspect-[4/3]">
            <Image src={coverSrc} alt={coverAlt} fill quality={92} className="object-cover" sizes={imageSizes} />
          </div>
          <p className="pt-[30px] px-[40px] pb-[30px] text-[16px] font-semibold leading-6 break-words">{description}</p>
          <div className="mb-[6px] mt-auto flex justify-end">
            <p className="text-[16px] mr-[13px] text-[#FFFFFF50] font-medium font-unbounded leading-6">{date}</p>
          </div>
        </>
      )}
    </div>
  );
}
