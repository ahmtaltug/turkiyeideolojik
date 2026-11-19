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
    /** Common criticisms, phrased neutrally. */
    critiques: string[];
    details: {
        history: string;
        principles: string[];
        motto: string;
    };
    actionPlan: string[];
    /** Set when the result is a blend of the top two ideologies. */
    isHybrid?: boolean;
    secondId?: IdeologyId;
}

// Positions on each axis are derived from the question stances (see utils/scoring.ts),
// so ideologies and questions can never drift apart.
// Content reflects Turkish politics as of November 2026.
export const ideologies: Record<IdeologyId, Ideology> = {
    kemalist: {
        id: 'kemalist',
        name: 'Kemalist',
        description: 'Atatürk ilkelerine, laikliğe, üniter ulus devlete ve güçlü bir kamu sektörüne bağlı cumhuriyetçi çizgi.',
        parties: ['CHP', 'YENİ Parti'],
        leaders: ['Mustafa Kemal Atatürk', 'İsmet İnönü', 'Kemal Kılıçdaroğlu'],
        color: '#D40000',
        critiques: [
            'Laiklik uygulamalarının zaman zaman dindar kesimlerin hak ve özgürlüklerini kısıtladığı ileri sürülür.',
            'Tek parti dönemi mirası ve vesayetçi refleksler nedeniyle çoğulcu demokrasiyle gerilim yaşadığı eleştirisi yapılır.',
        ],
        details: {
            history: 'Cumhuriyetin kuruluş felsefesidir. 2026\'da CHP\'nin kurultayının mahkemece iptal edilip Kılıçdaroğlu\'nun göreve iade edilmesi ve Özgür Özel\'in YENİ Parti\'yi kurmasıyla Kemalist seçmen iki parti arasında bölündü.',
            principles: ['Cumhuriyetçilik', 'Milliyetçilik', 'Halkçılık', 'Devletçilik', 'Laiklik', 'İnkılapçılık'],
            motto: 'Yurtta Sulh, Cihanda Sulh.',
        },
        actionPlan: [
            'Tarikat ve cemaatlerin eğitimdeki etkisini sınırlayıp laik ve bilimsel müfredatı yeniden kurmak.',
            'Enerji, maden ve savunma gibi stratejik sektörlerde kamunun belirleyici rolünü geri getirmek.',
            'Köy Enstitüleri modelini modernize ederek kırsal kalkınmayı nitelikli eğitimle birleştirmek.',
        ],
    },
    sosyal_demokrat: {
        id: 'sosyal_demokrat',
        name: 'Sosyal Demokrat',
        description: 'Sosyal adalet, hukukun üstünlüğü, parlamenter demokrasi ve yerel yönetim deneyimini öne çıkaran demokratik sol.',
        parties: ['YENİ Parti', 'CHP'],
        leaders: ['Bülent Ecevit', 'Özgür Özel', 'Ekrem İmamoğlu'],
        color: '#EE1C25',
        critiques: [
            'Kapsamlı sosyal harcama vaatlerinin yüksek enflasyon ortamında nasıl finanse edileceğinin belirsiz kaldığı söylenir.',
            'Parti içi bölünmeler ve liderlik tartışmalarının iktidar alternatifi olma iddiasını zayıflattığı ileri sürülür.',
        ],
        details: {
            history: '1960\'ların "ortanın solu"ndan bugüne uzanan gelenek. 2024 yerel seçimlerinde birinci parti olan CHP\'nin yönetimi 2026\'da mahkeme kararıyla değişince, Özgür Özel ve 91 milletvekili Temmuz 2026\'da YENİ Parti\'yi kurdu.',
            principles: ['Sosyal Adalet', 'Parlamenter Demokrasi', 'Liyakat', 'Yerel Yönetim', 'Emeğin Hakları'],
            motto: 'Hak, Hukuk, Adalet.',
        },
        actionPlan: [
            'Güçlendirilmiş parlamenter sisteme geçip yargı bağımsızlığını anayasal güvenceye almak.',
            'Asgari ücret ve en düşük emekli aylığını yılda iki kez gerçek enflasyona göre güncellemek.',
            'Belediyelerdeki kent lokantası, kreş ve sosyal konut uygulamalarını ulusal ölçeğe taşımak.',
        ],
    },
    muhafazakar: {
        id: 'muhafazakar',
        name: 'Muhafazakar',
        description: 'Dini-milli değerleri, güçlü liderliği ve büyük kalkınma projelerini merkeze alan iktidar çizgisi.',
        parties: ['AK Parti'],
        leaders: ['Recep Tayyip Erdoğan'],
        color: '#FFCC00',
        critiques: [
            'Yürütmede yoğunlaşan yetkilerin kuvvetler ayrılığını ve denetim mekanizmalarını zayıflattığı eleştirisi yapılır.',
            'Kamu kaynaklarının dağıtımında liyakat yerine yakınlığın öne çıktığı iddiaları sıkça dile getirilir.',
        ],
        details: {
            history: '2002\'den bu yana iktidarda olan, 2017\'de Cumhurbaşkanlığı Hükümet Sistemi\'ne geçişi sağlayan sağ akım. Bugün yeni anayasa, "Terörsüz Türkiye" süreci ve Türkiye Yüzyılı vizyonuna odaklanıyor.',
            principles: ['Dini-Milli Değerler', 'Güçlü Liderlik', 'Hizmet Siyaseti', 'Aile', 'Bölgesel Güç'],
            motto: 'Türkiye Yüzyılı.',
        },
        actionPlan: [
            'Cumhurbaşkanlığı sistemini koruyan sivil bir yeni anayasayı referanduma götürmek.',
            '"Aile ve Nüfus On Yılı" kapsamında çok çocuklu ailelere vergi ve konut desteğini genişletmek.',
            'Savunma sanayisinde yerlilik oranını artırıp Mekke Savunma Anlaşması gibi bölgesel ittifakları derinleştirmek.',
        ],
    },
    ulkucu: {
        id: 'ulkucu',
        name: 'Ülkücü',
        description: 'Türk-İslam sentezini, devletin bekasını ve güçlü merkezi yönetimi önceleyen geleneksel milliyetçi akım.',
        parties: ['MHP', 'BBP'],
        leaders: ['Alparslan Türkeş', 'Devlet Bahçeli', 'Mustafa Destici'],
        color: '#004A99',
        critiques: [
            'Güvenlikçi yaklaşımın temel hak ve özgürlükleri ikinci plana ittiği eleştirisi yapılır.',
            'Etnik ve dini kimliği merkeze alan milliyetçiliğin farklı kimlikleri dışladığı ileri sürülür.',
        ],
        details: {
            history: 'CKMP ve MHP ile kurumsallaşan hareket, Cumhur İttifakı\'nın ortağıdır. Ekim 2024\'te Bahçeli\'nin çağrısıyla başlayan "Terörsüz Türkiye" sürecinin siyasi öncüsü oldu.',
            principles: ['Türk-İslam Ülküsü', 'Devletin Bekası', 'Dokuz Işık', 'Türk Dünyası Birliği'],
            motto: 'Tanrı Türk\'ü Korusun ve Yüceltsin!',
        },
        actionPlan: [
            '"Terörsüz Türkiye" sürecini silah bırakma doğrulanana kadar devlet denetiminde tamamlamak.',
            'Türk Devletleri Teşkilatı\'nı ortak pazar ve ortak savunma birliğine dönüştürmek.',
            'Cumhurbaşkanlığı sistemini koruyarak güçlü ve merkezi devlet yapısını anayasal olarak pekiştirmek.',
        ],
    },
    liberal: {
        id: 'liberal',
        name: 'Liberal',
        description: 'Bireysel özgürlükleri, serbest piyasayı, hukuk devletini ve sınırlı devleti savunan görüş.',
        parties: ['DEVA Partisi', 'LDP'],
        leaders: ['Ali Babacan', 'Besim Tibuk'],
        color: '#14B8A6',
        critiques: [
            'Serbest piyasa vurgusunun gelir eşitsizliğini ve sosyal güvencesizliği artırabileceği söylenir.',
            'Seçmen tabanının dar olduğu ve Türkiye\'nin toplumsal gerçekliğinden kopuk kaldığı eleştirisi yapılır.',
        ],
        details: {
            history: 'Osmanlı\'nın son döneminden bu yana bireysel özgürlük ve serbest teşebbüs etrafında toplanan gelenek. Bugün DEVA Partisi parlamenter sistem ve hukuk reformu vurgusuyla bu çizgiyi temsil ediyor.',
            principles: ['Birey Hakları', 'Serbest Piyasa', 'Hukuk Devleti', 'Bağımsız Kurumlar', 'Mülkiyet Hakkı'],
            motto: 'Özgürlük, Herkese ve Daima!',
        },
        actionPlan: [
            'Merkez Bankası, TÜİK, SPK ve BDDK\'yı yasal güvenceyle siyasetten bağımsız hale getirmek.',
            'AB üyelik müzakerelerini yeniden canlandırıp Gümrük Birliği\'ni güncellemek.',
            'Kamu iktisadi teşebbüslerini şeffaf ihalelerle özelleştirip devleti ekonomiden geri çekmek.',
        ],
    },
    sosyalist: {
        id: 'sosyalist',
        name: 'Sosyalist',
        description: 'Kamu mülkiyetini, emekten yana politikaları, laikliği ve anti-emperyalizmi savunan sol.',
        parties: ['TİP', 'TKP', 'SOL Parti', 'EMEP'],
        leaders: ['Erkan Baş', 'Deniz Gezmiş'],
        color: '#8B0000',
        critiques: [
            'Kamulaştırma ve merkezi planlama önerilerinin verimlilik ve yatırım ortamı açısından riskli olduğu ileri sürülür.',
            'Tarihsel sosyalist deneyimlerin ekonomik başarısızlıklar ve özgürlük kısıtlamalarıyla sonuçlandığı hatırlatılır.',
        ],
        details: {
            history: '1960\'larda Türkiye İşçi Partisi ile kitleselleşen, sınıf siyaseti ve kamulaştırma odaklı sol gelenek. TİP bugün Meclis\'te temsil ediliyor.',
            principles: ['Eşitlik', 'Kamulaştırma', 'Emeğin Hakları', 'Anti-Emperyalizm', 'Laiklik'],
            motto: 'Dünyanın Bütün İşçileri Birleşin!',
        },
        actionPlan: [
            'Enerji, maden ve büyük bankaları kamulaştırıp emekçi denetimine açmak.',
            'Garantili Kamu-Özel İşbirliği sözleşmelerini tazminatsız iptal etmek.',
            'Kira artışlarına kalıcı tavan koyup boş konutları kamusal kiralık konuta dönüştürmek.',
        ],
    },
    ozerklikci: {
        id: 'ozerklikci',
        name: 'Demokratik Özerklikçi',
        description: 'Kürt siyasi hareketinden beslenen; yerinden yönetim, anadilde eğitim ve kimliklerin anayasal tanınmasını savunan çizgi.',
        parties: ['DEM Parti'],
        leaders: ['Tuncer Bakırhan', 'Tülay Hatimoğulları', 'Selahattin Demirtaş'],
        color: '#9400D3',
        critiques: [
            'Silahlı yapılarla arasına yeterli mesafe koymadığı eleştirisi, özellikle milliyetçi kesimlerce sıkça dile getirilir.',
            'Yerinden yönetim önerilerinin üniter yapıyı zayıflatabileceği ve toplumsal ayrışmayı derinleştirebileceği ileri sürülür.',
        ],
        details: {
            history: '1990\'lardan bu yana farklı parti isimleriyle varlığını sürdüren, kimlik taleplerini sol ve ekolojist söylemle birleştiren gelenek. "Terörsüz Türkiye" sürecinin ve 2026\'daki çerçeve yasanın müzakere tarafı oldu.',
            principles: ['Yerinden Yönetim', 'Anadilde Eğitim', 'Eş Başkanlık', 'Kadın Özgürlüğü', 'Ekoloji'],
            motto: 'Özgür Yaşam, Demokratik Toplum.',
        },
        actionPlan: [
            'Avrupa Yerel Yönetimler Özerklik Şartı\'ndaki çekinceleri kaldırıp yerel meclislerin yetkisini artırmak.',
            'Anadilde eğitimi anayasal güvenceye alıp Kürtçeyi yerel kamu hizmetlerinde kullanılır kılmak.',
            'Çözüm sürecinin hukuki ayağını tamamlayıp siyasi tutukluların serbest bırakılmasını sağlamak.',
        ],
    },
    islamci: {
        id: 'islamci',
        name: 'İslamcı',
        description: 'Toplumsal ve siyasal hayatın İslami referanslarla düzenlenmesini savunan, faizsiz ekonomi ve ümmet dayanışmasını öne çıkaran çizgi.',
        parties: ['Yeniden Refah', 'HÜDA PAR', 'Saadet Partisi'],
        leaders: ['Necmettin Erbakan', 'Fatih Erbakan'],
        color: '#006400',
        critiques: [
            'Dini referanslı düzenlemelerin farklı inanç ve yaşam tarzlarının haklarını kısıtlayabileceği söylenir.',
            'Faizsiz ekonomi gibi önerilerin modern finans sistemiyle nasıl uygulanacağının belirsiz kaldığı eleştirisi yapılır.',
        ],
        details: {
            history: 'Milli Görüş hareketiyle şekillenen, dini prensipleri siyasetin merkezine koyan akım. Bugün Yeniden Refah ve HÜDA PAR farklı tonlarda bu çizgiyi temsil ediyor.',
            principles: ['İslami Referans', 'Adil Düzen', 'Faizsiz Ekonomi', 'Ümmet Dayanışması'],
            motto: 'Hakkın Hakimiyeti İçin Çalışmak İbadettir.',
        },
        actionPlan: [
            'Faizsiz finans sistemini kamu bankacılığının merkezine alıp ağır sanayi hamlesi başlatmak.',
            'D-8 ve Mekke Savunma Anlaşması üzerinden İslam ülkeleriyle ortak pazar ve savunma birliği kurmak.',
            'İstanbul Sözleşmesi çizgisini kalıcı olarak reddedip aile hukukunu dini-ahlaki değerlere göre düzenlemek.',
        ],
    },
    avrasyaci: {
        id: 'avrasyaci',
        name: 'Avrasyacı',
        description: 'Batı ittifakı yerine Rusya, Çin ve Asya ile stratejik işbirliğini savunan, devletçi ve anti-Atlantikçi çizgi.',
        parties: ['Vatan Partisi'],
        leaders: ['Doğu Perinçek'],
        color: '#FF4500',
        critiques: [
            'Batı\'dan kopuşun Rusya ve Çin\'e yeni bir bağımlılık yaratabileceği ileri sürülür.',
            'Otoriter yönetimlerle yakınlaşmanın demokratik standartları zayıflatacağı eleştirisi yapılır.',
        ],
        details: {
            history: 'Aydınlık geleneğinden doğan, 2000\'lerden itibaren Batı karşıtlığı temelinde Avrasya ittifakını öneren stratejik görüş.',
            principles: ['Anti-Atlantikçilik', 'Avrasya İşbirliği', 'Devletçilik', 'Laiklik'],
            motto: 'Yükselen Asya, Bağımsız Türkiye!',
        },
        actionPlan: [
            'NATO\'dan çıkıp ülkedeki yabancı askeri üslerin faaliyetine son vermek.',
            'BRICS ve Şanghay İşbirliği Örgütü\'ne tam üyelik başvurusu yapmak.',
            'Merkezi planlama ve kamu yatırımıyla stratejik üretimi devlet eliyle büyütmek.',
        ],
    },
    ulusalci: {
        id: 'ulusalci',
        name: 'Ulusalcı',
        description: 'Tam bağımsızlıkçı, laik, devletçi ve sığınmacı politikalarında sert milliyetçi muhalefet çizgisi.',
        parties: ['Zafer Partisi', 'Vatan Partisi'],
        leaders: ['Ümit Özdağ', 'Doğu Perinçek'],
        color: '#B22222',
        critiques: [
            'Sığınmacılara yönelik sert söylemin ayrımcılığı ve toplumsal gerilimi besleyebileceği söylenir.',
            'Komplo teorilerine dayalı dış politika okumalarının gerçekçi çözümler üretmediği eleştirisi yapılır.',
        ],
        details: {
            history: '2000\'lerin başında AB ve ABD karşıtlığıyla kitleselleşen laik milliyetçilik, son yıllarda sığınmacı karşıtlığı ve çözüm sürecine itirazla yeniden yükseldi.',
            principles: ['Tam Bağımsızlık', 'Laik Milliyetçilik', 'Milli Ekonomi', 'Sığınmacı Karşıtlığı'],
            motto: 'Ne Mutlu Türküm Diyene!',
        },
        actionPlan: [
            'Sığınmacıları uluslararası baskıya rağmen takvime bağlı bir planla ülkelerine göndermek.',
            'Yatırımcı vatandaşlığını kaldırıp verilen vatandaşlıkları yeniden incelemek.',
            '"Terörsüz Türkiye" sürecini durdurup terörle mücadeleyi yalnızca güvenlik politikasıyla yürütmek.',
        ],
    },
    merkez_sag: {
        id: 'merkez_sag',
        name: 'Merkez Sağ',
        description: 'Serbest piyasa, parlamenter demokrasi ve kurumsal milliyetçiliği birleştiren ılımlı sağ çizgi.',
        parties: ['İYİ Parti', 'Anahtar Parti', 'Demokrat Parti'],
        leaders: ['Adnan Menderes', 'Süleyman Demirel', 'Müsavat Dervişoğlu', 'Yavuz Ağıralioğlu'],
        color: '#4169E1',
        critiques: [
            'Net bir ideolojik kimlik ortaya koyamadığı ve sağ seçmenin büyük partiler arasında bölündüğü ileri sürülür.',
            'Geçmiş merkez sağ iktidarlarının darbe ve ekonomik kriz dönemlerindeki performansı eleştiri konusu yapılır.',
        ],
        details: {
            history: 'Demokrat Parti\'den Adalet Partisi\'ne, oradan İYİ Parti ve 2024\'te kurulan Anahtar Parti\'ye uzanan gelenek. Bugün parlamenter sistem ve çözüm sürecine itiraz ortak paydası.',
            principles: ['Hukukun Üstünlüğü', 'Kurumsal Milliyetçilik', 'Serbest Piyasa', 'Parlamenter Sistem'],
            motto: 'Bizim Yolumuz, Milletin Yoludur.',
        },
        actionPlan: [
            'Güçlendirilmiş parlamenter sisteme dönüp bağımsız düzenleyici kurumları yeniden kurmak.',
            'Hukuk güvenliğini sağlayarak doğrudan yabancı yatırımı ve KOBİ\'leri büyütmek.',
            'Sığınmacı geri dönüşünü düzenli bir takvime bağlayıp sınır güvenliğini güçlendirmek.',
        ],
    },
    yesil: {
        id: 'yesil',
        name: 'Yeşil / Ekolojist',
        description: 'İklim adaletini, doğa haklarını ve sürdürülebilir ekonomiyi siyasetin merkezine koyan görüş.',
        parties: ['Yeşiller Partisi', 'DEM Parti (Ekoloji Meclisi)'],
        leaders: ['Greta Thunberg (Küresel)'],
        color: '#228B22',
        critiques: [
            'İklim hedeflerinin kısa vadede istihdam ve büyüme kaybına yol açabileceği söylenir.',
            'Türkiye\'de seçmen tabanının dar olması nedeniyle politikaları hayata geçirme kapasitesinin sınırlı olduğu ileri sürülür.',
        ],
        details: {
            history: 'Küresel yeşil hareketin Türkiye\'deki uzantısıdır. Zeytinlik, maden ve kömür santrali direnişleriyle görünürlük kazandı; COP31\'in Antalya\'da yapılmasıyla gündemi büyüdü.',
            principles: ['İklim Adaleti', 'Doğa Hakları', 'Sürdürülebilirlik', 'Yerel Demokrasi'],
            motto: 'Doğa ile Uyum İçinde Bir Gelecek.',
        },
        actionPlan: [
            'Yeni kömür santrallerini yasaklayıp 2053 net sıfır hedefini 2040\'a çekmek.',
            'Zeytinlik, mera ve ormanları madencilik ve imar baskısına karşı anayasal korumaya almak.',
            'Şehirlerde toplu taşımayı elektrikli ve ücretsiz hale getirip yaya odaklı planlamaya geçmek.',
        ],
    },
    turkculuk: {
        id: 'turkculuk',
        name: 'Türkçülük',
        description: 'Etnik vurgulu milliyetçilik, sığınmacı karşıtlığı, Türk dünyası birliği ve laik Türk kimliğini savunan çizgi.',
        parties: ['Zafer Partisi', 'İYİ Parti'],
        leaders: ['Ziya Gökalp', 'Nihal Atsız', 'Ümit Özdağ'],
        color: '#00BFFF',
        critiques: [
            'Etnik temelli vatandaşlık anlayışının Türkiye\'nin çok kimlikli yapısıyla çeliştiği eleştirisi yapılır.',
            'Sığınmacı karşıtı söylemin zaman zaman yabancı düşmanlığına dönüştüğü ileri sürülür.',
        ],
        details: {
            history: 'Ziya Gökalp ve Nihal Atsız\'ın fikirlerinden beslenen; son yıllarda sığınmacı tartışmaları ve çözüm sürecine itirazla yeniden yükselen laik, etnik vurgulu milliyetçilik.',
            principles: ['Türklük Bilinci', 'Demografik Koruma', 'Türk Dünyası Birliği', 'Laik Devlet'],
            motto: 'Vatan Ne Türkiye\'dir Türklere, Ne Türkistan; Vatan Büyük ve Müebbet Bir Ülkedir: Turan.',
        },
        actionPlan: [
            'Demografik koruma yasası çıkarıp yatırımcı vatandaşlığını kaldırmak.',
            'Türk Devletleri Teşkilatı ile ortak ordu, ortak alfabe ve ortak pazar hedeflemek.',
            'Anayasadaki "Türk" vatandaşlık tanımını tartışmaya kapalı hale getirmek.',
        ],
    },
};
