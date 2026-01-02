import { IdeologyId, ideologies, Ideology } from '../data/ideologies';
import { questions, AxisId } from '../data/questions';

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
    const rawWeights: Record<IdeologyId, number> = {} as any;
    const axisRawScores: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMaxPossible: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };

    // Initialize ideology weights
    Object.keys(ideologies).forEach(id => {
        rawWeights[id as IdeologyId] = 0;
    });

    const ideologyMaxPossible: Record<IdeologyId, number> = { ...rawWeights };

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

        Object.entries(question.weights).forEach(([ideologyId, weight]) => {
            rawWeights[ideologyId as IdeologyId] += (weight as number) * multiplier;
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

    // Calculate Similarity for each ideology
    const finalScores: Record<IdeologyId, number> = {} as any;

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

    return {
        topIdeology: ideologies[topIdeologyId],
        allScores: finalScores,
        axisScores,
        matchPercentage: finalScores[topIdeologyId]
    };
};
