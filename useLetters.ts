import { useState, useEffect } from "react";
import type { Letter } from "../types/letter";

const STORAGE_KEY = "time_locked_letters";

function loadFromStorage(): Letter[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Letter[];
  } catch {
    return [];
  }
}

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>(() => loadFromStorage());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(letters));
  }, [letters]);

  function addLetter(draft: Omit<Letter, "id" | "createdAt">) {
    const newLetter: Letter = {
      ...draft,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setLetters((prev) => [newLetter, ...prev]);
  }

  function deleteLetter(id: string) {
    setLetters((prev) => prev.filter((l) => l.id !== id));
  }

  return { letters, addLetter, deleteLetter };
}
