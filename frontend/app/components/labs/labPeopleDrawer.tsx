"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent, MouseEvent, ReactNode, WheelEvent } from "react";
import type { LabPerson } from "../../../DataBase/labs/people";

interface LabPeopleDrawerProps {
  labSlug: string;
  people: LabPerson[];
}

type PeopleCategory = "all" | "recent" | "favorites";
const FAVORITES_STORAGE_KEY = "lab-people-favorites";
const RECENT_STORAGE_KEY = "lab-people-recent";
const LAST_PROFILE_STORAGE_PREFIX = "lab-people-last-profile";

interface ProfilePanelProps {
  labSlug: string;
  person: LabPerson | undefined;
  isOpen: boolean;
  isContentVisible: boolean;
  hasHandle: boolean;
  onClose: () => void;
  onToggle: () => void;
  onWheelCapture: (_event: WheelEvent<HTMLElement>) => void;
}

interface ProfileSectionProps {
  iconClassName: string;
  title: string;
  children: ReactNode;
}

interface PeopleListItemProps {
  person: LabPerson;
  isActive: boolean;
  isFavorite: boolean;
  onPersonClick: (_event: MouseEvent<HTMLElement>) => void;
  onFavoriteClick: (_event: MouseEvent<HTMLButtonElement>) => void;
}

function readStoredIds(key: string, fallback: string[]): string[] {
  try {
    const storedValue = window.localStorage.getItem(key);
    const parsedValue: unknown = storedValue ? JSON.parse(storedValue) : fallback;
    return Array.isArray(parsedValue) ? parsedValue.filter((id): id is string => typeof id === "string") : fallback;
  } catch {
    return fallback;
  }
}

function ProfileSection({ iconClassName, title, children }: ProfileSectionProps): React.JSX.Element {
  return (
    <section className="space-y-3">
      <h3 className="flex items-center gap-2 text-[20px] font-extrabold text-white md:text-[22px]">
        <i className={`fas ${iconClassName} text-[17px] text-white/90`} />
        {title}
      </h3>
      {children}
    </section>
  );
}

