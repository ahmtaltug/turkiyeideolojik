import { describe, expect, it } from 'vitest';
import { questions } from '../data/questions';
import { ideologies, IdeologyId } from '../data/ideologies';
import { leaders } from '../data/leaders';
import {
    AXIS_IDS,
    IDEOLOGY_AXES,
    calculateScores,
    decodeResponses,
    dominantAxis,
    encodeResponses,
    leaderStance,
    pickBalancedQuestions,
    UserResponses,
} from './scoring';

const IDS = Object.keys(ideologies) as IdeologyId[];

/** Answers like a profile would (skips questions it is neutral on). */
const answersFrom = (stanceOf: (q: (typeof questions)[number]) => number): UserResponses => {
    const r: UserResponses = {};
    for (const q of questions) {
        const s = stanceOf(q);
        if (s > 0) r[q.id] = 'agree';
        else if (s < 0) r[q.id] = 'disagree';
    }
    return r;
};
const answersFor = (id: IdeologyId) => answersFrom(q => q.stances[id]);

/** Simulates N respondents answering with probability (stance + 2) / 4; seeded for determinism. */
const simulate = (stanceOf: (q: (typeof questions)[number]) => number, N: number, rank: (r: UserResponses) => string[], target: string) => {
    let seed = 42;
    const rand = () => {
        seed = (seed + 0x6d2b79f5) | 0;
        let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    let top1 = 0;
    let top3 = 0;
    for (let n = 0; n < N; n++) {
        const r: UserResponses = {};
        for (const q of questions) {
            const p = Math.min(0.95, Math.max(0.05, (stanceOf(q) + 2) / 4));
            r[q.id] = rand() < p ? 'agree' : 'disagree';
        }
        const ranking = rank(r);
        if (ranking[0] === target) top1++;
        if (ranking.slice(0, 3).includes(target)) top3++;
    }
    return { top1: top1 / N, top3: top3 / N };
};

describe('data integrity', () => {
    it('has 40 questions with unique ids', () => {
        expect(questions).toHaveLength(40);
        expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
    });

    it('defines a stance for every ideology on every question', () => {
        for (const q of questions) {
            for (const id of IDS) expect([-2, -1, 0, 1, 2]).toContain(q.stances[id]);
        }
    });

    it('asks one thing per question (no joined demands)', () => {
        for (const q of questions) {
            expect(q.text, `#${q.id}`).not.toMatch(/;/);
            expect(q.text, `#${q.id}`).not.toMatch(/m[ae]l[ıi](dır|dir)?,\s/);
            expect(q.text, `#${q.id}`).not.toMatch(/m[ae]l[ıi] ve /);
        }
    });

    it('only asks questions that divide the ideologies', () => {
        for (const q of questions) {
            const values = Object.values(q.stances);
            expect(values.some(v => v > 0), `#${q.id} has no supporters`).toBe(true);
            expect(values.some(v => v < 0), `#${q.id} has no opponents`).toBe(true);
        }
    });

    it('balances statement direction on each axis to limit yes-saying bias', () => {
        for (const axis of AXIS_IDS) {
            const loads = questions.map(q => q.axes[axis] ?? 0).filter(v => Math.abs(v) >= 0.5);
            expect(loads.some(v => v > 0), `${axis} has no positive items`).toBe(true);
            expect(loads.some(v => v < 0), `${axis} has no negative items`).toBe(true);
        }
    });

    it('lists neutral criticisms for every ideology', () => {
        for (const id of IDS) expect(ideologies[id].critiques.length).toBeGreaterThanOrEqual(2);
    });

    it('gives every leader blend weights that sum to 1', () => {
        for (const l of leaders) {
            const sum = Object.values(l.blend).reduce((a, b) => a + (b ?? 0), 0);
            expect(sum).toBeCloseTo(1, 5);
        }
    });
});

describe('ideology positions', () => {
    it('places ideologies sensibly on the axes', () => {
        expect(IDEOLOGY_AXES.sosyalist.ekonomi).toBeLessThan(-50);
        expect(IDEOLOGY_AXES.liberal.ekonomi).toBeGreaterThan(30);
        expect(IDEOLOGY_AXES.islamci.toplum).toBeGreaterThan(50);
        expect(IDEOLOGY_AXES.kemalist.toplum).toBeLessThan(-30);
        expect(IDEOLOGY_AXES.ozerklikci.milliyetcilik).toBeLessThan(-50);
        expect(IDEOLOGY_AXES.ulkucu.milliyetcilik).toBeGreaterThan(50);
        expect(IDEOLOGY_AXES.turkculuk.milliyetcilik).toBeGreaterThan(50);
        expect(IDEOLOGY_AXES.muhafazakar.yonetim).toBeGreaterThan(30);
        expect(IDEOLOGY_AXES.liberal.yonetim).toBeLessThan(-30);
    });
});

describe('calculateScores', () => {
    it.each(IDS)('identifies simulated %s respondents', id => {
        const { top1, top3 } = simulate(
            q => q.stances[id], 200,
            r => (Object.entries(calculateScores(r).allScores) as [IdeologyId, number][])
                .sort(([, x], [, y]) => y - x).map(([k]) => k),
            id
        );
        expect(top1).toBeGreaterThan(0.6);
        expect(top3).toBeGreaterThan(0.95);
    });

    it.each(leaders.map(l => [l.name, l] as const))('places simulated %s respondents near the leader', (_, leader) => {
        const { top3 } = simulate(
            q => leaderStance(leader, q), 100,
            r => calculateScores(r).leaderMatches.map(m => m.leader.name),
            leader.name
        );
        expect(top3).toBeGreaterThan(0.8);
    });

    it('keeps scores within 0-100', () => {
        const all = Object.fromEntries(questions.map(q => [q.id, 'agree'])) as UserResponses;
        const result = calculateScores(all);
        for (const s of Object.values(result.allScores)) {
            expect(s).toBeGreaterThanOrEqual(0);
            expect(s).toBeLessThanOrEqual(100);
        }
    });

    it('does not squash axis scores in quick mode', () => {
        const full = answersFor('sosyalist');
        const subset = pickBalancedQuestions(questions, 20, () => 0.42);
        const partial = Object.fromEntries(subset.filter(q => full[q.id]).map(q => [q.id, full[q.id]])) as UserResponses;
        const eco = (r: UserResponses) => calculateScores(r).axisScores.find(a => a.id === 'ekonomi')!.value;
        expect(eco(partial)).toBeLessThan(-40);
        expect(Math.abs(eco(partial))).toBeGreaterThan(Math.abs(eco(full)) * 0.6);
    });

    it('explains the result with agreements and disagreements', () => {
        const r = answersFor('kemalist');
        r[11] = 'agree'; // kemalist strongly disagrees with this one
        const result = calculateScores(r);
        expect(result.agreements.length).toBe(3);
        expect(result.disagreements.map(d => d.questionId)).toContain(11);
    });
});

describe('pickBalancedQuestions', () => {
    it('returns unique questions covering every axis', () => {
        const picked = pickBalancedQuestions(questions, 20);
        expect(picked).toHaveLength(20);
        expect(new Set(picked.map(q => q.id)).size).toBe(20);
        expect(new Set(picked.map(dominantAxis)).size).toBe(4);
    });
});

describe('share encoding', () => {
    it('round-trips responses', () => {
        const responses = answersFor('yesil');
        expect(decodeResponses(encodeResponses(responses))).toEqual(responses);
    });

    it('rejects malformed, too-short or old-version codes', () => {
        expect(decodeResponses('4-xyz')).toBeNull();
        expect(decodeResponses('4-ad')).toBeNull();
        expect(decodeResponses('a'.repeat(30))).toBeNull(); // v1 links had no prefix
        expect(decodeResponses('4-' + 'a'.repeat(questions.length + 1))).toBeNull();
    });
});
