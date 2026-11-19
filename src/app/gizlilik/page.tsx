import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DATA_CONTROLLER, PRIVACY_UPDATED, SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
    title: 'Aydınlatma Metni ve Gizlilik | Türkiye İdeolojik',
    description: '6698 sayılı KVKK kapsamında aydınlatma metni: hangi verilerin, hangi amaçla ve hangi hukuki sebeple işlendiği.',
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <section className="glass rounded-[2rem] p-6 md:p-8 space-y-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        <div className="space-y-3 text-sm leading-relaxed text-gray-300">{children}</div>
    </section>
);

export default function PrivacyPage() {
    return (
        <main className="min-h-svh flex justify-center p-4 md:p-8">
            <div className="max-w-3xl w-full space-y-6 py-6">
                <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" /> Teste dön
                </Link>

                <header className="space-y-3">
                    <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">Aydınlatma Metni ve Gizlilik</h1>
                    <p className="text-gray-400">
                        6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) madde 10 kapsamında hazırlanmıştır. Son güncelleme: {PRIVACY_UPDATED}.
                    </p>
                </header>

                <Section title="1. Veri sorumlusu">
                    <p>
                        {SITE_NAME} bir kişi tarafından yürütülen bağımsız bir projedir. Veri sorumlusu:{' '}
                        <strong className="text-white">{DATA_CONTROLLER.name}</strong>, iletişim:{' '}
                        <a href={`mailto:${DATA_CONTROLLER.email}`} className="underline underline-offset-4 hover:text-white">{DATA_CONTROLLER.email}</a>.
                    </p>
                </Section>

                <Section title="2. Özet">
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Testi çözmek için hesap açman, ad, e-posta veya başka bir kimlik bilgisi vermen gerekmez.</li>
                        <li>Cevapların tarayıcında işlenir ve bizim tarafımızdan kaydedilmez.</li>
                        <li>Sonucunu anonim istatistiklere eklemek tamamen isteğe bağlıdır ve yalnızca açık rızanla yapılır.</li>
                        <li>Sitede çerez kullanılmaz.</li>
                    </ul>
                </Section>

                <Section title="3. Hangi veriler, hangi amaçla ve hangi hukuki sebeple işlenir?">
                    <h3 className="font-semibold text-white">a) Anonim sonuç istatistikleri (yalnızca açık rızan varsa)</h3>
                    <p>
                        Sonuç ekranında kutucuğu işaretleyip &ldquo;Sonucumu ekle&rdquo; dersen, tarayıcın sunucuya yalnızca iki bilgi gönderir:
                        sonuç ideolojinin adı ve test türü (Hızlı Test / Tam Analiz). Sunucu bu bilgiyle yalnızca toplam sayaçları
                        (ideoloji bazında ve test türü bazında) bir artırır. Cevapların, IP adresin, cihaz bilgin, zaman damgası
                        veya seni tanımlayabilecek başka hiçbir bilgi bu kayıtla birlikte saklanmaz; tek tek sonuçlar tutulmaz.
                    </p>
                    <p>
                        Sonuç ideolojisi, KVKK madde 6 kapsamında özel nitelikli kişisel veri sayılan siyasi düşünceye ilişkin
                        olabileceğinden, gönderim yalnızca <strong className="text-white">açık rızana</strong> (KVKK m. 6/2) dayanır.
                        Sayaçlara eklendikten sonra veri kimseyle ilişkilendirilemeyen anonim bir sayıya dönüşür; anonim hale getirilerek
                        istatistik amacıyla işlenen veriler KVKK madde 28/1-(b) kapsamındadır.
                    </p>
                    <p>
                        Amaç: Sitede hangi sonuçların ne sıklıkla çıktığını <Link href="/istatistik" className="underline underline-offset-4 hover:text-white">herkese açık istatistik sayfasında</Link>{' '}
                        toplu olarak göstermek.
                    </p>

                    <h3 className="font-semibold text-white pt-2">b) Ziyaret istatistikleri</h3>
                    <p>
                        Kaç kişinin siteyi ziyaret ettiğini görmek için barındırma sağlayıcımız Vercel&apos;in çerezsiz &ldquo;Web Analytics&rdquo;
                        hizmeti kullanılır. Bu hizmet sayfa yolu, yönlendiren site, ülke, tarayıcı ve cihaz türü gibi toplu bilgileri
                        sayar; çerez kullanmaz. Sayfa adreslerindeki paylaşım kodu (cevaplarının kodu) bu hizmete gönderilmeden önce
                        silinir. Hukuki sebep: sitenin işletilmesi ve iyileştirilmesi için veri sorumlusunun meşru menfaati (KVKK m. 5/2-f).
                    </p>

                    <h3 className="font-semibold text-white pt-2">c) Teknik kayıtlar</h3>
                    <p>
                        Her web sitesinde olduğu gibi, sayfaya eriştiğinde IP adresin ve tarayıcı bilgilerin barındırma sağlayıcısının
                        sunucularına ulaşır ve sağlayıcının güvenlik ve işletim amaçlı standart erişim kayıtlarında sınırlı süreyle yer
                        alabilir. Bu kayıtlar tarafımızdan istatistik, profil çıkarma veya başka bir amaçla kullanılmaz. Hukuki sebep:
                        hizmetin güvenli şekilde sunulması için meşru menfaat (KVKK m. 5/2-f) ve sözleşmenin ifası (KVKK m. 5/2-c).
                    </p>

                    <h3 className="font-semibold text-white pt-2">d) Paylaşım linkleri</h3>
                    <p>
                        Sonucunu paylaştığında linkin içinde cevaplarının kısa bir kodu bulunur. Link açıldığında bu kod, sonucu ve sosyal
                        medya önizleme görselini oluşturmak için sunucuya iletilir; herhangi bir veritabanında saklanmaz. Linki paylaşıp
                        paylaşmamak tamamen senin kararındır.
                    </p>

                    <h3 className="font-semibold text-white pt-2">e) Yalnızca kendi tarayıcında saklananlar</h3>
                    <p>
                        Yarım kalan testin ve ses tercihin, kaldığın yerden devam edebilmen için yalnızca kendi tarayıcının yerel
                        depolamasında tutulur ve sunucuya gönderilmez. Tarayıcı verilerini silerek bunları kaldırabilirsin.
                    </p>
                </Section>

                <Section title="4. Verilerin aktarılması">
                    <p>
                        Site, Vercel Inc. (ABD) altyapısında barındırılır; anonim sayaçlar Upstash bulut veritabanında tutulur. Bu
                        sağlayıcılar veri sorumlusu adına hizmet veren veri işleyenlerdir ve sunucuları yurt dışında bulunabilir. Anonim
                        istatistikler ve ziyaret sayıları kişisel veri içermez. Teknik erişim kayıtlarının (IP adresi gibi) bu sağlayıcılar
                        tarafından işlenmesi, KVKK madde 9 kapsamındaki yurt dışına aktarım hükümlerine tabidir. Veriler bunun dışında
                        hiçbir üçüncü kişiyle paylaşılmaz veya satılmaz.
                    </p>
                </Section>

                <Section title="5. Saklama süresi">
                    <p>
                        Anonim sayaçlar, istatistik sayfası yayında olduğu sürece saklanır. Kişiyle ilişkilendirilebilen herhangi bir
                        sonuç kaydı tutulmadığı için bu kapsamda saklanan kişisel veri bulunmaz. Teknik erişim kayıtları, barındırma
                        sağlayıcısının belirlediği sınırlı süre boyunca tutulur.
                    </p>
                </Section>

                <Section title="6. Haklarınız (KVKK madde 11)">
                    <p>
                        Kişisel verilerinin işlenip işlenmediğini öğrenme, işlenmişse bilgi talep etme, amacını ve amacına uygun kullanılıp
                        kullanılmadığını öğrenme, aktarıldığı üçüncü kişileri bilme, eksik veya yanlış işlenmişse düzeltilmesini, silinmesini
                        veya yok edilmesini isteme, itiraz etme ve zarara uğraman halinde tazminat talep etme haklarına sahipsin.
                    </p>
                    <p>
                        Önemli not: İstatistiğe eklenen sonuçlar ekleme anında anonim bir sayıya dönüştüğü için, belirli bir kişinin
                        katkısını sonradan bulmak ve silmek teknik olarak mümkün değildir. Bu nedenle rızanı vermeden önce düşünebilirsin;
                        rıza vermezsen hiçbir sonuç gönderilmez.
                    </p>
                    <p>
                        Başvurularını{' '}
                        <a href={`mailto:${DATA_CONTROLLER.email}`} className="underline underline-offset-4 hover:text-white">{DATA_CONTROLLER.email}</a>{' '}
                        adresine iletebilirsin. Başvurular en geç 30 gün içinde ücretsiz olarak yanıtlanır. Yanıttan memnun kalmazsan
                        Kişisel Verileri Koruma Kurulu&apos;na şikâyette bulunabilirsin.
                    </p>
                </Section>

                <p className="text-center text-xs text-gray-600 pb-4">
                    <Link href="/yontem" className="underline hover:text-gray-400">Yöntem ve Sınırlamalar</Link> •{' '}
                    <Link href="/istatistik" className="underline hover:text-gray-400">İstatistikler</Link> •{' '}
                    <Link href="/" className="underline hover:text-gray-400">Teste dön</Link>
                </p>
            </div>
        </main>
    );
}
