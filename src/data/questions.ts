import { IdeologyId } from './ideologies';

export type AxisId = 'ekonomi' | 'toplum' | 'milliyetcilik' | 'yonetim';

export interface Question {
    id: number;
    text: string;
    weights: Partial<Record<IdeologyId, number>>;
    axisWeights: Record<AxisId, number>;
}

export const questions: Question[] = [
    {
        id: 1,
        text: 'Stratejik sanayi kuruluşları ve enerji sektörü tamamen devlet kontrolünde olmalıdır.',
        weights: {
            kemalist: 5,
            sosyalist: 10,
            ulusalci: 8,
            liberal: -10,
            merkez_sag: -5,
            avrasyaci: 6,
        },
        axisWeights: {
            ekonomi: -10,
            toplum: 0,
            milliyetcilik: 2,
            yonetim: 5,
        }
    },
    {
        id: 2,
        text: 'Türkiye, AB üyeliği ve Batı ittifakı ile bağlarını her ne pahasına olursa olsun güçlendirmelidir.',
        weights: {
            sosyal_demokrat: 8,
            liberal: 10,
            merkez_sag: 6,
            avrasyaci: -10,
            ulusalci: -8,
            ulkucu: -5,
            kemalist: 2,
        },
        axisWeights: {
            ekonomi: 5,
            toplum: -5,
            milliyetcilik: -10,
            yonetim: -2,
        }
    },
    {
        id: 3,
        text: 'Sığınmacılar ve mülteciler, güvenlik riski oluşturdukları gerekçesiyle en kısa sürede ülkelerine gönderilmelidir.',
        weights: {
            turkculuk: 10,
            ulkucu: 7,
            ulusalci: 10,
            kemalist: 5,
            sosyal_demokrat: 3,
            islamci: -8,
            muhafazakar: -5,
            liberal: -3,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: 5,
            milliyetcilik: 10,
            yonetim: 6,
        }
    },
    {
        id: 4,
        text: 'Diyanet İşleri Başkanlığı kaldırılmalı ve din işleri tamamen sivil topluma bırakılmalıdır.',
        weights: {
            sosyalist: 10,
            boluculuk: 8,
            yesil: 7,
            liberal: 6,
            sosyal_demokrat: 4,
            muhafazakar: -10,
            islamci: -10,
            kemalist: -2,
        },
        axisWeights: {
            ekonomi: 4,
            toplum: -10,
            milliyetcilik: -2,
            yonetim: -5,
        }
    },
    {
        id: 5,
        text: 'Anayasa\'nın ilk dört maddesi ve üniter devlet yapısı asla tartışılamaz.',
        weights: {
            kemalist: 10,
            turkculuk: 10,
            ulkucu: 10,
            ulusalci: 10,
            merkez_sag: 6,
            boluculuk: -10,
            liberal: -5,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: 5,
            milliyetcilik: 10,
            yonetim: 8,
        }
    },
    {
        id: 6,
        text: 'Türkiye, NATO üyeliğinden çıkmalı ve ŞİÖ (Şanghay İşbirliği Örgütü) gibi Avrasya merkezli ittifaklara yönelmelidir.',
        weights: {
            avrasyaci: 10,
            ulusalci: 6,
            sosyalist: 5,
            sosyal_demokrat: -8,
            liberal: -10,
            kemalist: -3,
        },
        axisWeights: {
            ekonomi: -5,
            toplum: 2,
            milliyetcilik: 8,
            yonetim: 6,
        }
    },
    {
        id: 7,
        text: 'Eğitim müfredatı seküler ve bilimsel temelde olmalı, dini referanslar eğitimden tamamen temizlenmelidir.',
        weights: {
            kemalist: 10,
            ulusalci: 10,
            sosyalist: 8,
            sosyal_demokrat: 5,
            muhafazakar: -10,
            islamci: -10,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -10,
            milliyetcilik: 2,
            yonetim: 4,
        }
    },
    {
        id: 8,
        text: 'Serbest piyasa ekonomisi, Türkiye\'nin zenginleşmesi için tek yoldur; devlet ekonomiden elini çekmelidir.',
        weights: {
            liberal: 10,
            merkez_sag: 8,
            muhafazakar: 5,
            sosyalist: -10,
            ulusalci: -6,
        },
        axisWeights: {
            ekonomi: 10,
            toplum: 0,
            milliyetcilik: -2,
            yonetim: -8,
        }
    },
    {
        id: 9,
        text: 'Kürt sorununun çözümü için yerel yönetimlere özerklik dahil her türlü siyasi hak tanınmalıdır.',
        weights: {
            boluculuk: 10,
            yesil: 5,
            liberal: 3,
            turkculuk: -10,
            ulkucu: -10,
            ulusalci: -10,
            kemalist: -8,
            merkez_sag: -5,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -3,
            milliyetcilik: -10,
            yonetim: -6,
        }
    },
    {
        id: 10,
        text: 'Çevreyi korumak için ekonomik büyümeden ve büyük sanayi projelerinden (Kanal İstanbul, Nükleer Santral vb.) vazgeçilebilir.',
        weights: {
            yesil: 10,
            sosyalist: 6,
            sosyal_demokrat: 4,
            boluculuk: 3,
            merkez_sag: -5,
            muhafazakar: -5,
        },
        axisWeights: {
            ekonomi: -8,
            toplum: -4,
            milliyetcilik: -2,
            yonetim: -5,
        }
    },
    {
        id: 11,
        text: 'İşçi hakları, sendikalaşma ve asgari ücretin iyileştirilmesi öncelikli devlet politikası olmalıdır.',
        weights: {
            sosyalist: 10,
            sosyal_demokrat: 8,
            yesil: 5,
            kemalist: 4,
            liberal: -6,
        },
        axisWeights: {
            ekonomi: -10,
            toplum: -2,
            milliyetcilik: 0,
            yonetim: -2,
        }
    },
    {
        id: 12,
        text: 'Toplumsal hayatın her alanında dini değerler ve ahlaki normlar esas alınmalıdır.',
        weights: {
            islamci: 10,
            muhafazakar: 7,
            kemalist: -10,
            sosyalist: -8,
            yesil: -5,
        },
        axisWeights: {
            ekonomi: 2,
            toplum: 10,
            milliyetcilik: 5,
            yonetim: 8,
        }
    },
    {
        id: 13,
        text: 'Kadın hakları ve toplumsal cinsiyet eşitliği, geleneksel aile yapısının önünde tutulmalıdır.',
        weights: {
            yesil: 8,
            sosyalist: 8,
            sosyal_demokrat: 8,
            kemalist: 6,
            boluculuk: 6,
            turkculuk: 4,
            muhafazakar: -10,
            islamci: -10,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -10,
            milliyetcilik: -2,
            yonetim: -5,
        }
    },
    {
        id: 14,
        text: 'Yabancı sermayenin Türkiye\'ye girişi kolaylaştırılmalı, global şirketler teşvik edilmelidir.',
        weights: {
            liberal: 10,
            merkez_sag: 7,
            muhafazakar: 4,
            ulusalci: -8,
            sosyalist: -8,
            avrasyaci: -6,
        },
        axisWeights: {
            ekonomi: 10,
            toplum: -2,
            milliyetcilik: -10,
            yonetim: -5,
        }
    },
    {
        id: 16,
        text: 'Basın özgürlüğü ve ifade hürriyeti, devlet güvenliği gerekçesiyle dahi olsa kısıtlanamaz.',
        weights: {
            liberal: 10,
            sosyalist: 8,
            sosyal_demokrat: 8,
            yesil: 7,
            muhafazakar: -8,
            islamci: -8,
            ulkucu: -6,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -8,
            milliyetcilik: -5,
            yonetim: -10,
        }
    },
    {
        id: 17,
        text: 'Zorunlu askerlik kaldırılmalı, tamamen profesyonel orduya geçilmelidir.',
        weights: {
            liberal: 10,
            yesil: 8,
            boluculuk: 7,
            sosyal_demokrat: 4,
            turkculuk: -10,
            ulkucu: -10,
            ulusalci: -10,
            kemalist: -6,
        },
        axisWeights: {
            ekonomi: 4,
            toplum: -5,
            milliyetcilik: -10,
            yonetim: -8,
        }
    },
    {
        id: 18,
        text: 'Eğitimde din dersleri tamamen seçmeli olmalı, devlet eliyle dini eğitim verilmemelidir.',
        weights: {
            kemalist: 10,
            sosyalist: 10,
            liberal: 8,
            sosyal_demokrat: 7,
            muhafazakar: -10,
            islamci: -10,
            ulkucu: -5,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -10,
            milliyetcilik: 0,
            yonetim: -4,
        }
    },
    {
        id: 19,
        text: 'Üniversitelerin idari ve akademik özerkliği dokunulmaz olmalıdır; Rektörler atanmamalı, seçilmelidir.',
        weights: {
            liberal: 8,
            sosyalist: 8,
            sosyal_demokrat: 8,
            yesil: 6,
            kemalist: 5,
            muhafazakar: -8,
            islamci: -8,
            ulkucu: -6,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -5,
            milliyetcilik: -2,
            yonetim: -10,
        }
    },
    {
        id: 20,
        text: 'Merkez Bankası tamamen bağımsız olmalı, siyasetçiler para politikasına asla müdahale etmemelidir.',
        weights: {
            liberal: 10,
            merkez_sag: 8,
            sosyal_demokrat: 5,
            muhafazakar: -8,
            islamci: -6,
            sosyalist: -5,
        },
        axisWeights: {
            ekonomi: 10,
            toplum: -2,
            milliyetcilik: -4,
            yonetim: -8,
        }
    },
    {
        id: 21,
        text: 'İstanbul Sözleşmesi\'ne geri dönülmeli ve LGBT+ hakları yasal güvence altına alınmalıdır.',
        weights: {
            yesil: 10,
            sosyalist: 9,
            sosyal_demokrat: 9,
            boluculuk: 7,
            kemalist: 4,
            muhafazakar: -10,
            islamci: -10,
            ulkucu: -8,
            turkculuk: -4,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -10,
            milliyetcilik: -4,
            yonetim: -6,
        }
    },
    {
        id: 22,
        text: 'Tarikat ve cemaatlerin devlet kadrolarındaki etkinliği Türkiye için bir ulusal güvenlik tehdididir.',
        weights: {
            kemalist: 10,
            ulusalci: 10,
            turkculuk: 8,
            sosyalist: 8,
            avrasyaci: 6,
            muhafazakar: -10,
            islamci: -10,
            merkez_sag: -4,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -10,
            milliyetcilik: 6,
            yonetim: 5,
        }
    },
    {
        id: 23,
        text: 'Seçilmiş yerel yöneticilerin (Belediye Baskanı vb.) yerine kayyum atanması hukuk dışıdır ve kabul edilemez.',
        weights: {
            boluculuk: 10,
            sosyalist: 8,
            sosyal_demokrat: 8,
            liberal: 7,
            yesil: 6,
            kemalist: 2,
            ulkucu: -10,
            ulusalci: -10,
            avrasyaci: -8,
            turkculuk: -6,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -4,
            milliyetcilik: -8,
            yonetim: -10,
        }
    },
    {
        id: 24,
        text: 'Devlet sanatı ve sanatçıyı doğrudan finanse etmemeli, kültür piyasası kendi dinamiklerine bırakılmalıdır.',
        weights: {
            liberal: 10,
            merkez_sag: 3,
            sosyalist: -10,
            kemalist: -8,
            ulusalci: -6,
        },
        axisWeights: {
            ekonomi: 8,
            toplum: -2,
            milliyetcilik: -4,
            yonetim: -6,
        }
    },
    {
        id: 25,
        text: 'Türkiye\'nin bekası için gerekirse bazı temel hak ve özgürlükler askıya alınabilir.',
        weights: {
            avrasyaci: 10,
            ulkucu: 9,
            ulusalci: 8,
            turkculuk: 6,
            muhafazakar: 5,
            kemalist: 2,
            liberal: -10,
            sosyalist: -8,
            yesil: -8,
            sosyal_demokrat: -8,
        },
        axisWeights: {
            ekonomi: -2,
            toplum: 5,
            milliyetcilik: 8,
            yonetim: 10,
        }
    },
    {
        id: 26,
        text: 'Miras vergisi ve servet vergisi gibi uygulamalarla sosyal adaletsizlik azaltılmalıdır.',
        weights: {
            sosyalist: 10,
            sosyal_demokrat: 7,
            yesil: 5,
            liberal: -10,
            merkez_sag: -6,
            muhafazakar: -4,
        },
        axisWeights: {
            ekonomi: -10,
            toplum: -2,
            milliyetcilik: 0,
            yonetim: 4,
        }
    },
    {
        id: 27,
        text: 'Düşük gelirli vatandaşlara sosyal yardım yapmak, uzay araştırmaları veya büyük savunma sanayii yatırımlarından daha önceliklidir.',
        weights: {
            sosyalist: 10,
            sosyal_demokrat: 8,
            yesil: 6,
            boluculuk: 4,
            ulusalci: -8,
            avrasyaci: -8,
            turkculuk: -6,
            kemalist: -4,
        },
        axisWeights: {
            ekonomi: -8,
            toplum: -4,
            milliyetcilik: -8,
            yonetim: -4,
        }
    },
    {
        id: 28,
        text: 'Kamu kurumlarına personel alımında liyakat tek kriter olmalı, mülakat sistemi tamamen kaldırılmalıdır.',
        weights: {
            kemalist: 8,
            liberal: 8,
            sosyal_demokrat: 8,
            ulkucu: 4,
            turkculuk: 4,
            merkez_sag: 4,
            muhafazakar: -10,
            islamci: -8,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -5,
            milliyetcilik: 2,
            yonetim: -10,
        }
    },
    {
        id: 29,
        text: 'Hayvanlar üzerinde deney yapılması tamamen yasaklanmalı ve vegan yaşam biçimi teşvik edilmelidir.',
        weights: {
            yesil: 10,
            sosyalist: 4,
            liberal: -2,
            muhafazakar: -6,
            islamci: -6,
        },
        axisWeights: {
            ekonomi: -4,
            toplum: -6,
            milliyetcilik: -2,
            yonetim: -2,
        }
    },
    {
        id: 30,
        text: 'Türkçe dışındaki diller (Kürtçe, Arapça vb.) kamu hizmetlerinde ve eğitimde resmi olarak kullanılabilmelidir.',
        weights: {
            boluculuk: 10,
            liberal: 5,
            yesil: 4,
            turkculuk: -10,
            ulusalci: -10,
            ulkucu: -10,
            kemalist: -8,
            avrasyaci: -6,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -4,
            milliyetcilik: -10,
            yonetim: -6,
        }
    },
    {
        id: 31,
        text: 'Sahipsiz sokak köpekleri, toplum güvenliği için gerekirse uyutulmalı veya kapalı barınaklara hapsedilmelidir.',
        weights: {
            muhafazakar: 10,
            ulkucu: 8,
            turkculuk: 6,
            merkez_sag: 5,
            yesil: -10,
            sosyalist: -8,
            sosyal_demokrat: -6,
        },
        axisWeights: {
            ekonomi: 2,
            toplum: 8,
            milliyetcilik: 4,
            yonetim: 6,
        }
    },
    {
        id: 32,
        text: 'Siyasetteki "normalleşme" veya "yumuşama" adımları Türkiye demokrasisi için olumludur; sert kutuplaşmadan vazgeçilmelidir.',
        weights: {
            sosyal_demokrat: 10,
            muhafazakar: 8,
            merkez_sag: 8,
            liberal: 6,
            ulusalci: -10,
            turkculuk: -8,
            avrasyaci: -6,
            sosyalist: -4,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -4,
            milliyetcilik: -6,
            yonetim: -8,
        }
    },
    {
        id: 33,
        text: 'Mevcut Cumhurbaşkanlığı Hükümet Sistemi revize edilmeli, güçlendirilmiş parlamenter sisteme geri dönülmelidir.',
        weights: {
            sosyal_demokrat: 10,
            merkez_sag: 9,
            liberal: 8,
            boluculuk: 7,
            yesil: 6,
            muhafazakar: -10,
            ulkucu: -10,
            avrasyaci: -8,
        },
        axisWeights: {
            ekonomi: -2,
            toplum: -5,
            milliyetcilik: -5,
            yonetim: -10,
        }
    },
    {
        id: 34,
        text: 'En düşük emekli maaşı, asgari ücretten düşük olmamalıdır; bütçe önceliği emeklilere ve dar gelirliye verilmelidir.',
        weights: {
            sosyal_demokrat: 10,
            sosyalist: 10,
            muhafazakar: 4,
            liberal: -8,
            merkez_sag: 2,
        },
        axisWeights: {
            ekonomi: -10,
            toplum: -2,
            milliyetcilik: 0,
            yonetim: 2,
        }
    },
    {
        id: 35,
        text: 'Eğitimde "Türkiye Yüzyılı Maarif Modeli" gibi yeni müfredat düzenlemeleri milli ve manevi değerleri korumak için gereklidir.',
        weights: {
            muhafazakar: 10,
            islamci: 10,
            ulkucu: 6,
            kemalist: -10,
            ulusalci: -10,
            sosyalist: -8,
            sosyal_demokrat: -8,
            liberal: -5,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: 10,
            milliyetcilik: 6,
            yonetim: 8,
        }
    },
    {
        id: 36,
        text: 'Terörün bitmesi için gerekirse Abdullah Öcalan TBMM\'de konuşmalı ve örgütün lağvedildiğini ilan etmelidir.',
        weights: {
            ulkucu: 10,
            muhafazakar: 9,
            boluculuk: 8,
            merkez_sag: -10,
            turkculuk: -10,
            ulusalci: -10,
            kemalist: -8,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -2,
            milliyetcilik: -10,
            yonetim: 5,
        }
    },
    {
        id: 37,
        text: 'Belirli bir süre hapis yatan mahkumlar için "Umut Hakkı" yasallaşmalı; örgüt silah bıraktığı takdirde lider kadrosuna bu hak tanınmalıdır.',
        weights: {
            boluculuk: 10,
            liberal: 8,
            muhafazakar: 6,
            ulkucu: 6,
            turkculuk: -10,
            ulusalci: -10,
            kemalist: -8,
            sosyalist: 5,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -5,
            milliyetcilik: -10,
            yonetim: -8,
        }
    },
    {
        id: 38,
        text: 'Türkiye\'nin bekası için iktidar ve ana muhalefetin terörle mücadele ve Kürt meselesinde ortak bir strateji izlemesi zorunludur.',
        weights: {
            sosyal_demokrat: 10,
            muhafazakar: 8,
            merkez_sag: 8,
            ulkucu: 6,
            ulusalci: -8,
            turkculuk: -6,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: 0,
            milliyetcilik: 2,
            yonetim: 5,
        }
    },
    {
        id: 39,
        text: 'Kürt sorunu sadece asayiş politikalarıyla değil, meclis çatısı altında tam bir siyasi temsil ve uzlaşma ile çözülmelidir.',
        weights: {
            sosyal_demokrat: 10,
            boluculuk: 10,
            liberal: 8,
            yesil: 8,
            muhafazakar: 5,
            ulkucu: 4,
            turkculuk: -10,
            ulusalci: -10,
        },
        axisWeights: {
            ekonomi: 0,
            toplum: -6,
            milliyetcilik: -10,
            yonetim: -8,
        }
    },
    {
        id: 40,
        text: 'Türkiye, Suriye\'deki güvenliği için gerekirse oradaki Kürt gruplarla (SDG/PYD) doğrudan siyasi masaya oturup anlaşmalıdır.',
        weights: {
            boluculuk: 10,
            liberal: 8,
            sosyal_demokrat: 5,
            muhafazakar: 2,
            turkculuk: -10,
            ulkucu: -10,
            ulusalci: -10,
            avrasyaci: -6,
        },
        axisWeights: {
            ekonomi: 2,
            toplum: -2,
            milliyetcilik: -10,
            yonetim: -5,
        }
    },
];




