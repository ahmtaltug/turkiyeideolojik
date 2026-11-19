import { AxisId } from './questions';

export type IdeologyId =
    | 'kemalist'
    | 'sosyal_demokrat'
    | 'muhafazakar'
    | 'ulkucu'
    | 'liberal'
    | 'sosyalist'
    | 'ozerklikci'
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
    /** Set when the result is a blend of the top two ideologies. */
    isHybrid?: boolean;
    secondId?: IdeologyId;
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
            "Devlet kurumlarında liyakati en katı şekilde uygulayıp mülakatları tamamen tarihe gömmek.",
            "Tüm stratejik sanayi kollarında ve enerjide yeniden devlet kontrolünü sağlamak.",
            "Köy Enstitüleri modelini modernize ederek kırsal kalkınma ve nitelikli eğitimi birleştirmek."
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
            motto: "Hak, Hukuk, Adalet."
        },
        actionPlan: [
            "Avrupa Birliği ile tam entegrasyon için demokratik reform takvimini derhal başlatmak.",
            "Sendikal hakları güçlendirip asgari ücreti insani yaşam standartlarına göre üç ayda bir güncellemek.",
            "Yerel yönetimlerdeki 'Kent Lokantası' gibi sosyal başarıları ulusal çapta bir ağa dönüştürmek."
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
            "Türkiye Yüzyılı vizyonuyla yerli savunma sanayi kapasitesini %100 yerli üretim seviyesine çekmek.",
            "Aile yapısını koruma odaklı geniş kapsamlı vergi indirimleri ve konut destekleri sağlamak.",
            "Büyük kalkınma projelerini (Kanal İstanbul, nükleer vb.) tamamlayarak bölgesel liderliği pekiştirmek."
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
            "Terörün her türlüsüne karşı 'tavizsiz mücadele' doktriniyle sınır ötesi güvenliği kalıcı hale getirmek.",
            "Türk Devletleri Teşkilatı'nı (TDT) Avrupa Birliği benzeri ortak bir pazara ve orduya dönüştürmek.",
            "Kamu kurumlarında milli beka odaklı bir kadrolaşma ve denetim mekanizması kurmak."
        ]
    },
    liberal: {
        id: 'liberal',
        name: 'Liberal',
        description: 'Bireysel özgürlükleri, serbest piyasa ekonomisini ve sınırlı devleti savunan görüş.',
        parties: ['LDP', 'DEVA'],
        leaders: ['Besim Tibuk', 'Ali Babacan'],
        color: '#14B8A6',
        roast: "Her şey özelleşsin istiyorsun ama sevgilin 'başkasıyla da görüşelim' dese hemen devletçi olup kural koyarsın.",
        idealAxes: { ekonomi: 90, toplum: -40, milliyetcilik: -60, yonetim: -90 },
        details: {
            history: "Osmanlı'nın son döneminden bu yana bireysel özgürlük ve serbest teşebbüs ilkeleri etrafında toplanan gruptur.",
            principles: ["Birey Hakları", "Serbest Piyasa", "Hukuk Devleti", "Mülkiyet Hakkı"],
            motto: "Özgürlük, Herkese ve Daima!"
        },
        actionPlan: [
            "TRT ve devlet bankaları dahil tüm kamu iktisadi teşebbüslerini blok halinde özelleştirip piyasadan çekilmek.",
            "Bireysel silahlanma haklarını genişletip mülkiyet güvenliğini hane bazında garanti altına almak.",
            "Merkez Bankası'nı sembolik bir kuruma dönüştürüp para politikasını serbest kur rejimine bırakmak."
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
            "Büyük sanayi holdinglerini ve bankaları halk adına kamulaştırıp işçi konseylerine devretmek.",
            "Haftalık çalışma süresini 30 saate indirip işsizliği iş paylaşımıyla tamamen yok etmek.",
            "Kira artışlarını tamamen yasaklayıp boş konutları evsizlere tahsis eden bir iskan yasası çıkarmak."
        ]
    },
    ozerklikci: {
        id: 'ozerklikci',
        name: 'Demokratik Özerklikçi',
        description: 'Kürt siyasi hareketinden beslenen; yerinden yönetim, anadilde eğitim ve kimliklerin anayasal tanınmasını savunan çizgi.',
        parties: ['DEM Parti'],
        leaders: ['Selahattin Demirtaş', 'Tülay Hatimoğulları', 'Tuncer Bakırhan'],
        color: '#9400D3',
        roast: "Her toplantıya eş başkan, eş sözcü ve eş moderatör getiriyorsun; kararı kimin vereceğine karar vermek için ayrı bir meclis kuruyorsun.",
        idealAxes: { ekonomi: -40, toplum: -60, milliyetcilik: -100, yonetim: -40 },
        details: {
            history: "1990'lardan bu yana farklı parti isimleriyle varlığını sürdüren, etnik kimlik taleplerini sol ve ekolojist söylemle birleştiren gelenektir. 2025'te başlayan çözüm süreci tartışmalarında merkezi bir aktör olmuştur.",
            principles: ["Yerinden Yönetim", "Anadilde Eğitim", "Eş Başkanlık", "Anayasal Kimlik"],
            motto: "Özgür Yaşam, Demokratik Toplum."
        },
        actionPlan: [
            "Avrupa Yerel Yönetimler Özerklik Şartı'ndaki tüm çekinceleri kaldırıp yerel meclislerin yetkisini artırmak.",
            "Anayasa'daki vatandaşlık tanımını etnik vurgudan arındırıp 'Türkiye Cumhuriyeti vatandaşlığı' temelinde yeniden yazmak.",
            "Eğitim, kültür ve yerel güvenlik yetkilerinin bir kısmını seçilmiş bölgesel yönetimlere devretmek."
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
            "Adil Düzen sistemiyle ağır sanayi hamlesini başlatıp faizci dünya düzeninden tamamen kopmak.",
            "D8 Teşkilatı üzerinden İslam Ortak Pazarı ve İslam Dinarı'nı hayata geçirmek.",
            "Eğitimi ve hukuku fıtrata ve inanca dayalı referanslarla yeniden yapılandırmak."
        ]
    },
    avrasyaci: {
        id: 'avrasyaci',
        name: 'Avrasyacı',
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
            "NATO'dan derhal çıkıp Türkiye'deki tüm yabancı askeri üsleri mühürlemek.",
            "BRICS ve Şanghay İşbirliği Örgütü'ne tam üyelik ile yeni bir küresel ittifak kurmak.",
            "İçeride ordunun kontrolünde güçlü bir merkezi üretim ve planlama otoritesi oluşturmak."
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
            "Sığınmacı ve kaçakları hiçbir uluslararası yaptırımı dinlemeden bir yıl içinde sınır dışı etmek.",
            "Gümrük Birliği'nden gerekirse çıkıp milli ekonomiyi koruyucu bir gümrük duvarı örmek.",
            "Mavi Vatan sınırlarında tavizsiz bir askeri varlık gösterip enerji kaynaklarını millileştirmek."
        ]
    },
    merkez_sag: {
        id: 'merkez_sag',
        name: 'Merkez Sağ',
        description: 'Demokratik değerler ile serbest piyasayı birleştiren, ılımlı ve kurumsal milliyetçi çizgi.',
        parties: ['İYİ Parti', 'Demokrat Parti'],
        leaders: ['Adnan Menderes', 'Süleyman Demirel', 'Musavat Dervişoğlu'],
        color: '#4169E1',
        roast: "Üçüncü yol dedin, dördüncü yol dedin, sonunda navigasyonu bozulan turistler gibi yolun ortasında kaldın.",
        idealAxes: { ekonomi: 70, toplum: 20, milliyetcilik: 60, yonetim: 20 },
        details: {
            history: "Demokrat Parti'den İYİ Parti'ye uzanan, 2024 sonrası yeniden yapılanma sürecine giren merkez sağ gelenek.",
            principles: ["Hukukun Üstünlüğü", "Kurumsal Milliyetçilik", "Serbest Piyasa", "Liyakat"],
            motto: "Bizim Yolumuz, Milletin Yoludur."
        },
        actionPlan: [
            "Hukuk güvenliğini sağlayarak doğrudan yabancı yatırımı çekmek ve liranın istikrarını korumak.",
            "Güçlendirilmiş Parlamenter Sistem ile kuvvetler ayrılığını yeniden tesis etmek.",
            "KOBİ'lere yönelik büyük teşvik paketleri açarak orta sınıfı ekonomik olarak güçlendirmek."
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
            "Türkiye'deki tüm kömür ve linyit madenlerini derhal kapatıp %100 rüzgar/güneş hedefine geçmek.",
            "Şehirleri 'yaya odaklı' hale getirip toplu taşımayı tamamen ücretsiz ve elektrikli yapmak.",
            "Hayvan hakları anayasası hazırlayarak doğaya yönelik tüm suçları ağır ceza kapsamına almak."
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
            history: "Ziya Gökalp ve Nihal Atsız'ın fikirlerinden beslenen; son yıllarda sığınmacı tartışmalarıyla yeniden yükselen seküler, etnik vurgulu milliyetçi çizgidir.",
            principles: ["Türklük Bilinci", "Demografik Koruma", "Seküler Devlet"],
            motto: "Vatan Ne Türkiye'dir Türklere, Ne Türkistan; Vatan Büyük ve Müebbet Bir Ülkedir: Turan."
        },
        actionPlan: [
            "Demografik beka yasası çıkararak vatandaşlık verilmiş yabancıları incelemeye alıp iptal etmek.",
            "Türklük kimliğini anayasada tek birleştirici unsur olarak daha sert ifadelerle tanımlamak.",
            "Türk dünyasıyla 'Kızılelma' vizyonu çerçevesinde derin bir askeri ve kültürel entegrasyon başlatmak."
        ]
    },
};
