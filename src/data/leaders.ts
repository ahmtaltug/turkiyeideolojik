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
        coordinates: { ekonomi: 40, toplum: 85, milliyetcilik: 60, yonetim: 95 },
        color: '#FFCC00'
    },
    {
        name: 'Özgür Özel',
        title: 'CHP Genel Başkanı',
        coordinates: { ekonomi: -60, toplum: -70, milliyetcilik: 10, yonetim: -50 },
        color: '#EE1C25'
    },
    {
        name: 'Ümit Özdağ',
        title: 'Zafer Partisi Genel Başkanı',
        coordinates: { ekonomi: -20, toplum: -30, milliyetcilik: 100, yonetim: 80 },
        color: '#B22222'
    },
    {
        name: 'Ali Babacan',
        title: 'DEVA Partisi Genel Başkanı',
        coordinates: { ekonomi: 90, toplum: -20, milliyetcilik: -50, yonetim: -85 },
        color: '#00ADEF'
    },
    {
        name: 'Erkan Baş',
        title: 'TİP Genel Başkanı',
        coordinates: { ekonomi: -100, toplum: -80, milliyetcilik: -70, yonetim: -20 },
        color: '#D40000'
    },
    {
        name: 'Meral Akşener',
        title: 'İYİ Parti Eski Gn. Bşk.',
        coordinates: { ekonomi: 30, toplum: 20, milliyetcilik: 60, yonetim: 20 },
        color: '#3BA3D2'
    },
    {
        name: 'Besim Tibuk',
        title: 'LDP Onursal Başkanı',
        coordinates: { ekonomi: 100, toplum: -50, milliyetcilik: -90, yonetim: -100 },
        color: '#0000FF'
    },
    {
        name: 'Doğu Perinçek',
        title: 'Vatan Partisi Genel Başkanı',
        coordinates: { ekonomi: -90, toplum: 10, milliyetcilik: 80, yonetim: 95 },
        color: '#FF0000'
    }
];
