"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "gama-favoritos";
const CHANGE_EVENT = "gama-favoritos-changed";

type Ids = Array<string | number>;

let cachedRaw: string | null = null;
let cachedIds: Ids = [];

function getSnapshot(): Ids {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedIds = raw ? JSON.parse(raw) : [];
    } catch {
      cachedIds = [];
    }
  }
  return cachedIds;
}

const EMPTY: Ids = [];

function getServerSnapshot(): Ids {
  return EMPTY;
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

function writeIds(ids: Ids) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Favorites persisted in localStorage — this site has no user accounts, so there's nowhere else to store them. */
export function useFavorites() {
  const ids = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isFavorite = useCallback(
    (id: string | number) => ids.some((x) => String(x) === String(id)),
    [ids]
  );

  const toggleFavorite = useCallback((id: string | number) => {
    const current = getSnapshot();
    const exists = current.some((x) => String(x) === String(id));
    const next = exists ? current.filter((x) => String(x) !== String(id)) : [...current, id];
    writeIds(next);
  }, []);

  return { ids, isFavorite, toggleFavorite };
}
