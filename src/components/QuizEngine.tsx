'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { questions } from '@/data/questions';
import { Ideology, IdeologyId } from '@/data/ideologies';
import { Answer, UserResponses, calculateScores, AxisScore } from '@/utils/scoring';
import SwipeCard from './SwipeCard';

interface QuizEngineProps {

    onFinish: (ideology: Ideology, allScores: Record<IdeologyId, number>, axisScores: AxisScore[], matchPercentage: number) => void;
    onReset: () => void;
}

export default function QuizEngine({ onFinish, onReset }: QuizEngineProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [responses, setResponses] = useState<UserResponses>({});

    const handleSwipe = (direction: 'left' | 'right') => {
        const question = questions[currentIndex];
        const answer: Answer = direction === 'right' ? 'agree' : 'disagree';

        const newResponses = { ...responses, [question.id]: answer };
        setResponses(newResponses);

        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            const result = calculateScores(newResponses);
            onFinish(result.topIdeology, result.allScores, result.axisScores, result.matchPercentage);
        }
    };


    const progress = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="w-full max-w-lg h-[80vh] flex flex-col pt-4">
            {/* Quiz Header */}
            <div className="flex items-center justify-between mb-8 px-4">
                <button
                    onClick={onReset}
                    className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                        Soru {currentIndex + 1} / {questions.length}
                    </span>
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-red-500 to-blue-500"
                        />
                    </div>
                </div>
                <div className="w-10" /> {/* Spacer */}
            </div>

            {/* Card Stack */}
            <div className="relative flex-1 perspective-1000">
                <AnimatePresence mode="popLayout">
                    {questions.slice(currentIndex, currentIndex + 2).reverse().map((question, index) => {
                        const isFront = index === (questions.slice(currentIndex, currentIndex + 2).length - 1);
                        return (
                            <SwipeCard
                                key={question.id}
                                text={question.text}
                                onSwipe={handleSwipe}
                                isFront={isFront}
                            />
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Instructions */}
            <div className="mt-8 flex justify-center items-center gap-2 text-gray-500 animate-pulse">
                <HelpCircle className="w-4 h-4" />
                <span className="text-sm">Kartı kaydırarak karar ver</span>
            </div>
        </div>
    );
}
