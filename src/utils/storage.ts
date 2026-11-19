import { UserResponses } from './scoring';

export type QuizMode = 'quick' | 'full';

export interface SavedProgress {
    mode: QuizMode;
    questionIds: number[];
    currentIndex: number;
    responses: UserResponses;
}

const PROGRESS_KEY = 'turkiyeideolojik:progress:v2';
const SOUND_KEY = 'turkiyeideolojik:sound';

const safe = <T,>(fn: () => T, fallback: T): T => {
    try { return fn(); } catch { return fallback; }
};

export const loadProgress = (): SavedProgress | null =>
    safe(() => {
        const raw = localStorage.getItem(PROGRESS_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw) as SavedProgress;
        if (!Array.isArray(data.questionIds) || typeof data.currentIndex !== 'number') return null;
        return data.currentIndex > 0 ? data : null;
    }, null);

export const saveProgress = (progress: SavedProgress) =>
    safe(() => localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress)), undefined);

export const clearProgress = () => safe(() => localStorage.removeItem(PROGRESS_KEY), undefined);

export const loadSoundEnabled = (): boolean =>
    safe(() => localStorage.getItem(SOUND_KEY) !== 'off', true);

export const saveSoundEnabled = (enabled: boolean) =>
    safe(() => localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off'), undefined);
