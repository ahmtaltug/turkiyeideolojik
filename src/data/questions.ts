import { IdeologyId } from './ideologies';

export type AxisId = 'ekonomi' | 'toplum' | 'milliyetcilik' | 'yonetim';

/**
 * How an ideology would answer a statement:
 *  2 = kesinlikle katılır, 1 = katılır, 0 = bölünmüş / kayıtsız,
 * -1 = katılmaz, -2 = kesinlikle katılmaz.
 */
export type Stance = -2 | -1 | 0 | 1 | 2;

export interface Question {
    id: number;
    text: string;
    /** Optional one-line background for current-affairs questions. */
    context?: string;
    /**
     * What "Katılıyorum" means on each axis (-1..1). Positive = right-hand label:
     * ekonomi → serbest piyasa, toplum → muhafazakar, milliyetcilik → milliyetçi,
     * yonetim → merkeziyetçi/otoriter.
     */
    axes: Partial<Record<AxisId, number>>;
    stances: Record<IdeologyId, Stance>;
}

// Content reflects Turkish politics as of November 2026.
export const questions: Question[] = [
    /* ---------------- Ekonomi ---------------- */
    {
        id: 1,
        text: 'Enflasyonla mücadelede yüksek faiz politikası sürdürülmelidir.',
        context: 'Yüksek faiz enflasyonu düşürmeye yardım eder ama kredi, yatırım ve büyümeyi yavaşlatır.',
        axes: { ekonomi: 1 },
        stances: { kemalist: -1, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 0, liberal: 2, sosyalist: -2, ozerklikci: -1, islamci: -2, avrasyaci: -2, ulusalci: -1, merkez_sag: 1, yesil: -1, turkculuk: 0 },
    },
    {
        id: 2,
        text: 'Asgari ücret yılda en az iki kez, gerçekleşen enflasyona göre güncellenmelidir.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: 1, liberal: -1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: 0, yesil: 1, turkculuk: 1 },
    },
    {
        id: 3,
        text: 'En düşük emekli aylığı asgari ücretten düşük olmamalıdır.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: 0, liberal: -1, sosyalist: 2, ozerklikci: 1, islamci: 2, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 4,
        text: 'Garantili otoyol, köprü ve şehir hastanesi sözleşmeleri (Kamu-Özel İşbirliği) yeniden müzakere edilmelidir.',
        context: 'Bu projelerde devlet belirli bir araç ya da hasta sayısını garanti eder; kullanım düşük kalırsa farkı Hazine öder.',
        axes: { ekonomi: -0.6, yonetim: -0.4 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: 2, turkculuk: 1 },
    },
    {
        id: 5,
        text: 'Enerji, maden ve limanlar gibi stratejik sektörler kamu mülkiyetinde olmalıdır.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 1, muhafazakar: -1, ulkucu: 1, liberal: -2, sosyalist: 2, ozerklikci: 1, islamci: 1, avrasyaci: 2, ulusalci: 2, merkez_sag: -1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 6,
        text: 'Vergi yükü, KDV gibi dolaylı vergilerden büyük servet ve yüksek gelir sahiplerine kaydırılmalıdır.',
        context: 'Dolaylı vergiler herkesten aynı oranda alınır; gelir vergisi ise kazanç arttıkça artar.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: 0, liberal: -1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: -1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 7,
        text: 'Kıdem tazminatı, ayrılışta işverenin ödediği toplu tutar yerine her ay prim yatırılan bir fona devredilmelidir.',
        context: 'Bugün işveren, işten çıkardığı çalışana her çalışma yılı için yaklaşık bir aylık brüt maaş öder. Sendikalar fon sistemine, iş dünyası ise mevcut sisteme genelde karşıdır.',
        axes: { ekonomi: 1 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 1, ulkucu: 0, liberal: 2, sosyalist: -2, ozerklikci: -2, islamci: -1, avrasyaci: -2, ulusalci: -1, merkez_sag: 1, yesil: -1, turkculuk: -1 },
    },
    {
        id: 8,
        text: 'Kira artışlarına kalıcı bir yasal üst sınır getirilmelidir.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: 0, ulkucu: 1, liberal: -2, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: -1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 9,
        text: 'Yerli tarım üreticisini korumak için ithal tarım ürünlerine yüksek gümrük vergisi uygulanmalıdır.',
        axes: { ekonomi: -0.7, milliyetcilik: 0.3 },
        stances: { kemalist: 1, sosyal_demokrat: 1, muhafazakar: 0, ulkucu: 2, liberal: -2, sosyalist: 1, ozerklikci: 1, islamci: 1, avrasyaci: 2, ulusalci: 2, merkez_sag: 0, yesil: 1, turkculuk: 2 },
    },

    /* ---------------- Toplum ---------------- */
    {
        id: 10,
        text: 'Diyanet İşleri Başkanlığı\'nın bütçesi ve yetkileri azaltılmalıdır.',
        axes: { toplum: -1 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -2, avrasyaci: -1, ulusalci: -1, merkez_sag: -1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 11,
        text: '"Türkiye Yüzyılı Maarif Modeli" müfredatı doğru bir adımdır.',
        context: '2024\'ten itibaren kademeli olarak uygulanan, milli ve manevi değerlere ağırlık veren yeni ulusal müfredat.',
        axes: { toplum: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: -1, ulusalci: -2, merkez_sag: 0, yesil: -2, turkculuk: -1 },
    },
    {
        id: 12,
        text: 'Türkiye, İstanbul Sözleşmesi\'ne geri dönmelidir.',
        context: 'Kadına yönelik şiddeti önlemeye dair bu Avrupa Konseyi sözleşmesinden Türkiye 2021\'de Cumhurbaşkanı kararıyla çekildi.',
        axes: { toplum: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -2, avrasyaci: -1, ulusalci: 1, merkez_sag: 1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 13,
        text: 'LGBT+ kimliğini "özendirmek" cezai yaptırıma bağlanmalıdır.',
        context: 'Son yargı paketlerinde "biyolojik cinsiyete aykırılığı özendirme" suçu getirilmesi gündeme geldi.',
        axes: { toplum: 1, yonetim: 0.4 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 2, avrasyaci: 1, ulusalci: 0, merkez_sag: 0, yesil: -2, turkculuk: 1 },
    },
    {
        id: 14,
        text: 'Nüfus düşüşüne karşı devlet çok çocuklu aileleri güçlü biçimde ödüllendirmelidir.',
        axes: { toplum: 1 },
        stances: { kemalist: 0, sosyal_demokrat: 0, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: 0, ozerklikci: -1, islamci: 2, avrasyaci: 1, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 15,
        text: 'Kamu kurumlarında ve okullarda dini kıyafet ve sembollere hiçbir kısıtlama getirilmemelidir.',
        axes: { toplum: 0.5, yonetim: -0.5 },
        stances: { kemalist: -1, sosyal_demokrat: 1, muhafazakar: 2, ulkucu: 1, liberal: 2, sosyalist: 0, ozerklikci: 1, islamci: 2, avrasyaci: -1, ulusalci: -2, merkez_sag: 1, yesil: 1, turkculuk: -1 },
    },
    {
        id: 16,
        text: 'Tarikat ve cemaatlerin eğitimdeki ve kamu kurumlarındaki etkisi sınırlandırılmalıdır.',
        axes: { toplum: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 0, sosyalist: 2, ozerklikci: 1, islamci: -2, avrasyaci: 2, ulusalci: 2, merkez_sag: 1, yesil: 1, turkculuk: 2 },
    },
    {
        id: 17,
        text: 'Katılım bankacılığı (faizsiz bankacılık) devlet tarafından özel olarak teşvik edilmelidir.',
        context: 'Katılım bankacılığı, faiz yerine kâr-zarar ortaklığı gibi yöntemlerle çalışan İslami esaslı bankacılıktır.',
        axes: { toplum: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 1, liberal: -1, sosyalist: -2, ozerklikci: -1, islamci: 2, avrasyaci: -1, ulusalci: -2, merkez_sag: 0, yesil: -1, turkculuk: -1 },
    },
    {
        id: 18,
        text: 'Barınaklarda sahiplenilmeyen sokak köpekleri uyutulabilmelidir.',
        axes: { toplum: 0.5, yonetim: 0.5 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 1, ulkucu: 1, liberal: -1, sosyalist: -1, ozerklikci: 0, islamci: 1, avrasyaci: 1, ulusalci: 2, merkez_sag: 0, yesil: -2, turkculuk: 2 },
    },
    {
        id: 19,
        text: 'Yeni kömür santrallerine izin verilmemelidir.',
        context: 'Türkiye 2053 net sıfır emisyon hedefi açıkladı; elektriğin önemli bir kısmı hâlâ kömürden üretiliyor.',
        axes: { ekonomi: -0.5, toplum: -0.5 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: -2, ulkucu: -1, liberal: 0, sosyalist: 1, ozerklikci: 1, islamci: -1, avrasyaci: -1, ulusalci: -1, merkez_sag: -1, yesil: 2, turkculuk: -1 },
    },

    /* ------------- Milliyetçilik & Dış Politika ------------- */
    {
        id: 20,
        text: 'Sığınmacılar, gönüllü dönüş beklenmeden zorunlu olarak ülkelerine geri gönderilmelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 1, sosyal_demokrat: -1, muhafazakar: -1, ulkucu: 1, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: -2, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: -2, turkculuk: 2 },
    },
    {
        id: 21,
        text: 'Türkiye, AB üyeliğini yeniden dış politikanın ana hedefi yapmalıdır.',
        axes: { milliyetcilik: -1, yonetim: -0.3 },
        stances: { kemalist: 0, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: -2, liberal: 2, sosyalist: -1, ozerklikci: 1, islamci: -2, avrasyaci: -2, ulusalci: -2, merkez_sag: 1, yesil: 1, turkculuk: -2 },
    },
    {
        id: 22,
        text: 'Türkiye NATO\'dan ayrılmalıdır.',
        context: 'Ayrılmayı savunanların bir kısmı Rusya ve Çin ile daha yakın ilişki önerir.',
        axes: { milliyetcilik: 0.7, ekonomi: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: -1, ulkucu: -1, liberal: -2, sosyalist: 2, ozerklikci: 0, islamci: 0, avrasyaci: 2, ulusalci: 1, merkez_sag: -2, yesil: 0, turkculuk: -2 },
    },
    {
        id: 23,
        text: 'Mekke Ortak Savunma Anlaşması Türkiye\'nin çıkarına uygundur.',
        context: '2026\'da Suudi Arabistan ve Pakistan ile imzalanan anlaşmaya göre taraflardan birine yapılan saldırı tümüne yapılmış sayılır.',
        axes: { toplum: 0.5, milliyetcilik: 0.5 },
        stances: { kemalist: -1, sosyal_demokrat: -1, muhafazakar: 2, ulkucu: 1, liberal: -1, sosyalist: -2, ozerklikci: -1, islamci: 2, avrasyaci: -1, ulusalci: -1, merkez_sag: 0, yesil: -1, turkculuk: -1 },
    },
    {
        id: 24,
        text: 'Türk Devletleri Teşkilatı ortak bir savunma birliğine dönüştürülmelidir.',
        context: 'Üyeleri: Türkiye, Azerbaycan, Kazakistan, Kırgızistan ve Özbekistan.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 0, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 0, avrasyaci: 0, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 25,
        text: 'Okullarda Kürtçe gibi anadillerde eğitim hakkı tanınmalıdır.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: -2, sosyal_demokrat: 0, muhafazakar: -1, ulkucu: -2, liberal: 1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 1, turkculuk: -2 },
    },
    {
        id: 26,
        text: 'Anayasanın değiştirilemez ilk dört maddesi hiçbir koşulda tartışmaya açılmamalıdır.',
        context: 'İlk dört madde devletin şeklini, niteliklerini, ülke bütünlüğünü, dilini, bayrağını ve başkentini düzenler.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 2, sosyal_demokrat: 1, muhafazakar: 1, ulkucu: 2, liberal: -1, sosyalist: -1, ozerklikci: -2, islamci: -1, avrasyaci: 2, ulusalci: 2, merkez_sag: 2, yesil: -1, turkculuk: 2 },
    },
    {
        id: 27,
        text: 'Türkiye, kuzey Suriye\'deki askeri varlığını sürdürmelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 0, sosyal_demokrat: -1, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: -1, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 28,
        text: 'Ermenistan ile sınır kapısı açılmalıdır.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: 1, ulkucu: -1, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: 0, avrasyaci: 0, ulusalci: -2, merkez_sag: -1, yesil: 2, turkculuk: -2 },
    },
    {
        id: 29,
        text: 'Zorunlu askerlik kaldırılmalıdır.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: -2, sosyal_demokrat: 0, muhafazakar: -1, ulkucu: -2, liberal: 2, sosyalist: 0, ozerklikci: 2, islamci: -1, avrasyaci: -2, ulusalci: -2, merkez_sag: -1, yesil: 1, turkculuk: -2 },
    },
    {
        id: 30,
        text: 'Konut veya arazi alan yabancılara verilen "yatırımcı vatandaşlığı" tamamen kaldırılmalıdır.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 2, sosyal_demokrat: 1, muhafazakar: -2, ulkucu: 0, liberal: -2, sosyalist: 1, ozerklikci: 0, islamci: -1, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: 0, turkculuk: 2 },
    },

    /* ------------- Yönetim, Hukuk & Çözüm Süreci ------------- */
    {
        id: 31,
        text: 'Güçlendirilmiş parlamenter sisteme geri dönülmelidir.',
        context: 'Türkiye 2018\'den bu yana Cumhurbaşkanlığı Hükümet Sistemi ile yönetiliyor.',
        axes: { yonetim: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 1, ozerklikci: 1, islamci: 0, avrasyaci: -1, ulusalci: 1, merkez_sag: 2, yesil: 1, turkculuk: 1 },
    },
    {
        id: 32,
        text: 'Seçilmiş belediye başkanlarının yerine kayyum atanması kabul edilemez.',
        axes: { yonetim: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -1, avrasyaci: -1, ulusalci: 0, merkez_sag: 1, yesil: 2, turkculuk: -1 },
    },
    {
        id: 33,
        text: 'Ekrem İmamoğlu\'na yönelik davalar, bağımsız yargının olağan işleyişidir.',
        context: 'İBB Başkanı İmamoğlu Mart 2025\'te tutuklandı; diploması mahkeme kararıyla iptal edildi.',
        axes: { yonetim: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 0, avrasyaci: 1, ulusalci: -1, merkez_sag: -1, yesil: -2, turkculuk: 0 },
    },
    {
        id: 34,
        text: '"Terörsüz Türkiye" süreci kapsamında silah bırakan PKK üyelerine topluma yasal olarak dönme imkânı tanınmalıdır.',
        context: 'Bu amaçla çıkarılan çerçeve yasa Ağustos 2026\'da TBMM\'den geçti; uygulanması silah bırakmanın doğrulanmasına bağlı.',
        axes: { milliyetcilik: -0.7, yonetim: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: 1, muhafazakar: 2, ulkucu: 2, liberal: 1, sosyalist: 1, ozerklikci: 2, islamci: 1, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 1, turkculuk: -2 },
    },
    {
        id: 35,
        text: 'Abdullah Öcalan için "umut hakkı" tanınmalıdır.',
        context: 'Umut hakkı: ağırlaştırılmış müebbet hapis cezası alan kişinin belirli bir süre sonra şartlı tahliye için yeniden değerlendirilmesi.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: -2, sosyal_demokrat: -1, muhafazakar: -1, ulkucu: 0, liberal: 0, sosyalist: 1, ozerklikci: 2, islamci: 0, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 0, turkculuk: -2 },
    },
    {
        id: 36,
        text: 'Ulusal güvenlik gerekçesiyle sosyal medyaya erişim engeli getirilebilmelidir.',
        axes: { yonetim: 1 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: 1, ulusalci: -1, merkez_sag: -1, yesil: -2, turkculuk: 0 },
    },
    {
        id: 37,
        text: 'Merkez Bankası ve TÜİK gibi kurumların başkanları Cumhurbaşkanı tarafından tek başına atanmamalıdır.',
        context: 'Bu kurumların başkanları bugün Cumhurbaşkanı kararıyla atanıyor.',
        axes: { yonetim: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 2, sosyalist: 0, ozerklikci: 1, islamci: -1, avrasyaci: -1, ulusalci: 1, merkez_sag: 2, yesil: 1, turkculuk: 0 },
    },
    {
        id: 38,
        text: 'Valiler atamayla değil, seçimle göreve gelmelidir.',
        axes: { yonetim: -0.7, milliyetcilik: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: 0, muhafazakar: -1, ulkucu: -2, liberal: 1, sosyalist: 1, ozerklikci: 2, islamci: 0, avrasyaci: -2, ulusalci: -2, merkez_sag: -1, yesil: 1, turkculuk: -2 },
    },
    {
        id: 39,
        text: 'Yeni bir anayasa yapılacaksa Cumhurbaşkanlığı Hükümet Sistemi korunmalıdır.',
        context: 'Yeni anayasa tartışmalarında mevcut sistemin korunup korunmayacağı temel ayrılık noktalarından biridir.',
        axes: { yonetim: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -1, ozerklikci: 0, islamci: 1, avrasyaci: 1, ulusalci: -1, merkez_sag: -2, yesil: -1, turkculuk: 0 },
    },
    {
        id: 40,
        text: 'Ağır suçlar için idam cezası geri getirilmelidir.',
        context: 'Özellikle çocuk istismarı ve terör suçlarından sonra sıkça gündeme geliyor.',
        axes: { yonetim: 1, toplum: 0.3 },
        stances: { kemalist: 0, sosyal_demokrat: -2, muhafazakar: 1, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: 0, yesil: -2, turkculuk: 2 },
    },
];
