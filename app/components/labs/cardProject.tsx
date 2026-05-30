"use client";

import Link from "next/link";

interface CardProjectProps {
  title: string;
  description: string;
  minHeight?: number;
  href?: string;
}

export default function CardProject({
  title,
  description,
  minHeight,
  href,
}: CardProjectProps): React.JSX.Element {
  return (
    <div
      data-project-card
      style={minHeight ? { minHeight: `${minHeight}px` } : undefined}
      className="glass flex h-full w-full max-w-[474px] flex-col !bg-gradient-to-b from-[#afafaf20] to-[#6f6f6f30] px-5 py-6 duration-200 hover:![box-shadow:0px_0px_50px_#ffffff34,_inset_0px_0px_50px_#ffffff26]"
    >
      <p className="font-unbounded text-[24px] mb-4 font-black">{title}</p>
      <p className="text-[16px]">{description}</p>

      <div className="mt-auto">
        {href ? (
          <Link
            href={href}
            aria-label={`Подробнее о проекте ${title}`}
            className="glass custom-before mt-4 inline-flex hover:![box-shadow:0px_0px_10px_#ffffff34,_inset_0px_0px_10px_#ffffff26] duration-200 !rounded-2xl !bg-[#afafaf30] px-[24px] py-[12px] text-[16px] uppercase font-black font-unbounded"
          >
            подробнее
          </Link>
        ) : (
          <button
            type="button"
            aria-label={`Подробнее о проекте ${title}`}
            className="glass custom-before mt-4 hover:![box-shadow:0px_0px_10px_#ffffff34,_inset_0px_0px_10px_#ffffff26] duration-200 !rounded-2xl !bg-[#afafaf30] px-[24px] py-[12px] text-[16px] uppercase font-black font-unbounded"
          >
            подробнее
          </button>
        )}
      </div>
    </div>
  );
}