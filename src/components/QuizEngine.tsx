'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Check, SkipForward, Undo2, Volume2, VolumeX, X } from 'lucide-react';
import { questions as allQuestions, Question } from '@/data/questions';
import { Answer, MIN_ANSWERS, UserResponses } from '@/utils/scoring';
import { playSwipeSound, vibrate, warmUpAudio } from '@/utils/sound';
import { QuizMode, saveProgress, clearProgress, loadSoundEnabled, saveSoundEnabled } from '@/utils/storage';
import SwipeCard, { SwipeDirection } from './SwipeCard';

interface QuizEngineProps {
    mode: QuizMode;
    questionIds: number[];
    initialIndex?: number;
    initialResponses?: UserResponses;
    onFinish: (responses: UserResponses) => void;
    onExit: () => void;
}

const questionMap = new Map<number, Question>(allQuestions.map(q => [q.id, q]));

export default function QuizEngine({
    mode,
    questionIds,
    initialIndex = 0,
    initialResponses = {},
    onFinish,
    onExit,
}: QuizEngineProps) {
    const questions = useMemo(
        () => questionIds.map(id => questionMap.get(id)).filter((q): q is Question => !!q),
        [questionIds]
    );
    const [currentIndex, setCurrentIndex] = useState(Math.min(initialIndex, questions.length - 1));
    const [responses, setResponses] = useState<UserResponses>(initialResponses);
    const [exitDirection, setExitDirection] = useState<SwipeDirection | null>(null);
    const [soundOn, setSoundOn] = useState(false);
    const [notice, setNotice] = useState<string | null>(null);
    const finishedRef = useRef(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- read client-only preference after hydration
        setSoundOn(loadSoundEnabled());
    }, []);

    const current = questions[currentIndex];
    const next = questions[currentIndex + 1];

    /** Records an answer (or a skip, which removes any earlier answer) and moves on. */
    const respond = useCallback((choice: SwipeDirection | 'skip') => {
        if (!current || finishedRef.current) return;
        if (choice !== 'skip') {
            if (soundOn) playSwipeSound(choice);
            vibrate();
        }

        const newResponses = { ...responses };
        if (choice === 'skip') delete newResponses[current.id];
        else newResponses[current.id] = (choice === 'right' ? 'agree' : 'disagree') as Answer;
        setResponses(newResponses);

        if (currentIndex < questions.length - 1) {
            setNotice(null);
            setExitDirection(choice === 'skip' ? null : choice);
            const nextIndex = currentIndex + 1;
            setCurrentIndex(nextIndex);
            saveProgress({ mode, questionIds, currentIndex: nextIndex, responses: newResponses });
            return;
        }

        if (Object.keys(newResponses).length < MIN_ANSWERS) {
            setNotice(`Sonuç için en az ${MIN_ANSWERS} soruyu cevaplaman gerekiyor. Geri dönüp atladığın sorulara cevap verebilirsin.`);
            return;
        }
        finishedRef.current = true;
        setExitDirection(choice === 'skip' ? null : choice);
        clearProgress();
        // Let the last card fly out before switching screens.
        setTimeout(() => onFinish(newResponses), 250);
    }, [current, currentIndex, mode, onFinish, questionIds, questions.length, responses, soundOn]);

    const goBack = useCallback(() => {
        if (currentIndex === 0 || finishedRef.current) return;
        setExitDirection(null);
        setNotice(null);
        const prevIndex = currentIndex - 1;
        setCurrentIndex(prevIndex);
        saveProgress({ mode, questionIds, currentIndex: prevIndex, responses });
    }, [currentIndex, mode, questionIds, responses]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'ArrowRight') { e.preventDefault(); respond('right'); }
            else if (e.key === 'ArrowLeft') { e.preventDefault(); respond('left'); }
            else if (e.key === 'ArrowDown') { e.preventDefault(); respond('skip'); }
            else if (e.key === 'Backspace' || e.key === 'z') { e.preventDefault(); goBack(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [respond, goBack]);

    const toggleSound = () => {
        setSoundOn(prev => {
            saveSoundEnabled(!prev);
            return !prev;
        });
    };

    const progress = (currentIndex / questions.length) * 100;
    const previousAnswer = current ? responses[current.id] : undefined;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg min-h-[560px] h-[85svh] max-h-[760px] flex flex-col pt-2"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6 px-2">
                <button
                    onClick={onExit}
                    aria-label="Ana sayfaya dön"
                    className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                        {mode === 'quick' ? 'Hızlı Test' : 'Tam Analiz'} • Soru {currentIndex + 1} / {questions.length}
                    </span>
                    <div
                        className="w-40 h-1.5 bg-white/5 rounded-full overflow-hidden"
                        role="progressbar"
                        aria-valuemin={0}
                        aria-valuemax={questions.length}
                        aria-valuenow={currentIndex}
                        aria-label="İlerleme"
                    >
                        <motion.div
                            initial={false}
                            animate={{ scaleX: progress / 100 }}
                            transition={{ duration: 0.25 }}
                            className="h-full w-full origin-left bg-gradient-to-r from-red-500 to-blue-500"
                        />
                    </div>
                </div>
                <button
                    onClick={toggleSound}
                    aria-label={soundOn ? 'Sesi kapat' : 'Sesi aç'}
                    aria-pressed={soundOn}
                    className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                >
                    {soundOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </button>
            </div>

            {/* Card stack */}
            <div className="relative flex-1 mx-2" onPointerDown={soundOn ? warmUpAudio : undefined}>
                {next && (
                    // Solid background, no backdrop-filter or blur(): the front card moves over
                    // this every frame, and filters behind it are what made swiping stutter.
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 rounded-3xl bg-[#0a0a0a] border border-white/5 scale-95 translate-y-4"
                    />
                )}
                <AnimatePresence custom={exitDirection} initial={false}>
                    {current && (
                        <SwipeCard key={current.id} text={current.text} onSwipe={respond} />
                    )}
                </AnimatePresence>
            </div>

            <div className="mt-3 min-h-[2.5rem] px-3 text-center">
                {current?.context && (
                    <p className="text-[11px] leading-snug text-gray-500">
                        <span className="font-bold uppercase tracking-wider text-gray-400">Bağlam: </span>
                        {current.context}
                    </p>
                )}
            </div>

            {previousAnswer && (
                <p className="mt-3 text-center text-[11px] text-gray-500 uppercase tracking-widest">
                    Önceki cevabın: <span className={previousAnswer === 'agree' ? 'text-green-500' : 'text-red-500'}>
                        {previousAnswer === 'agree' ? 'Katılıyorum' : 'Katılmıyorum'}
                    </span>
                </p>
            )}

            {notice && (
                <p role="alert" className="mt-3 mx-2 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-300 text-xs text-center">
                    {notice}
                </p>
            )}

            {/* Answer buttons */}
            <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-2">
                <button
                    onClick={() => respond('left')}
                    className="flex items-center justify-center gap-1.5 px-2 py-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-black uppercase text-xs sm:text-sm sm:tracking-wider hover:bg-red-500/20 active:scale-95 transition-all"
                >
                    <X className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" /> Katılmıyorum
                </button>
                <button
                    onClick={goBack}
                    disabled={currentIndex === 0}
                    aria-label="Önceki soruya dön"
                    title="Önceki soruya dön"
                    className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 active:scale-95 transition-all disabled:opacity-30 disabled:pointer-events-none"
                >
                    <Undo2 className="w-5 h-5" />
                </button>
                <button
                    onClick={() => respond('right')}
                    className="flex items-center justify-center gap-1.5 px-2 py-4 rounded-2xl bg-green-500/10 border border-green-500/20 text-green-400 font-black uppercase text-xs sm:text-sm sm:tracking-wider hover:bg-green-500/20 active:scale-95 transition-all"
                >
                    Katılıyorum <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                </button>
            </div>

            <button
                onClick={() => respond('skip')}
                className="mt-3 mx-auto flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
                Fikrim yok, geç <SkipForward className="w-3.5 h-3.5" />
            </button>

            <p className="mt-2 text-center text-xs text-gray-600 hidden md:block">
                Kartı kaydır ya da klavyede <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">←</kbd>{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">→</kbd> kullan •{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↓</kbd> geç •{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">Backspace</kbd> geri al
            </p>
        </motion.div>
    );
}
