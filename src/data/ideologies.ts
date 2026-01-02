import { AxisId } from './questions';

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
    idealAxes: Record<AxisId, number>; // -100 to 100
    details?: {
        history: string;
        principles: string[];
        motto: string;
    };
    actionPlan: string[];
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
        idealAxes: { ekonomi: -40, toplum: -80, milliyetcilik: 60, yonetim: 40 },
        details: {
            history: "Cumhuriyetin kuruluş felsefesidir. 1920'lerden günümüze Türkiye'nin modernleşme sürecinin temelidir.",
            principles: ["Cumhuriyetçilik", "Milliyetçilik", "Halkçılık", "Devletçilik", "Laiklik", "İnkılapçılık"],
            motto: "Ne Mutlu Türküm Diyene!"
        },
        actionPlan: [
            "Kamuda liyakat sistemini geri getirip mülakatları tamamen kaldırmak.",
            "Eğitim müfredatını bilimsel ve laik temellere göre baştan aşağı yenilemek.",
            "Stratejik kurumların özelleştirilmesini durdurup devlet kontrolünü artırmak."
        ]
    },
    sosyal_demokrat: {
        id: 'sosyal_demokrat',
        name: 'Sosyal Demokrat',
        description: 'Sosyal adalet, halkçılık ve liyakati önceleyen, 2024 sonrası yerel yönetim gücüyle yükselen demokratik sol çizgi.',
        parties: ['CHP'],
        leaders: ['Mustafa Kemal Atatürk', 'Bülent Ecevit', 'Özgür Özel', 'Ekrem İmamoğlu'],
        color: '#EE1C25',
        roast: "Her seçim sonrası 'bu sefer tamam' diyorsun ama genel merkezde koltuk kavgası başlayınca Twitter'da taziye mesajı yayınlayan bir hesap gibi kalıyorsun.",
        idealAxes: { ekonomi: -60, toplum: -70, milliyetcilik: -10, yonetim: -60 },
        details: {
            history: "1960'lardan bugüne evrilen, 2024 yerel seçimleriyle Türkiye'nin birinci partisi konumuna gelen siyasi akım.",
            principles: ["Sosyal Adalet", "Demokratik Yönetim", "Liyakat", "Halkçı Ekonomi"],
            motto: "Türkiye İttifakı!"
        },
        actionPlan: [
            "Kent lokantaları ve sosyal yardım ağlarını ulusal seviyeye taşımak.",
            "Yargı bağımsızlığını sağlayıp Avrupa İnsan Hakları Sözleşmesi'ne tam uyum.",
            "Asgari ücreti insani yaşam sınırına çekip vergi yükünü zenginden almak."
        ]
    },
    muhafazakar: {
        id: 'muhafazakar',
        name: 'Muhafazakar',
        description: 'Geleneklere bağlı, kalkınmacı ve dini-milli değerleri sentezleyen iktidar bloku çizgisi.',
        parties: ['AK Parti', 'Gelecek Partisi'],
        leaders: ['Recep Tayyip Erdoğan'],
        color: '#FFCC00',
        roast: "Mülakat kalkacak diye sevinirken, aslında mülakatın artık bir 'yaşam tarzı' olduğunu fark edemeyecek kadar optimistsin.",
        idealAxes: { ekonomi: 60, toplum: 80, milliyetcilik: 60, yonetim: 80 },
        details: {
            history: "2000'lerden bu yana Türkiye siyasetini domine eden, Yeni Anayasa ve Türkiye Yüzyılı vizyonuna odaklanmış sağ akım.",
            principles: ["Dini-Milli Değerler", "Hizmet Siyaseti", "Yeni Anayasa", "Güçlü Liderlik"],
            motto: "Durmak Yok, Yola Devam."
        },
        actionPlan: [
            "Savunma sanayi projelerine (KAAN, TOGG vb.) hız kesmeden devam etmek.",
            "Yeni, sivil ve kapsayıcı bir anayasa için referanduma gitmek.",
            "Bölgesel güç odaklı aktif bir dış politika izlemek."
        ]
    },
    ulkucu: {
        id: 'ulkucu',
        name: 'Ülkücü',
        description: 'Türk-İslam sentezini ve devletin bekasını merkeze koyan geleneksel milliyetçi akım.',
        parties: ['MHP', 'BBP'],
        leaders: ['Alparslan Türkeş', 'Devlet Bahçeli'],
        color: '#004A99',
        roast: "Dava dava deyip aslında birilerinin her mevsim değişen siyasi manevralarına stepne olmaktan hiç yorulmadın.",
        idealAxes: { ekonomi: -20, toplum: 60, milliyetcilik: 90, yonetim: 80 },
        details: {
            history: "CKMP ve MHP ile kurumsallaşmış, Türk milliyetçiliğini İslami hassasiyetlerle birleştirmiş bir harekettir.",
            principles: ["Türk-İslam Ülküsü", "Devletin Bekası", "Dokuz Işık Öğretisi"],
            motto: "Tanrı Türk'ü Korusun ve Yüceltsin!"
        },
        actionPlan: [
            "Terörle mücadelede tavizsiz bir güvenlik politikası uygulamak.",
            "Türk Devletleri Teşkilatı'nı askeri ve ekonomik bir birliğe dönüştürmek.",
            "Devlet kadrolarında milli hassasiyeti yüksek kadrolaşmaya gitmek."
        ]
    },
    liberal: {
        id: 'liberal',
        name: 'Liberal',
        description: 'Bireysel özgürlükleri, serbest piyasa ekonomisini ve sınırlı devleti savunan görüş.',
        parties: ['LDP', 'DEVA'],
        leaders: ['Besim Tibuk', 'Ali Babacan'],
        color: '#FFD700',
        roast: "Her şey özelleşsin istiyorsun ama sevgilin 'başkasıyla da görüşelim' dese hemen devletçi olup kural koyarsın.",
        idealAxes: { ekonomi: 90, toplum: -40, milliyetcilik: -60, yonetim: -90 },
        details: {
            history: "Osmanlı'nın son döneminden bu yana bireysel özgürlük ve serbest teşebbüs ilkeleri etrafında toplanan gruptur.",
            principles: ["Birey Hakları", "Serbest Piyasa", "Hukuk Devleti", "Mülkiyet Hakkı"],
            motto: "Özgürlük, Herkese ve Daima!"
        },
        actionPlan: [
            "TRT dahil tüm kamu iktisadi teşebbüslerini acilen özelleştirmek.",
            "Merkez Bankası'nı tam bağımsız yapıp vergi oranlarını radikal düşürmek.",
            "Vize serbestisi ve serbest ticaret anlaşmalarıyla dünyayla entegrasyon."
        ]
    },
    sosyalist: {
        id: 'sosyalist',
        name: 'Sosyalist',
        description: 'Üretim araçlarının kamulaştırılmasını, sınıfsız toplumu ve emekten yana politikaları savunan sol.',
        parties: ['TİP', 'TKP', 'Sol Parti'],
        leaders: ['Erkan Baş', 'Deniz Gezmiş'],
        color: '#8B0000',
        roast: "Kapitalizme karşı tweet atarken kullandığın iPhone şarjı %1 kalınca yaşadığın panik, devrim korkundan büyük.",
        idealAxes: { ekonomi: -90, toplum: -70, milliyetcilik: -50, yonetim: -20 },
        details: {
            history: "1960'larda Türkiye İşçi Partisi ile hız kazanan, toplumsal mülkiyet ve sınıf mücadelesi odaklı sol akımdır.",
            principles: ["Sınıfsız Toplum", "Eşitlik", "Anti-Emperyalizm", "Kamulaştırma"],
            motto: "Dünyanın Bütün İşçileri Birleşin!"
        },
        actionPlan: [
            "Tüm temel hizmetlerin (eğitim, sağlık, ulaşım) tamamen ücretsiz yapılması.",
            "Haftalık çalışma süresini 35 saate indirip işten çıkarmaları yasaklamak.",
            "NATO'dan çıkıp tam bağımsız, emekten yana bir dış politika kurmak."
        ]
    },
    boluculuk: {
        id: 'boluculuk',
        name: 'Bölücülük',
        description: 'Türkiye\'nin üniter yapısına karşı çıkan, özyönetim ve ayrılıkçılık odaklı siyasi ajanda.',
        parties: ['DEM Parti'],
        leaders: ['Selahattin Demirtaş'],
        color: '#9400D3',
        roast: "Barış ve demokrasi deyip, her fırsatta terör örgütüyle arana mesafe koyamamandaki o garip 'utangaçlık' gerçekten göz kamaştırıcı.",
        idealAxes: { ekonomi: -40, toplum: -60, milliyetcilik: -100, yonetim: -40 },
        details: {
            history: "Bölgesel özyönetim ve etnik temelli siyaset güden, üniter devlet yapısını sorgulayan akımdır.",
            principles: ["Yerinden Yönetim", "Etnik Siyaset", "Anayasal Kimlik"],
            motto: "Özgür Yaşam, Demokratik Toplum."
        },
        actionPlan: [
            "Yerinden yönetim ve özerklik şartlarını hayata geçirmek.",
            "Anadilde eğitimi tüm kademelerde zorunlu/seçmeli hale getirmek.",
            "Kayyum atamalarını yasaklayıp geniş bir genel af ilan etmek."
        ]
    },
    islamci: {
        id: 'islamci',
        name: 'İslamcı',
        description: 'Toplumsal ve siyasal hayatın İslami referanslarla düzenlenmesini savunan düşünce sistemi.',
        parties: ['Yeniden Refah', 'HÜDA PAR'],
        leaders: ['Necmettin Erbakan', 'Fatih Erbakan'],
        color: '#006400',
        roast: "Ahiret odaklısın ama kripto borsa grafiklerini takip etmekten Farz namazlarına bile vaktin kalmıyor.",
        idealAxes: { ekonomi: -30, toplum: 100, milliyetcilik: 30, yonetim: 90 },
        details: {
            history: "Milli Görüş hareketiyle şekillenmiş, dini prensipleri siyasetin merkezine koyan akımdır.",
            principles: ["Şer'i Referans", "Ümmetçilik", "Adil Düzen"],
            motto: "Hakkın Hakimiyeti İçin Çalışmak İbadettir."
        },
        actionPlan: [
            "Faizsiz ekonomi sistemine (Adil Düzen) geçişi hızlandırmak.",
            "D8 Teşkilatı'nı canlandırıp İslam Birliği'ni kurmak.",
            "Eğitim müfredatını manevi ve ahlaki değerler ekseninde yenilemek."
        ]
    },
    avrasyaci: {
        id: 'avrasyaci',
        name: 'Avrasyaci',
        description: 'Batı ittifakı yerine Rusya ve Çin ile stratejik işbirliğini savunan anti-emperyalist çizgi.',
        parties: ['Vatan Partisi'],
        leaders: ['Doğu Perinçek'],
        color: '#FF4500',
        roast: "NATO'ya sövüp Rus doğal gazıyla ısınırken kendini anti-emperyalist devrimci sanman gerçekten çok şirin.",
        idealAxes: { ekonomi: -80, toplum: 20, milliyetcilik: 70, yonetim: 95 },
        details: {
            history: "Aydınlık hareketi ve sonrasında Batı karşıtlığı temelinde gelişen, Avrasya ittifakını öneren stratejik görüştür.",
            principles: ["Anti-NATO", "Jeopolitik Değişim", "Otoriter Devlet Yapısı"],
            motto: "Yükselen Asya, Bağımsız Türkiye!"
        },
        actionPlan: [
            "NATO'dan çıkıp BRICS ve Şanghay İşbirliği Örgütü'ne üye olmak.",
            "Üretim devrimi için planlı ekonomi ve kamulaştırma hamlesi.",
            "Eskişehir-Pekin İpek Yolu hattını stratejik merkez yapmak."
        ]
    },
    ulusalci: {
        id: 'ulusalci',
        name: 'Ulusalcı',
        description: 'Tam bağımsızlıkçı, devletçi ve seküler milliyetçiliği savunan laik-ulusal kesim.',
        parties: ['Vatan Partisi', 'Zafer Partisi'],
        leaders: ['Doğu Perinçek', 'Ümit Özdağ'],
        color: '#B22222',
        roast: "Her gün yeni bir 'derin devlet komplo teorisi' ile uyanıp akşam TRT belgeseliyle sakinleşen bir yorgun savaşçısın.",
        idealAxes: { ekonomi: -70, toplum: -50, milliyetcilik: 90, yonetim: 85 },
        details: {
            history: "2000'lerin başında AB ve ABD karşıtlığıyla kitleselleşen seküler milliyetçi çizgidir.",
            principles: ["Tam Bağımsızlık", "Seküler Milliyetçilik", "Milli Ekonomi"],
            motto: "Türkiye Türklerindir!"
        },
        actionPlan: [
            "Sığınmacıların tamamını bir yıl içinde ülkelerine geri göndermek.",
            "AB ve Gümrük Birliği anlaşmalarını milli çıkarlarca revize etmek.",
            "Mavi Vatan ve Kıbrıs konusunda tavizsiz, sert dış politika."
        ]
    },
    merkez_sag: {
        id: 'merkez_sag',
        name: 'Merkez Sağ',
        description: 'Demokratik değerler ile serbest piyasayı birleştiren, ılımlı ve kurumsal milliyetçi çizgi.',
        parties: ['İYİ Parti', 'Demokrat Parti'],
        leaders: ['Süleyman Demirel', 'Musavat Dervişoğlu', 'Mansur Yavaş'],
        color: '#4169E1',
        roast: "Üçüncü yol dedin, dördüncü yol dedin, sonunda navigasyonu bozulan turistler gibi yolun ortasında kaldın.",
        idealAxes: { ekonomi: 70, toplum: 20, milliyetcilik: 60, yonetim: 20 },
        details: {
            history: "Demokrat Parti'den İYİ Parti'ye uzanan, 2024 sonrası yeniden yapılanma sürecine giren merkez sağ gelenek.",
            principles: ["Hukukun Üstünlüğü", "Kurumsal Milliyetçilik", "Serbest Piyasa", "Liyakat"],
            motto: "Bizim Yolumuz, Milletin Yoludur."
        },
        actionPlan: [
            "Güçlendirilmiş parlamenter sisteme acil geri dönüş hamlesi.",
            "Merkez Bankası ve TÜİK gibi kurumlara liyakatli atamalar.",
            "Küçük esnaf ve sanayiciyi koruyan vergi reformları."
        ]
    },
    yesil: {
        id: 'yesil',
        name: 'Yeşil / Ekolojist',
        description: 'Çevre korumacı, sürdürülebilir yaşamı ve ekolojik adaleti savunan siyaset.',
        parties: ['Yeşiller Partisi', 'DEM Parti (Ekoloji Komisyonu)'],
        leaders: ['Greta Thunberg (Global)', 'Alper Akyüz'],
        color: '#228B22',
        roast: "Plastik pipet kullanmıyorsun diye dünya kurtuldu sanıyorsun ama 45 numara ekolojik ayak izin seni ele veriyor.",
        idealAxes: { ekonomi: -70, toplum: -80, milliyetcilik: -60, yonetim: -80 },
        details: {
            history: "Global yeşil hareketin Türkiye'deki uzantısıdır. Çevre ve sürdürülebilirlik odaklıdır.",
            principles: ["Ekolojik Adalet", "Doğa Hakları", "Sürdürülebilirlik"],
            motto: "Doğa ile Uyum İçinde Bir Gelecek."
        },
        actionPlan: [
            "Fosil yakıt kullanımını sonlandırıp %100 yenilenebilir enerjiye geçiş.",
            "Hayvan hakları kanununu en sert şekilde revize etmek.",
            "Tüm maden projelerini ekolojik denetimden geçirip riskli olanları kapatmak."
        ]
    },
    turkculuk: {
        id: 'turkculuk',
        name: 'Türkçülük',
        description: 'Etnik temelli milliyetçilik, sığınmacı karşıtlığı ve seküler Türk kimliğini savunan yeni nesil muhalif çizgi.',
        parties: ['Zafer Partisi', 'İYİ Parti'],
        leaders: ['Nihal Atsız', 'Ümit Özdağ'],
        color: '#00BFFF',
        roast: "Tüm gün Twitter'da sığınmacı kovalayıp kendini Bilge Kağan sanıyorsun ama aslında sadece algoritmanın kölesi olmuş bir ergensin.",
        idealAxes: { ekonomi: -20, toplum: -20, milliyetcilik: 100, yonetim: 60 },
        details: {
            history: "Asala ve mülteci krizi gibi dönemlerle şekillenmiş, seküler ve net milliyetçi bir çizgidir.",
            principles: ["Türklük Bilinci", "Demografik Koruma", "Seküler Devlet"],
            motto: "Vatan Ne Türkiye'dir Türklere, Ne Türkistan; Vatan Büyük ve Müebbet Bir Ülkedir: Turan."
        },
        actionPlan: [
            "Sınır güvenliği için 'Duvar' ve 'Sensör' projelerini tamamlamak.",
            "Vatandaşlık alan sığınmacıların vatandaşlık incelemesini başlatmak.",
            "Milli Savunma Bakanlığı yapısını 15 Temmuz öncesine döndürmek."
        ]
    },
};


