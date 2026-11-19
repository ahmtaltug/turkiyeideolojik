# 🇹🇷 Türkiye İdeolojik

Türkiye siyasetindeki yerini keşfetmeni sağlayan, kaydırmalı (swipe) bir siyasi kimlik testi.

### 🧐 Bu nedir?
Sorulara sağa (katılıyorum) veya sola (katılmıyorum) kaydırarak cevap verirsin; sonuç ekranında 13 ideolojik akımdan hangisine ve hangi liderlere daha yakın olduğunu görürsün.

### ✨ Özellikler
* **Kaydır, tıkla ya da klavye kullan:** Kart kaydırma, Katılıyorum/Katılmıyorum butonları, `←` / `→` tuşları, `↓` ile soruyu geçme ve `Backspace` ile geri alma.
* **İki mod:** 40 soruluk Tam Analiz veya 4 eksene dengeli dağıtılmış 20 soruluk Hızlı Test.
* **Fikrim yok, geç:** Bilmediğin konuları atlayabilirsin; atlanan sorular hesaplamaya katılmaz.
* **Kaldığın yerden devam:** İlerleme tarayıcıda saklanır, sayfa yenilense de kaybolmaz.
* **Ayrıntılı sonuç:** 4 eksen (Ekonomi, Toplumsal, Milliyetçilik, Yönetim), tüm ideolojilerin sıralaması, lider uyumu, "Neden bu sonuç?" açıklaması ve tutarlılık skoru.
* **Paylaşım:** Sonuç linki cevapları kısa bir kodla taşır; WhatsApp, X gibi platformlarda kişinin kendi sonucunu gösteren önizleme görseli oluşur. Kart PNG olarak da indirilebilir.
* **Anonim istatistikler:** Test bitince (kullanıcı ana sayfadaki işareti kaldırmadıysa) yalnızca sonuç ideolojisi ve test türü toplam sayaçlara eklenir; `/istatistik` sayfasında toplu dağılım gösterilir. Kişi bazında kayıt, IP veya çerez tutulmaz.
* **Yöntem sayfası:** `/yontem` hesaplamanın nasıl yapıldığını, sınırlamaları ve gizlilik bilgisini açıklar.
* **Gizlilik:** Cevaplar tarayıcıda işlenir ve kaydedilmez. Paylaşılan linkteki kod yalnızca önizleme görselini oluşturmak için sunucuya iletilir.

### 🧮 Hesaplama nasıl çalışır?
* Her sorunun 13 ideolojinin her biri için bir tutumu var (-2 kesinlikle katılmaz … +2 kesinlikle katılır). Tutumlar `src/data/questions.ts` içinde.
* Uyum yüzdesi, o ideolojiye sahip birinin senin verdiğin cevapların aynısını verme olasılığından hesaplanır. Bir ideolojinin temel çizgisine (±2) ters düşmek, hafif bir ayrılıktan çok daha fazla uzaklaştırır.
* Eksen konumları ve ideolojilerin tipik konumları aynı tutumlardan türetilir; liderler ideoloji karışımı ve konu bazlı istisnalarla tanımlanır (`src/data/leaders.ts`).
* Testler, her ideolojiyi taklit eden simüle katılımcıların doğru ideolojiye eşleştiğini kontrol eder.

İçerik Kasım 2026 Türkiye siyasetine göre güncellenmiştir.

### 🛠️ Geliştirme
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # puanlama motoru testleri (Vitest)
npm run lint
npm run build
```
Teknolojiler: Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Recharts.

`NEXT_PUBLIC_SITE_URL` ortam değişkeni sitenin adresini belirler (önizleme görselleri, sitemap ve robots için). Vercel'de ayarlanmazsa projenin üretim adresi otomatik kullanılır; özel bir alan adı bağlarsan bu değişkeni o adrese ayarla.

İçerik tarihi `src/lib/site.ts` içindeki `CONTENT_DATE` ile gösterilir; içeriği güncellediğinde bunu da güncelle. Sorular değişirse eski paylaşım linklerinin yanlış sonuca eşlenmemesi için `src/utils/scoring.ts` içindeki `SHARE_VERSION` değerini artır.

### 📊 İstatistik ve trafik kurulumu (Vercel)
1. **Anonim sonuç istatistikleri:** Vercel panelinde *Storage → Marketplace → Upstash (Redis)* ile bir veritabanı oluşturup projeye bağla (mümkünse Frankfurt bölgesi). Bağlantı `KV_REST_API_URL` / `KV_REST_API_TOKEN` (veya `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN`) ortam değişkenlerini otomatik ekler. Bu değişkenler yoksa üretimde istatistik toplama kapalı kalır ve onay kutusu gösterilmez.
2. **Trafik:** Vercel panelinde projenin *Analytics* sekmesinden Web Analytics'i etkinleştir. Çerez kullanmaz; paylaşım kodunun gitmemesi için sayfa adreslerindeki `?s=` parametresi gönderilmeden önce silinir.
3. **Kötüye kullanıma karşı (önerilir):** *Firewall* bölümünden `/api/istatistik` için bir hız sınırı kuralı ekle (ör. IP başına dakikada 5 istek). Uygulama IP adresi okumadığı için bu koruma Vercel tarafında yapılmalı.

**Ücretsiz planlarda kalmak için:** Vercel Hobby ve Upstash ücretsiz planında limit aşılırsa ücret çıkmaz; ilgili özellik bir süre durur. Upstash'e ya da Vercel'e kredi kartı eklemeyin ve planı yükseltmeyin; böylece otomatik olarak ücretli plana geçilmez. Vercel Hobby planı yalnızca kişisel ve ticari olmayan kullanım içindir; sitede reklam, bağış veya sponsorluk gibi gelir başlarsa Pro plana geçmek gerekir.

Aydınlatma metni `/gizlilik` sayfasındadır; veri sorumlusu bilgileri `src/lib/site.ts` içindeki `DATA_CONTROLLER` alanındadır. Metin KVKK'ya uygun olacak şekilde hazırlanmıştır ancak yayına almadan önce bir hukukçuya gözden geçirtilmesi önerilir.

### ⚠️ Önemli Not
Bu uygulama bilgilendirme ve fikir jimnastiği amacıyla geliştirilmiştir. Sonuçlar bilimsel bir kesinlik taşımaz; ideoloji ve lider konumları yaklaşık tahminlerdir.
