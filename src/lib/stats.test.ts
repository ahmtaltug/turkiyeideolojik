import { describe, expect, it } from 'vitest';
import { buildSnapshot, incrementCommands, parseSubmission } from './stats';

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
        const cmds = incrementCommands({ ideology: 'yesil', mode: 'quick' });
        expect(cmds.every(c => c[0] === 'HINCRBY' && c[3] === '1')).toBe(true);
        expect(cmds.map(c => c[1])).toEqual(['stats:v1:ideology', 'stats:v1:mode']);
    });

    it('parses Upstash HGETALL replies into a snapshot', () => {
        const snap = buildSnapshot(['liberal', '3', 'yesil', '2'], ['quick', '4', 'full', '1']);
        expect(snap.total).toBe(5);
        expect(snap.byIdeology.liberal).toBe(3);
        expect(snap.byIdeology.kemalist).toBe(0);
        expect(snap.byMode).toEqual({ quick: 4, full: 1 });
    });
});
