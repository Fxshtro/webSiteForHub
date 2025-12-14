'use client';

import SimpleCard from "../components/simple-card";

export default function LaboratoriesPage() {
  return (
    <main>
      <div className="container" style={{ paddingTop: '350px', minHeight: '100vh', position: 'relative' }}>
        <div className="figure-container " style={{ position: 'absolute', top: -700, left: '50%', transform: 'translateX(-50%) scale(3) rotate(131deg)', zIndex: '-1' }}>
          <img src="/image/figure.svg" alt="" className="!w-300 !h-300 md:!w-350 md:!h-350 opacity-15"/>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 md:gap-x-10 gap-y-10 md:gap-y-19">
          <SimpleCard text="Лаборатория Frontend разработки" />
          <SimpleCard text="Лаборатория Backend разработки" />
          <SimpleCard text="Лаборатория Mobile разработки" />
          <SimpleCard text="Лаборатория UI/UX дизайна" />
        </div>
      </div>
    </main>
  );
}

