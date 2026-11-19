import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ideologies, IdeologyId } from '@/data/ideologies';
import { leaders } from '@/data/leaders';
import { questions } from '@/data/questions';
import { AXES, AXIS_IDS, IDEOLOGY_AXES } from '@/utils/scoring';
import { CONTENT_DATE } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Yöntem ve Sınırlamalar | Türkiye İdeolojik',
    description: 'Türkiye İdeolojik testinin nasıl hesaplandığı, neye dayandığı ve sınırlamaları.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="glass rounded-[2rem] p-6 md:p-8 space-y-4">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-300">{children}</div>
    </section>
);

const formatAxis = (value: number, labels: [string, string]) =>
    Math.abs(value) < 5
        ? `Merkez (${value > 0 ? '+' : ''}${value})`
        : `${value > 0 ? labels[1] : labels[0]} (${value > 0 ? '+' : ''}${value})`;

export default function MethodologyPage() {
    const ideologyIds = Object.keys(ideologies) as IdeologyId[];

    return (
        <main className="min-h-svh flex justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full space-y-6 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Teste dön
                </Link>

                <header className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Yöntem ve Sınırlamalar</h1>
                    <p className="text-gray-400">
                        Testin nasıl çalıştığını, sonuçların neye dayandığını ve neleri ölçemediğini burada açıklıyoruz.
                        İçerik {CONTENT_DATE} itibarıyla günceldir.
                    </p>
                </header>

                <Section title="Nasıl hesaplanıyor?">
                    <p>
                        Testte {questions.length} ifade var. Her ifade için 13 ideolojinin her birinin tipik tutumu
                        -2 (kesinlikle katılmaz) ile +2 (kesinlikle katılır) arasında bir değerle tanımlandı.
                    </p>
                    <p>
                        <strong className="text-white">Uyum yüzdesi</strong>, o ideolojiyi benimseyen birinin senin verdiğin
                        cevapların aynısını verme olasılığına dayanır. Bir ideolojinin temel bir çizgisine (±2) ters düşmek,
                        hafif bir ayrılıktan (±1) çok daha fazla uzaklaştırır; tutumu nötr (0) olan ifadeler ise belirleyici olmaz.
                        %100, o ideolojinin kararlı bir savunucusu gibi cevap verdiğin anlamına gelir.
                    </p>
                    <p>
                        <strong className="text-white">Eksenler</strong> (Ekonomi, Toplumsal, Milliyetçilik, Yönetim) her ifadenin
                        hangi yönde ölçüm yaptığına göre hesaplanır. İdeolojilerin eksenlerdeki tipik konumu da aynı tutumlardan
                        türetilir; böylece sorular ve ideolojiler birbiriyle tutarlı kalır.
                    </p>
                    <p>
                        <strong className="text-white">Liderler</strong>, ideolojilerin ağırlıklı bir karışımı olarak tanımlanır
                        (örneğin %80 bir ideoloji, %20 başka biri). Bir liderin kamuya açık tutumunun karışımdan belirgin biçimde
                        ayrıldığı konularda o soru için ayrıca tutum belirlenmiştir.
                    </p>
                    <p>
                        <strong className="text-white">Tutarlılık</strong>, aynı eksendeki cevaplarının ne kadar aynı yönü
                        gösterdiğini ölçer. Düşük tutarlılık bir hata değildir; birçok insanın görüşleri farklı konularda farklı
                        geleneklere yakındır. İlk iki ideoloji arasındaki fark 3 puan veya altındaysa sonuç
                        <strong className="text-white"> hibrit</strong> olarak gösterilir.
                    </p>
                    <p>
                        &ldquo;Fikrim yok, geç&rdquo; dediğin sorular hesaplamaya katılmaz. 15&apos;ten az soru cevaplandığında sonuç
                        daha az güvenilir olarak işaretlenir.
                    </p>
                </Section>

                <Section title="Neye dayanıyor?">
                    <p>
                        İdeoloji ve lider tutumları; parti programları, seçim beyannameleri, Meclis oylamaları ve liderlerin kamuya
                        açık açıklamaları esas alınarak belirlenmiş <strong className="text-white">yaklaşık tahminlerdir</strong>.
                        Bir partinin ya da liderin resmi görüşünü temsil etmez.
                    </p>
                    <p>
                        Güncel olaylara dayanan sorularda kısa bir &ldquo;Bağlam&rdquo; notu verilir. Siyasi gelişmeler hızla
                        değiştiği için bazı bilgiler zamanla eskiyebilir.
                    </p>
                </Section>

                <Section title="Sınırlamalar">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Cevaplar &ldquo;katılıyorum / katılmıyorum&rdquo; şeklindedir; görüşlerin şiddetini ölçmez.</li>
                        <li>{questions.length} soru Türkiye siyasetinin tamamını kapsayamaz; soru seçimi sonucu etkiler.</li>
                        <li>Partiler ve ideolojiler kendi içinde çeşitlidir; her tabanda farklı görüşler bulunur.</li>
                        <li>Bazı ideolojiler birbirine yakındır (örneğin Yeşil ile Demokratik Özerklikçi, Kemalist ile Ulusalcı); bu çiftler arasında sonuç kolayca değişebilir.</li>
                        <li>Bu test bilimsel olarak doğrulanmış bir ölçek değildir ve oy tavsiyesi değildir.</li>
                    </ul>
                </Section>

                <Section title="Gizlilik">
                    <p>
                        Cevapların tarayıcında işlenir ve kaydedilmez; hesap açma ya da çerez yoktur. Test bitince{' '}
                        <Link href="/istatistik" className="underline underline-offset-4 hover:text-white">anonim istatistiklere</Link>{' '}
                        yalnızca sonuç ideolojin ve test türün eklenir, kimliğinle ilişkilendirilmez. İstemiyorsan ana sayfadaki işareti
                        kaldırarak bunu kapatabilirsin.
                    </p>
                    <p>
                        Ayrıntılar için <Link href="/gizlilik" className="underline underline-offset-4 hover:text-white">Aydınlatma Metni</Link>&apos;ne bakabilirsin.
                    </p>
                </Section>

                <Section title="İdeolojiler">
                    <div className="space-y-4">
                        {ideologyIds.map(id => {
                            const ideology = ideologies[id];
                            return (
                                <div key={id} className="border-l-2 pl-4 space-y-1" style={{ borderColor: ideology.color }}>
                                    <h3 className="font-bold text-white">{ideology.name}</h3>
                                    <p className="text-gray-400">{ideology.description}</p>
                                    <p className="text-xs text-gray-500">
                                        Partiler: {ideology.parties.join(', ')} •{' '}
                                        {AXIS_IDS.map(axis => `${AXES[axis].name}: ${formatAxis(IDEOLOGY_AXES[id][axis], AXES[axis].labels)}`).join(' • ')}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </Section>

                <Section title="Liderler">
                    <ul className="space-y-2">
                        {leaders.map(leader => (
                            <li key={leader.name}>
                                <span className="font-semibold text-white">{leader.name}</span>
                                <span className="text-gray-500"> – {leader.title}</span>:{' '}
                                {(Object.entries(leader.blend) as [IdeologyId, number][])
                                    .sort(([, a], [, b]) => b - a)
                                    .map(([id, w]) => `%${Math.round(w * 100)} ${ideologies[id].name}`)
                                    .join(', ')}
                                {leader.overrides && Object.keys(leader.overrides).length > 0 && (
                                    <span className="text-gray-500"> • {Object.keys(leader.overrides).length} soruda ayrı tutum</span>
                                )}
                            </li>
                        ))}
                    </ul>
                </Section>

                <p className="text-center text-xs text-gray-600 pb-4">
                    <Link href="/" className="underline hover:text-gray-400">Teste dön</Link>
                </p>
            </div>
        </main>
    );
}
