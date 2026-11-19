import { IdeologyId, ideologies, Ideology } from '../data/ideologies';
import { questions, AxisId, Question, Stance } from '../data/questions';
import { leaders, PoliticalLeader } from '../data/leaders';

/*
 * Scoring model
 * -------------
 * Every question stores how each ideology would answer it (stance -2..2).
 * Each stance is read as a probability of agreeing; a user's match with an
 * ideology is how likely a holder of it would be to answer exactly like them.
 * Axis positions come from each question's axis loadings, and ideology/leader
 * axis positions are derived from the same stances, so everything stays in sync.
 */

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
    questionId: number;
    questionText: string;
    answer: Answer;
    stance: Stance;
}

export interface QuizResult {
    topIdeology: Ideology;
    oppositeIdeology: Ideology;
    allScores: Record<IdeologyId, number>;
    axisScores: AxisScore[];
    matchPercentage: number;
    leaderMatches: LeaderMatch[];
    /** Strongest issues where the user sides with the top ideology. */
    agreements: BreakdownItem[];
    /** Strongest issues where the user departs from the top ideology. */
    disagreements: BreakdownItem[];
    consistencyScore: number;
    answeredCount: number;
}

export const AXIS_IDS: AxisId[] = ['ekonomi', 'toplum', 'milliyetcilik', 'yonetim'];

export const AXES: Record<AxisId, { name: string; labels: [string, string] }> = {
    ekonomi: { name: 'Ekonomi', labels: ['Devletçi / Sosyal', 'Serbest Piyasa / Liberal'] },
    toplum: { name: 'Toplumsal', labels: ['İlerici / Seküler', 'Muhafazakar / Dindar'] },
    milliyetcilik: { name: 'Milliyetçilik', labels: ['Çoğulcu / Küreselci', 'Milliyetçi / Ulusalcı'] },
    yonetim: { name: 'Yönetim', labels: ['Özgürlükçü / Yerinden', 'Otoriter / Merkeziyetçi'] },
};

const AXIS_IMPORTANCE: Record<AxisId, number> = {
    milliyetcilik: 1.2,
    toplum: 1.1,
    ekonomi: 0.9,
    yonetim: 1,
};

const IDEOLOGY_IDS = Object.keys(ideologies) as IdeologyId[];
const questionById = new Map<number, Question>(questions.map(q => [q.id, q]));

/**
 * Probability that someone holding `stance` agrees with the statement.
 * Clamped so a single answer can never rule an ideology out completely.
 */
const agreeProbability = (stance: number) => Math.min(0.95, Math.max(0.05, (stance + 2) / 4));

const answerValue = (answer: Answer) => (answer === 'agree' ? 1 : -1);

const P_MIN = 0.05;
const P_MAX = 0.95;

/**
 * Match (0-100): geometric mean of the probabilities that a holder of this
 * profile would give each of the user's answers, rescaled so that "always
 * answers like a committed member" is 100 and "always the opposite" is 0.
 * Contradicting a core (±2) position therefore costs far more than a mild one.
 */
const matchScore = (
    answered: { question: Question; answer: Answer }[],
    stanceOf: (q: Question) => number
): number => {
    if (answered.length === 0) return 50;
    let logSum = 0;
    for (const { question, answer } of answered) {
        const p = agreeProbability(stanceOf(question));
        logSum += Math.log(answer === 'agree' ? p : 1 - p);
    }
    const geoMean = Math.exp(logSum / answered.length);
    return Math.round(((geoMean - P_MIN) / (P_MAX - P_MIN)) * 100);
};

export const leaderStance = (leader: PoliticalLeader, q: Question): number => {
    const override = leader.overrides?.[q.id];
    if (override !== undefined) return override;
    return (Object.entries(leader.blend) as [IdeologyId, number][])
        .reduce((sum, [id, w]) => sum + w * q.stances[id], 0);
};

