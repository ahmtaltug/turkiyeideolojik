'use client';

import { motion } from 'framer-motion';
import { RefreshCcw, Share2, PartyPopper } from 'lucide-react';
import { Ideology } from '@/data/ideologies';

interface ResultScreenProps {
    ideology: Ideology;
    onReset: () => void;
}

export default function ResultScreen({ ideology, onReset }: ResultScreenProps) {
    return (
        <div className="max-w-2xl w-full text-center space-y-8 py-8">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10"
            >
                <PartyPopper className="w-12 h-12 text-white" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Sonuç Açıklandı</h2>
                <motion.h1
                    className="text-5xl md:text-6xl font-black italic uppercase"
                    style={{ color: ideology.color }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {ideology.name}
                </motion.h1>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="glass p-8 rounded-3xl text-left space-y-6"
            >
                <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">İdeoloji Özeti</h3>
                    <p className="text-gray-400 leading-relaxed">
                        {ideology.description}
                    </p>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                    <p className="text-red-400 italic text-sm">
                        <span className="font-bold uppercase mr-2.1 NOT_A_REAL_CSS_CLASS">Gerçekler:</span>
                        "{ideology.roast}"
                    </p>
                </div>

                <div className="h-px bg-white/5" />

                <div className="space-y-4">
                    <h3 className="text-lg font-bold text-white">Bu görüşe en yakın partiler:</h3>
                    <div className="flex flex-wrap gap-3">
                        {ideology.parties.map((party, i) => (
                            <span
                                key={i}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                            >
                                {party}
                            </span>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                    onClick={onReset}
                    className="px-8 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Yeniden Çöz
                </button>
                <button
                    onClick={() => {
                        if (navigator.share) {
                            navigator.share({
                                title: 'Türkiyeİdeolojik',
                                text: `Benim siyasi kimliğim: ${ideology.name}. Seninki ne?`,
                                url: window.location.href,
                            });
                        } else {
                            alert('Sonuç: ' + ideology.name);
                        }
                    }}
                    className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full flex items-center gap-2 hover:bg-white/10 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center"
                >
                    <Share2 className="w-5 h-5" />
                    Paylaş
                </button>
            </div>
        </div>
    );
}
