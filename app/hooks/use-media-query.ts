import { useMemo, useSyncExternalStore } from "react";

const createMediaQuerySubscribe = (query: string) => {
  return (onStoreChange: () => void): (() => void) => {
    if (typeof window === "undefined") return (): void => {};

    const mediaQueryList = window.matchMedia(query);
    mediaQueryList.addEventListener("change", onStoreChange);

    return (): void => {
      mediaQueryList.removeEventListener("change", onStoreChange);
    };
  };
};

const createMediaQuerySnapshot = (query: string) => {
  return (): boolean => {
    if (typeof window === "undefined") return false;

    return window.matchMedia(query).matches;
  };
};

export function useMediaQuery(query: string): boolean {
  const subscribe = useMemo(() => createMediaQuerySubscribe(query), [query]);
  const getSnapshot = useMemo(() => createMediaQuerySnapshot(query), [query]);

  return useSyncExternalStore(
    subscribe,
    getSnapshot,
    (): boolean => false,
  );
}
