import { IdeologyId, ideologies } from '../data/ideologies';
import { questions } from '../data/questions';

export type Answer = 'agree' | 'disagree' | 'neutral';

export interface UserResponses {
    [questionId: number]: Answer;
}

export const calculateScores = (responses: UserResponses) => {
    const rawScores: Record<IdeologyId, number> = {
        kemalist: 0,
        sosyal_demokrat: 0,
        muhafazakar: 0,
        milliyetci: 0,
        liberal: 0,
        sosyalist: 0,
        kurt_siyasi: 0,
        islamci: 0,
        avrasyaci: 0,
        ulusalci: 0,
        merkez_sag: 0,
        yesil: 0,
    };

    // Calculate potential maximum and minimum for normalization
    const maxPossible: Record<IdeologyId, number> = { ...rawScores };

    questions.forEach(q => {
        Object.entries(q.weights).forEach(([ideologyId, weight]) => {
            maxPossible[ideologyId as IdeologyId] += Math.abs(weight as number);
        });
    });

    Object.entries(responses).forEach(([qId, answer]) => {
        const question = questions.find((q) => q.id === Number(qId));
        if (!question) return;

        if (answer === 'neutral') return;

        const multiplier = answer === 'agree' ? 1 : -1;

        Object.entries(question.weights).forEach(([ideologyId, weight]) => {
            rawScores[ideologyId as IdeologyId] += (weight as number) * multiplier;
        });
    });

    // Normalize scores to 0-100 range based on maximum possible alignment
    const normalizedScores: Record<IdeologyId, number> = { ...rawScores };
    Object.keys(normalizedScores).forEach((id) => {
        const ideologyId = id as IdeologyId;
        const max = maxPossible[ideologyId];
        if (max === 0) {
            normalizedScores[ideologyId] = 0;
        } else {
            // (Raw + Max) / (2 * Max) * 100 
            // This maps -Max to 0, 0 to 50, and +Max to 100
            normalizedScores[ideologyId] = Math.round(((rawScores[ideologyId] + max) / (2 * max)) * 100);
        }
    });

    // Get the highest scoring ideology
    const sortedIdeologies = Object.entries(normalizedScores).sort(([, a], [, b]) => b - a);
    const topIdeologyId = sortedIdeologies[0][0] as IdeologyId;

    return {
        topIdeology: ideologies[topIdeologyId],
        allScores: normalizedScores,
    };
};
