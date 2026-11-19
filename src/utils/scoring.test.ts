import { describe, expect, it } from 'vitest';
import { questions } from '../data/questions';
import { ideologies, IdeologyId } from '../data/ideologies';
import {
    calculateScores,
    decodeResponses,
    dominantAxis,
    encodeResponses,
    pickBalancedQuestions,
    UserResponses,
} from './scoring';

/** Answers every question the way an ideology with explicit weights would. */
const answersFor = (id: IdeologyId): UserResponses => {
    const ideal = ideologies[id].idealAxes;
    return Object.fromEntries(
        questions.map(q => {
            const w = q.weights[id] ?? (Object.entries(q.axisWeights) as [keyof typeof ideal, number][])
                .reduce((s, [axis, aw]) => s + aw * ideal[axis], 0);
            return [q.id, w >= 0 ? 'agree' : 'disagree'] as const;
        })
    ) as UserResponses;
};

describe('data integrity', () => {
    it('has unique question ids', () => {
        expect(new Set(questions.map(q => q.id)).size).toBe(questions.length);
    });

    it('only references known ideologies in weights', () => {
        for (const q of questions) {
            for (const key of Object.keys(q.weights)) {
                expect(ideologies).toHaveProperty(key);
            }
        }
    });
});

describe('calculateScores', () => {
    it('keeps every score within 0-100', () => {
        const all = Object.fromEntries(questions.map(q => [q.id, 'agree'])) as UserResponses;
        const result = calculateScores(all);
        for (const score of Object.values(result.allScores)) {
            expect(score).toBeGreaterThanOrEqual(0);
            expect(score).toBeLessThanOrEqual(100);
        }
        for (const axis of result.axisScores) {
            expect(Math.abs(axis.value)).toBeLessThanOrEqual(100);
        }
    });

    it.each(['sosyalist', 'muhafazakar', 'liberal', 'ulusalci'] as IdeologyId[])(
        'ranks %s at or near the top for its own answers',
        id => {
            const result = calculateScores(answersFor(id));
            const ranking = Object.entries(result.allScores).sort(([, a], [, b]) => b - a).map(([k]) => k);
            expect(ranking.slice(0, 3)).toContain(id);
        }
    );

    it('does not squash axis scores in quick mode', () => {
        const full = answersFor('sosyalist');
        const subset = pickBalancedQuestions(questions, 20, () => 0.42);
        const partial = Object.fromEntries(subset.map(q => [q.id, full[q.id]])) as UserResponses;
        const fullEco = calculateScores(full).axisScores.find(a => a.id === 'ekonomi')!.value;
        const quickEco = calculateScores(partial).axisScores.find(a => a.id === 'ekonomi')!.value;
        expect(quickEco).toBeLessThan(0);
        expect(Math.abs(quickEco)).toBeGreaterThan(Math.abs(fullEco) * 0.6);
    });

    it('gives a perfectly consistent profile a high consistency score', () => {
        expect(calculateScores(answersFor('liberal')).consistencyScore).toBeGreaterThan(50);
    });

    it('normalizes breakdown impact to 0-100', () => {
        const result = calculateScores(answersFor('kemalist'));
        expect(result.breakdown.length).toBeGreaterThan(0);
        expect(result.breakdown[0].impact).toBe(100);
        for (const item of result.breakdown) expect(item.impact).toBeLessThanOrEqual(100);
    });
});

describe('pickBalancedQuestions', () => {
    it('returns the requested number of unique questions covering every axis', () => {
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

    it('rejects malformed or too-short codes', () => {
        expect(decodeResponses('xyz')).toBeNull();
        expect(decodeResponses('ad')).toBeNull();
        expect(decodeResponses('a'.repeat(questions.length + 1))).toBeNull();
    });
});
