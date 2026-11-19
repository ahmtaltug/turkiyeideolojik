import { IdeologyId, ideologies, Ideology } from '../data/ideologies';
import { questions, AxisId, Question } from '../data/questions';
import { leaders, PoliticalLeader } from '../data/leaders';

export type Answer = 'agree' | 'disagree';

export interface UserResponses {
    [questionId: number]: Answer;
}

export interface AxisScore {
    id: AxisId;
    name: string;
    value: number; // -100 to 100
    labels: [string, string]; // [Negative label, Positive label]
}

export interface LeaderMatch {
    leader: PoliticalLeader;
    matchPercentage: number;
}

export interface BreakdownItem {
    questionText: string;
    answer: Answer;
    /** Relative influence on the top result, 0-100. */
    impact: number;
    direction: 'positive' | 'negative';
}

export interface QuizResult {
    topIdeology: Ideology;
    oppositeIdeology: Ideology;
    allScores: Record<IdeologyId, number>;
    axisScores: AxisScore[];
    matchPercentage: number;
    leaderMatches: LeaderMatch[];
    breakdown: BreakdownItem[];
    consistencyScore: number;
    answeredCount: number;
}

export const AXIS_IDS: AxisId[] = ['ekonomi', 'toplum', 'milliyetcilik', 'yonetim'];

export const AXES: Record<AxisId, { name: string; labels: [string, string] }> = {
    ekonomi: {
        name: 'Ekonomi',
        labels: ['Devletçi / Sosyalist', 'Serbest Piyasa / Liberal']
    },
    toplum: {
        name: 'Toplumsal',
        labels: ['İlerici / Seküler', 'Muhafazakar / Dindar']
    },
    milliyetcilik: {
        name: 'Milliyetçilik',
        labels: ['Küreselci / Kozmopolit', 'Milliyetçi / Ulusalcı']
    },
    yonetim: {
        name: 'Yönetim',
        labels: ['Özgürlükçü / Demokratik', 'Otoriter / Devletçi']
    }
};

const AXIS_IMPORTANCE: Record<AxisId, number> = {
    milliyetcilik: 1.3,
    toplum: 1.2,
    ekonomi: 0.9,
    yonetim: 0.7
};

const IDEOLOGY_RIGIDITY: Record<IdeologyId, number> = {
    islamci: 1.4,
    sosyalist: 1.3,
    ozerklikci: 1.5,
    turkculuk: 1.3,
    avrasyaci: 1.2,
    ulusalci: 1.2,
    kemalist: 1.1,
    ulkucu: 1.1,
    muhafazakar: 1.0,
    sosyal_demokrat: 0.9,
    merkez_sag: 0.8,
    liberal: 0.9,
    yesil: 1.0
};

const IDEOLOGY_IDS = Object.keys(ideologies) as IdeologyId[];
const questionById = new Map<number, Question>(questions.map(q => [q.id, q]));

/** Explicit weight if the question defines one, otherwise projected from the ideology's ideal axes. */
const getEffectiveWeight = (q: Question, ideologyId: IdeologyId): number => {
    const explicit = q.weights[ideologyId];
    if (explicit !== undefined) return explicit;
    const ideal = ideologies[ideologyId].idealAxes;
    return AXIS_IDS.reduce((sum, axis) => sum + (q.axisWeights[axis] * ideal[axis]) / 100, 0);
};

/** The axis a question mostly measures (largest absolute axis weight). */
export const dominantAxis = (q: Question): AxisId =>
    AXIS_IDS.reduce((best, axis) =>
        Math.abs(q.axisWeights[axis]) > Math.abs(q.axisWeights[best]) ? axis : best, AXIS_IDS[0]);

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

