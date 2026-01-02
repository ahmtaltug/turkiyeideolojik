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
    const rawWeights: Record<string, number> = {};
    const ideologyMaxPossible: Record<string, number> = {};

    // Initialize ideology trackers
    Object.keys(ideologies).forEach(id => {
        rawWeights[id] = 0;
        ideologyMaxPossible[id] = 0;
    });

    const axisRawScores: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMaxPossible: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const questionImpacts: Record<number, Partial<Record<IdeologyId, number>>> = {};

    // 1. First Pass: Calculate Maximum Possible Weights for Normalization
    questions.forEach(q => {
        Object.entries(q.weights).forEach(([ideologyId, weight]) => {
            ideologyMaxPossible[ideologyId] += Math.abs(weight as number);
        });
        Object.entries(q.axisWeights).forEach(([axisId, weight]) => {
            axisMaxPossible[axisId as AxisId] += Math.abs(weight as number);
        });
    });

    // 2. Second Pass: Process User Responses
    Object.entries(responses).forEach(([qId, answer]) => {
        const question = questions.find((q) => q.id === Number(qId));
        if (!question || answer === 'neutral') return;

        const multiplier = answer === 'agree' ? 1 : -1;
        questionImpacts[question.id] = {};

        Object.entries(question.weights).forEach(([ideologyId, weight]) => {
            const impact = (weight as number) * multiplier;
            rawWeights[ideologyId] += impact;
            questionImpacts[question.id][ideologyId as IdeologyId] = impact;
        });

        Object.entries(question.axisWeights).forEach(([axisId, weight]) => {
            axisRawScores[axisId as AxisId] += (weight as number) * multiplier;
        });
    });

    // 3. Normalize Axis Scores (-100 to 100)
    const normalizedAxes: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisScores: AxisScore[] = (Object.keys(axisRawScores) as AxisId[]).map(axisId => {
        const raw = axisRawScores[axisId];
        const max = axisMaxPossible[axisId];
        const value = max === 0 ? 0 : Math.round((raw / max) * 100);
        normalizedAxes[axisId] = value;
        return { id: axisId, name: AXES[axisId].name, value, labels: AXES[axisId].labels };
    });

    // 4. Advanced Ideology Match Calculation
    const finalScores = {} as Record<IdeologyId, number>;

    Object.entries(ideologies).forEach(([id, ideology]) => {
        const ideologyId = id as IdeologyId;

        // A. Normalized Weight Score (0-100)
        // Adjust for potential bias towards ideologies with more questions
        const maxW = ideologyMaxPossible[ideologyId];
        const weightScore = maxW === 0 ? 50 : ((rawWeights[ideologyId] + maxW) / (2 * maxW)) * 100;

        // B. Precision Distance Score (Gaussian Decay)
        // Linear distance doesn't capture the 'clustering' effect of political ideologies.
        // We use a normalized Euclidean distance with an exponential decay for a sharper 'match' effect.
        let distanceSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const delta = (normalizedAxes[axisId] - ideology.idealAxes[axisId]) / 100; // Normalized to 0-2 range
            distanceSum += Math.pow(delta, 2);
        });

        const euclideanDistance = Math.sqrt(distanceSum);
        // Gaussian match formula: e^(- (d^2) / (2 * sigma^2))
        // sigma=1.0 is a good default for 4 axes normalization
        const sigma = 1.25;
        const distanceMatch = Math.exp(-Math.pow(euclideanDistance, 2) / (2 * Math.pow(sigma, 2))) * 100;

        // 5. Final Hybrid Blend (30% Weights, 70% Point-in-Space)
        // Point-in-space (Axis) is more reliable for long-term ideology than individual question weights.
        finalScores[ideologyId] = Math.round((weightScore * 0.3) + (distanceMatch * 0.7));
    });

    // Sort Result
    const sortedResult = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
    const topIdeologyId = sortedResult[0][0] as IdeologyId;
    const oppositeIdeologyId = sortedResult[sortedResult.length - 1][0] as IdeologyId;

    // Leader Precision Comparison (Same Gaussian Logic)
    const leaderMatches: LeaderMatch[] = leaders.map(leader => {
        let dSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const delta = (normalizedAxes[axisId] - leader.coordinates[axisId]) / 100;
            dSum += Math.pow(delta, 2);
        });
        const dMatch = Math.exp(-Math.pow(Math.sqrt(dSum), 2) / (2 * Math.pow(1.5, 2))) * 100;
        return { leader, matchPercentage: Math.round(dMatch) };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Breakdown Analysis
    const breakdown: BreakdownItem[] = Object.entries(questionImpacts)
        .map(([qId, impacts]) => {
            const question = questions.find(q => q.id === Number(qId))!;
            const impactForTop = impacts[topIdeologyId] || 0;
            return {
                questionText: question.text,
                impact: Math.abs(impactForTop),
                direction: (impactForTop >= 0 ? 'positive' : 'negative') as 'positive' | 'negative'
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
