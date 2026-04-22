"use client";

import { useEffect, useMemo, useState } from "react";
import type { LabPerson } from "../../../DataBase/labs/people";

interface LabPeopleDrawerProps {
  people: LabPerson[];
}

type PeopleCategory = "all" | "recent" | "favorites";

export default function LabPeopleDrawer({ people }: LabPeopleDrawerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PeopleCategory>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [favoritesViewIds, setFavoritesViewIds] = useState<string[]>([]);

  useEffect((): void => {
    const initialFavorites = people.filter((person) => person.isFavorite).map((person) => person.id);
    const storedFavorites = window.localStorage.getItem("lab-people-favorites");
    const storedRecent = window.localStorage.getItem("lab-people-recent");

    setFavoriteIds(storedFavorites ? (JSON.parse(storedFavorites) as string[]) : initialFavorites);
    setRecentIds(storedRecent ? (JSON.parse(storedRecent) as string[]) : []);
  }, [people]);

  useEffect((): void => {
    window.localStorage.setItem("lab-people-favorites", JSON.stringify(favoriteIds));
  }, [favoriteIds]);

  useEffect((): void => {
    window.localStorage.setItem("lab-people-recent", JSON.stringify(recentIds));
  }, [recentIds]);

  useEffect((): (() => void) => {
    const previousOverflow = document.body.style.overflow;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if (isOpen && isMobileViewport) {
      document.body.style.overflow = "hidden";
    }

    return (): void => {
      document.body.style.overflow = previousOverflow || "unset";
    };
  }, [isOpen]);

  const peopleById = useMemo((): Record<string, LabPerson> => {
    return people.reduce<Record<string, LabPerson>>((accumulator, person) => {
      accumulator[person.id] = person;
      return accumulator;
    }, {});
  }, [people]);

  const recentPeople = useMemo((): LabPerson[] => {
    return recentIds.map((id) => peopleById[id]).filter((person): person is LabPerson => Boolean(person));
  }, [peopleById, recentIds]);

  useEffect((): void => {
    if (activeCategory !== "favorites") {
      return;
    }
    setFavoritesViewIds(favoriteIds);
  }, [activeCategory, people]);

  const favoritePeople = useMemo((): LabPerson[] => {
    const idsToRender = activeCategory === "favorites" ? favoritesViewIds : favoriteIds;
    return idsToRender.map((id) => peopleById[id]).filter((person): person is LabPerson => Boolean(person));
  }, [activeCategory, favoriteIds, favoritesViewIds, peopleById]);

  const filteredPeople = useMemo((): LabPerson[] => {
    const source =
      activeCategory === "all"
        ? people
        : activeCategory === "recent"
          ? recentPeople
          : favoritePeople;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return source;
    }
    return source.filter((person) => {
      const byName = person.name.toLowerCase().includes(normalizedQuery);
      const byRole = person.role.toLowerCase().includes(normalizedQuery);
      return byName || byRole;
    });
  }, [activeCategory, favoritePeople, query, recentPeople]);

  const emptyStateMessage = useMemo((): string => {
    if (query.trim()) {
      return "По вашему запросу люди не найдены.";
    }
    if (activeCategory === "favorites") {
      return "У вас нет избранных.";
    }
    if (activeCategory === "recent") {
      return "Вы ещё не заглядывали никому в профиль.";
    }
    return "Список людей пока пуст.";
  }, [activeCategory, query]);

  const toggleFavorite = (personId: string): void => {
    setFavoriteIds((prev) => {
      if (prev.includes(personId)) {
        return prev.filter((id) => id !== personId);
      }
      return [personId, ...prev];
    });
  };

  const markAsRecent = (personId: string): void => {
    setRecentIds((prev) => [personId, ...prev.filter((id) => id !== personId)]);
  };

  const toggleDrawer = (): void => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 right-0 top-[85px] z-40 flex justify-end items-start overflow-hidden">
      <button
        type="button"
        onClick={toggleDrawer}
        className={`pointer-events-auto absolute top-4 z-10 flex h-[44px] w-[82px] items-center justify-center rounded-l-full px-3 text-white text-shadow-lg bg-gradient-to-l from-[#7743d0] to-[#512e8f] shadow-[#00000050] shadow-lg text-shadow-[#00000026] transition-all duration-300 hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56] md:h-[80px] md:w-[100px] md:px-4 ${
          isOpen ? "right-[calc(100vw-2px)] md:right-[388px]" : "right-0"
        }`}
        aria-hidden={isOpen}
        tabIndex={isOpen ? -1 : 0}
        aria-label={isOpen ? "Скрыть список участников" : "Показать список участников"}
      >
        <span className="inline-flex items-center gap-2">
          <span className="text-[18px] font-extrabold leading-none md:text-[22px]">{people.length}</span>
          <i className="fas fa-user text-[12px] md:text-[14px]" />
        </span>
      </button>

      <aside
        className={`pointer-events-auto absolute right-0 top-0 h-[calc(100vh-85px)] w-screen overflow-hidden border-l border-white/20 bg-black/70 px-[20px] backdrop-blur-md transition-transform duration-300 md:w-[390px] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        onWheelCapture={(event): void => {
          event.stopPropagation();
        }}
      >
        <div className="border-b border-white/20 px-0 pb-3 pt-5">
          <div className="mb-3 flex items-center justify-end">
            <button
              type="button"
              onClick={toggleDrawer}
              className="flex h-[30px] w-[30px] items-center justify-center rounded-full border border-white/30 text-white/80 hover:text-white md:hidden"
              aria-label="Закрыть меню людей"
            >
              <i className="fas fa-xmark text-[14px]" />
            </button>
          </div>
          <div className="relative mt-2">
            <i className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Имя, роль или ключевое слово"
              className="h-[42px] w-full rounded-lg border border-white/30 bg-transparent pl-10 pr-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none"
            />
          </div>
        </div>
        <div className="border-b border-white/20 px-0 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-2xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                activeCategory === "all"
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/70 hover:text-white"
              }`}
            >
              Все
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("recent")}
              className={`rounded-2xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                activeCategory === "recent"
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/70 hover:text-white"
              }`}
            >
              Недавно просмотренные
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("favorites")}
              className={`rounded-2xl px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                activeCategory === "favorites"
                  ? "bg-white/20 text-white"
                  : "bg-transparent text-white/70 hover:text-white"
              }`}
            >
              Избранные
            </button>
          </div>
        </div>

        <div className="max-h-[calc(100vh-241px)] space-y-2 overflow-y-auto overscroll-contain px-[20px] py-3 pb-6">
          {filteredPeople.map((person) => (
            <article
              key={person.id}
              className="glass custom-before !rounded-2xl !bg-[#afafaf2b] p-3 duration-200 cursor-pointer select-none hover:![box-shadow:0px_0px_50px_#ffffff34,_inset_0px_0px_50px_#ffffff26]"
              onClick={() => markAsRecent(person.id)}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-white/80 text-black">
                  <i className="fas fa-user text-[14px]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[22px] font-semibold leading-6 text-white">{person.name}</p>
                  <p className="truncate text-[13px] text-white/75">{person.role}</p>
                </div>
                <button
                  type="button"
                  aria-label="Переключить избранное"
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleFavorite(person.id);
                  }}
                >
                  <i
                    className={`${
                      favoriteIds.includes(person.id) ? "fas text-yellow-400" : "far text-white/80"
                    } fa-star text-[14px]`}
                  />
                </button>
              </div>
            </article>
          ))}
          {filteredPeople.length === 0 ? (
            <p className="text-center text-[13px] text-white/70">{emptyStateMessage}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
