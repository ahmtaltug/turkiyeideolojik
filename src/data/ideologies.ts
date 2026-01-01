export type IdeologyId =
    | 'kemalist'
    | 'sosyal_demokrat'
    | 'muhafazakar'
    | 'milliyetci'
    | 'liberal'
    | 'sosyalist'
    | 'kurt_siyasi'
    | 'islamci'
    | 'avrasyaci'
    | 'ulusalci'
    | 'merkez_sag'
    | 'yesil';

export interface Ideology {
    id: IdeologyId;
    name: string;
    description: string;
    parties: string[];
    color: string;
}

export const ideologies: Record<IdeologyId, Ideology> = {
    kemalist: {
        id: 'kemalist',
        name: 'Kemalist',
        description: 'Atatürk ilkelerine bağlı, laiklik ve cumhuriyet değerlerini savunan modernleşmeci çizgi.',
        parties: ['CHP', 'Memleket Partisi'],
        color: '#D40000',
    },
    sosyal_demokrat: {
        id: 'sosyal_demokrat',
        name: 'Sosyal Demokrat',
        description: 'Sosyal adalet, emek hakları ve demokratik hukuk devletini önceleyen merkez sol görüş.',
        parties: ['CHP', 'DSP'],
        color: '#0056b3',
    },
    muhafazakar: {
        id: 'muhafazakar',
        name: 'Muhafazakar',
        description: 'Geleneksel değerleri, aile yapısını ve dini hassasiyetleri korumayı hedefleyen sağ siyaset.',
        parties: ['AK Parti', 'Saadet Partisi', 'Gelecek Partisi'],
        color: '#008000',
    },
    milliyetci: {
        id: 'milliyetci',
        name: 'Milliyetçi (Ülkücü)',
        description: 'Türk milliyetçiliğini ve devletin bekasını merkeze koyan ideolojik akım.',
        parties: ['MHP', 'İYİ Parti', 'Zafer Partisi'],
        color: '#004A99',
    },
    liberal: {
        id: 'liberal',
        name: 'Liberal',
        description: 'Bireysel özgürlükleri, serbest piyasa ekonomisini ve sınırlı devleti savunan görüş.',
        parties: ['LDP', 'DEVA'],
        color: '#FFD700',
    },
    sosyalist: {
        id: 'sosyalist',
        name: 'Sosyalist',
        description: 'Üretim araçlarının kamulaştırılmasını, sınıfsız toplumu ve emekten yana politikaları savunan sol.',
        parties: ['TİP', 'TKP', 'Sol Parti'],
        color: '#8B0000',
    },
    kurt_siyasi: {
        id: 'kurt_siyasi',
        name: 'Kürt Siyasi Hareketi',
        description: 'Kürt kimliğinin tanınması, yerel özerklik ve azınlık hakları odaklı demokratik siyaset.',
        parties: ['DEM Parti'],
        color: '#9400D3',
    },
    islamci: {
        id: 'islamci',
        name: 'İslamcı',
        description: 'Toplumsal ve siyasal hayatın İslami referanslarla düzenlenmesini savunan düşünce sistemi.',
        parties: ['Yeniden Refah', 'HÜDA PAR'],
        color: '#006400',
    },
    avrasyaci: {
        id: 'avrasyaci',
        name: 'Avrasyacı',
        description: 'Batı ittifakı yerine Rusya ve Çin ile stratejik işbirliğini savunan anti-emperyalist çizgi.',
        parties: ['Vatan Partisi'],
        color: '#FF4500',
    },
    ulusalci: {
        id: 'ulusalci',
        name: 'Ulusalcı',
        description: 'Tam bağımsızlıkçı, devletçi ve seküler milliyetçiliği savunan laik-ulusal kesim.',
        parties: ['Vatan Partisi', 'Zafer Partisi'],
        color: '#B22222',
    },
    merkez_sag: {
        id: 'merkez_sag',
        name: 'Merkez Sağ',
        description: 'Demokratik değerler ile serbest piyasayı birleştiren, kalkınmacı ve ılımlı muhafazakar çizgi.',
        parties: ['İYİ Parti', 'Demokrat Parti'],
        color: '#4169E1',
    },
    yesil: {
        id: 'yesil',
        name: 'Yeşil / Ekolojist',
        description: 'Çevre korumacı, sürdürülebilir yaşamı ve ekolojik adaleti savunan siyaset.',
        parties: ['Yeşiller Partisi', 'DEM Parti (Ekoloji Komisyonu)'],
        color: '#228B22',
    },
};
