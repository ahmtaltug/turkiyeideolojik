'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, BarChart3, Info } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
import ResultScreen from '@/components/ResultScreen';
import { Ideology, IdeologyId } from '@/data/ideologies';
import { AxisScore, BreakdownItem, LeaderMatch } from '@/utils/scoring';

export default function Home() {
  const [view, setView] = useState<'home' | 'quiz' | 'result'>('home');
  const [mode, setMode] = useState<'quick' | 'full'>('full');
  const [result, setResult] = useState<Ideology | null>(null);
  const [oppositeResult, setOppositeResult] = useState<Ideology | null>(null);
  const [resultScores, setResultScores] = useState<Record<IdeologyId, number> | null>(null);
  const [axisScores, setAxisScores] = useState<AxisScore[] | null>(null);
  const [matchPercentage, setMatchPercentage] = useState<number>(0);
  const [leaderMatches, setLeaderMatches] = useState<LeaderMatch[] | null>(null);
  const [breakdown, setBreakdown] = useState<BreakdownItem[] | null>(null);

  const startQuiz = (selectedMode: 'quick' | 'full') => {
    setMode(selectedMode);
    setView('quiz');
  };

  const finishQuiz = (
    ideology: Ideology,
    opposite: Ideology,
    scores: Record<IdeologyId, number>,
    axes: AxisScore[],
    match: number,
    leaders: LeaderMatch[],
    breakdownItems: BreakdownItem[]
  ) => {
    setResult(ideology);
    setOppositeResult(opposite);
    setResultScores(scores);
    setAxisScores(axes);
    setMatchPercentage(match);
    setLeaderMatches(leaders);
    setBreakdown(breakdownItems);
    setView('result');
  };

  const reset = () => {
    setResult(null);
    setOppositeResult(null);
    setResultScores(null);
    setAxisScores(null);
    setMatchPercentage(0);
    setLeaderMatches(null);
    setBreakdown(null);
    setView('home');
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="max-w-2xl w-full text-center space-y-8"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="inline-block p-3 rounded-2xl bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-white/10 mb-4"
              >
                <BarChart3 className="w-12 h-12 text-white" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="gradient-text">Türkiye</span>
                <span className="text-white">İdeolojik</span>
              </h1>
              <p className="text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
                Tinder usulü kaydırmalı sorularla Türkiye siyasetindeki gerçek kimliğini keşfet.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md">
                <button
                  onClick={() => startQuiz('full')}
                  className="group relative w-full px-8 py-5 bg-white text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex flex-col items-center"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>Tam Analiz</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-[10px] uppercase opacity-50 font-bold">40 Soru • Tam Profil</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
                </button>

                <button
                  onClick={() => startQuiz('quick')}
                  className="group relative w-full px-8 py-5 glass text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex flex-col items-center border-white/10"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span>Hızlı Test</span>
                    <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                  </div>
                  <span className="text-[10px] uppercase opacity-50 font-bold">20 Soru • 1.5 Dakika</span>
                </button>
              </div>
            </div>


            <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {[
                { icon: BarChart3, title: 'Analiz', text: '13 farklı ideolojik akım üzerinden derinlemesine eşleşme.' },
                { icon: RefreshCw, title: 'Swipe', text: 'Sıkıcı testlerden kurtul, sağa veya sola kaydırarak cevapla.' },
                { icon: Info, title: 'Partiler', text: 'Görüşlerine en yakın güncel siyasi partileri hemen öğren.' },
              ].map((item, i) => (
                <div key={i} className="glass p-6 rounded-2xl space-y-3">
                  <item.icon className="w-6 h-6 text-gray-400" />
                  <h3 className="font-bold text-white">{item.title}</h3>
                  <p className="text-sm text-gray-500">{item.text}</p>
                </div>
              ))}
            </div>

            <footer className="pt-12 text-gray-600 text-xs uppercase tracking-widest font-medium">
              &copy; 2026 Türkiyeİdeolojik &bull; Bilimsel Değildir
            </footer>
          </motion.div>
        )}

        {view === 'quiz' && (
          <QuizEngine key="quiz" mode={mode} onFinish={finishQuiz} onReset={reset} />
        )}


        {view === 'result' && result && oppositeResult && resultScores && axisScores && leaderMatches && breakdown && (
          <ResultScreen
            key="result"
            ideology={result}
            oppositeIdeology={oppositeResult}
            allScores={resultScores}
            axisScores={axisScores}
            matchPercentage={matchPercentage}
            leaderMatches={leaderMatches}
            breakdown={breakdown}
            onReset={reset}
          />
        )}


      </AnimatePresence>
    </main>
  );
}
