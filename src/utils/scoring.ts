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

const AXIS_IMPORTANCE: Record<AxisId, number> = {
    milliyetcilik: 1.3,
    toplum: 1.2,
    ekonomi: 0.9,
    yonetim: 0.7
};

const IDEOLOGY_RIGIDITY: Record<IdeologyId, number> = {
    islamci: 1.4,
    sosyalist: 1.3,
    boluculuk: 1.5,
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

export const calculateScores = (responses: UserResponses) => {
    const ideologyScores: Record<IdeologyId, number> = {} as Record<IdeologyId, number>;
    const ideologyMaxPossible: Record<IdeologyId, number> = {} as Record<IdeologyId, number>;

    // Initialize
    (Object.keys(ideologies) as IdeologyId[]).forEach(id => {
        ideologyScores[id] = 0;
        ideologyMaxPossible[id] = 0;
    });

    const axisRawScores: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisMaxPossible: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const questionImpacts: Record<number, Record<string, number>> = {};

    // For consistency check
    const axisResponseVectors: Record<AxisId, number[]> = { ekonomi: [], toplum: [], milliyetcilik: [], yonetim: [] };

    // Helper to get weight for an ideology, fallback to dot product if not defined
    const getEffectiveWeight = (q: Question, ideologyId: IdeologyId): number => {
        if (q.weights[ideologyId] !== undefined) return q.weights[ideologyId] as number;
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
        if (!question) return;

        const multiplier = answer === 'agree' ? 1 : -1;
        questionImpacts[question.id] = {};

        Object.keys(ideologies).forEach(id => {
            const ideologyId = id as IdeologyId;
            const weight = getEffectiveWeight(question, ideologyId);
            let impact = weight * multiplier;

            // RED LINE PENALTY: Extra penalty if opposing a core value
            if (Math.abs(weight) >= 8 && Math.sign(weight) !== Math.sign(multiplier)) {
                impact *= 1.5;
            }

            ideologyScores[ideologyId] += impact;
            questionImpacts[question.id][ideologyId] = impact;
        });

        Object.entries(question.axisWeights).forEach(([axisId, weight]) => {
            const val = (weight as number) * multiplier;
            axisRawScores[axisId as AxisId] += val;
            axisResponseVectors[axisId as AxisId].push(val);
        });
    });

    // Consistency Score: High variance in same-axis responses indicates low consistency
    let consistencyScore = 100;
    let totalConflict = 0;
    Object.values(axisResponseVectors).forEach(vectors => {
        if (vectors.length < 2) return;
        const signs = vectors.map(v => Math.sign(v)).filter(s => s !== 0);
        const conflicts = signs.filter(s => s !== signs[0]).length;
        totalConflict += conflicts / vectors.length;
    });
    consistencyScore = Math.max(0, Math.round(100 - (totalConflict * 25)));

    // Normalize Axis Scores
    const normalizedAxes: Record<AxisId, number> = { ekonomi: 0, toplum: 0, milliyetcilik: 0, yonetim: 0 };
    const axisScores: AxisScore[] = (Object.keys(axisRawScores) as AxisId[]).map(axisId => {
        const raw = axisRawScores[axisId];
        const max = axisMaxPossible[axisId];
        const value = max === 0 ? 0 : Math.round((raw / max) * 100);
        normalizedAxes[axisId] = value;
        return { id: axisId, name: AXES[axisId].name, value, labels: AXES[axisId].labels };
    });

    // Final Scoring (Gaussian with weights and rigidity)
    const finalScores = {} as Record<IdeologyId, number>;
    Object.entries(ideologies).forEach(([id, ideology]) => {
        const ideologyId = id as IdeologyId;
        const maxW = ideologyMaxPossible[ideologyId];
        const weightScore = maxW === 0 ? 50 : ((ideologyScores[ideologyId] + maxW) / (2 * maxW)) * 100;

        let weightedDistanceSum = 0;
        let importanceSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const importance = AXIS_IMPORTANCE[axisId];
            const delta = (normalizedAxes[axisId] - ideology.idealAxes[axisId]) / 120;
            weightedDistanceSum += Math.pow(delta, 2) * importance;
            importanceSum += importance;
        });

        // DYNAMIC SIGMA (Rigidity): High rigidity means the "bell" is narrower
        const rigidity = IDEOLOGY_RIGIDITY[ideologyId] || 1.0;
        const distanceMatch = Math.exp(-(weightedDistanceSum * rigidity) / (importanceSum / 2)) * 100;

        // Final combine: Distance is more authoritative (75%) than raw weight
        finalScores[ideologyId] = Math.round((weightScore * 0.25) + (distanceMatch * 0.75));
    });

    const sortedResult = Object.entries(finalScores).sort(([, a], [, b]) => b - a);
    const topIdeologyId = sortedResult[0][0] as IdeologyId;
    const secondIdeologyId = sortedResult[1][0] as IdeologyId;
    const oppositeIdeologyId = sortedResult[sortedResult.length - 1][0] as IdeologyId;

    const topScore = sortedResult[0][1];
    const secondScore = sortedResult[1][1];
    const isHybrid = (topScore - secondScore) <= 5 && topScore > 40;

    let resultIdeology: Ideology & { isHybrid?: boolean; secondId?: IdeologyId } = { ...ideologies[topIdeologyId] };

    if (isHybrid) {
        const second = ideologies[secondIdeologyId];
        resultIdeology = {
            ...resultIdeology,
            isHybrid: true,
            secondId: secondIdeologyId,
            name: `${resultIdeology.name} - ${second.name} Sentezi`,
            description: `${resultIdeology.name} ve ${second.name} görüşlerinin ortak paydada buluştuğu hibrit bir siyasi kimlik.`,
            parties: [...new Set([...resultIdeology.parties, ...second.parties])],
        };
    }

    const leaderMatches: LeaderMatch[] = leaders.map(leader => {
        let dSum = 0;
        (Object.keys(AXES) as AxisId[]).forEach(axisId => {
            const delta = (normalizedAxes[axisId] - leader.coordinates[axisId]) / 150;
            dSum += Math.pow(delta, 2) * AXIS_IMPORTANCE[axisId];
        });
        const match = Math.exp(-dSum / 2.5) * 100;
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
        topIdeology: resultIdeology,
        oppositeIdeology: ideologies[oppositeIdeologyId],
        allScores: finalScores,
        axisScores,
        matchPercentage: topScore,
        leaderMatches,
        breakdown,
        consistencyScore
    };
};
