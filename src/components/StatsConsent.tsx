'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Check, Loader2 } from 'lucide-react';
import { IdeologyId } from '@/data/ideologies';
import { QuizMode } from '@/utils/storage';

interface StatsConsentProps {
    ideology: IdeologyId;
    mode: QuizMode;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Remembers, for this tab only, that this particular result was already shared. */
const sentKey = () => `turkiyeideolojik:stats-sent:${window.location.search}`;

/**
 * Opt-in (unchecked by default) explicit consent to add the result to the
 * anonymous statistics. Nothing is sent unless the visitor ticks the box and
 * presses the button.
 */
export default function StatsConsent({ ideology, mode }: StatsConsentProps) {
    const [consent, setConsent] = useState(false);
    const [status, setStatus] = useState<Status>('idle');

    useEffect(() => {
        try {
            // eslint-disable-next-line react-hooks/set-state-in-effect -- read per-tab flag after hydration
            if (sessionStorage.getItem(sentKey())) setStatus('sent');
        } catch { /* storage unavailable */ }
    }, []);

    const submit = async () => {
        if (!consent || status === 'sending' || status === 'sent') return;
        setStatus('sending');
        try {
            const res = await fetch('/api/istatistik', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ideology, mode }),
            });
            if (!res.ok) throw new Error(String(res.status));
            try { sessionStorage.setItem(sentKey(), '1'); } catch { /* ignore */ }
            setStatus('sent');
        } catch {
            setStatus('error');
        }
    };

    if (status === 'sent') {
        return (
            <div className="glass rounded-2xl p-4 flex items-center gap-3 text-sm text-gray-300">
                <Check className="w-5 h-5 text-green-400 shrink-0" />
                <span>
                    Teşekkürler, sonucun anonim istatistiklere eklendi.{' '}
                    <Link href="/istatistik" className="underline underline-offset-4 hover:text-white">İstatistikleri gör</Link>
                </span>
            </div>
        );
    }

    return (
        <section className="glass rounded-2xl p-5 space-y-3" aria-labelledby="stats-consent-title">
            <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-sky-400 shrink-0" />
                <h2 id="stats-consent-title" className="font-bold text-white text-sm">Anonim istatistiğe katkı (isteğe bağlı)</h2>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
                İstersen yalnızca sonuç ideolojin ve test türün, kimliğinle ilişkilendirilmeden toplam sayılara eklenir.
                Cevapların, IP adresin veya cihaz bilgin kaydedilmez. Katılmazsan hiçbir şey gönderilmez.
            </p>
            <label className="flex items-start gap-3 text-xs text-gray-300 leading-relaxed cursor-pointer">
                <input
                    type="checkbox"
                    checked={consent}
                    onChange={e => setConsent(e.target.checked)}
                    className="mt-0.5 w-4 h-4 shrink-0 accent-sky-500"
                />
                <span>
                    <Link href="/gizlilik" className="underline underline-offset-4 hover:text-white">Aydınlatma Metni</Link>&apos;ni
                    okudum. Siyasi görüşüme ilişkin sonucumun anonim olarak istatistiklere eklenmesine açık rıza veriyorum.
                </span>
            </label>
            <div className="flex flex-wrap items-center gap-3">
                <button
                    onClick={submit}
                    disabled={!consent || status === 'sending'}
                    className="px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {status === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                    Sonucumu ekle
                </button>
                {status === 'error' && (
                    <span role="status" className="text-xs text-orange-300">Şu anda gönderilemedi, daha sonra tekrar deneyebilirsin.</span>
                )}
            </div>
        </section>
    );
}
