import { IdeologyId } from './ideologies';
import { Stance } from './questions';

export interface PoliticalLeader {
    name: string;
    title: string;
    color: string;
    /**
     * The leader's political profile as a blend of ideologies (weights sum to 1).
     * Their expected answer to each question is the weighted mix of those stances.
     */
    blend: Partial<Record<IdeologyId, number>>;
    /** Question-specific positions where the leader departs from the blend. */
    overrides?: Record<number, Stance>;
}

// Titles as of November 2026. Positions are approximate, based on public statements.
export const leaders: PoliticalLeader[] = [
    {
        name: 'Recep Tayyip Erdoğan',
        title: 'Cumhurbaşkanı / AK Parti Genel Başkanı',
        color: '#FFCC00',
        blend: { muhafazakar: 0.8, islamci: 0.1, ulkucu: 0.1 },
        overrides: { 1: 1, 23: 2, 33: 2, 39: 2, 34: 2 },
    },
    {
        name: 'Özgür Özel',
        title: 'YENİ Parti Genel Başkanı',
        color: '#E30A17',
        blend: { sosyal_demokrat: 0.8, kemalist: 0.2 },
        overrides: { 34: 1 },
    },
    {
        name: 'Kemal Kılıçdaroğlu',
        title: 'CHP Genel Başkanı (mahkeme kararıyla)',
        color: '#EE1C25',
        blend: { sosyal_demokrat: 0.6, kemalist: 0.4 },
    },
    {
        name: 'Ekrem İmamoğlu',
        title: 'Tutuklu İBB Başkanı',
        color: '#EE1C25',
        blend: { sosyal_demokrat: 0.7, merkez_sag: 0.15, liberal: 0.15 },
    },
    {
        name: 'Mansur Yavaş',
        title: 'Ankara Büyükşehir Belediye Başkanı',
        color: '#3B82F6',
        blend: { merkez_sag: 0.5, kemalist: 0.3, ulkucu: 0.2 },
        overrides: { 34: -1, 25: -2 },
    },
    {
        name: 'Devlet Bahçeli',
        title: 'MHP Genel Başkanı',
        color: '#004A99',
        blend: { ulkucu: 0.9, muhafazakar: 0.1 },
        overrides: { 34: 2, 35: 1 },
    },
    {
        name: 'Müsavat Dervişoğlu',
        title: 'İYİ Parti Genel Başkanı',
        color: '#3BA3D2',
        blend: { merkez_sag: 0.7, turkculuk: 0.15, kemalist: 0.15 },
    },
    {
        name: 'Ümit Özdağ',
        title: 'Zafer Partisi Genel Başkanı',
        color: '#B22222',
        blend: { ulusalci: 0.5, turkculuk: 0.5 },
    },
    {
        name: 'Tuncer Bakırhan',
        title: 'DEM Parti Eş Genel Başkanı',
        color: '#9400D3',
        blend: { ozerklikci: 0.85, sosyalist: 0.15 },
    },
    {
        name: 'Ali Babacan',
        title: 'DEVA Partisi Genel Başkanı',
        color: '#00ADEF',
        blend: { liberal: 0.75, merkez_sag: 0.25 },
    },
    {
        name: 'Fatih Erbakan',
        title: 'Yeniden Refah Partisi Genel Başkanı',
        color: '#CC0000',
        blend: { islamci: 0.85, muhafazakar: 0.15 },
    },
    {
        name: 'Yavuz Ağıralioğlu',
        title: 'Anahtar Parti Genel Başkanı',
        color: '#1E3A8A',
        blend: { merkez_sag: 0.5, muhafazakar: 0.25, ulkucu: 0.25 },
        overrides: { 31: 2, 34: -2 },
    },
    {
        name: 'Erkan Baş',
        title: 'TİP Genel Başkanı',
        color: '#8B0000',
        blend: { sosyalist: 1 },
    },
    {
        name: 'Doğu Perinçek',
        title: 'Vatan Partisi Genel Başkanı',
        color: '#FF4500',
        blend: { avrasyaci: 0.8, ulusalci: 0.2 },
    },
];
