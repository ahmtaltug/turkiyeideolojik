import { IdeologyId } from './ideologies';

export interface Question {
    id: number;
    text: string;
    weights: Partial<Record<IdeologyId, number>>;
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
            milliyetci: -5,
            kemalist: 2,
        },
    },
    {
        id: 3,
        text: 'Sığınmacılar ve mülteciler, güvenlik riski oluşturdukları gerekçesiyle en kısa sürede ülkelerine gönderilmelidir.',
        weights: {
            milliyetci: 10,
            ulusalci: 10,
            kemalist: 5,
            sosyal_demokrat: 3,
            islamci: -8,
            muhafazakar: -5,
            liberal: -3,
        },
    },
    {
        id: 4,
        text: 'Diyanet İşleri Başkanlığı kaldırılmalı ve din işleri tamamen sivil topluma bırakılmalıdır.',
        weights: {
            sosyalist: 10,
            kurt_siyasi: 8,
            yesil: 7,
            liberal: 6,
            sosyal_demokrat: 4,
            muhafazakar: -10,
            islamci: -10,
            kemalist: -2,
        },
    },
    {
        id: 5,
        text: 'Anayasa\'nın ilk dört maddesi ve üniter devlet yapısı asla tartışılamaz.',
        weights: {
            kemalist: 10,
            milliyetci: 10,
            ulusalci: 10,
            merkez_sag: 6,
            kurt_siyasi: -10,
            liberal: -5,
        },
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
    },
    {
        id: 9,
        text: 'Kürt sorununun çözümü için yerel yönetimlere özerklik dahil her türlü siyasi hak tanınmalıdır.',
        weights: {
            kurt_siyasi: 10,
            yesil: 5,
            liberal: 3,
            milliyetci: -10,
            ulusalci: -10,
            kemalist: -8,
            merkez_sag: -5,
        },
    },
    {
        id: 10,
        text: 'Çevreyi korumak için ekonomik büyümeden ve büyük sanayi projelerinden (Kanal İstanbul, Nükleer Santral vb.) vazgeçilebilir.',
        weights: {
            yesil: 10,
            sosyalist: 6,
            sosyal_demokrat: 4,
            kurt_siyasi: 3,
            merkez_sag: -5,
            muhafazakar: -5,
        },
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
    },
    {
        id: 13,
        text: 'Kadın hakları ve toplumsal cinsiyet eşitliği, geleneksel aile yapısının önünde tutulmalıdır.',
        weights: {
            yesil: 8,
            sosyalist: 8,
            sosyal_demokrat: 8,
            kemalist: 6,
            kurt_siyasi: 6,
            muhafazakar: -10,
            islamci: -10,
        },
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
    },
    {
        id: 15,
        text: 'Yargı bağımsızlığı ve hukukun üstünlüğü, her türlü siyasi otoritenin ve güvenlik kaygısının üstündedir.',
        weights: {
            liberal: 8,
            sosyal_demokrat: 8,
            merkez_sag: 6,
            kemalist: 5,
            kurt_siyasi: 4,
            yesil: 4,
            milliyetci: -5,
            muhafazakar: -3,
        },
    },
];
