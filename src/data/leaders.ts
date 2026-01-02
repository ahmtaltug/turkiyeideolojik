import { AxisId } from './questions';

export interface PoliticalLeader {
    name: string;
    title: string;
    image?: string;
    coordinates: Record<AxisId, number>;
    color: string;
}

export const leaders: PoliticalLeader[] = [
    {
        name: 'Recep Tayyip Erdoğan',
        title: 'Cumhurbaşkanı / AK Parti Gn. Bşk.',
        coordinates: { ekonomi: 50, toplum: 90, milliyetcilik: 70, yonetim: 95 },
        color: '#FFCC00'
    },
    {
        name: 'Ekrem İmamoğlu',
        title: 'İBB Başkanı / CHP',
        coordinates: { ekonomi: -40, toplum: -70, milliyetcilik: 20, yonetim: -70 },
        color: '#EE1C25'
    },
    {
        name: 'Özgür Özel',
        title: 'CHP Genel Başkanı',
        coordinates: { ekonomi: -60, toplum: -75, milliyetcilik: 15, yonetim: -60 },
        color: '#EE1C25'
    },
    {
        name: 'Mansur Yavaş',
        title: 'ABB Başkanı / CHP',
        coordinates: { ekonomi: -20, toplum: -20, milliyetcilik: 80, yonetim: -50 },
        color: '#EE1C25'
    },
    {
        name: 'Devlet Bahçeli',
        title: 'MHP Genel Başkanı',
        coordinates: { ekonomi: -20, toplum: 70, milliyetcilik: 100, yonetim: 90 },
        color: '#004A99'
    },
    {
        name: 'Ümit Özdağ',
        title: 'Zafer Partisi Genel Başkanı',
        coordinates: { ekonomi: -20, toplum: -30, milliyetcilik: 100, yonetim: 80 },
        color: '#B22222'
    },
    {
        name: 'Fatih Erbakan',
        title: 'Yeniden Refah Partisi Gn. Bşk.',
        coordinates: { ekonomi: -50, toplum: 100, milliyetcilik: 40, yonetim: 85 },
        color: '#CC0000'
    },
    {
        name: 'Musavat Dervişoğlu',
        title: 'İYİ Parti Genel Başkanı',
        coordinates: { ekonomi: 40, toplum: 10, milliyetcilik: 85, yonetim: 30 },
        color: '#3BA3D2'
    },
    {
        name: 'Ali Babacan',
        title: 'DEVA Partisi Genel Başkanı',
        coordinates: { ekonomi: 95, toplum: -30, milliyetcilik: -40, yonetim: -80 },
        color: '#00ADEF'
    },
    {
        name: 'Erkan Baş',
        title: 'TİP Genel Başkanı',
        coordinates: { ekonomi: -100, toplum: -85, milliyetcilik: -60, yonetim: -30 },
        color: '#D40000'
    }
];

