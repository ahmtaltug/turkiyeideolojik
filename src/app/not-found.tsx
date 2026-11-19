import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-svh flex items-center justify-center p-6">
            <div className="glass rounded-[2rem] p-8 md:p-12 max-w-md w-full text-center space-y-4">
                <p className="text-5xl font-extrabold text-white">404</p>
                <h1 className="text-xl font-bold text-white">Sayfa bulunamadı</h1>
                <p className="text-sm text-gray-400">Aradığın sayfa taşınmış ya da hiç var olmamış olabilir.</p>
                <Link href="/" className="inline-block px-6 py-3 rounded-2xl bg-white text-black font-bold hover:scale-105 transition-transform">
                    Ana sayfaya dön
                </Link>
            </div>
        </main>
    );
}
