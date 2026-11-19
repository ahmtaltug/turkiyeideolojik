'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, RefreshCw, BarChart3, Users, PlayCircle } from 'lucide-react';
import QuizEngine from '@/components/QuizEngine';
import ResultScreen from '@/components/ResultScreen';
import { questions } from '@/data/questions';
import {
  UserResponses,
  calculateScores,
  decodeResponses,
  encodeResponses,
  pickBalancedQuestions,
} from '@/utils/scoring';
import { QuizMode, SavedProgress, clearProgress, loadProgress } from '@/utils/storage';
import { CONTENT_DATE, SHARE_PARAM } from '@/lib/site';
import Link from 'next/link';

const QUICK_COUNT = 20;


type View =
  | { name: 'home' }
  | { name: 'quiz'; mode: QuizMode; questionIds: number[]; index: number; responses: UserResponses }
  | { name: 'result'; responses: UserResponses; shared: boolean; mode?: QuizMode };

const setShareParam = (code: string | null) => {
  const url = new URL(window.location.href);
  if (code) url.searchParams.set(SHARE_PARAM, code);
  else url.searchParams.delete(SHARE_PARAM);
  url.hash = '';
  window.history.replaceState(null, '', url.pathname + url.search);
};

interface AppProps {
  /** Share code from the URL, decoded on the server so shared results render without a flash. */
  initialSharedCode?: string;
  /** Whether anonymous statistics collection is configured on the server. */
  statsEnabled: boolean;
}

export default function App({ initialSharedCode, statsEnabled }: AppProps) {
  const [view, setView] = useState<View>(() => {
    const shared = initialSharedCode ? decodeResponses(initialSharedCode) : null;
    return shared ? { name: 'result', responses: shared, shared: true } : { name: 'home' };
  });
  const [saved, setSaved] = useState<SavedProgress | null>(null);

  // Saved progress lives in localStorage, so it is read after hydration.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSaved(loadProgress());
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [view.name]);

  const result = useMemo(
    () => (view.name === 'result' ? calculateScores(view.responses) : null),
    [view]
  );

  const startQuiz = (mode: QuizMode) => {
    clearProgress();
    setSaved(null);
    const ids = mode === 'full'
      ? questions.map(q => q.id)
      : pickBalancedQuestions(questions, QUICK_COUNT).map(q => q.id);
    setView({ name: 'quiz', mode, questionIds: ids, index: 0, responses: {} });
  };

  const resumeQuiz = () => {
    if (!saved) return;
    setView({ name: 'quiz', mode: saved.mode, questionIds: saved.questionIds, index: saved.currentIndex, responses: saved.responses });
  };

  const finishQuiz = useCallback((responses: UserResponses) => {
    setShareParam(encodeResponses(responses));
    setView(prev => ({ name: 'result', responses, shared: false, mode: prev.name === 'quiz' ? prev.mode : undefined }));
  }, []);

  const goHome = useCallback(() => {
    setShareParam(null);
    setSaved(loadProgress());
    setView({ name: 'home' });
  }, []);

  return (
    <main className="min-h-svh flex flex-col items-center justify-center p-4 md:p-8">
      <AnimatePresence mode="wait">
        {view.name === 'home' && (
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
                className="inline-block p-4 rounded-[2rem] bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-white/10 mb-4 animate-float"
              >
                <BarChart3 className="w-14 h-14 text-white" aria-hidden="true" />
              </motion.div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
                <span className="gradient-text">Türkiye</span>{' '}
                <span className="text-white">İdeolojik</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-400 max-w-lg mx-auto leading-relaxed">
                Kaydırmalı sorularla Türkiye siyasetindeki yerini keşfet.
              </p>
            </div>

            {saved && (
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={resumeQuiz}
                className="w-full max-w-md mx-auto flex items-center justify-center gap-3 px-6 py-4 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 font-bold hover:bg-yellow-500/15 transition-colors"
              >
                <PlayCircle className="w-5 h-5" />
                Kaldığın yerden devam et ({saved.mode === 'quick' ? 'Hızlı' : 'Tam'} • {saved.currentIndex}/{saved.questionIds.length})
              </motion.button>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-md mx-auto">
              <button
                onClick={() => startQuiz('full')}
                className="group relative w-full px-8 py-5 bg-white text-black font-black rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex flex-col items-center"
              >
                <span className="flex items-center gap-2 mb-1">
                  Tam Analiz
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[10px] uppercase opacity-60 font-bold">{questions.length} Soru • ~4 Dakika</span>
              </button>

              <button
                onClick={() => startQuiz('quick')}
                className="group relative w-full px-8 py-5 glass text-white font-bold rounded-2xl overflow-hidden transition-all hover:scale-105 active:scale-95 flex flex-col items-center"
              >
                <span className="flex items-center gap-2 mb-1">
                  Hızlı Test
                  <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </span>
                <span className="text-[10px] uppercase opacity-60 font-bold">{QUICK_COUNT} Soru • ~2 Dakika</span>
              </button>
            </div>

            <div className="pt-8 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
              {[
                { icon: BarChart3, title: 'Analiz', text: '13 ideoloji ve 4 eksen üzerinden ayrıntılı eşleşme.' },
                { icon: RefreshCw, title: 'Kaydır', text: 'Katılıyorsan sağa, katılmıyorsan sola kaydır. Butonlar ve klavye de çalışır.' },
                { icon: Users, title: 'Liderler', text: 'Görüşlerinin hangi siyasi liderlere ve partilere yakın olduğunu gör.' },
              ].map(item => (
                <div key={item.title} className="glass p-6 rounded-2xl space-y-3">
                  <item.icon className="w-6 h-6 text-gray-400" aria-hidden="true" />
                  <h2 className="font-bold text-white">{item.title}</h2>
                  <p className="text-sm text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>

            <p className="text-xs text-gray-500 max-w-md mx-auto leading-relaxed">
              Cevapların tarayıcında işlenir ve kaydedilmez. İçerik {CONTENT_DATE} itibarıyla günceldir.
            </p>

            <footer className="pt-4 text-gray-600 text-xs uppercase tracking-widest font-medium">
              &copy; {new Date().getFullYear()} Türkiye İdeolojik &bull; Bilimsel bir ölçüm değildir &bull;{' '}
              <Link href="/yontem" className="underline underline-offset-4 hover:text-gray-400">Yöntem</Link> &bull;{' '}
              <Link href="/istatistik" className="underline underline-offset-4 hover:text-gray-400">İstatistikler</Link> &bull;{' '}
              <Link href="/gizlilik" className="underline underline-offset-4 hover:text-gray-400">Gizlilik</Link>
            </footer>
          </motion.div>
        )}

        {view.name === 'quiz' && (
          <QuizEngine
            key={`quiz-${view.questionIds.join(',')}`}
            mode={view.mode}
            questionIds={view.questionIds}
            initialIndex={view.index}
            initialResponses={view.responses}
            onFinish={finishQuiz}
            onExit={goHome}
          />
        )}

        {view.name === 'result' && result && (
          <ResultScreen
            key="result"
            result={result}
            shared={view.shared}
            mode={view.mode}
            statsEnabled={statsEnabled}
            onReset={goHome}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
