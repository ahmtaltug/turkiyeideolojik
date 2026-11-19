import { IdeologyId, ideologies, Ideology } from '../data/ideologies';
import { questions, AxisId, Question, Stance } from '../data/questions';
import { leaders, PoliticalLeader } from '../data/leaders';
import { AXIS_IDS, Answer, UserResponses } from './quiz';

export {
    AXIS_IDS,
    MIN_ANSWERS,
    SHARE_VERSION,
    decodeResponses,
    dominantAxis,
    encodeResponses,
    pickBalancedQuestions,
} from './quiz';
export type { Answer, UserResponses } from './quiz';

/*
 * Scoring model
 * -------------
 * Every question stores how each ideology would answer it (stance -2..2).
 * Each stance is read as a probability of agreeing; a user's match with an
 * ideology is how likely a holder of it would be to answer exactly like them.
 * Axis positions come from each question's axis loadings, and ideology/leader
 * axis positions are derived from the same stances, so everything stays in sync.
 */

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
    /** Issues where the user is furthest from the most distant ideology. */
    oppositeDifferences: BreakdownItem[];
    consistencyScore: number;
    answeredCount: number;
}

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
            name: `${topIdeology.name} – ${second.name} Sentezi`,
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

    const oppositeDifferences = answered
        .map(({ question, answer }) => ({
            questionId: question.id,
            questionText: question.text,
            answer,
            stance: question.stances[oppositeId],
        }))
        .filter(i => i.stance !== 0 && Math.sign(i.stance) !== answerValue(i.answer))
        .sort((a, b) => Math.abs(b.stance) - Math.abs(a.stance))
        .slice(0, 3);

    return {
        topIdeology,
        oppositeIdeology: ideologies[oppositeId],
        allScores,
        axisScores,
        matchPercentage: topScore,
        leaderMatches,
        agreements,
        disagreements,
        oppositeDifferences,
        consistencyScore,
        answeredCount: answered.length,
    };
};
