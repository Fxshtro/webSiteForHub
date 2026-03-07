'use client';
import Image from "next/image";
import { useState, useEffect } from "react";

interface CardProps {
    name: string;
    participants: number;
    project: number;
    img: string;
}

export default function Card({
    name, participants, project, img
}: CardProps) {
    return (
        <div className="w-[354px] h-[353px] glass px-[12px] pt-[12px] pb-[12px] relative">
            <div className="w-full h-[198px] rounded-3xl">
            <Image 
                src={img}
                alt={name}
                height={1000}
                width={1000}
                className="object-cover rounded-3xl [box-shadow:0px_4px_9px_#00000052]"
            />
            </div>
            <p className="text-[24px] font-bold text-center mt-[10px]">{name || "name"}</p>
            <ul className="text-[20px] font-bold">
                <li className="ml-5"> · {participants || "..."} участников</li>
                <li className="ml-5"> · {project || "..."} активных проектов</li>
            </ul>
            <div className="!absolute glass bottom-[13px] right-[13px] w-[69px] h-[42px]">
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8.5px] border-l-transparent border-r-[8.5px] border-r-transparent border-t-[9px] border-t-white"></div>
            </div>
        </div>
    );
}

