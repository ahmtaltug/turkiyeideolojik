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
    const ideologyScores: Record<IdeologyId, number> = {} as any;
    const ideologyMaxPossible: Record<IdeologyId, number> = {} as any;

    // Initialize
    Object.keys(ideologies).forEach(id => {
        ideologyScores[id as IdeologyId] = 0;
        ideologyMaxPossible[id as IdeologyId] = 0;
    });

    const axisRawScores: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMaxPossible: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const questionImpacts: Record<number, Partial<Record<IdeologyId, number>>> = {};

    // Helper to get weight for an ideology, fallback to dot product if not defined
    const getEffectiveWeight = (q: Question, ideologyId: IdeologyId): number => {
        // Use manual weight if exists
        if (q.weights[ideologyId] !== undefined) {
            return q.weights[ideologyId] as number;
        }

        // Dynamic weight based on Axis Projection (Dot Product)
        const ideology = ideologies[ideologyId];
        let projection = 0;
        Object.entries(q.axisWeights).forEach(([axis, weight]) => {
            const axisId = axis as AxisId;
            projection += (weight * ideology.idealAxes[axisId]) / 100;
        });
        return projection;
    };

    // Calculate maximums
    questions.forEach(q => {
        Object.keys(ideologies).forEach(id => {
            const ideologyId = id as IdeologyId;
            ideologyMaxPossible[ideologyId] += Math.abs(getEffectiveWeight(q, ideologyId));
        });
        Object.entries(q.axisWeights).forEach(([axisId, weight]) => {
            axisMaxPossible[axisId as AxisId] += Math.abs(weight as number);
        });
    });

    // Process responses
    Object.entries(responses).forEach(([qId, answer]) => {
        const question = questions.find((q) => q.id === Number(qId));
        if (!question || answer === 'neutral') return;

        const multiplier = answer === 'agree' ? 1 : -1;
        questionImpacts[question.id] = {};

        Object.keys(ideologies).forEach(id => {
            const ideologyId = id as IdeologyId;
            const weight = getEffectiveWeight(question, ideologyId);
            const impact = weight * multiplier;

            ideologyScores[ideologyId] += impact;
            questionImpacts[question.id][ideologyId] = impact;
        });

        Object.entries(question.axisWeights).forEach(([axisId, weight]) => {
            axisRawScores[axisId as AxisId] += (weight as number) * multiplier;
        });
    });

    // Normalize Axis Scores (-100 to 100)
    const normalizedAxes: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisScores: AxisScore[] = (Object.keys(axisRawScores) as AxisId[]).map(axisId => {
        const raw = axisRawScores[axisId];
        const max = axisMaxPossible[axisId];
        const value = max === 0 ? 0 : Math.round((raw / max) * 100);
        normalizedAxes[axisId] = value;
        return { id: axisId, name: AXES[axisId].name, value, labels: AXES[axisId].labels };
    });

    // Final Scoring (Gaussian)
    const finalScores = {} as Record<IdeologyId, number>;
    Object.entries(ideologies).forEach(([id, ideology]) => {
        const ideologyId = id as IdeologyId;
        const maxW = ideologyMaxPossible[ideologyId];
        const weightScore = maxW === 0 ? 50 : ((ideologyScores[ideologyId] + maxW) / (2 * maxW)) * 100;

        let distanceSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const delta = (normalizedAxes[axisId] - ideology.idealAxes[axisId]) / 120;
            distanceSum += Math.pow(delta, 2);
        });
        const distanceMatch = Math.exp(-distanceSum / 2) * 100;

        finalScores[ideologyId] = Math.round((weightScore * 0.3) + (distanceMatch * 0.7));
    });

    const sortedResult = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
    const topIdeologyId = sortedResult[0][0] as IdeologyId;
    const oppositeIdeologyId = sortedResult[sortedResult.length - 1][0] as IdeologyId;

    const leaderMatches: LeaderMatch[] = leaders.map(leader => {
        let dSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const delta = (normalizedAxes[axisId] - leader.coordinates[axisId]) / 150;
            dSum += Math.pow(delta, 2);
        });
        const match = Math.exp(-dSum / 2) * 100;
        return { leader, matchPercentage: Math.round(match) };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    const breakdown: BreakdownItem[] = Object.entries(questionImpacts)
        .map(([qId, impacts]) => {
            const question = questions.find(q => q.id === Number(qId))!;
            const impactForTop = impacts[topIdeologyId] || 0;
            return {
                questionText: question.text,
                impact: Math.abs(impactForTop),
                direction: (impactForTop >= 0 ? 'positive' : 'negative') as any
            };
        })
        .filter(item => item.impact > 0)
        .sort((a, b) => b.impact - a.impact)
        .slice(0, 4);

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
