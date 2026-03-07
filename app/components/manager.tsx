'use client';
import Image from "next/image";
import { useState, useEffect } from "react";

export default function ManagerCard() {
    return (
        <div>
            <div className="glass w-[461px] !bg-[#9F9F9F20] px-[21px] pt-[16px] pb-9 ![box-shadow:0px_0px_250px_#ffffff10]">
                <div className="flex justify-between">
                    <div className="text-[24px] text-[#FFFFFF24] w-full text-center">Академия цифрового развития</div>
                    <Image src="/i.svg" width={30} height={30} alt=""/>
                </div>
                <div className="flex mt-5">
                    <div className="w-[130px] h-[130px] !bg-[#D9D9D925] !rounded-2xl glass custom-before"></div>
                    <div className="pl-5 flex-1 min-w-0">
                        <div className="font-bold text-[32px] leading-9">Фамилия Имя Отчество</div>
                        <div className="font-medium text-[24px] leading-7">
                              к.ф.н, доцент 
                        <br/> Руководитель академии
                        </div>
                    </div>
                </div>
                <div className="font-unbounded2 text-[36px] text-center mt-8 text-shadow-lg text-shadow-[#000000]">+7 (988) 892-70-02</div>
                <a href="" className="text-[36px] text-center w-full inline-block leading-9 text-shadow-lg text-shadow-[#000000]">academy_it@iubip.ru</a>
            </div>
        </div>
    );
}