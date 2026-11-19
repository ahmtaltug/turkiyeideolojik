import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ideologies, IdeologyId } from '@/data/ideologies';
import { isStatsEnabled, readSnapshot, StatsSnapshot } from '@/lib/stats';

export const metadata: Metadata = {
    title: 'Anonim İstatistikler | Türkiye İdeolojik',
    description: 'Testi tamamlayıp katkıda bulunmayı seçenlerin sonuçlarının anonim, toplu dağılımı.',
};

// Refresh the cached page at most every 5 minutes. Each refresh costs a few
// Redis commands, so this keeps usage well inside Upstash's free tier.
export const revalidate = 300;

const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'];
const formatMonth = (key: string) => {
    const [y, m] = key.split('-').map(Number);
    return `${MONTHS[m - 1]} ${y}`;
};
const pct = (n: number, total: number) => (total === 0 ? 0 : Math.round((n / total) * 1000) / 10);
const fmt = (n: number) => n.toLocaleString('tr-TR');

const Card = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="glass rounded-[2rem] p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {children}
    </section>
);

async function loadSnapshot(): Promise<StatsSnapshot | null> {
    try {
        return await readSnapshot();
    } catch {
        return null;
    }
}

export default async function StatsPage() {
    const enabled = isStatsEnabled();
    const snapshot = enabled ? await loadSnapshot() : null;
    const ranking = snapshot
        ? (Object.entries(snapshot.byIdeology) as [IdeologyId, number][]).sort(([, a], [, b]) => b - a)
        : [];
    const maxMonth = snapshot ? Math.max(1, ...snapshot.byMonth.map(m => m.total)) : 1;

    return (
        <main className="min-h-svh flex justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full space-y-6 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Teste dön
                </Link>

                <header className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Anonim İstatistikler</h1>
                    <p className="text-gray-400">
                        Testi tamamladıktan sonra sonucunu paylaşmayı <strong className="text-gray-200">kendi isteğiyle</strong> seçen
                        kullanıcıların sonuç ideolojilerinin toplu dağılımı. Kişi bazında hiçbir kayıt tutulmaz.
                    </p>
                </header>

                {!enabled && (
                    <Card title="Henüz etkin değil">
                        <p className="text-sm text-gray-400">İstatistik toplama bu sitede henüz açılmadı.</p>
                    </Card>
                )}

                {enabled && !snapshot && (
                    <Card title="Şu anda gösterilemiyor">
                        <p className="text-sm text-gray-400">İstatistiklere şu anda ulaşılamıyor. Lütfen daha sonra tekrar dene.</p>
                    </Card>
                )}

                {snapshot && (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {[
                                { label: 'Toplam katkı', value: fmt(snapshot.total) },
                                { label: 'Tam Analiz', value: fmt(snapshot.byMode.full) },
                                { label: 'Hızlı Test', value: fmt(snapshot.byMode.quick) },
                            ].map(item => (
                                <div key={item.label} className="glass rounded-2xl p-5">
                                    <div className="text-xs uppercase tracking-wider text-gray-500">{item.label}</div>
                                    <div className="text-3xl font-extrabold text-white tabular-nums mt-1">{item.value}</div>
                                </div>
                            ))}
                        </div>

                        <Card title="İdeoloji dağılımı">
                            {snapshot.total === 0 ? (
                                <p className="text-sm text-gray-400">Henüz katkı yok. İlk sonucu ekleyen sen olabilirsin.</p>
                            ) : (
                                <ol className="space-y-3">
                                    {ranking.map(([id, count]) => (
                                        <li key={id} className="space-y-1">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-200 font-semibold">{ideologies[id].name}</span>
                                                <span className="text-gray-400 tabular-nums">%{pct(count, snapshot.total)} <span className="text-gray-600">({fmt(count)})</span></span>
                                            </div>
                                            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                                                <div className="h-full rounded-full" style={{ width: `${pct(count, snapshot.total)}%`, backgroundColor: ideologies[id].color }} />
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </Card>

                        <Card title="Aylık katkı sayısı">
                            <ul className="space-y-2">
                                {snapshot.byMonth.map(m => (
                                    <li key={m.month} className="flex items-center gap-3 text-sm">
                                        <span className="w-28 shrink-0 text-gray-400">{formatMonth(m.month)}</span>
                                        <div className="h-2 flex-1 rounded-full bg-white/5 overflow-hidden">
                                            <div className="h-full rounded-full bg-sky-500/70" style={{ width: `${(m.total / maxMonth) * 100}%` }} />
                                        </div>
                                        <span className="w-14 text-right tabular-nums text-gray-300">{fmt(m.total)}</span>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </>
                )}

                <Card title="Bu sayıları nasıl okumalı?">
                    <ul className="list-disc pl-5 space-y-2 text-sm text-gray-300 leading-relaxed">
                        <li>Bu bir kamuoyu araştırması değildir. Yalnızca testi çözüp katkıda bulunmayı seçenler sayılır; Türkiye nüfusunu temsil etmez.</li>
                        <li>Aynı kişi testi birden çok kez çözüp katkıda bulunabilir. Kişisel veri tutulmadığı için tekrarlar ayıklanamaz.</li>
                        <li>Az sayıda katkı varken yüzdeler büyük dalgalanabilir; yorumlarken toplam katkı sayısına da bak.</li>
                        <li>Sayılar birkaç dakikada bir güncellenen toplamlardır; tek tek sonuçlar saklanmaz.</li>
                    </ul>
                    <p className="text-xs text-gray-500">
                        Verilerin nasıl işlendiği için <Link href="/gizlilik" className="underline underline-offset-4 hover:text-gray-300">Aydınlatma Metni</Link>&apos;ne bakabilirsin.
                    </p>
                </Card>
            </div>
        </main>
    );
}
