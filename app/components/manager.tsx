'use client';
import Image from "next/image";

export default function ManagerCard() {
    return (
        <div>
            <div className="glass md:w-[461px] w-[361px] !bg-[#9F9F9F20] px-[21px] pt-[16px] md:pb-9 pb-6 ![box-shadow:0px_0px_250px_#ffffff10]">
                <div className="flex justify-between">
                    <div className="md:text-[24px] text-[18px] text-[#FFFFFF24] w-full text-center">Академия цифрового развития</div>
                    <Image src="/i.svg" width={30} height={30} alt="info" className="cursor-pointer hover:opacity-60"/>
                </div>
                <div className="flex mt-5">
                    <div className="md:w-[130px] w-[110px] md:h-[130px] h-[110px] !bg-[#D9D9D925] !rounded-2xl glass custom-before"></div>
                    <div className="pl-5 flex-1 min-w-0">
                        <div className="font-bold md:text-[32px] text-[22px] md:leading-9 leading-6">Фамилия Имя Отчество</div>
                        <div className="font-medium md:text-[24px] text-[18px] md:leading-7 leading-4">
                              к.ф.н, доцент 
                        <br/> Руководитель академии
                        </div>
                    </div>
                </div>
                <div className="font-unbounded2 md:text-[36px] text-[26px] text-center md:mt-8 mt-4 text-shadow-lg text-shadow-[#000000]">+7 (988) 892-70-02</div>
                <a href="" className="md:text-[36px] text-[26px] text-center w-full inline-block md:leading-9 leading-5 text-shadow-lg text-shadow-[#000000] hover:underline">academy_it@iubip.ru</a>
            </div>
        </div>
    );
}