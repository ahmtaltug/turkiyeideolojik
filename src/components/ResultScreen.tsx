import { motion } from 'framer-motion';
import { RefreshCcw, PartyPopper, UserCheck, BarChart2 } from 'lucide-react';
import { Ideology, IdeologyId, ideologies } from '@/data/ideologies';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

interface ResultScreenProps {
    ideology: Ideology;
    allScores: Record<IdeologyId, number>;
    onReset: () => void;
}

export default function ResultScreen({ ideology, allScores, onReset }: ResultScreenProps) {
    // Prepare data for Radar Chart
    const radarData = Object.entries(allScores).map(([id, score]) => ({
        subject: ideologies[id as IdeologyId].name,
        A: score,
        fullMark: 100,
    }));

    // Find leader matches (top ideology leaders)
    const leaderMatches = ideology.leaders;

    return (
        <div className="max-w-4xl w-full text-center space-y-8 py-8 px-4">
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

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Summary and Roast */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-3xl text-left space-y-6 flex flex-col h-full"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white mb-2">
                            <BarChart2 className="w-5 h-5" />
                            <h3 className="text-xl font-bold">İdeoloji Özeti</h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed">
                            {ideology.description}
                        </p>
                    </div>

                    <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                        <p className="text-red-400 italic text-sm">
                            <span className="font-bold uppercase mr-2.1">Gerçekler:</span>
                            "{ideology.roast}"
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-white mb-2">
                            <UserCheck className="w-5 h-5" />
                            <h3 className="text-lg font-bold">Lider Eşleşmesi</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {leaderMatches.map((leader, i) => (
                                <span key={i} className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white font-medium">
                                    {leader}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold text-gray-500 uppercase mb-3">İlgili Partiler</h3>
                        <div className="flex flex-wrap gap-2">
                            {ideology.parties.map((party, i) => (
                                <span key={i} className="text-xs px-3 py-1 bg-white/5 rounded-lg text-gray-400 border border-white/10">
                                    {party}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Right Column: Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-8 rounded-3xl flex flex-col items-center justify-center min-h-[400px]"
                >
                    <h3 className="text-xl font-bold text-white mb-6">Detaylı Analiz</h3>
                    <div className="w-full h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                                <PolarGrid stroke="#ffffff10" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10 }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Uyum"
                                    dataKey="A"
                                    stroke={ideology.color}
                                    fill={ideology.color}
                                    fillOpacity={0.5}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', color: '#fff' }}
                                    itemStyle={{ color: ideology.color }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="flex items-center justify-center pt-4">
                <button
                    onClick={onReset}
                    className="px-12 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center shadow-lg shadow-white/10"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Yeniden Çöz
                </button>
            </div>
        </div>
    );
}
