import { motion } from 'framer-motion';
import { RefreshCcw, PartyPopper, UserCheck, BarChart2, Compass } from 'lucide-react';
import { Ideology, IdeologyId, ideologies } from '@/data/ideologies';
import { AxisScore } from '@/utils/scoring';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

interface ResultScreenProps {
    ideology: Ideology;
    allScores: Record<IdeologyId, number>;
    axisScores: AxisScore[];
    matchPercentage: number;
    onReset: () => void;
}

export default function ResultScreen({ ideology, allScores, axisScores, matchPercentage, onReset }: ResultScreenProps) {
    // Prepare data for Radar Chart
    const radarData = Object.entries(allScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 8) // Show top 8 for better readability
        .map(([id, score]) => ({
            subject: ideologies[id as IdeologyId].name,
            A: score,
            fullMark: 100,
        }));

    return (
        <div className="max-w-6xl w-full text-center space-y-8 py-8 px-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 15 }}
                className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10"
            >
                <div className="relative">
                    <PartyPopper className="w-12 h-12 text-white" />
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-black"
                    >
                        %{matchPercentage}
                    </motion.div>
                </div>
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">En Yakın Eşleşme</h2>
                <motion.h1
                    className="text-5xl md:text-7xl font-black italic uppercase leading-none"
                    style={{ color: ideology.color }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {ideology.name}
                </motion.h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Summary and Roast */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-8 rounded-3xl text-left space-y-6 flex flex-col"
                >
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-white mb-2 font-bold opacity-50">
                            <BarChart2 className="w-4 h-4" />
                            <h3 className="text-sm uppercase tracking-wider">İdeoloji Tanımı</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed text-lg font-medium">
                            {ideology.description}
                        </p>
                    </div>

                    <div className="p-5 bg-red-500/10 border border-red-500/20 rounded-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                            <PartyPopper className="w-12 h-12" />
                        </div>
                        <p className="text-red-400 italic text-sm relative z-10 leading-snug">
                            <span className="font-bold uppercase mr-2 text-xs bg-red-500 text-white px-1.5 py-0.5 rounded">Acı Gerçekler:</span>
                            {ideology.roast}
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-2 text-white mb-2 font-bold opacity-50 uppercase tracking-wider text-sm">
                            <UserCheck className="w-4 h-4" />
                            <h3>Liderler</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {ideology.leaders.map((leader, i) => (
                                <span key={i} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm font-medium">
                                    {leader}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="mt-auto pt-6 border-t border-white/5">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Yakın Partiler</h3>
                        <div className="flex flex-wrap gap-2">
                            {ideology.parties.map((party, i) => (
                                <span key={i} className="text-[10px] px-2 py-1 bg-white/5 rounded-md text-gray-500 border border-white/5 font-bold">
                                    {party}
                                </span>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Middle Column: Axis Analysis */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-8 rounded-3xl text-left space-y-8"
                >
                    <div className="flex items-center gap-2 text-white font-bold opacity-50 uppercase tracking-wider text-sm border-b border-white/5 pb-4">
                        <Compass className="w-4 h-4" />
                        <h3>Eksen Analizi</h3>
                    </div>

                    <div className="space-y-10">
                        {axisScores.map((axis) => (
                            <div key={axis.id} className="space-y-3">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-tighter text-gray-500">
                                    <span>{axis.labels[0]}</span>
                                    <span>{axis.labels[1]}</span>
                                </div>
                                <div className="relative h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                                    {/* Middle line */}
                                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/20 z-10" />

                                    <motion.div
                                        initial={{ width: '0%', left: '50%' }}
                                        animate={{
                                            width: `${Math.abs(axis.value) / 2}%`,
                                            left: axis.value >= 0 ? '50%' : `${50 - Math.abs(axis.value) / 2}%`
                                        }}
                                        className={`absolute top-0 bottom-0 ${axis.value >= 0 ? 'bg-blue-500' : 'bg-red-500'} opacity-60`}
                                    />

                                    {/* Pointer */}
                                    <motion.div
                                        initial={{ left: '50%' }}
                                        animate={{ left: `${(axis.value + 100) / 2}%` }}
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] z-20"
                                    />
                                </div>
                                <div className="text-center font-bold text-xs text-white uppercase italic">
                                    {axis.name}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-4 rounded-2xl bg-white/5 text-[11px] text-gray-500 italic leading-snug">
                        * Bu analiz 4 ana siyasi eksen üzerinden yüzdelik diliminize göre hesaplanmıştır.
                    </div>
                </motion.div>

                {/* Right Column: Radar Chart */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="glass p-8 rounded-3xl flex flex-col h-full"
                >
                    <div className="flex items-center gap-2 text-white font-bold opacity-50 uppercase tracking-wider text-sm border-b border-white/5 pb-4 mb-6">
                        <BarChart2 className="w-4 h-4" />
                        <h3>İdeolojik Spektrum</h3>
                    </div>

                    <div className="flex-1 w-full min-h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="55%" outerRadius="75%" data={radarData}>
                                <PolarGrid stroke="#ffffff10" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                <Radar
                                    name="Uyum"
                                    dataKey="A"
                                    stroke={ideology.color}
                                    fill={ideology.color}
                                    fillOpacity={0.5}
                                />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: ideology.color }}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 font-medium">
                        En yüksek skor aldığınız ilk 8 ideoloji gösterilmektedir.
                    </div>
                </motion.div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                <button
                    onClick={onReset}
                    className="px-12 py-4 bg-white text-black font-bold rounded-full flex items-center gap-2 hover:scale-105 active:scale-95 transition-all w-full sm:w-auto justify-center shadow-2xl shadow-white/5"
                >
                    <RefreshCcw className="w-5 h-5" />
                    Analizi Sıfırla
                </button>
                <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest px-6 py-2 border border-white/5 rounded-full">
                    Gidilecek Yol: Demokratik Türkiye
                </div>
            </div>
        </div>
    );
}