export const calculateScores = (responses: UserResponses): QuizResult => {
    const answered = Object.entries(responses)
        .map(([qId, answer]) => ({ question: questionById.get(Number(qId)), answer }))
        .filter((r): r is { question: Question; answer: Answer } => !!r.question);

    const ideologyRaw = Object.fromEntries(IDEOLOGY_IDS.map(id => [id, 0])) as Record<IdeologyId, number>;
    const ideologyMax = Object.fromEntries(IDEOLOGY_IDS.map(id => [id, 0])) as Record<IdeologyId, number>;
    const axisRaw: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMax: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    // Positive / negative evidence per axis, used for the consistency score.
    const axisPos: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisNeg: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const questionImpacts = new Map<number, Record<IdeologyId, number>>();

    // Only answered questions count towards the maxima; otherwise a 20-question
    // quick test would have its scores squashed toward the centre.
    for (const { question, answer } of answered) {
        const multiplier = answer === 'agree' ? 1 : -1;
        const impacts = {} as Record<IdeologyId, number>;

        for (const id of IDEOLOGY_IDS) {
            const weight = getEffectiveWeight(question, id);
            let impact = weight * multiplier;
            // Red line penalty: contradicting a core value of an ideology costs extra.
            if (Math.abs(weight) >= 8 && Math.sign(weight) !== multiplier) impact *= 1.5;
            ideologyRaw[id] += impact;
            ideologyMax[id] += Math.abs(weight);
            impacts[id] = impact;
        }
        questionImpacts.set(question.id, impacts);

        for (const axis of AXIS_IDS) {
            const w = question.axisWeights[axis];
            const val = w * multiplier;
            axisRaw[axis] += val;
            axisMax[axis] += Math.abs(w);
            if (val > 0) axisPos[axis] += val;
            else if (val < 0) axisNeg[axis] -= val;
        }
    }

    // Consistency: on each axis, how much of the evidence points the "minority" way.
    let conflictSum = 0;
    let evidenceSum = 0;
    for (const axis of AXIS_IDS) {
        const total = axisPos[axis] + axisNeg[axis];
        if (total === 0) continue;
        conflictSum += Math.min(axisPos[axis], axisNeg[axis]) * AXIS_IMPORTANCE[axis];
        evidenceSum += total * AXIS_IMPORTANCE[axis];
    }
    // A minority share of 0.5 (perfectly split) maps to 0, 0 maps to 100.
    const consistencyScore = evidenceSum === 0
        ? 100
        : Math.round(100 * (1 - (conflictSum / evidenceSum) * 2));

    const normalizedAxes = {} as Record<AxisId, number>;
    const axisScores: AxisScore[] = AXIS_IDS.map(axis => {
        const value = axisMax[axis] === 0 ? 0 : Math.round((axisRaw[axis] / axisMax[axis]) * 100);
        normalizedAxes[axis] = value;
        return { id: axis, name: AXES[axis].name, value, labels: AXES[axis].labels };
    });

    // Final: Gaussian distance on the axes (75%) blended with direct question weights (25%).
    const importanceSum = AXIS_IDS.reduce((s, a) => s + AXIS_IMPORTANCE[a], 0);
    const finalScores = {} as Record<IdeologyId, number>;
    for (const id of IDEOLOGY_IDS) {
        const ideology = ideologies[id];
        const maxW = ideologyMax[id];
        // Penalties can push raw below -maxW; clamp so the score stays within 0-100.
        const weightScore = maxW === 0
            ? 50
            : Math.min(100, Math.max(0, ((ideologyRaw[id] + maxW) / (2 * maxW)) * 100));

        const weightedDistance = AXIS_IDS.reduce((sum, axis) => {
            const delta = (normalizedAxes[axis] - ideology.idealAxes[axis]) / 120;
            return sum + delta * delta * AXIS_IMPORTANCE[axis];
        }, 0);
        const rigidity = IDEOLOGY_RIGIDITY[id] ?? 1;
        const distanceMatch = Math.exp(-(weightedDistance * rigidity) / (importanceSum / 2)) * 100;

        finalScores[id] = Math.round(weightScore * 0.25 + distanceMatch * 0.75);
    }

    const sorted = (Object.entries(finalScores) as [IdeologyId, number][]).sort(([, a], [, b]) => b - a);
    const [topId, topScore] = sorted[0];
    const [secondId, secondScore] = sorted[1];
    const oppositeId = sorted[sorted.length - 1][0];

    const isHybrid = topScore - secondScore <= 5 && topScore > 40;
    let topIdeology: Ideology = { ...ideologies[topId] };
    if (isHybrid) {
        const second = ideologies[secondId];
        topIdeology = {
            ...topIdeology,
            isHybrid: true,
            secondId,
            name: `${topIdeology.name} - ${second.name} Sentezi`,
            description: `${topIdeology.name} ve ${second.name} görüşlerinin ortak paydada buluştuğu hibrit bir siyasi kimlik.`,
            parties: [...new Set([...topIdeology.parties, ...second.parties])],
        };
    }

    const leaderMatches: LeaderMatch[] = leaders
        .map(leader => {
            const d = AXIS_IDS.reduce((sum, axis) => {
                const delta = (normalizedAxes[axis] - leader.coordinates[axis]) / 150;
                return sum + delta * delta * AXIS_IMPORTANCE[axis];
            }, 0);
            return { leader, matchPercentage: Math.round(Math.exp(-d / 2.5) * 100) };
        })
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    const rawBreakdown = answered
        .map(({ question, answer }) => {
            const impact = questionImpacts.get(question.id)?.[topId] ?? 0;
            return { questionText: question.text, answer, raw: impact };
        })
        .filter(item => item.raw !== 0)
        .sort((a, b) => Math.abs(b.raw) - Math.abs(a.raw))
        .slice(0, 4);
    const maxImpact = Math.max(1, ...rawBreakdown.map(i => Math.abs(i.raw)));
    const breakdown: BreakdownItem[] = rawBreakdown.map(({ questionText, answer, raw }) => ({
        questionText,
        answer,
        impact: Math.round((Math.abs(raw) / maxImpact) * 100),
        direction: raw >= 0 ? 'positive' : 'negative',
    }));

    return {
        topIdeology,
        oppositeIdeology: ideologies[oppositeId],
        allScores: finalScores,
        axisScores,
        matchPercentage: topScore,
        leaderMatches,
        breakdown,
        consistencyScore: Math.max(0, Math.min(100, consistencyScore)),
        answeredCount: answered.length,
    };
};

/* ---------- Shareable result encoding ---------- */

/**
 * Encodes responses as one character per question (in question order):
 * 'a' = agree, 'd' = disagree, '_' = skipped. Trailing skips are trimmed.
 */
export const encodeResponses = (responses: UserResponses): string =>
    questions
        .map(q => (responses[q.id] === 'agree' ? 'a' : responses[q.id] === 'disagree' ? 'd' : '_'))
        .join('')
        .replace(/_+$/, '');

export const decodeResponses = (code: string): UserResponses | null => {
    if (!/^[ad_]+$/.test(code) || code.length > questions.length) return null;
    const responses: UserResponses = {};
    [...code].forEach((ch, i) => {
        if (ch === 'a') responses[questions[i].id] = 'agree';
        else if (ch === 'd') responses[questions[i].id] = 'disagree';
    });
    return Object.keys(responses).length >= 10 ? responses : null;
};
