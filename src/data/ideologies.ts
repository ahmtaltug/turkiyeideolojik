export type IdeologyId =
    | 'kemalist'
    | 'sosyal_demokrat'
    | 'muhafazakar'
    | 'ulkucu'
    | 'liberal'
    | 'sosyalist'
    | 'boluculuk'
    | 'islamci'
    | 'avrasyaci'
    | 'ulusalci'
    | 'merkez_sag'
    | 'yesil'
    | 'turkculuk';

export interface Ideology {
    id: IdeologyId;
    name: string;
    description: string;
    parties: string[];
    leaders: string[];
    color: string;
    roast: string;
}

export const ideologies: Record<IdeologyId, Ideology> = {
    kemalist: {
        id: 'kemalist',
        name: 'Kemalist',
        description: 'Atatürk ilkelerine bağlı, laiklik ve cumhuriyet değerlerini savunan modernleşmeci çizgi.',
        parties: ['CHP'],
        leaders: ['Mustafa Kemal Atatürk'],
        color: '#D40000',
        roast: "Modernleşmeyi sadece batılı gibi giyinmek sanıp, 100 yıl önceki kazanımların üzerine tek bir taş koymadan başkalarını cahillikle suçlamayı çok seviyorsun.",
    },
    sosyal_demokrat: {
        id: 'sosyal_demokrat',
        name: 'Sosyal Demokrat',
        description: 'Sosyal adalet, emek hakları ve demokratik hukuk devletini önceleyen merkez sol görüş.',
        parties: ['CHP', 'DSP'],
        leaders: ['Bülent Ecevit', 'Özgür Özel'],
        color: '#0056b3',
        roast: "Halkın sesisin ama halkla en yakın temasın latte beklerken kurduğun kısa diyaloglar.",
    },
    muhafazakar: {
        id: 'muhafazakar',
        name: 'Muhafazakar',
        description: 'Geleneksel değerleri, aile yapısını ve dini hassasiyetleri korumayı hedefleyen sağ siyaset.',
        parties: ['AK Parti', 'Saadet Partisi', 'Gelecek Partisi'],
        leaders: ['Recep Tayyip Erdoğan', 'Ahmet Davutoğlu'],
        color: '#008000',
        roast: "Dış güçler diye diye içindeki 'yerli ve milli' kredi kartı borçlarını çoktan unutmuşsun.",
    },
    ulkucu: {
        id: 'ulkucu',
        name: 'Ülkücü',
        description: 'Türk-İslam sentezini ve devletin bekasını merkeze koyan geleneksel milliyetçi akım.',
        parties: ['MHP', 'BBP'],
        leaders: ['Alparslan Türkeş', 'Devlet Bahçeli'],
        color: '#004A99',
        roast: "Dava dava deyip aslında birilerinin her mevsim değişen siyasi manevralarına stepne olmaktan hiç yorulmadın.",
    },
    liberal: {
        id: 'liberal',
        name: 'Liberal',
        description: 'Bireysel özgürlükleri, serbest piyasa ekonomisini ve sınırlı devleti savunan görüş.',
        parties: ['LDP', 'DEVA'],
        leaders: ['Besim Tibuk', 'Ali Babacan'],
        color: '#FFD700',
        roast: "Her şey özelleşsin istiyorsun ama sevgilin 'başkasıyla da görüşelim' dese hemen devletçi olup kural koyarsın.",
    },
    sosyalist: {
        id: 'sosyalist',
        name: 'Sosyalist',
        description: 'Üretim araçlarının kamulaştırılmasını, sınıfsız toplumu ve emekten yana politikaları savunan sol.',
        parties: ['TİP', 'TKP', 'Sol Parti'],
        leaders: ['Erkan Baş', 'Deniz Gezmiş'],
        color: '#8B0000',
        roast: "Kapitalizme karşı tweet atarken kullandığın iPhone şarjı %1 kalınca yaşadığın panik, devrim korkundan büyük.",
    },
    boluculuk: {
        id: 'boluculuk',
        name: 'Bölücülük',
        description: 'Türkiye\'nin üniter yapısına karşı çıkan, özyönetim ve ayrılıkçılık odaklı siyasi ajanda.',
        parties: ['DEM Parti'],
        leaders: ['Selahattin Demirtaş'],
        color: '#9400D3',
        roast: "Barış ve demokrasi deyip, her fırsatta terör örgütüyle arana mesafe koyamamandaki o garip 'utangaçlık' gerçekten göz kamaştırıcı.",
    },
    islamci: {
        id: 'islamci',
        name: 'İslamcı',
        description: 'Toplumsal ve siyasal hayatın İslami referanslarla düzenlenmesini savunan düşünce sistemi.',
        parties: ['Yeniden Refah', 'HÜDA PAR'],
        leaders: ['Necmettin Erbakan', 'Fatih Erbakan'],
        color: '#006400',
        roast: "Ahiret odaklısın ama kripto borsa grafiklerini takip etmekten Farz namazlarına bile vaktin kalmıyor.",
    },
    avrasyaci: {
        id: 'avrasyaci',
        name: 'Avrasyacı',
        description: 'Batı ittifakı yerine Rusya ve Çin ile stratejik işbirliğini savunan anti-emperyalist çizgi.',
        parties: ['Vatan Partisi'],
        leaders: ['Doğu Perinçek'],
        color: '#FF4500',
        roast: "NATO'ya sövüp Rus doğal gazıyla ısınırken kendini anti-emperyalist devrimci sanman gerçekten çok şirin.",
    },
    ulusalci: {
        id: 'ulusalci',
        name: 'Ulusalcı',
        description: 'Tam bağımsızlıkçı, devletçi ve seküler milliyetçiliği savunan laik-ulusal kesim.',
        parties: ['Vatan Partisi', 'Zafer Partisi'],
        leaders: ['Doğu Perinçek', 'Ümit Özdağ'],
        color: '#B22222',
        roast: "Her gün yeni bir 'derin devlet komplo teorisi' ile uyanıp akşam TRT belgeseliyle sakinleşen bir yorgun savaşçısın.",
    },
    merkez_sag: {
        id: 'merkez_sag',
        name: 'Merkez Sağ',
        description: 'Demokratik değerler ile serbest piyasayı birleştiren, kalkınmacı ve ılımlı muhafazakar çizgi.',
        parties: ['İYİ Parti', 'Demokrat Parti'],
        leaders: ['Süleyman Demirel', 'Turgut Özal', 'Meral Akşener'],
        color: '#4169E1',
        roast: "Kimin kazandığı önemli değil, senin kimin yanında durduğun önemli... yani hep kazananın.",
    },
    yesil: {
        id: 'yesil',
        name: 'Yeşil / Ekolojist',
        description: 'Çevre korumacı, sürdürülebilir yaşamı ve ekolojik adaleti savunan siyaset.',
        parties: ['Yeşiller Partisi', 'DEM Parti (Ekoloji Komisyonu)'],
        leaders: ['Greta Thunberg (Global)', 'Alper Akyüz'],
        color: '#228B22',
        roast: "Plastik pipet kullanmıyorsun diye dünya kurtuldu sanıyorsun ama 45 numara ekolojik ayak izin seni ele veriyor.",
    },
    turkculuk: {
        id: 'turkculuk',
        name: 'Türkçülük',
        description: 'Etnik temelli milliyetçilik, sığınmacı karşıtlığı ve seküler Türk kimliğini savunan yeni nesil muhalif çizgi.',
        parties: ['Zafer Partisi', 'İYİ Parti'],
        leaders: ['Nihal Atsız', 'Ümit Özdağ'],
        color: '#00BFFF',
        roast: "Tüm gün Twitter'da sığınmacı kovalayıp kendini Bilge Kağan sanıyorsun ama aslında sadece algoritmanın kölesi olmuş bir ergensin.",
    },
};
