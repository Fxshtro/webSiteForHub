'use client';
import Image from "next/image";
import Link from "next/link";

interface CardProps {
    name: string;
    participants: number;
    project: number;
    img: string;
}

export default function Card({name = "name", participants = 0, project = 0, img = "/default-image.jpg"}: CardProps) {
    return (
        <Link href="" className="w-[354px] h-[353px] glass px-[12px] pt-[12px] pb-[12px] relative hover:![box-shadow:0px_0px_50px_#ffffff44,_inset_0px_0px_50px_#ffffff56] duration-200">
            <div className="w-full h-[198px] rounded-3xl">
            <Image 
                src={img}
                alt={`Изображение для карточки ${name}`}
                height={1000}
                width={1000}
                className="object-cover rounded-3xl [box-shadow:0px_4px_9px_#00000052]"
            />
            </div>
            <p className="text-[24px] font-bold text-center mt-[10px]">{name}</p>
            <ul className="text-[20px] font-bold">
                <li className="ml-5"> · {participants} участников</li>
                <li className="ml-5"> · {project} активных проектов</li>
            </ul>
            <div className="!absolute glass bottom-[13px] right-[13px] w-[69px] h-[42px] hover:![box-shadow:0px_0px_50px_#ffffff35,_inset_0px_0px_15px_#ffffffd9] duration-200">
                <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-0 h-0 border-l-[8.5px] border-l-transparent border-r-[8.5px] border-r-transparent border-t-[9px] border-t-white"></div>
            </div>
        </Link>
    );
}

