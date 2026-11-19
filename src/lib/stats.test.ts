import { describe, expect, it } from 'vitest';
import { buildSnapshot, incrementCommands, monthKey, parseSubmission, recentMonths } from './stats';

describe('parseSubmission', () => {
    it('accepts exactly an ideology and a mode', () => {
        expect(parseSubmission({ ideology: 'liberal', mode: 'full' })).toEqual({ ideology: 'liberal', mode: 'full' });
    });

    it('rejects unknown ideologies, modes and any extra field', () => {
        expect(parseSubmission({ ideology: 'nope', mode: 'full' })).toBeNull();
        expect(parseSubmission({ ideology: 'liberal', mode: 'x' })).toBeNull();
        expect(parseSubmission({ ideology: 'liberal', mode: 'full', age: 30 })).toBeNull();
        expect(parseSubmission({ ideology: 'liberal', mode: 'full', answers: '4-ad' })).toBeNull();
        expect(parseSubmission(null)).toBeNull();
        expect(parseSubmission('liberal')).toBeNull();
    });
});

describe('stored data', () => {
    it('only increments aggregate counters (no per-person record)', () => {
        const cmds = incrementCommands({ ideology: 'yesil', mode: 'quick' }, new Date(Date.UTC(2026, 10, 19)));
        expect(cmds.every(c => c[0] === 'HINCRBY' && c[3] === '1')).toBe(true);
        expect(cmds.map(c => c[1])).toEqual(['stats:v1:ideology', 'stats:v1:month:2026-11', 'stats:v1:mode']);
    });

    it('builds month keys across year boundaries', () => {
        expect(monthKey(new Date(Date.UTC(2026, 0, 5)))).toBe('2026-01');
        expect(recentMonths(new Date(Date.UTC(2026, 1, 1)), 3)).toEqual(['2025-12', '2026-01', '2026-02']);
    });

    it('parses Upstash HGETALL replies into a snapshot', () => {
        const snap = buildSnapshot(
            ['liberal', '3', 'yesil', '2'],
            ['quick', '4', 'full', '1'],
            [{ month: '2026-11', raw: ['liberal', '3', 'yesil', '2'] }, { month: '2026-10', raw: null }]
        );
        expect(snap.total).toBe(5);
        expect(snap.byIdeology.liberal).toBe(3);
        expect(snap.byIdeology.kemalist).toBe(0);
        expect(snap.byMode).toEqual({ quick: 4, full: 1 });
        expect(snap.byMonth).toEqual([{ month: '2026-11', total: 5 }, { month: '2026-10', total: 0 }]);
    });
});