/** Axis position (-100..100) of a profile that answers with probability given by its stance. */
const profileAxes = (stanceOf: (q: Question) => number): Record<AxisId, number> => {
    const raw: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const max: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    for (const q of questions) {
        const s = stanceOf(q) / 2;
        for (const axis of AXIS_IDS) {
            const load = q.axes[axis] ?? 0;
            raw[axis] += s * load;
            max[axis] += Math.abs(load);
        }
    }
    return Object.fromEntries(
        AXIS_IDS.map(a => [a, max[a] === 0 ? 0 : Math.round((raw[a] / max[a]) * 100)])
    ) as Record<AxisId, number>;
};

/** Where each ideology sits on the four axes, derived from its stances. */
export const IDEOLOGY_AXES: Record<IdeologyId, Record<AxisId, number>> = Object.fromEntries(
    IDEOLOGY_IDS.map(id => [id, profileAxes(q => q.stances[id])])
) as Record<IdeologyId, Record<AxisId, number>>;

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

export const calculateScores = (responses: UserResponses): QuizResult => {
    const answered = Object.entries(responses)
        .map(([qId, answer]) => ({ question: questionById.get(Number(qId)), answer }))
        .filter((r): r is { question: Question; answer: Answer } => !!r.question);

    // Ideology match = weighted agreement on answered questions.
    const allScores = Object.fromEntries(
        IDEOLOGY_IDS.map(id => [id, matchScore(answered, q => q.stances[id])])
    ) as Record<IdeologyId, number>;

    // User axes, normalised over answered questions only.
    const axisRaw: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMax: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisPos: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisNeg: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    for (const { question, answer } of answered) {
        for (const axis of AXIS_IDS) {
            const load = question.axes[axis] ?? 0;
            const val = load * answerValue(answer);
            axisRaw[axis] += val;
            axisMax[axis] += Math.abs(load);
            if (val > 0) axisPos[axis] += val;
            else axisNeg[axis] -= val;
        }
    }
    const axisScores: AxisScore[] = AXIS_IDS.map(axis => ({
        id: axis,
        name: AXES[axis].name,
        value: axisMax[axis] === 0 ? 0 : Math.round((axisRaw[axis] / axisMax[axis]) * 100),
        labels: AXES[axis].labels,
    }));

    // Consistency: how much of the evidence on each axis points the "minority" way.
    let conflict = 0;
    let evidence = 0;
    for (const axis of AXIS_IDS) {
        conflict += Math.min(axisPos[axis], axisNeg[axis]) * AXIS_IMPORTANCE[axis];
        evidence += (axisPos[axis] + axisNeg[axis]) * AXIS_IMPORTANCE[axis];
    }
    const consistencyScore = evidence === 0
        ? 100
        : Math.max(0, Math.min(100, Math.round(100 * (1 - (conflict / evidence) * 2))));

    const sorted = (Object.entries(allScores) as [IdeologyId, number][]).sort(([, a], [, b]) => b - a);
    const [topId, topScore] = sorted[0];
    const [secondId, secondScore] = sorted[1];
    const oppositeId = sorted[sorted.length - 1][0];

    let topIdeology: Ideology = { ...ideologies[topId] };
    if (topScore - secondScore <= 3 && topScore >= 50) {
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
        .map(leader => ({ leader, matchPercentage: matchScore(answered, q => leaderStance(leader, q)) }))
        .sort((a, b) => b.matchPercentage - a.matchPercentage);

    const items = answered
        .map(({ question, answer }) => ({
            questionId: question.id,
            questionText: question.text,
            answer,
            stance: question.stances[topId],
        }))
        .filter(i => i.stance !== 0)
        .sort((a, b) => Math.abs(b.stance) - Math.abs(a.stance));
    const agreements = items.filter(i => Math.sign(i.stance) === answerValue(i.answer)).slice(0, 3);
    const disagreements = items.filter(i => Math.sign(i.stance) !== answerValue(i.answer)).slice(0, 3);

    return {
        topIdeology,
        oppositeIdeology: ideologies[oppositeId],
        allScores,
        axisScores,
        matchPercentage: topScore,
        leaderMatches,
        agreements,
        disagreements,
        consistencyScore,
        answeredCount: answered.length,
    };
};

/* ---------- Shareable result encoding ---------- */

/** Bumped whenever questions change, so old links don't decode onto new questions. */
export const SHARE_VERSION = '2';

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
    return Object.keys(responses).length >= 10 ? responses : null;
};
