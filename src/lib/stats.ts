import { ideologies, IdeologyId } from '@/data/ideologies';

/*
 * Anonymous, aggregate-only result statistics.
 *
 * Privacy by design: the server never stores anything about an individual.
 * A consenting visitor's browser sends only { ideology, mode }; the server
 * increments a few counters (all-time, per month, per mode) and forgets the
 * request. No IP address, cookie, device id, answers or timestamp is saved,
 * so the stored data cannot be linked back to a person.
 */

export type StatsMode = 'quick' | 'full';

export interface StatsSubmission {
    ideology: IdeologyId;
    mode: StatsMode;
}

export interface StatsSnapshot {
    total: number;
    byIdeology: Record<IdeologyId, number>;
    byMode: Record<StatsMode, number>;
    /** Month key (YYYY-MM) → total submissions that month, oldest first. */
    byMonth: { month: string; total: number }[];
}

const PREFIX = 'stats:v1';
const IDEOLOGY_IDS = Object.keys(ideologies) as IdeologyId[];

export const monthKey = (date: Date) =>
    `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`;

/** Accepts only the exact expected shape; anything else is rejected. */
export const parseSubmission = (body: unknown): StatsSubmission | null => {
    if (!body || typeof body !== 'object') return null;
    const { ideology, mode, ...rest } = body as Record<string, unknown>;
    if (Object.keys(rest).length > 0) return null;
    if (typeof ideology !== 'string' || !(IDEOLOGY_IDS as string[]).includes(ideology)) return null;
    if (mode !== 'quick' && mode !== 'full') return null;
    return { ideology: ideology as IdeologyId, mode };
};

/** Redis commands that record one submission (counters only). */
export const incrementCommands = (s: StatsSubmission, now: Date): string[][] => [
    ['HINCRBY', `${PREFIX}:ideology`, s.ideology, '1'],
    ['HINCRBY', `${PREFIX}:month:${monthKey(now)}`, s.ideology, '1'],
    ['HINCRBY', `${PREFIX}:mode`, s.mode, '1'],
];

/** Last `count` month keys ending with the month of `now`, oldest first. */
export const recentMonths = (now: Date, count: number) =>
    Array.from({ length: count }, (_, i) => {
        const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (count - 1 - i), 1));
        return monthKey(d);
    });

const toCounts = (raw: unknown): Record<string, number> => {
    // Upstash returns HGETALL as a flat [field, value, field, value, ...] array.
    const out: Record<string, number> = {};
    if (Array.isArray(raw)) {
        for (let i = 0; i + 1 < raw.length; i += 2) out[String(raw[i])] = Number(raw[i + 1]) || 0;
    } else if (raw && typeof raw === 'object') {
        for (const [k, v] of Object.entries(raw)) out[k] = Number(v) || 0;
    }
    return out;
};

export const buildSnapshot = (
    ideologyRaw: unknown,
    modeRaw: unknown,
    months: { month: string; raw: unknown }[]
): StatsSnapshot => {
    const ideologyCounts = toCounts(ideologyRaw);
    const modeCounts = toCounts(modeRaw);
    const byIdeology = Object.fromEntries(IDEOLOGY_IDS.map(id => [id, ideologyCounts[id] ?? 0])) as Record<IdeologyId, number>;
    return {
        total: Object.values(byIdeology).reduce((a, b) => a + b, 0),
        byIdeology,
        byMode: { quick: modeCounts.quick ?? 0, full: modeCounts.full ?? 0 },
        byMonth: months.map(({ month, raw }) => ({
            month,
            total: Object.values(toCounts(raw)).reduce((a, b) => a + b, 0),
        })),
    };
};

/* ---------------- Storage ---------------- */

interface Store {
    pipeline(commands: string[][]): Promise<unknown[]>;
}

const restUrl = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
const restToken = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;

/** Upstash Redis over its REST API (no extra dependency). */
const upstashStore = (url: string, token: string): Store => ({
    async pipeline(commands) {
        const res = await fetch(`${url.replace(/\/$/, '')}/pipeline`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify(commands),
            cache: 'no-store',
        });
        if (!res.ok) throw new Error(`Stats store error: ${res.status}`);
        const data = (await res.json()) as { result?: unknown; error?: string }[];
        return data.map(d => {
            if (d.error) throw new Error(d.error);
            return d.result;
        });
    },
});

/**
 * In-memory store for local development only. Kept on globalThis because the
 * dev server loads route handlers and pages as separate module instances.
 */
const devGlobal = globalThis as typeof globalThis & { __statsMemory?: Map<string, Map<string, number>> };
const memoryHashes = (devGlobal.__statsMemory ??= new Map<string, Map<string, number>>());
const memoryStore: Store = {
    async pipeline(commands) {
        return commands.map(([cmd, key, field, by]) => {
            const hash = memoryHashes.get(key) ?? new Map<string, number>();
            memoryHashes.set(key, hash);
            if (cmd === 'HINCRBY') {
                const next = (hash.get(field) ?? 0) + Number(by);
                hash.set(field, next);
                return next;
            }
            if (cmd === 'HGETALL') return [...hash.entries()].flat();
            throw new Error(`Unsupported command ${cmd}`);
        });
    },
};

const store: Store | null =
    restUrl && restToken
        ? upstashStore(restUrl, restToken)
        : process.env.NODE_ENV !== 'production'
            ? memoryStore
            : null;

/** False in production until a Redis store is connected. */
export const isStatsEnabled = () => store !== null;

export const recordSubmission = async (s: StatsSubmission) => {
    if (!store) throw new Error('Stats store is not configured');
    await store.pipeline(incrementCommands(s, new Date()));
};

export const readSnapshot = async (monthsBack = 6): Promise<StatsSnapshot | null> => {
    if (!store) return null;
    const months = recentMonths(new Date(), monthsBack);
    const results = await store.pipeline([
        ['HGETALL', `${PREFIX}:ideology`],
        ['HGETALL', `${PREFIX}:mode`],
        ...months.map(m => ['HGETALL', `${PREFIX}:month:${m}`]),
    ]);
    return buildSnapshot(
        results[0],
        results[1],
        months.map((month, i) => ({ month, raw: results[2 + i] }))
    );
};
