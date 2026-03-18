"use client";
import Image from "next/image";

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
}: ManagerCardProps) {
  return (
    <div>
      <div className="glass md:w-[461px] w-[361px] !bg-[#9F9F9F20] px-[21px] pt-[16px] md:pb-9 pb-6 ![box-shadow:0px_0px_250px_#ffffff10]">
        <div className="flex justify-between">
          <div className="md:text-[24px] text-[18px] text-[#FFFFFF24] w-full text-center">
            Академия цифрового развития
          </div>
          <Image
            src="/i.svg"
            width={30}
            height={30}
            alt="info"
            className="cursor-pointer hover:opacity-60"
            loading="lazy"
            sizes="30px"
          />
        </div>
        <div className="flex mt-5">
          <div className="md:w-[130px] w-[110px] md:h-[130px] h-[110px] !bg-[#D9D9D925] !rounded-2xl glass custom-before">
            {imageSrc && (
              <Image src={imageSrc} alt={name} fill className="object-cover rounded-2xl" />
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
        <div className="font-unbounded md:text-[36px] text-[26px] text-center md:mt-8 mt-4 text-shadow-lg text-shadow-[#000000]">
          {phone}
        </div>
        <a
          href={`mailto:${email}`}
          className="md:text-[36px] text-[26px] text-center w-full inline-block md:leading-9 leading-5 text-shadow-lg text-shadow-[#000000] hover:underline"
        >
          {email}
        </a>
      </div>
    </div>
  );
}
