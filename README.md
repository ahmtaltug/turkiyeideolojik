# 🇹🇷 Türkiye İdeolojik

Türkiye siyasetindeki yerini keşfetmeni sağlayan, kaydırmalı (swipe) bir siyasi kimlik testi.

### 🧐 Bu nedir?
Sorulara sağa (katılıyorum) veya sola (katılmıyorum) kaydırarak cevap verirsin; sonuç ekranında 13 ideolojik akımdan hangisine ve hangi liderlere daha yakın olduğunu görürsün.

### ✨ Özellikler
* **Kaydır, tıkla ya da klavye kullan:** Kart kaydırma, Katılıyorum/Katılmıyorum butonları, `←` / `→` tuşları ve `Backspace` ile geri alma.
* **İki mod:** 40 soruluk Tam Analiz veya 4 eksene dengeli dağıtılmış 20 soruluk Hızlı Test.
* **Kaldığın yerden devam:** İlerleme tarayıcıda saklanır, sayfa yenilense de kaybolmaz.
* **Ayrıntılı sonuç:** 4 eksen (Ekonomi, Toplumsal, Milliyetçilik, Yönetim), tüm ideolojilerin sıralaması, lider uyumu, "Neden bu sonuç?" açıklaması ve tutarlılık skoru.
* **Paylaşım:** Sonuç linki cevapları URL'de taşır (sunucu yok); kart PNG olarak indirilebilir.
* **Gizlilik:** Cevaplar yalnızca tarayıcıda işlenir.

### 🛠️ Geliştirme
```bash
npm install
npm run dev        # http://localhost:3000
npm test           # puanlama motoru testleri (Vitest)
npm run lint
npm run build
```
Teknolojiler: Next.js 16, React 19, Tailwind CSS 4, Framer Motion, Recharts.

İsteğe bağlı: `NEXT_PUBLIC_SITE_URL` ortam değişkeni sosyal medya önizlemeleri için sitenin adresini belirler (Vercel'de otomatik).

### ⚠️ Önemli Not
Bu uygulama eğlence ve fikir jimnastiği amacıyla geliştirilmiştir. Sonuçlar bilimsel bir kesinlik taşımaz; ideoloji ve lider konumları yaklaşık tahminlerdir.
