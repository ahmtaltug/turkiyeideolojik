'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, BarChart3, Info } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
import ResultScreen from '@/components/ResultScreen';
import { Ideology, IdeologyId } from '@/data/ideologies';

export default function Home() {
  const [view, setView] = useState<'home' | 'quiz' | 'result'>('home');
  const [result, setResult] = useState<Ideology | null>(null);
  const [resultScores, setResultScores] = useState<Record<IdeologyId, number> | null>(null);

  const startQuiz = () => setView('quiz');

  const finishQuiz = (ideology: Ideology, scores: Record<IdeologyId, number>) => {
    setResult(ideology);
    setResultScores(scores);
    setView('result');
  };

  const reset = () => {
    setResult(null);
    setResultScores(null);
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
                Tinder usulü kaydırmalı sorularla Türkiye siyasetindeki gerçek kimliğini keşfet. 13 farklı ideolojik ana akımdan hangisine daha yakınsın?
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={startQuiz}
                className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
              >
                <span className="relative z-10">Başla</span>
                <ChevronRight className="w-5 h-5 relative z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-blue-500 opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
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
          <QuizEngine key="quiz" onFinish={finishQuiz} onReset={reset} />
        )}

        {view === 'result' && result && resultScores && (
          <ResultScreen key="result" ideology={result} allScores={resultScores} onReset={reset} />
        )}
      </AnimatePresence>
    </main>
  );
}
