import { questions, AxisId, Question } from '../data/questions';

/*
 * Lightweight helpers used by the start page and the quiz. Kept separate from
 * scoring.ts so the ideology texts (only needed on the result screen) stay out
 * of the initial JavaScript bundle.
 */

export type Answer = 'agree' | 'disagree';

export interface UserResponses {
    [questionId: number]: Answer;
}

export const AXIS_IDS: AxisId[] = ['ekonomi', 'toplum', 'milliyetcilik', 'yonetim'];

/** The axis a question mostly measures (largest absolute loading). */
export const dominantAxis = (q: Question): AxisId =>
    AXIS_IDS.reduce((best, axis) =>
        Math.abs(q.axes[axis] ?? 0) > Math.abs(q.axes[best] ?? 0) ? axis : best, AXIS_IDS[0]);

/**
 * Picks `count` questions balanced across axes (round-robin over the dominant axis),
 * so short quizzes still measure every dimension. Returned in original order.
 */
export const pickBalancedQuestions = (
    pool: Question[],
    count: number,
    random: () => number = Math.random
): Question[] => {
    if (count >= pool.length) return [...pool];
    const shuffle = <T,>(arr: T[]) => {
        const a = [...arr];
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    };
    const groups = AXIS_IDS.map(axis => shuffle(pool.filter(q => dominantAxis(q) === axis)));
    const picked: Question[] = [];
    while (picked.length < count) {
        for (const group of groups) {
            const next = group.shift();
            if (next && picked.length < count) picked.push(next);
        }
    }
    const order = new Map(pool.map((q, i) => [q.id, i]));
    return picked.sort((a, b) => order.get(a.id)! - order.get(b.id)!);
};

/* ---------- Shareable result encoding ---------- */

/** Bumped whenever questions change, so old links don't decode onto new questions. */
export const SHARE_VERSION = '4';

/** Fewest answers needed for a result. */
export const MIN_ANSWERS = 5;

/**
 * Encodes responses as a version prefix plus one character per question:
 * 'a' = agree, 'd' = disagree, '_' = skipped. Trailing skips are trimmed.
 */
export const encodeResponses = (responses: UserResponses): string =>
    SHARE_VERSION + '-' + questions
        .map(q => (responses[q.id] === 'agree' ? 'a' : responses[q.id] === 'disagree' ? 'd' : '_'))
        .join('')
        .replace(/_+$/, '');

export const decodeResponses = (code: string): UserResponses | null => {
    const [version, body] = code.split('-');
    if (version !== SHARE_VERSION || !body) return null;
    if (!/^[ad_]+$/.test(body) || body.length > questions.length) return null;
    const responses: UserResponses = {};
    [...body].forEach((ch, i) => {
        if (ch === 'a') responses[questions[i].id] = 'agree';
        else if (ch === 'd') responses[questions[i].id] = 'disagree';
    });
    return Object.keys(responses).length >= MIN_ANSWERS ? responses : null;
};
