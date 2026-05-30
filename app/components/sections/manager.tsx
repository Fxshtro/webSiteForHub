"use client";
import Image from "next/image";
import { FALLBACK_IMAGE_SRC } from "../../constants/images";

export interface ManagerCardProps {
  name: string;
  title: string;
  degree: string;
  phone: string;
  email: string;
  imageSrc?: string;
}

export default function ManagerCard({
  name = "Фамилия Имя Отчество",
  title = "Руководитель академии",
  degree = "к.ф.н, доцент",
  phone = "+7 (988) 892-70-02",
  email = "academy_it@iubip.ru",
  imageSrc,
}: ManagerCardProps): React.JSX.Element {
  const portraitSrc = imageSrc ?? FALLBACK_IMAGE_SRC;
  const isFallbackPortrait = portraitSrc === FALLBACK_IMAGE_SRC;

  return (
    <div className="glass mx-auto flex h-full min-h-full w-full max-w-[361px] flex-col self-stretch md:max-w-[461px] !bg-[#9F9F9F20] px-[21px] pt-[16px] md:pb-9 pb-6 ![box-shadow:0px_0px_250px_#ffffff10]">
        <div className="flex justify-between">
          <div className="md:text-[24px] text-[18px] text-[#FFFFFF24] w-full text-center">
            Академия цифрового развития
          </div>
          <Image
            src="/icons/i.svg"
            width={30}
            height={30}
            alt="info"
            className="cursor-pointer hover:opacity-60"
            loading="lazy"
            sizes="30px"
          />
        </div>
        <div className="flex mt-5">
          <div className="relative md:w-[130px] w-[110px] md:h-[173.33px] h-[146.67px] !bg-[#D9D9D925] !rounded-2xl glass custom-before overflow-hidden">
            {isFallbackPortrait ? (
              <div className="absolute left-1/2 top-1/2 h-[110px] w-[146.67px] -translate-x-1/2 -translate-y-1/2 rotate-90 md:h-[130px] md:w-[173.33px]">
                <Image
                  src={portraitSrc}
                  alt="Изображение-заглушка"
                  fill
                  quality={92}
                  className="object-cover"
                  sizes="(max-width: 767px) 110px, 130px"
                />
              </div>
            ) : (
              <Image
                src={portraitSrc}
                alt={name}
                fill
                quality={92}
                className="object-cover rounded-2xl"
                sizes="(max-width: 767px) 110px, 130px"
              />
            )}
          </div>
          <div className="pl-5 flex-1 min-w-0">
            <div className="font-bold md:text-[32px] text-[22px] md:leading-9 leading-6">
              {name}
            </div>
            <div className="font-medium md:text-[24px] text-[18px] md:leading-7 leading-4">
              {degree}
              <br /> {title}
            </div>
          </div>
        </div>
        <div className="mt-auto pt-4 md:pt-8">
          <div className="font-unbounded text-center text-[26px] text-shadow-lg text-shadow-[#000000] md:text-[36px]">
            {phone}
          </div>
          <a
            href={`mailto:${email}`}
            className="inline-block w-full text-center text-[26px] leading-5 text-shadow-lg text-shadow-[#000000] hover:underline md:text-[36px] md:leading-9"
          >
            {email}
          </a>
        </div>
    </div>
  );
}
