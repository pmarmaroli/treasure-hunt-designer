import { useEffect, useRef, useCallback } from 'react';

const STORAGE_KEY = 'treasureHuntDraft';
const DEBOUNCE_MS = 500;

export type SavedDraft = {
  treasureHunt: {
    title: string;
    participants: Array<{ name: string; secret: string; circuit: number[]; code: string }>;
    locations: Array<{ name: string; clue: string; useClue: boolean }>;
    riddles: Array<{ text: string; answer: string; instruction: string; digit: string }>;
  };
  participantCount: number;
  riddleCount: number;
  createStep: number;
  currentParticipantIndex: number;
  currentLocationIndex: number;
  currentRiddleIndex: number;
  tempParticipant: { name: string; secret: string };
  tempLocation: { name: string; clue: string; useClue: boolean };
  tempRiddle: { text: string; answer: string; instruction: string; digit: string };
  savedAt: number;
};

export function loadSavedDraft(): SavedDraft | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedDraft;
    // Basic validation
    if (!parsed.treasureHunt || typeof parsed.createStep !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSavedDraft(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useAutoSave(draft: Omit<SavedDraft, 'savedAt'> | null): void {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const save = useCallback(() => {
    if (!draft) return;
    const toSave: SavedDraft = { ...draft, savedAt: Date.now() };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // Storage full or unavailable — silently ignore
    }
  }, [draft]);

  useEffect(() => {
    if (!draft) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, DEBOUNCE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [draft, save]);
}
