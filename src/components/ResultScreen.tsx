'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RefreshCcw, PartyPopper, UserCheck, BarChart2, Compass,
    Share2, Download, Info, Zap, AlertTriangle, X, ExternalLink,
    Quote, Target, Sparkles
} from 'lucide-react';
import { Ideology, IdeologyId, ideologies } from '@/data/ideologies';
import { AxisScore, LeaderMatch, BreakdownItem } from '@/utils/scoring';
import { toPng } from 'html-to-image';
import {
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip
} from 'recharts';

interface ResultScreenProps {
    ideology: Ideology;
    oppositeIdeology: Ideology;
    allScores: Record<IdeologyId, number>;
    axisScores: AxisScore[];
    matchPercentage: number;
    leaderMatches: LeaderMatch[];
    breakdown: BreakdownItem[];
    consistencyScore: number;
    onReset: () => void;
}

export default function ResultScreen({
    ideology,
    oppositeIdeology,
    allScores,
    axisScores,
    matchPercentage,
    leaderMatches,
    breakdown,
    consistencyScore,
    onReset
}: ResultScreenProps) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const downloadCard = async () => {
        if (!cardRef.current) return;
        setIsExporting(true);
        try {
            const dataUrl = await toPng(cardRef.current, {
                cacheBust: true,
                style: { transform: 'scale(1)', transformOrigin: 'top left' }
            });
            const link = document.createElement('a');
            link.download = `turkiye-ideolojik-${ideology.id}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Export failed', err);
        } finally {
            setIsExporting(false);
        }
    };

    const radarData = Object.entries(allScores)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([id, score]) => ({
            subject: ideologies[id as IdeologyId].name,
            A: score,
            fullMark: 100,
        }));

    return (
        <div className="max-w-6xl w-full space-y-8 py-8 px-4">
            {/* Main Result Card (Exportable) */}
            <div ref={cardRef} className="relative bg-black p-1">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] text-left border-white/10 overflow-hidden relative">
                    {/* Background Glow */}
                    <div
                        className="absolute -top-24 -right-24 w-96 h-96 blur-[120px] opacity-20 rounded-full"
                        style={{
                            background: (ideology as any).isHybrid
                                ? `linear-gradient(to bottom right, ${ideology.color}, ${ideologies[(ideology as any).secondId as IdeologyId].color})`
                                : ideology.color
                        }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="space-y-4">
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center gap-3"
                                >
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        Analiz Tamamlandı
                                    </span>
                                    {(ideology as any).isHybrid && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-500 animate-pulse">
                                            Hibrit Sentez
                                        </span>
                                    )}
                                    <div className="h-px flex-1 bg-white/10" />
                                </motion.div>

                                <div className="space-y-2">
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className="text-5xl md:text-7xl font-black italic uppercase leading-none tracking-tighter break-words max-w-full"
                                        style={{
                                            color: ideology.color,
                                            background: (ideology as any).isHybrid ? `linear-gradient(to right, ${ideology.color}, ${ideologies[(ideology as any).secondId as IdeologyId].color})` : 'none',
                                            WebkitBackgroundClip: (ideology as any).isHybrid ? 'text' : 'none',
                                            WebkitTextFillColor: (ideology as any).isHybrid ? 'transparent' : 'initial'
                                        }}
                                    >
                                        {ideology.name}
                                    </motion.h1>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="inline-block px-4 py-2 bg-white text-black font-black italic rounded-xl text-2xl shrink-0">
                                            %{matchPercentage} UYUM
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Tutarlılık: %{consistencyScore}</span>
                                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-tighter ${consistencyScore > 70 ? 'bg-green-500/20 text-green-500' : 'bg-orange-500/20 text-orange-500'}`}>
                                                    {consistencyScore > 70 ? 'Net Çizgili' : 'Hibrit Zihin'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 font-medium max-w-sm text-sm leading-tight mt-1">
                                                {ideology.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                                {axisScores.map((axis) => (
                                    <div key={axis.id} className="space-y-3">
                                        <div className="flex justify-between items-end px-0.5 gap-2 min-h-[20px]">
                                            <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-tighter transition-colors leading-tight max-w-[48%] ${axis.value < -15 ? 'text-white' : 'text-gray-600'}`}>
                                                {axis.labels[0].replace(' / ', '/')}
                                            </span>
                                            <span className={`text-[7px] md:text-[9px] font-black uppercase tracking-tighter transition-colors leading-tight max-w-[48%] text-right ${axis.value > 15 ? 'text-white' : 'text-gray-600'}`}>
                                                {axis.labels[1].replace(' / ', '/')}
                                            </span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                                            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 z-10" />
                                            <motion.div
                                                initial={{ width: 0, left: '50%' }}
                                                animate={{
                                                    width: `${Math.abs(axis.value) / 2}%`,
                                                    left: axis.value < 0 ? `${50 - Math.abs(axis.value) / 2}%` : '50%'
                                                }}
                                                className="h-full absolute"
                                                style={{
                                                    backgroundColor: ideology.color,
                                                    boxShadow: `0 0 15px ${ideology.color}40`
                                                }}
                                            />
                                        </div>
                                        <div className="pt-2 border-t border-white/10">
                                            <span className="text-[10px] font-black text-gray-500 uppercase block text-center tracking-[0.2em] italic">
                                                {axis.name}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {ideology.parties.map((p, i) => (
                                    <span key={i} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4 h-[300px] md:h-[400px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                                    <PolarGrid stroke="#ffffff10" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 'bold' }} />
                                    <Radar
                                        name="Uyum"
                                        dataKey="A"
                                        stroke={ideology.color}
                                        fill={(ideology as any).isHybrid ? ideologies[(ideology as any).secondId as IdeologyId].color : ideology.color}
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-x-0 bottom-0 text-center">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Siyasi Kimlik Kartı • turkiyeideolojik.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4">
                <button
                    onClick={downloadCard}
                    disabled={isExporting}
                    className="px-8 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10"
                >
                    {isExporting ? <Zap className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    KARTI İNDİR
                </button>
                <button
                    onClick={() => setShowDetails(true)}
                    className="px-8 py-4 glass text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all border-white/10"
                >
                    <Info className="w-5 h-5" />
                    BİLGİ KARTI
                </button>
                <button
                    onClick={onReset}
                    className="p-4 glass text-gray-400 hover:text-white rounded-2xl border-white/10 transition-colors"
                >
                    <RefreshCcw className="w-6 h-6" />
                </button>
            </div>

            {/* In-depth Analysis Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* 1. Neden Bu Sonuç? */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 rounded-[2rem] border-white/5 space-y-4"
                >
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Target className="w-5 h-5 text-blue-400" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Neden Bu Sonuç?</h3>
                    </div>
                    <div className="space-y-3">
                        {breakdown.map((item, i) => (
                            <div key={i} className="p-3 bg-white/5 rounded-xl space-y-1">
                                <p className="text-[11px] text-gray-400 leading-tight">"{item.questionText}"</p>
                                <div className="flex items-center gap-2">
                                    <div className={`text-[10px] font-black uppercase ${item.direction === 'positive' ? 'text-green-500' : 'text-red-500'}`}>
                                        {item.direction === 'positive' ? '+ Destekledi' : '- Uzaklaştırdı'}
                                    </div>
                                    <div className="h-1 flex-1 bg-white/10 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.direction === 'positive' ? 'bg-green-500' : 'bg-red-500'}`}
                                            style={{ width: `${item.impact * 10}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 2. Lider Eşleşmesi */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 rounded-[2rem] border-white/5 space-y-4"
                >
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <UserCheck className="w-5 h-5 text-yellow-500" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">Lider Uyumu</h3>
                    </div>
                    <div className="space-y-2">
                        {leaderMatches.slice(0, 4).map((match, i) => (
                            <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs"
                                    style={{ backgroundColor: `${match.leader.color}20`, color: match.leader.color, border: `1px solid ${match.leader.color}40` }}
                                >
                                    {match.leader.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs font-bold text-white">{match.leader.name}</div>
                                    <div className="text-[9px] text-gray-500 uppercase">{match.leader.title}</div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white">%{match.matchPercentage}</div>
                                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white" style={{ width: `${match.matchPercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 3. Karşıt İdeoloji */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 rounded-[2rem] border-white/5 space-y-4 group overflow-hidden"
                >
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className="font-bold text-white uppercase tracking-wider text-sm">En Uzak Görüş</h3>
                    </div>
                    <div className="relative z-10 space-y-3">
                        <div className="text-4xl font-black italic uppercase text-red-500/50">
                            {oppositeIdeology.name}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed italic">
                            Bu görüşe taban tabana zıtsın. Siyasi spektrumun tam diğer ucunda yer alıyor.
                        </p>
                        <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-2xl">
                            <Quote className="w-4 h-4 text-red-500/20 mb-1" />
                            <p className="text-[10px] text-red-400 font-medium leading-tight">
                                {oppositeIdeology.roast}
                            </p>
                        </div>
                    </div>
                    <div
                        className="absolute -bottom-12 -right-12 w-32 h-32 blur-3xl opacity-10 rounded-full"
                        style={{ backgroundColor: oppositeIdeology.color }}
                    />
                </motion.div>

                {/* 4. Sen Olsan Ne Yapardın? */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-3 glass p-8 rounded-[2.5rem] border-white/5 space-y-6 relative overflow-hidden group"
                >
                    <div className="absolute -top-12 -right-12 p-8 opacity-5 group-hover:opacity-10 transition-opacity rotate-12">
                        <Sparkles className="w-48 h-48 text-yellow-500" />
                    </div>

                    <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                        <div className="p-3 bg-yellow-500/10 rounded-2xl">
                            <Sparkles className="w-6 h-6 text-yellow-500" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white uppercase tracking-wider text-xl">Sen Olsan Ne Yapardın?</h3>
                            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em]">İdeolojine Göre Gelecek Vizyonun</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                        {ideology.actionPlan.map((action, i) => (
                            <div key={i} className="space-y-4 p-6 bg-white/5 rounded-3xl border border-white/10 hover:border-yellow-500/20 transition-all hover:scale-[1.02] cursor-default">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center text-sm font-black text-black shadow-lg shadow-yellow-500/20">
                                        0{i + 1}
                                    </div>
                                    <div className="h-px flex-1 bg-white/5" />
                                </div>
                                <p className="text-sm text-gray-300 font-bold leading-relaxed">
                                    {action}
                                </p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Educational Info Modal */}
            <AnimatePresence>
                {showDetails && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowDetails(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                        />
                        <motion.div
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative max-w-2xl w-full glass rounded-[3rem] border-white/10 overflow-hidden shadow-2xl"
                        >
                            <button
                                onClick={() => setShowDetails(false)}
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20 text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div
                                className="h-48 relative overflow-hidden flex items-end p-8"
                                style={{ backgroundColor: `${ideology.color}20` }}
                            >
                                <div
                                    className="absolute inset-0 opacity-20"
                                    style={{
                                        backgroundImage: `linear-gradient(to bottom, transparent, ${ideology.color})`
                                    }}
                                />
                                <div className="relative z-10">
                                    <h2 className="text-5xl font-black italic uppercase mb-2" style={{ color: ideology.color }}>
                                        {ideology.name}
                                    </h2>
                                    <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">
                                        İdeolojik Bilgi Kartı
                                    </p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-50">
                                        <Zap className="w-4 h-4" />
                                        <h3>Temel Felsefe</h3>
                                    </div>
                                    <p className="text-gray-300 leading-relaxed font-medium">
                                        {ideology.details?.history || ideology.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-50">
                                            <Target className="w-4 h-4" />
                                            <h3>Temel İlkeler</h3>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            {ideology.details?.principles.map((pr, i) => (
                                                <div key={i} className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <div className="w-1 h-1 rounded-full bg-white opacity-30" />
                                                    {pr}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-50">
                                            <Quote className="w-4 h-4" />
                                            <h3>Siyasi Motto</h3>
                                        </div>
                                        <div
                                            className="p-4 rounded-2xl border-l-4 font-bold italic text-white"
                                            style={{ backgroundColor: `${ideology.color}10`, borderLeftColor: ideology.color }}
                                        >
                                            "{ideology.details?.motto || 'Halkın Gücü, Milletin Kararı.'}"
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                                    <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-tight">
                                        Bu bilgiler genel siyasi literatür temelinde hazırlanmıştır.<br />Bilimsel kesinlik taşımaz.
                                    </div>
                                    <div
                                        className="px-6 py-2 rounded-full font-black text-[10px] uppercase border"
                                        style={{ borderColor: `${ideology.color}30`, color: ideology.color }}
                                    >
                                        Görüş: {ideology.name}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
