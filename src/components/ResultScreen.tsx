'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    RefreshCcw, UserCheck, Download, Info, Loader2, AlertTriangle, X,
    Quote, Target, Landmark, Scale, Share2, Check, ListOrdered, Zap,
} from 'lucide-react';
import { IdeologyId, ideologies } from '@/data/ideologies';
import { BreakdownItem, IDEOLOGY_AXES, QuizResult } from '@/utils/scoring';
import { toPng } from 'html-to-image';
import Link from 'next/link';
import { CONTENT_DATE } from '@/lib/site';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

/** Below this many answers the result is flagged as less reliable. */
const LOW_CONFIDENCE_BELOW = 15;

interface ResultScreenProps {
    result: QuizResult;
    shared: boolean;
    onReset: () => void;
}

const fadeUp = (delay: number) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { delay },
});

export default function ResultScreen({ result, shared, onReset }: ResultScreenProps) {
    const {
        topIdeology: ideology, oppositeIdeology, allScores, axisScores,
        matchPercentage, leaderMatches, agreements, disagreements, oppositeDifferences, consistencyScore, answeredCount,
    } = result;

    const cardRef = useRef<HTMLDivElement>(null);
    const [showDetails, setShowDetails] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [shareState, setShareState] = useState<'idle' | 'copied' | 'error'>('idle');

    const secondColor = ideology.isHybrid && ideology.secondId ? ideologies[ideology.secondId].color : null;
    const accentGradient = secondColor ? `linear-gradient(to right, ${ideology.color}, ${secondColor})` : undefined;

    // Modal: close on Escape and lock background scroll.
    useEffect(() => {
        if (!showDetails) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setShowDetails(false);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prevOverflow;
            window.removeEventListener('keydown', onKey);
        };
    }, [showDetails]);

    const renderCard = async () => {
        if (!cardRef.current) return null;
        return toPng(cardRef.current, { cacheBust: true, pixelRatio: 2, backgroundColor: '#050505' });
    };

    const downloadCard = async () => {
        setIsExporting(true);
        try {
            const dataUrl = await renderCard();
            if (!dataUrl) return;
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

    const share = async () => {
        const url = window.location.href;
        const text = `Türkiye İdeolojik sonucum: ${ideology.name} (%${matchPercentage} uyum). Sen hangisisin?`;
        try {
            if (navigator.share) {
                await navigator.share({ title: 'Türkiye İdeolojik', text, url });
                return;
            }
            await navigator.clipboard.writeText(`${text} ${url}`);
            setShareState('copied');
        } catch (err) {
            if ((err as Error)?.name === 'AbortError') return;
            setShareState('error');
        }
        setTimeout(() => setShareState('idle'), 2500);
    };

    const ranking = (Object.entries(allScores) as [IdeologyId, number][]).sort(([, a], [, b]) => b - a);
    const radarData = ranking.slice(0, 5).map(([id, score]) => ({
        subject: ideologies[id].name,
        A: score,
        fullMark: 100,
    }));

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="max-w-6xl w-full space-y-8 py-8"
        >
            {shared && (
                <div className="glass rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
                    <span className="text-gray-300">Bu, paylaşılan bir sonuç. Seninki ne çıkacak?</span>
                    <button onClick={onReset} className="px-4 py-2 rounded-xl bg-white text-black font-black text-xs uppercase tracking-wider hover:scale-105 transition-transform">
                        Testi Çöz
                    </button>
                </div>
            )}

            {/* Main result card (exportable) */}
            <div ref={cardRef} className="relative bg-[#050505] rounded-[2.5rem]">
                <div className="glass p-6 md:p-12 rounded-[2.5rem] text-left overflow-hidden relative">
                    <div
                        aria-hidden="true"
                        className="absolute -top-24 -right-24 w-96 h-96 blur-[120px] opacity-20 rounded-full"
                        style={{ background: accentGradient ?? ideology.color }}
                    />

                    <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                        <div className="lg:col-span-8 space-y-8">
                            <div className="space-y-4">
                                <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="flex items-center gap-3">
                                    <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                                        {shared ? 'Paylaşılan Sonuç' : 'Analiz Tamamlandı'} • {answeredCount} Soru
                                    </span>
                                    {ideology.isHybrid && (
                                        <span className="px-3 py-1 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-yellow-500">
                                            Hibrit Sentez
                                        </span>
                                    )}
                                    <div className="h-px flex-1 bg-white/10" />
                                </motion.div>

                                {answeredCount < LOW_CONFIDENCE_BELOW && (
                                    <p className="text-xs text-orange-300/90 bg-orange-500/10 border border-orange-500/20 rounded-xl px-3 py-2">
                                        Yalnızca {answeredCount} soruyu cevapladığın için bu sonuç daha az güvenilir.
                                    </p>
                                )}

                                <div className="space-y-4">
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        className={`${ideology.isHybrid ? 'text-3xl md:text-5xl' : 'text-4xl md:text-6xl'} font-extrabold leading-tight tracking-tight break-words max-w-full pr-2`}
                                        style={accentGradient
                                            ? { backgroundImage: accentGradient, WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }
                                            : { color: ideology.color }}
                                    >
                                        {ideology.name}
                                    </motion.h1>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                        <div className="inline-flex flex-col self-start px-5 py-2.5 bg-white text-black rounded-2xl shrink-0">
                                            <span className="text-2xl font-extrabold tabular-nums leading-none">%{matchPercentage}</span>
                                            <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mt-1">Uyum</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Tutarlılık: %{consistencyScore}</span>
                                                <span
                                                    title="Aynı eksendeki cevaplarının birbiriyle ne kadar uyumlu olduğunu gösterir."
                                                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tight ${consistencyScore > 60 ? 'bg-green-500/20 text-green-400' : 'bg-orange-500/20 text-orange-400'}`}
                                                >
                                                    {consistencyScore > 60 ? 'Tutarlı' : 'Karma Görüşler'}
                                                </span>
                                            </div>
                                            <p className="text-gray-400 font-medium max-w-md text-sm leading-snug mt-1">
                                                {ideology.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                                {axisScores.map(axis => (
                                    <div key={axis.id} className="space-y-3">
                                        <div className="flex justify-between items-end gap-1 min-h-[40px]">
                                            {axis.labels.map((label, side) => {
                                                const active = side === 0 ? axis.value < -15 : axis.value > 15;
                                                return (
                                                    <div
                                                        key={label}
                                                        className={`text-[8px] md:text-[9px] font-black uppercase tracking-tight leading-[1.15] max-w-[48%] ${side === 1 ? 'text-right' : ''} ${active ? 'text-white' : 'text-gray-600'}`}
                                                    >
                                                        {label.split(' / ').map(s => <div key={s}>{s}</div>)}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                        <div
                                            className="h-2 w-full bg-white/5 rounded-full relative border border-white/5"
                                            role="meter"
                                            aria-valuemin={-100}
                                            aria-valuemax={100}
                                            aria-valuenow={axis.value}
                                            aria-label={`${axis.name}: ${axis.value < 0 ? axis.labels[0] : axis.labels[1]} yönünde ${Math.abs(axis.value)}`}
                                        >
                                            <div className="absolute inset-y-0 left-1/2 w-0.5 bg-white/20 -translate-x-1/2 z-10" />
                                            <motion.div
                                                initial={{ width: 0, left: '50%' }}
                                                animate={{
                                                    width: `${Math.abs(axis.value) / 2}%`,
                                                    left: axis.value < 0 ? `${50 - Math.abs(axis.value) / 2}%` : '50%',
                                                }}
                                                className="h-full absolute"
                                                style={{ backgroundColor: ideology.color, boxShadow: `0 0 15px ${ideology.color}40` }}
                                            />
                                            <div
                                                title={`${ideologies[ideology.id].name} ortalaması`}
                                                className="absolute top-1/2 w-2.5 h-2.5 -translate-x-1/2 -translate-y-1/2 rotate-45 border-2 border-white bg-black z-20"
                                                style={{ left: `${50 + IDEOLOGY_AXES[ideology.id][axis.id] / 2}%` }}
                                            />
                                        </div>
                                        <div className="pt-2 border-t border-white/10 flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-[0.15em]">
                                            <span>{axis.name}</span>
                                            <span className="text-gray-400 tabular-nums">{axis.value > 0 ? '+' : ''}{axis.value}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <p className="text-[10px] text-gray-500 -mt-4 flex items-center gap-2">
                                <span className="inline-block w-2 h-2 rotate-45 border-2 border-white bg-black" />
                                {ideologies[ideology.id].name} ideolojisinin tipik konumu
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {ideology.parties.map(p => (
                                    <span key={p} className="px-3 py-1 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-gray-400 uppercase">
                                        {p}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="lg:col-span-4 h-[300px] md:h-[380px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="60%" data={radarData} margin={{ top: 10, right: 44, bottom: 10, left: 44 }}>
                                    <PolarGrid stroke="#ffffff1a" />
                                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 'bold' }} />
                                    <Radar
                                        name="Uyum"
                                        dataKey="A"
                                        stroke={ideology.color}
                                        fill={secondColor ?? ideology.color}
                                        fillOpacity={0.5}
                                        isAnimationActive={false}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-x-0 bottom-0 text-center">
                                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-[0.2em]">Siyasi Kimlik Kartı • Türkiye İdeolojik</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                    onClick={downloadCard}
                    disabled={isExporting}
                    className="px-6 py-4 bg-white text-black font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-white/10 disabled:opacity-70"
                >
                    {isExporting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
                    KARTI İNDİR
                </button>
                <button
                    onClick={share}
                    className="px-6 py-4 glass text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                    {shareState === 'copied' ? <Check className="w-5 h-5 text-green-400" /> : <Share2 className="w-5 h-5" />}
                    {shareState === 'copied' ? 'LİNK KOPYALANDI' : shareState === 'error' ? 'PAYLAŞILAMADI' : 'PAYLAŞ'}
                </button>
                <button
                    onClick={() => setShowDetails(true)}
                    className="px-6 py-4 glass text-white font-black rounded-2xl flex items-center gap-3 hover:scale-105 active:scale-95 transition-all"
                >
                    <Info className="w-5 h-5" />
                    BİLGİ KARTI
                </button>
                <button
                    onClick={onReset}
                    aria-label="Baştan başla"
                    title="Baştan başla"
                    className="p-4 glass text-gray-400 hover:text-white rounded-2xl transition-colors"
                >
                    <RefreshCcw className="w-6 h-6" />
                </button>
            </div>

            {/* Analysis grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <motion.section {...fadeUp(0.1)} className="glass p-6 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Target className="w-5 h-5 text-blue-400" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Neden Bu Sonuç?</h2>
                    </div>
                    <BreakdownList title="Ortak noktalarınız" items={agreements} agree />
                    {disagreements.length > 0 && (
                        <BreakdownList title="Ayrıldığın noktalar" items={disagreements} agree={false} />
                    )}
                </motion.section>

                <motion.section {...fadeUp(0.2)} className="glass p-6 rounded-[2rem] space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <UserCheck className="w-5 h-5 text-yellow-500" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Lider Uyumu</h2>
                    </div>
                    <div className="space-y-2">
                        {leaderMatches.slice(0, 5).map(match => (
                            <div key={match.leader.name} className="flex items-center gap-3 p-2 bg-white/5 rounded-xl border border-white/5">
                                <div
                                    aria-hidden="true"
                                    className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center font-bold text-xs"
                                    style={{ backgroundColor: `${match.leader.color}20`, color: match.leader.color, border: `1px solid ${match.leader.color}40` }}
                                >
                                    {match.leader.name.split(' ').map(n => n[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-xs font-bold text-white truncate">{match.leader.name}</div>
                                    <div className="text-[9px] text-gray-500 uppercase truncate">{match.leader.title}</div>
                                </div>
                                <div className="text-right shrink-0">
                                    <div className="text-sm font-black text-white tabular-nums">%{match.matchPercentage}</div>
                                    <div className="w-12 h-1 bg-white/10 rounded-full overflow-hidden">
                                        <div className="h-full bg-white" style={{ width: `${match.matchPercentage}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p className="text-[10px] text-gray-600 leading-snug">
                        Lider konumları kamuya açık söylem ve politikalara dayalı yaklaşık tahminlerdir.
                    </p>
                </motion.section>

                <motion.section {...fadeUp(0.3)} className="glass p-6 rounded-[2rem] space-y-4 overflow-hidden relative">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">En Uzak Görüş</h2>
                    </div>
                    <div className="relative z-10 space-y-3">
                        <div className="text-2xl md:text-3xl font-extrabold break-words" style={{ color: oppositeIdeology.color }}>
                            {oppositeIdeology.name}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">{oppositeIdeology.description}</p>
                        {oppositeDifferences.length > 0 && (
                            <BreakdownList title="En belirgin ayrılıklar" items={oppositeDifferences} agree={false} />
                        )}
                    </div>
                    <div
                        aria-hidden="true"
                        className="absolute -bottom-12 -right-12 w-32 h-32 blur-3xl opacity-10 rounded-full"
                        style={{ backgroundColor: oppositeIdeology.color }}
                    />
                </motion.section>

                {/* Criticisms of the matched ideology */}
                <motion.section {...fadeUp(0.35)} className="glass p-6 rounded-[2rem] space-y-4 md:col-span-2 lg:col-span-1">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Scale className="w-5 h-5 text-orange-400" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Eleştiriler</h2>
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug">
                        {ideologies[ideology.id].name} çizgisine sıkça yöneltilen eleştiriler:
                    </p>
                    <ul className="space-y-3">
                        {ideologies[ideology.id].critiques.map(c => (
                            <li key={c} className="flex gap-3 text-sm text-gray-300 leading-relaxed">
                                <span className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-orange-400/70" />
                                {c}
                            </li>
                        ))}
                    </ul>
                </motion.section>

                {/* Full ranking */}
                <motion.section {...fadeUp(0.4)} className="glass p-6 rounded-[2rem] space-y-4 md:col-span-2">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <ListOrdered className="w-5 h-5 text-purple-400" />
                        <h2 className="font-bold text-white uppercase tracking-wider text-sm">Tüm İdeolojiler</h2>
                    </div>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                        {ranking.map(([id, score], i) => (
                            <li key={id} className="flex items-center gap-3">
                                <span className="w-5 text-[10px] font-black text-gray-600 tabular-nums">{i + 1}</span>
                                <span className="w-36 text-xs font-bold text-gray-300 truncate">{ideologies[id].name}</span>
                                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${score}%` }}
                                        transition={{ delay: 0.4 + i * 0.03 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: ideologies[id].color }}
                                    />
                                </div>
                                <span className="w-9 text-right text-xs font-black text-white tabular-nums">%{score}</span>
                            </li>
                        ))}
                    </ol>
                </motion.section>

                {/* Typical policy proposals */}
                <motion.section {...fadeUp(0.5)} className="md:col-span-2 lg:col-span-3 glass p-6 md:p-8 rounded-[2rem] space-y-6">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                        <Landmark className="w-5 h-5 text-sky-400" />
                        <div>
                            <h2 className="font-bold text-white uppercase tracking-wider text-sm">Politika Önerileri</h2>
                            <p className="text-[11px] text-gray-500">{ideologies[ideology.id].name} çizgisinin öne çıkardığı başlıca politikalar</p>
                        </div>
                    </div>
                    <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ideology.actionPlan.map((action, i) => (
                            <li key={action} className="flex gap-4 p-5 bg-white/5 rounded-2xl border border-white/10">
                                <span className="text-sm font-bold text-gray-500 tabular-nums">{i + 1}.</span>
                                <p className="text-sm text-gray-300 leading-relaxed">{action}</p>
                            </li>
                        ))}
                    </ol>
                </motion.section>
            </div>

            <p className="text-center text-[10px] text-gray-600 uppercase tracking-widest leading-relaxed">
                Bu sonuç yalnızca verdiğin cevaplara dayalı bir eşleşmedir; bilimsel bir ölçüm değildir. İçerik {CONTENT_DATE} itibarıyla günceldir.{' '}
                <Link href="/yontem" className="underline underline-offset-4 hover:text-gray-400">Yöntem ve sınırlamalar</Link>
            </p>

            {/* Info modal */}
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
                            role="dialog"
                            aria-modal="true"
                            aria-labelledby="ideology-dialog-title"
                            initial={{ scale: 0.9, y: 20, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 0.9, y: 20, opacity: 0 }}
                            className="relative max-w-2xl w-full glass bg-neutral-950/90 rounded-[2.5rem] overflow-hidden shadow-2xl"
                        >
                            <button
                                autoFocus
                                onClick={() => setShowDetails(false)}
                                aria-label="Kapat"
                                className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full transition-colors z-20 text-gray-400"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            <div className="h-40 md:h-48 relative overflow-hidden flex items-end p-8" style={{ backgroundColor: `${ideology.color}20` }}>
                                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `linear-gradient(to bottom, transparent, ${ideology.color})` }} />
                                <div className="relative z-10">
                                    <h2 id="ideology-dialog-title" className="text-3xl md:text-4xl font-extrabold mb-2" style={{ color: ideology.color }}>
                                        {ideologies[ideology.id].name}
                                    </h2>
                                    <p className="text-white/60 font-bold uppercase tracking-[0.3em] text-[10px]">İdeolojik Bilgi Kartı</p>
                                </div>
                            </div>

                            <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto">
                                <div className="space-y-3">
                                    <h3 className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-60">
                                        <Zap className="w-4 h-4" /> Temel Felsefe
                                    </h3>
                                    <p className="text-gray-300 leading-relaxed font-medium">
                                        {ideology.details?.history ?? ideology.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-60">
                                            <Target className="w-4 h-4" /> Temel İlkeler
                                        </h3>
                                        <ul className="flex flex-col gap-2">
                                            {ideology.details?.principles.map(pr => (
                                                <li key={pr} className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <span className="w-1 h-1 rounded-full bg-white opacity-30" />
                                                    {pr}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="space-y-3">
                                        <h3 className="flex items-center gap-2 text-white font-bold uppercase text-xs opacity-60">
                                            <Quote className="w-4 h-4" /> Siyasi Motto
                                        </h3>
                                        <div
                                            className="p-4 rounded-2xl border-l-4 font-semibold text-white"
                                            style={{ backgroundColor: `${ideology.color}10`, borderLeftColor: ideology.color }}
                                        >
                                            &ldquo;{ideology.details?.motto}&rdquo;
                                        </div>
                                        {ideology.leaders.length > 0 && (
                                            <p className="text-xs text-gray-500">
                                                <span className="font-bold uppercase text-gray-400">Öne çıkan isimler:</span> {ideology.leaders.join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-white/5 text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                    Bu bilgiler genel siyasi literatür temelinde hazırlanmıştır ve bilimsel kesinlik taşımaz.
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

function BreakdownList({ title, items, agree }: { title: string; items: BreakdownItem[]; agree: boolean }) {
    return (
        <div className="space-y-2">
            <h3 className={`text-[10px] font-black uppercase tracking-widest ${agree ? 'text-green-500' : 'text-red-500'}`}>{title}</h3>
            {items.map(item => (
                <div key={item.questionId} className="p-3 bg-white/5 rounded-xl space-y-1.5">
                    <p className="text-[11px] text-gray-400 leading-snug">&ldquo;{item.questionText.replace(/"([^"]+)"/g, '‘$1’')}&rdquo;</p>
                    <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500">
                        Sen: <span className={item.answer === 'agree' ? 'text-green-400' : 'text-red-400'}>
                            {item.answer === 'agree' ? 'Katılıyorum' : 'Katılmıyorum'}
                        </span>
                        {' • '}İdeoloji: <span className={item.stance > 0 ? 'text-green-400' : 'text-red-400'}>
                            {item.stance === 2 ? 'Kesinlikle katılır' : item.stance === 1 ? 'Katılır' : item.stance === -1 ? 'Katılmaz' : 'Kesinlikle katılmaz'}
                        </span>
                    </p>
                </div>
            ))}
        </div>
    );
}
