import { IdeologyId, ideologies, Ideology } from '../data/ideologies';
import { questions, AxisId, Question } from '../data/questions';
import { leaders, PoliticalLeader } from '../data/leaders';

export type Answer = 'agree' | 'disagree' | 'neutral';

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
    impact: number; // Percentage contribution
    direction: 'positive' | 'negative';
}

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

export const calculateScores = (responses: UserResponses) => {
    const rawWeights: any = {};

    // Initialize ideology weights
    Object.keys(ideologies).forEach(id => {
        rawWeights[id as IdeologyId] = 0;
    });

    const ideologyMaxPossible: any = { ...rawWeights };
    const axisRawScores: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMaxPossible: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };

    // Track per-question impact for breakdown
    const questionImpacts: Record<number, Partial<Record<IdeologyId, number>>> = {};

    // Calculate maximums
    questions.forEach(q => {
        Object.entries(q.weights).forEach(([ideologyId, weight]) => {
            ideologyMaxPossible[ideologyId as IdeologyId] += Math.abs(weight as number);
        });
        Object.entries(q.axisWeights).forEach(([axisId, weight]) => {
            axisMaxPossible[axisId as AxisId] += Math.abs(weight as number);
        });
    });

    // Process responses
    Object.entries(responses).forEach(([qId, answer]) => {
        const question = questions.find((q) => q.id === Number(qId));
        if (!question) return;
        if (answer === 'neutral') return;

        const multiplier = answer === 'agree' ? 1 : -1;
        questionImpacts[question.id] = {};

        Object.entries(question.weights).forEach(([ideologyId, weight]) => {
            const impact = (weight as number) * multiplier;
            rawWeights[ideologyId as IdeologyId] += impact;
            questionImpacts[question.id][ideologyId as IdeologyId] = impact;
        });

        Object.entries(question.axisWeights).forEach(([axisId, weight]) => {
            axisRawScores[axisId as AxisId] += (weight as number) * multiplier;
        });
    });

    // Normalize Axis Scores to -100..100
    const normalizedAxes: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisScores: AxisScore[] = (Object.keys(axisRawScores) as AxisId[]).map(axisId => {
        const raw = axisRawScores[axisId];
        const max = axisMaxPossible[axisId];
        const value = max === 0 ? 0 : Math.round((raw / max) * 100);
        normalizedAxes[axisId] = value;

        return {
            id: axisId,
            name: AXES[axisId].name,
            value,
            labels: AXES[axisId].labels
        };
    });

    // Calculate Hybrid Scores
    const finalScores = {} as Record<IdeologyId, number>;


    Object.entries(ideologies).forEach(([id, ideology]) => {
        const ideologyId = id as IdeologyId;

        // 1. Weight-based Score (0-100)
        const maxW = ideologyMaxPossible[ideologyId];
        const weightScore = maxW === 0 ? 0 : ((rawWeights[ideologyId] + maxW) / (2 * maxW)) * 100;

        // 2. Axis Distance-based Score (0-100)
        // Calculate Euclidean distance between user axes and ideology ideal axes
        let distanceSum = 0;
        let maxDistanceSum = 0;

        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const userVal = normalizedAxes[axisId];
            const idealVal = ideology.idealAxes[axisId];
            distanceSum += Math.pow(userVal - idealVal, 2);
            // Max possible distance for one axis is 200 (from -100 to 100)
            maxDistanceSum += Math.pow(200, 2);
        });

        const distance = Math.sqrt(distanceSum);
        const maxPossibleDistance = Math.sqrt(maxDistanceSum);
        const distanceScore = ((maxPossibleDistance - distance) / maxPossibleDistance) * 100;

        // Hybrid Score: 40% Weights, 60% Axis Distance
        finalScores[ideologyId] = Math.round((weightScore * 0.4) + (distanceScore * 0.6));
    });

    // Sort result
    const sortedResult = Object.entries(finalScores)
        .sort(([, a], [, b]) => b - a);

    const topIdeologyId = sortedResult[0][0] as IdeologyId;
    const oppositeIdeologyId = sortedResult[sortedResult.length - 1][0] as IdeologyId;

    // Leader Comparison
    const leaderMatches: LeaderMatch[] = leaders.map(leader => {
        let distanceSum = 0;
        let maxDistanceSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            distanceSum += Math.pow(normalizedAxes[axisId] - leader.coordinates[axisId], 2);
            maxDistanceSum += Math.pow(200, 2);
        });
        const matchPercentage = Math.round(((Math.sqrt(maxDistanceSum) - Math.sqrt(distanceSum)) / Math.sqrt(maxDistanceSum)) * 100);
        return { leader, matchPercentage };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Breakdown (Top 3 questions for winning ideology)
    const breakdown: BreakdownItem[] = Object.entries(questionImpacts)
        .map(([qId, impacts]) => {
            const question = questions.find(q => q.id === Number(qId))!;
            const impactForTop = impacts[topIdeologyId] || 0;
            return {
                questionText: question.text,
                impact: Math.abs(impactForTop),
                direction: impactForTop >= 0 ? 'positive' : 'negative'
            };
        })
        .filter(item => item.impact > 0)
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 4) as BreakdownItem[];

    return {
        topIdeology: ideologies[topIdeologyId],
        oppositeIdeology: ideologies[oppositeIdeologyId],
        allScores: finalScores,
        axisScores,
        matchPercentage: finalScores[topIdeologyId],
        leaderMatches,
        breakdown
    };
};
