import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Türkiye İdeolojik',
    short_name: 'İdeolojik',
    description: 'Kaydırmalı sorularla Türkiye siyasetindeki yerini keşfet.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    lang: 'tr',
    icons: [{ src: '/favicon.ico', sizes: 'any', type: 'image/x-icon' }],
  };
}