function ProfilePanel({ labSlug, person, isOpen, isContentVisible, hasHandle, onClose, onToggle, onWheelCapture }: ProfilePanelProps): React.JSX.Element {
  const shouldRenderHandle = hasHandle && Boolean(person);

  return (
    <div
      className={`pointer-events-auto absolute left-0 top-[85px] z-50 flex h-[calc(100%-85px)] items-start transition-transform duration-300 ease-out ${
        isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-[520px]"
      }`}
    >
      <aside
        className="flex h-full w-screen flex-col overflow-hidden overflow-x-hidden border-r border-white/20 bg-black/55 text-white shadow-2xl backdrop-blur-xl md:w-[520px]"
        onWheelCapture={onWheelCapture}
      >
        <div className="flex items-center justify-end pr-5 pt-4 md:hidden">
          <button
            type="button"
            onClick={onClose}
            className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/30 text-white/80 transition-colors hover:text-white"
            aria-label="Закрыть профиль"
          >
            <i className="fas fa-xmark text-[20px]" />
          </button>
        </div>

        <div
          className={`flex min-h-0 flex-1 flex-col transition-opacity duration-200 ease-out ${
            isContentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          {person ? <PersonProfile labSlug={labSlug} person={person} /> : null}
        </div>
      </aside>

      {shouldRenderHandle ? (
        <button
          type="button"
          onClick={onToggle}
          className="mt-4 hidden h-[80px] w-[100px] items-center justify-center rounded-r-full bg-gradient-to-r from-[#7743d0] to-[#512e8f] px-4 text-white shadow-lg shadow-[#00000050] text-shadow-lg text-shadow-[#00000026] transition-all duration-300 hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56] md:flex"
          aria-label={isOpen ? "Скрыть профиль участника" : "Показать последний профиль участника"}
        >
          <i className={`fas ${isOpen ? "fa-chevron-left" : "fa-user-tie"} text-[20px]`} />
        </button>
      ) : null}
    </div>
  );
}

function PersonProfile({ labSlug, person }: { labSlug: string; person: LabPerson }): React.JSX.Element {
  return (
    <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain pb-8">
      <div className="px-7 pb-8 pt-2 md:pt-7">
        <div className="flex items-start gap-4">
          <div className="glass custom-before flex h-[88px] w-[88px] shrink-0 items-center justify-center !rounded-2xl !bg-gradient-to-b !from-[#afafaf30] !to-[#6f6f6f40] shadow-xl md:h-[102px] md:w-[102px]">
            <i className={`fas ${person.avatarIcon} text-[42px] text-white/85 md:text-[48px]`} />
          </div>
          <div className="pt-2">
            <h2 className="text-[25px] font-extrabold leading-tight text-white md:text-[30px]">{person.name}</h2>
            <p className="mt-2 text-[14px] font-semibold text-white/75 md:text-[15px]">{person.role}</p>
          </div>
        </div>
      </div>

      <div className="relative h-[88px] overflow-hidden md:h-[104px]">
        <Image
          src="/images/decor/glists2.svg"
          alt=""
          role="presentation"
          fill
          sizes="520px"
          className="scale-x-150 scale-y-110 object-fill"
        />
      </div>

      <div className="max-w-full space-y-7 overflow-x-hidden px-5 pb-2 pt-4 md:px-7">
        {person.directions.length > 0 && (
          <ProfileSection iconClassName="fa-puzzle-piece" title="Направления">
            <div className="glass custom-before flex flex-wrap gap-3 !rounded-2xl !bg-gradient-to-b !from-[#afafaf30] !to-[#6f6f6f40] p-5">
              {person.directions.map((direction) => (
                <span
                  key={direction}
                  className="glass custom-before max-w-full !rounded-2xl !bg-[#afafaf30] px-[20px] py-[10px] text-[15px] font-semibold text-white/90 md:text-[16px]"
                >
                  {direction}
                </span>
              ))}
            </div>
          </ProfileSection>
        )}

        {person.projects.length > 0 && (
          <ProfileSection iconClassName="fa-briefcase" title="Проекты">
            <div className="grid gap-3 md:grid-cols-2">
              {person.projects.map((project) => (
                <Link
                  key={`${person.id}-${project.projectId}`}
                  href={`/labs/${labSlug}/projects/${project.projectId}`}
                  className="glass custom-before flex h-full min-h-[115px] flex-col !rounded-2xl !bg-gradient-to-b !from-[#afafaf30] !to-[#6f6f6f40] px-5 pb-5 pt-4 duration-200 hover:![box-shadow:0px_0px_30px_#ffffff34,_inset_0px_0px_30px_#ffffff20]"
                >
                  <p className="break-words text-[16px] font-bold text-white md:text-[17px]">{project.title}</p>
                  <div className="mt-auto flex flex-wrap gap-2 pt-4">
                    {project.roles.map((role) => (
                      <span key={`${project.projectId}-${role}`} className="glass custom-before !rounded-2xl !bg-[#afafaf30] px-3 py-1 text-[13px] font-semibold text-white/80 md:text-[14px]">
                        {role}
                      </span>
                    ))}
                  </div>
                </Link>
              ))}
            </div>
          </ProfileSection>
        )}

        {person.roles.length > 0 && (
          <ProfileSection iconClassName="fa-briefcase" title="Роли">
            <div className="glass custom-before flex flex-wrap gap-3 !rounded-2xl !bg-gradient-to-b !from-[#afafaf30] !to-[#6f6f6f40] p-5">
              {person.roles.map((role) => (
                <span
                  key={role}
                  className="glass custom-before flex min-w-[180px] max-w-full flex-1 items-center justify-center !rounded-2xl !bg-[#afafaf30] px-[24px] py-[12px] text-center font-unbounded text-[14px] font-black uppercase text-white md:text-[15px]"
                >
                  {role}
                </span>
              ))}
            </div>
          </ProfileSection>
        )}

        {person.metaverseUrl.length > 0 && (
          <ProfileSection iconClassName="fa-globe" title="Метавселенная">
            <a
              href={person.metaverseUrl}
              target="_blank"
              rel="noreferrer"
              className="glass custom-before flex max-w-full items-center justify-between gap-4 !rounded-2xl !bg-gradient-to-b !from-[#afafaf30] !to-[#6f6f6f40] px-5 pb-5 pt-4 text-[16px] font-semibold text-white/90 underline underline-offset-4 md:text-[17px]"
            >
              <span className="truncate">{person.metaverseUrl.replace("https://", "")}</span>
              <i className="fas fa-up-right-from-square shrink-0 text-[18px]" />
            </a>
          </ProfileSection>
        )}
      </div>
    </div>
  );
}

function PeopleListItem({ person, isActive, isFavorite, onPersonClick, onFavoriteClick }: PeopleListItemProps): React.JSX.Element {
  return (
    <article
      data-person-id={person.id}
      className={`glass custom-before cursor-pointer select-none !rounded-2xl p-3 duration-200 hover:![box-shadow:0px_0px_50px_#ffffff34,_inset_0px_0px_50px_#ffffff26] ${
        isActive ? "!bg-[#afafaf2b] md:!bg-[#7641d74a]" : "!bg-[#afafaf2b]"
      }`}
      onClick={onPersonClick}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-white/80 text-black">
          <i className={`fas ${person.avatarIcon} text-[14px]`} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-[22px] font-semibold leading-6 text-white">{person.name}</p>
          <p className="truncate text-[13px] text-white/75">{person.role}</p>
        </div>
        <button type="button" data-person-id={person.id} aria-label="Переключить избранное" onClick={onFavoriteClick}>
          <i className={`${isFavorite ? "fas text-yellow-400" : "far text-white/80"} fa-star text-[14px]`} />
        </button>
      </div>
    </article>
  );
}

export default function LabPeopleDrawer({ labSlug, people }: LabPeopleDrawerProps): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profilePersonId, setProfilePersonId] = useState<string | null>(null);
  const [isProfileContentVisible, setIsProfileContentVisible] = useState(false);
  const [hasProfileHandle, setHasProfileHandle] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<PeopleCategory>("all");
  const [favoriteIds, setFavoriteIds] = useState<string[]>(
    people.filter((person) => person.isFavorite).map((person) => person.id),
  );
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const isPeopleStorageHydratedRef = useRef(false);
  const profileHideTimeoutRef = useRef<number | null>(null);
  const profileRevealTimeoutRef = useRef<number | null>(null);
  const profileLabSlug = useMemo((): string => labSlug.split(":")[0] ?? labSlug, [labSlug]);
  const favoritesStorageKey = useMemo(
    (): string => `${FAVORITES_STORAGE_KEY}:${profileLabSlug}`,
    [profileLabSlug],
  );
  const recentStorageKey = useMemo(
    (): string => `${RECENT_STORAGE_KEY}:${profileLabSlug}`,
    [profileLabSlug],
  );
  const lastProfileStorageKey = useMemo((): string => `${LAST_PROFILE_STORAGE_PREFIX}:${labSlug}`, [labSlug]);

  const clearProfileAnimationTimers = useCallback((): void => {
    if (profileHideTimeoutRef.current) {
      window.clearTimeout(profileHideTimeoutRef.current);
      profileHideTimeoutRef.current = null;
    }

    if (profileRevealTimeoutRef.current) {
      window.clearTimeout(profileRevealTimeoutRef.current);
      profileRevealTimeoutRef.current = null;
    }
  }, []);

  useEffect((): (() => void) => {
    isPeopleStorageHydratedRef.current = false;

    const timeoutId = window.setTimeout((): void => {
      const initialFavorites = people.filter((person) => person.isFavorite).map((person) => person.id);
      const parsedFavorites = readStoredIds(favoritesStorageKey, initialFavorites);
      const parsedRecent = readStoredIds(recentStorageKey, []);

      isPeopleStorageHydratedRef.current = true;
      setFavoriteIds(parsedFavorites);
      setRecentIds(parsedRecent);
    }, 0);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, [favoritesStorageKey, people, recentStorageKey]);

  useEffect((): void => {
    if (!isPeopleStorageHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(favoritesStorageKey, JSON.stringify(favoriteIds));
  }, [favoriteIds, favoritesStorageKey]);

  useEffect((): void => {
    if (!isPeopleStorageHydratedRef.current) {
      return;
    }

    window.localStorage.setItem(recentStorageKey, JSON.stringify(recentIds));
  }, [recentIds, recentStorageKey]);

  useEffect((): (() => void) => {
    const previousOverflow = document.body.style.overflow;
    const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;

    if ((isOpen || isProfileOpen) && isMobileViewport) {
      document.body.style.overflow = "hidden";
    }

    return (): void => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isProfileOpen]);

  useEffect((): (() => void) => {
    return (): void => {
      clearProfileAnimationTimers();
    };
  }, [clearProfileAnimationTimers]);

  const peopleById = useMemo<Record<string, LabPerson>>((): Record<string, LabPerson> => {
    return people.reduce<Record<string, LabPerson>>((accumulator, person) => {
      accumulator[person.id] = person;
      return accumulator;
    }, {});
  }, [people]);

  useEffect((): (() => void) => {
    const timeoutId = window.setTimeout((): void => {
      const storedPersonId = window.localStorage.getItem(lastProfileStorageKey);
      const storedPerson = storedPersonId ? peopleById[storedPersonId] : undefined;

      if (!storedPersonId || !storedPerson) {
        setProfilePersonId(null);
        setHasProfileHandle(false);
        setIsProfileOpen(false);
        setIsProfileContentVisible(false);
        return;
      }

      setProfilePersonId(storedPersonId);
      setHasProfileHandle(true);
      setIsProfileOpen(false);
      setIsProfileContentVisible(true);
    }, 0);

    return (): void => {
      window.clearTimeout(timeoutId);
    };
  }, [lastProfileStorageKey, peopleById]);

  const recentPeople = useMemo<LabPerson[]>((): LabPerson[] => {
    return recentIds.map((id) => peopleById[id]).filter((person): person is LabPerson => Boolean(person));
  }, [peopleById, recentIds]);

  const favoritePeople = useMemo<LabPerson[]>((): LabPerson[] => {
    return favoriteIds.map((id) => peopleById[id]).filter((person): person is LabPerson => Boolean(person));
  }, [favoriteIds, peopleById]);

  const favoriteIdSet = useMemo<Set<string>>((): Set<string> => new Set(favoriteIds), [favoriteIds]);

  const filteredPeople = useMemo((): LabPerson[] => {
    const source = activeCategory === "all" ? people : activeCategory === "recent" ? recentPeople : favoritePeople;
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return source;
    }
    return source.filter((person) => {
      const byName = person.name.toLowerCase().includes(normalizedQuery);
      const byRole = person.role.toLowerCase().includes(normalizedQuery);
      return byName || byRole;
    });
  }, [activeCategory, favoritePeople, people, query, recentPeople]);

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

  const toggleFavorite = useCallback((personId: string): void => {
    setFavoriteIds((prev) => {
      if (prev.some((id) => id === personId)) {
        return prev.filter((id) => id !== personId);
      }
      return [personId, ...prev];
    });
  }, []);

  const markAsRecent = useCallback((personId: string): void => {
    setRecentIds((prev) => [personId, ...prev.filter((id) => id !== personId)]);
  }, []);

  const setProfileWithAnimation = useCallback(
    (personId: string): void => {
      clearProfileAnimationTimers();

      if (!profilePersonId || profilePersonId === personId || !isProfileContentVisible) {
        setProfilePersonId(personId);
        profileRevealTimeoutRef.current = window.setTimeout((): void => {
          setIsProfileContentVisible(true);
          profileRevealTimeoutRef.current = null;
        }, 20);
        return;
      }

      setIsProfileContentVisible(false);
      profileHideTimeoutRef.current = window.setTimeout((): void => {
        setProfilePersonId(personId);
        profileHideTimeoutRef.current = null;

        profileRevealTimeoutRef.current = window.setTimeout((): void => {
          setIsProfileContentVisible(true);
          profileRevealTimeoutRef.current = null;
        }, 20);
      }, 200);
    },
    [clearProfileAnimationTimers, isProfileContentVisible, profilePersonId],
  );

  const openProfile = useCallback(
    (personId: string): void => {
      if (!peopleById[personId]) {
        return;
      }

      markAsRecent(personId);
      setProfileWithAnimation(personId);
      setHasProfileHandle(true);
      setIsProfileOpen(true);
      window.localStorage.setItem(lastProfileStorageKey, personId);
    },
    [lastProfileStorageKey, markAsRecent, peopleById, setProfileWithAnimation],
  );

  const toggleDrawer = useCallback((): void => {
    setIsOpen((prev) => !prev);
  }, []);

  const toggleProfile = useCallback((): void => {
    setIsProfileOpen((prev) => !prev);
  }, []);

  const closeProfile = useCallback((): void => {
    setIsProfileOpen(false);
  }, []);

  const stopScrollPropagation = useCallback((event: WheelEvent<HTMLElement>): void => {
    event.stopPropagation();
  }, []);

  const handleSearchChange = useCallback((event: ChangeEvent<HTMLInputElement>): void => {
    setQuery(event.target.value);
  }, []);

  const handleCategoryClick = useCallback((event: MouseEvent<HTMLButtonElement>): void => {
    const category = event.currentTarget.dataset.category as PeopleCategory | undefined;
    if (!category) {
      return;
    }
    setActiveCategory(category);
  }, []);

  const handlePersonClick = useCallback(
    (event: MouseEvent<HTMLElement>): void => {
      const personId = event.currentTarget.dataset.personId;
      if (!personId) {
        return;
      }
      openProfile(personId);
    },
    [openProfile],
  );

  const handleFavoriteClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>): void => {
      event.stopPropagation();
      const personId = event.currentTarget.dataset.personId;
      if (!personId) {
        return;
      }
      toggleFavorite(personId);
    },
    [toggleFavorite],
  );

  const selectedPerson = profilePersonId ? peopleById[profilePersonId] : undefined;
  const selectedPersonId = isProfileOpen ? selectedPerson?.id ?? null : null;

  return (
    <div className="pointer-events-none fixed inset-0 z-40 flex items-start justify-end overflow-hidden">
      <ProfilePanel
        labSlug={profileLabSlug}
        person={selectedPerson}
        isOpen={isProfileOpen}
        isContentVisible={isProfileContentVisible}
        hasHandle={hasProfileHandle}
        onClose={closeProfile}
        onToggle={toggleProfile}
        onWheelCapture={stopScrollPropagation}
      />

      <div
        className={`pointer-events-auto absolute right-0 top-[85px] flex h-[calc(100%-85px)] items-start transition-transform duration-300 ease-out ${
          isOpen ? "translate-x-0" : "translate-x-[calc(100%-82px)] md:translate-x-[390px]"
        }`}
      >
        <button
          type="button"
          onClick={toggleDrawer}
          className="mt-4 flex h-[44px] w-[82px] items-center justify-center rounded-l-full px-3 text-white text-shadow-lg bg-gradient-to-l from-[#7743d0] to-[#512e8f] shadow-[#00000050] shadow-lg text-shadow-[#00000026] transition-all duration-300 hover:![box-shadow:0px_0px_10px_#ffffff44,_inset_0px_0px_20px_#ffffff56] md:h-[80px] md:w-[100px] md:px-4"
          aria-label={isOpen ? "Скрыть список участников" : "Показать список участников"}
        >
          <span className="inline-flex items-center gap-2">
            <span className="text-[18px] font-extrabold leading-none md:text-[22px]">{people.length}</span>
            <i className="fas fa-user text-[12px] md:text-[14px]" />
          </span>
        </button>

        <aside
          className="flex h-full w-screen flex-col overflow-hidden border-l border-white/20 bg-black/70 px-[20px] backdrop-blur-md md:w-[390px]"
          onWheelCapture={stopScrollPropagation}
          aria-label="Список участников лаборатории"
        >
          <div className="border-b border-white/20 px-0 pb-3 pt-5">
            <div className="mb-3 flex items-center justify-end">
              <button
                type="button"
                onClick={toggleDrawer}
                className="flex h-[42px] w-[42px] items-center justify-center rounded-full border border-white/30 text-white/80 hover:text-white md:hidden"
                aria-label="Закрыть меню людей"
              >
                <i className="fas fa-xmark text-[20px]" />
              </button>
            </div>
            <div className="relative mt-2">
              <i className="fas fa-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/45" />
              <input
                type="search"
                value={query}
                onChange={handleSearchChange}
                placeholder="Имя, роль или ключевое слово"
                aria-label="Поиск участника по имени или роли"
                className="h-[42px] w-full rounded-lg border border-white/30 bg-transparent pl-10 pr-3 text-[14px] text-white placeholder:text-white/40 focus:outline-none"
              />
            </div>
          </div>
          <div className="border-b border-white/20 px-0 py-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                data-category="all"
                onClick={handleCategoryClick}
                aria-pressed={activeCategory === "all"}
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
                data-category="recent"
                onClick={handleCategoryClick}
                aria-pressed={activeCategory === "recent"}
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
                data-category="favorites"
                onClick={handleCategoryClick}
                aria-pressed={activeCategory === "favorites"}
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

          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-[20px] py-3 pb-6">
            {filteredPeople.map((person) => (
              <PeopleListItem
                key={person.id}
                person={person}
                isActive={selectedPersonId === person.id}
                isFavorite={favoriteIdSet.has(person.id)}
                onPersonClick={handlePersonClick}
                onFavoriteClick={handleFavoriteClick}
              />
            ))}
            {filteredPeople.length === 0 ? (
              <p className="text-center text-[13px] text-white/70">{emptyStateMessage}</p>
            ) : null}
          </div>
        </aside>
      </div>
    </div>
  );
}
