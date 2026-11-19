import { UserResponses } from './quiz';

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
    safe(() => localStorage.getItem(SOUND_KEY) === 'on', false);

export const saveSoundEnabled = (enabled: boolean) =>
    safe(() => localStorage.setItem(SOUND_KEY, enabled ? 'on' : 'off'), undefined);

const STATS_OPT_OUT_KEY = 'turkiyeideolojik:stats-opt-out';

/** Results are added to the anonymous statistics unless the visitor opted out. */
export const loadStatsOptIn = (): boolean =>
    safe(() => localStorage.getItem(STATS_OPT_OUT_KEY) !== '1', true);

export const saveStatsOptIn = (optIn: boolean) =>
    safe(() => (optIn ? localStorage.removeItem(STATS_OPT_OUT_KEY) : localStorage.setItem(STATS_OPT_OUT_KEY, '1')), undefined);
