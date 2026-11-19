'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { BarChart3, Check } from 'lucide-react';
import { IdeologyId } from '@/data/ideologies';
import { QuizMode } from '@/utils/storage';

interface StatsNoticeProps {
    ideology: IdeologyId;
    mode: QuizMode;
    /** False when the visitor turned anonymous statistics off before the test. */
    contribute: boolean;
}

type Status = 'idle' | 'sending' | 'sent' | 'error';

/** Remembers, for this tab only, that this particular result was already counted. */
const sentKey = () => `turkiyeideolojik:stats-sent:${window.location.search}`;

const send = (ideology: IdeologyId, mode: QuizMode) =>
    fetch('/api/istatistik', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ideology, mode }),
    }).then(res => {
        if (!res.ok) throw new Error(String(res.status));
    });

/**
 * Adds the result to the anonymous statistics automatically, unless the visitor
 * opted out on the start screen. Only { ideology, mode } is sent.
 */
export default function StatsNotice({ ideology, mode, contribute }: StatsNoticeProps) {
    const [status, setStatus] = useState<Status>(() => {
        if (typeof window === 'undefined') return 'idle';
        let alreadySent = false;
        try { alreadySent = !!sessionStorage.getItem(sentKey()); } catch { /* ignore */ }
        if (alreadySent) return 'sent';
        return contribute ? 'sending' : 'idle';
    });
    const startedRef = useRef(false);

    // Manual "add anyway" after opting out; marks the automatic path as done so it can't double count.
    const submit = () => {
        startedRef.current = true;
        setStatus('sending');
        send(ideology, mode)
            .then(() => {
                try { sessionStorage.setItem(sentKey(), '1'); } catch { /* ignore */ }
                setStatus('sent');
            })
            .catch(() => setStatus('error'));
    };

    // Automatic submission, once per result screen.
    useEffect(() => {
        if (startedRef.current || status !== 'sending') return;
        startedRef.current = true;
        send(ideology, mode)
            .then(() => {
                try { sessionStorage.setItem(sentKey(), '1'); } catch { /* ignore */ }
                setStatus('sent');
            })
            .catch(() => setStatus('error'));
    }, [ideology, mode, status]);

    if (status === 'sent' || status === 'sending') {
        return (
            <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Check className="w-4 h-4 text-green-500/80 shrink-0" />
                Sonuç ideolojin anonim istatistiklere eklendi.{' '}
                <Link href="/istatistik" className="underline underline-offset-4 hover:text-gray-300">İstatistikleri gör</Link>
            </p>
        );
    }

    if (status === 'error') {
        return (
            <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <BarChart3 className="w-4 h-4 shrink-0" />
                Sonuç şu anda istatistiklere eklenemedi.
            </p>
        );
    }

    // Opted out: nothing was sent. Offer a one-click way to add it anyway.
    return (
        <p className="flex flex-wrap items-center justify-center gap-2 text-xs text-gray-500">
            <BarChart3 className="w-4 h-4 shrink-0" />
            Tercihin gereği sonucun anonim istatistiklere eklenmedi.
            <button onClick={submit} className="underline underline-offset-4 hover:text-gray-300">Yine de ekle</button>
        </p>
    );
}
