'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-svh flex items-center justify-center p-6">
            <div className="glass rounded-[2rem] p-8 md:p-12 max-w-md w-full text-center space-y-4">
                <h1 className="text-xl font-bold text-white">Bir şeyler ters gitti</h1>
                <p className="text-sm text-gray-400">Beklenmeyen bir hata oluştu. Tekrar deneyebilir ya da ana sayfaya dönebilirsin.</p>
                <div className="flex flex-wrap justify-center gap-3">
                    <button onClick={reset} className="px-6 py-3 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-transform">
                        Tekrar dene
                    </button>
                    <Link href="/" className="px-6 py-3 rounded-2xl glass text-white font-bold">
                        Ana sayfa
                    </Link>
                </div>
            </div>
        </main>
    );
}
