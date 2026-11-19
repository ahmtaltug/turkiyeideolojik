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
        text: 'Enflasyonla mücadelede yüksek faiz ve sıkı para politikası, ekonomi yavaşlasa bile sürdürülmelidir.',
        context: 'Merkez Bankası politika faizi Ekim 2026 itibarıyla %36, yıllık enflasyon ~%30.',
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
        text: 'En düşük emekli aylığı asgari ücretin altında olmamalı; bütçede öncelik emekliye verilmelidir.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: 0, liberal: -1, sosyalist: 2, ozerklikci: 1, islamci: 2, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 4,
        text: 'Garantili otoyol, köprü ve şehir hastanesi sözleşmeleri (Kamu-Özel İşbirliği) iptal edilmeli ya da yeniden müzakere edilmelidir.',
        axes: { ekonomi: -0.6, yonetim: -0.4 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: 2, turkculuk: 1 },
    },
    {
        id: 5,
        text: 'Enerji, maden ve limanlar gibi stratejik sektörler kamu mülkiyetinde olmalı; yapılan özelleştirmeler geri alınmalıdır.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 1, muhafazakar: -1, ulkucu: 1, liberal: -2, sosyalist: 2, ozerklikci: 1, islamci: 1, avrasyaci: 2, ulusalci: 2, merkez_sag: -1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 6,
        text: 'Büyük servetlere ve yüksek gelire ek vergi getirilmeli, KDV gibi dolaylı vergiler düşürülmelidir.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: 0, liberal: -1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: -1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 7,
        text: 'Yatırım çekmek için iş gücü piyasası esnetilmeli, kıdem tazminatı bir fona devredilmelidir.',
        axes: { ekonomi: 1 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 1, ulkucu: 0, liberal: 2, sosyalist: -2, ozerklikci: -2, islamci: -1, avrasyaci: -2, ulusalci: -1, merkez_sag: 1, yesil: -1, turkculuk: -1 },
    },
    {
        id: 8,
        text: 'Konut krizine karşı kira artışlarına kalıcı bir tavan konmalı, devlet büyük ölçekli kiralık sosyal konut üretmelidir.',
        axes: { ekonomi: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: 0, ulkucu: 1, liberal: -2, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: -1, yesil: 1, turkculuk: 1 },
    },
    {
        id: 9,
        text: 'Tarımda ithalat yerine yerli üretici korunmalı; gerekirse yüksek gümrük vergileri uygulanmalıdır.',
        axes: { ekonomi: -0.7, milliyetcilik: 0.3 },
        stances: { kemalist: 1, sosyal_demokrat: 1, muhafazakar: 0, ulkucu: 2, liberal: -2, sosyalist: 1, ozerklikci: 1, islamci: 1, avrasyaci: 2, ulusalci: 2, merkez_sag: 0, yesil: 1, turkculuk: 2 },
    },

    /* ---------------- Toplum ---------------- */
    {
        id: 10,
        text: 'Diyanet İşleri Başkanlığı\'nın bütçesi ve yetkileri azaltılmalı, din hizmetleri devletten bağımsızlaşmalıdır.',
        axes: { toplum: -1 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -2, avrasyaci: -1, ulusalci: -1, merkez_sag: -1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 11,
        text: '"Türkiye Yüzyılı Maarif Modeli" müfredatı, milli ve manevi değerleri güçlendirdiği için doğru bir adımdır.',
        axes: { toplum: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: -1, ulusalci: -2, merkez_sag: 0, yesil: -2, turkculuk: -1 },
    },
    {
        id: 12,
        text: 'İstanbul Sözleşmesi\'ne geri dönülmeli ve kadına yönelik şiddette "haksız tahrik" indirimleri tamamen kaldırılmalıdır.',
        axes: { toplum: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -2, avrasyaci: -1, ulusalci: 1, merkez_sag: 1, yesil: 2, turkculuk: 0 },
    },
    {
        id: 13,
        text: 'LGBT+ kimliğini "özendirmek" cezai yaptırıma bağlanmalıdır.',
        context: 'Yargı paketleri kapsamında "biyolojik cinsiyete aykırılık" düzenlemesi tartışılıyor.',
        axes: { toplum: 1, yonetim: 0.4 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 2, avrasyaci: 1, ulusalci: 0, merkez_sag: 0, yesil: -2, turkculuk: 1 },
    },
    {
        id: 14,
        text: 'Nüfus düşüşüyle mücadele için devlet geleneksel aile modelini öne çıkarmalı, çok çocuklu aileleri güçlü biçimde ödüllendirmelidir.',
        axes: { toplum: 1 },
        stances: { kemalist: 0, sosyal_demokrat: -1, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: -1, ozerklikci: -1, islamci: 2, avrasyaci: 1, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 15,
        text: 'Kamu kurumlarında ve okullarda dini kıyafet ve sembollere hiçbir kısıtlama getirilmemelidir.',
        axes: { toplum: 0.5, yonetim: -0.5 },
        stances: { kemalist: -1, sosyal_demokrat: 1, muhafazakar: 2, ulkucu: 1, liberal: 2, sosyalist: 0, ozerklikci: 1, islamci: 2, avrasyaci: -1, ulusalci: -2, merkez_sag: 1, yesil: 1, turkculuk: -1 },
    },
    {
        id: 16,
        text: 'Tarikat ve cemaatlerin eğitimde ve kamu kurumlarındaki etkisi sıkı biçimde denetlenmeli ve sınırlandırılmalıdır.',
        axes: { toplum: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 0, sosyalist: 2, ozerklikci: 1, islamci: -2, avrasyaci: 2, ulusalci: 2, merkez_sag: 1, yesil: 1, turkculuk: 2 },
    },
    {
        id: 17,
        text: 'Faizsiz bankacılık ve katılım finansı devlet tarafından özel olarak teşvik edilmelidir.',
        axes: { toplum: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 1, liberal: -1, sosyalist: -2, ozerklikci: -1, islamci: 2, avrasyaci: -1, ulusalci: -2, merkez_sag: 0, yesil: -1, turkculuk: -1 },
    },
    {
        id: 18,
        text: 'Sahipsiz köpekler toplanıp barınaklara alınmalı, gerekirse uyutulmalıdır.',
        axes: { toplum: 0.5, yonetim: 0.5 },
        stances: { kemalist: 0, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 1, liberal: -1, sosyalist: -1, ozerklikci: 0, islamci: 1, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: -2, turkculuk: 2 },
    },
    {
        id: 19,
        text: 'Yeni kömür santrallerine ve zeytinlik, mera, orman alanlarında madenciliğe, büyümeyi yavaşlatsa bile izin verilmemelidir.',
        context: 'Türkiye Kasım 2026\'da Antalya\'da COP31 İklim Zirvesi\'ne ev sahipliği yapıyor.',
        axes: { ekonomi: -0.5, toplum: -0.5 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: -2, ulkucu: -1, liberal: 0, sosyalist: 1, ozerklikci: 1, islamci: -1, avrasyaci: -1, ulusalci: -1, merkez_sag: -1, yesil: 2, turkculuk: -1 },
    },

    /* ------------- Milliyetçilik & Dış Politika ------------- */
    {
        id: 20,
        text: 'Sığınmacılar, uluslararası tepkiye rağmen zorunlu ve takvime bağlı bir planla ülkelerine geri gönderilmelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 1, sosyal_demokrat: 0, muhafazakar: -1, ulkucu: 1, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: -2, avrasyaci: 1, ulusalci: 2, merkez_sag: 1, yesil: -2, turkculuk: 2 },
    },
    {
        id: 21,
        text: 'Türkiye, AB üyeliğini yeniden dış politikanın ana hedefi yapmalı ve gereken demokratik reformları yapmalıdır.',
        axes: { milliyetcilik: -1, yonetim: -0.3 },
        stances: { kemalist: 0, sosyal_demokrat: 2, muhafazakar: -1, ulkucu: -2, liberal: 2, sosyalist: -1, ozerklikci: 1, islamci: -2, avrasyaci: -2, ulusalci: -2, merkez_sag: 1, yesil: 1, turkculuk: -2 },
    },
    {
        id: 22,
        text: 'Türkiye NATO\'dan ayrılmalı ve Rusya-Çin eksenindeki BRICS ve Şanghay İşbirliği Örgütü\'ne yönelmelidir.',
        axes: { milliyetcilik: 0.7, ekonomi: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: -1, ulkucu: -1, liberal: -2, sosyalist: 1, ozerklikci: -1, islamci: 0, avrasyaci: 2, ulusalci: 1, merkez_sag: -2, yesil: -1, turkculuk: -2 },
    },
    {
        id: 23,
        text: 'Suudi Arabistan ve Pakistan ile imzalanan Mekke Ortak Savunma Anlaşması Türkiye\'nin çıkarına uygundur.',
        context: 'Anlaşma Kasım 2026\'da TBMM\'de kabul edildi; bir tarafa saldırı tümüne yapılmış sayılıyor.',
        axes: { toplum: 0.5, milliyetcilik: 0.5 },
        stances: { kemalist: -1, sosyal_demokrat: -1, muhafazakar: 2, ulkucu: 1, liberal: -1, sosyalist: -2, ozerklikci: -1, islamci: 2, avrasyaci: -1, ulusalci: -1, merkez_sag: 0, yesil: -1, turkculuk: -1 },
    },
    {
        id: 24,
        text: 'Türk Devletleri Teşkilatı ortak pazar ve ortak savunma birliğine dönüştürülmelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 1, sosyal_demokrat: -1, muhafazakar: 1, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 0, avrasyaci: 0, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 25,
        text: 'Anadilde eğitim hakkı tanınmalı, Kürtçe yerel kamu hizmetlerinde ikinci resmi dil olarak kullanılabilmelidir.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: -2, sosyal_demokrat: 0, muhafazakar: -1, ulkucu: -2, liberal: 1, sosyalist: 2, ozerklikci: 2, islamci: 1, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 1, turkculuk: -2 },
    },
    {
        id: 26,
        text: 'Yeni anayasa yapılsa bile vatandaşlık tanımındaki "Türk" ifadesi ve ilk dört madde kesinlikle değiştirilmemelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 2, sosyal_demokrat: 1, muhafazakar: 0, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: -1, avrasyaci: 2, ulusalci: 2, merkez_sag: 2, yesil: -1, turkculuk: 2 },
    },
    {
        id: 27,
        text: 'Türkiye, Suriye\'deki yeni yönetimle güvenlik tam sağlanana kadar kuzey Suriye\'deki askeri varlığını sürdürmelidir.',
        axes: { milliyetcilik: 1 },
        stances: { kemalist: 0, sosyal_demokrat: -1, muhafazakar: 2, ulkucu: 2, liberal: -1, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: -1, ulusalci: 1, merkez_sag: 1, yesil: -1, turkculuk: 2 },
    },
    {
        id: 28,
        text: 'Ermenistan sınırı açılmalı ve iki ülke arasındaki diplomatik ilişkiler tamamen normalleştirilmelidir.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: 0, sosyal_demokrat: 1, muhafazakar: 1, ulkucu: -1, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: 0, avrasyaci: 0, ulusalci: -2, merkez_sag: -1, yesil: 2, turkculuk: -2 },
    },
    {
        id: 29,
        text: 'Zorunlu askerlik kaldırılmalı, tamamen profesyonel orduya geçilmelidir.',
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
        text: 'Cumhurbaşkanlığı Hükümet Sistemi terk edilmeli, güçlendirilmiş parlamenter sisteme geri dönülmelidir.',
        axes: { yonetim: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 1, ozerklikci: 1, islamci: 0, avrasyaci: -1, ulusalci: 1, merkez_sag: 2, yesil: 1, turkculuk: 1 },
    },
    {
        id: 32,
        text: 'Seçilmiş belediye başkanlarının tutuklanması ve yerlerine kayyum atanması kabul edilemez.',
        axes: { yonetim: -1 },
        stances: { kemalist: 2, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -2, liberal: 2, sosyalist: 2, ozerklikci: 2, islamci: -1, avrasyaci: -1, ulusalci: 0, merkez_sag: 1, yesil: 2, turkculuk: -1 },
    },
    {
        id: 33,
        text: 'Ekrem İmamoğlu\'na yönelik davalar ve CHP kurultay davası, bağımsız yargının olağan işleyişidir.',
        context: 'İmamoğlu\'nun diploma iptali Kasım 2026\'da kesinleşti; istinaf CHP kurultayını "mutlak butlan"la iptal etti.',
        axes: { yonetim: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 0, avrasyaci: 1, ulusalci: -1, merkez_sag: -1, yesil: -2, turkculuk: 0 },
    },
    {
        id: 34,
        text: '"Terörsüz Türkiye" süreci kapsamında silah bırakan PKK üyelerine yasal dönüş ve topluma kazandırılma imkânı tanınması doğrudur.',
        context: 'Çerçeve yasa Ağustos 2026\'da TBMM\'den geçti; uygulama silah bırakmanın doğrulanmasına bağlı.',
        axes: { milliyetcilik: -0.7, yonetim: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: 1, muhafazakar: 2, ulkucu: 2, liberal: 1, sosyalist: 1, ozerklikci: 2, islamci: 1, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 1, turkculuk: -2 },
    },
    {
        id: 35,
        text: 'Abdullah Öcalan\'ın cezaevi koşulları iyileştirilmeli ve "umut hakkı" tartışmaya açılmalıdır.',
        axes: { milliyetcilik: -1 },
        stances: { kemalist: -2, sosyal_demokrat: -1, muhafazakar: -1, ulkucu: 0, liberal: 0, sosyalist: 1, ozerklikci: 2, islamci: 0, avrasyaci: -2, ulusalci: -2, merkez_sag: -2, yesil: 0, turkculuk: -2 },
    },
    {
        id: 36,
        text: 'Ulusal güvenlik gerekçesiyle sosyal medya erişim engelleri, bant daraltma ve yayın kuruluşlarına kayyum atanması gereklidir.',
        axes: { yonetim: 1 },
        stances: { kemalist: -1, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: 1, ulusalci: -1, merkez_sag: -1, yesil: -2, turkculuk: 0 },
    },
    {
        id: 37,
        text: 'Merkez Bankası, TÜİK, SPK ve BDDK gibi kurumların başkanlarını Cumhurbaşkanı tek başına atayamamalı; bu kurumlar tam bağımsız olmalıdır.',
        context: 'Yatırım fonu soruşturması 2026 sonbaharında BDDK ve SPK yönetimlerine uzandı.',
        axes: { yonetim: -1 },
        stances: { kemalist: 1, sosyal_demokrat: 2, muhafazakar: -2, ulkucu: -1, liberal: 2, sosyalist: 0, ozerklikci: 1, islamci: -1, avrasyaci: -1, ulusalci: 1, merkez_sag: 2, yesil: 1, turkculuk: 0 },
    },
    {
        id: 38,
        text: 'Yerel yönetimlere daha fazla yetki ve bütçe verilmeli, valiler de seçimle göreve gelmelidir.',
        axes: { yonetim: -0.7, milliyetcilik: -0.3 },
        stances: { kemalist: -1, sosyal_demokrat: 1, muhafazakar: -1, ulkucu: -2, liberal: 2, sosyalist: 1, ozerklikci: 2, islamci: 0, avrasyaci: -2, ulusalci: -2, merkez_sag: -1, yesil: 1, turkculuk: -2 },
    },
    {
        id: 39,
        text: 'Yeni bir anayasa yapılacaksa Cumhurbaşkanlığı Hükümet Sistemi korunmalıdır.',
        context: 'AK Parti\'nin yeni anayasa taslağı çalışması sürüyor; seçimler 2028\'de bekleniyor.',
        axes: { yonetim: 1 },
        stances: { kemalist: -2, sosyal_demokrat: -2, muhafazakar: 2, ulkucu: 2, liberal: -2, sosyalist: -1, ozerklikci: 0, islamci: 1, avrasyaci: 1, ulusalci: -1, merkez_sag: -2, yesil: -1, turkculuk: 0 },
    },
    {
        id: 40,
        text: 'Çocuk istismarı ve terör gibi ağır suçlar için idam cezası geri getirilmelidir.',
        axes: { yonetim: 1, toplum: 0.3 },
        stances: { kemalist: 0, sosyal_demokrat: -2, muhafazakar: 1, ulkucu: 2, liberal: -2, sosyalist: -2, ozerklikci: -2, islamci: 1, avrasyaci: 1, ulusalci: 1, merkez_sag: 0, yesil: -2, turkculuk: 2 },
    },
];
