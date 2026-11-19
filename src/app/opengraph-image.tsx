import { ImageResponse } from 'next/og';

export const alt = 'Türkiye İdeolojik - Siyasi Kimliğini Keşfet';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          background: 'radial-gradient(circle at 15% 20%, rgba(220,38,38,0.35), transparent 45%), radial-gradient(circle at 85% 80%, rgba(37,99,235,0.35), transparent 45%), #050505',
          color: 'white',
        }}
      >
        <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, letterSpacing: -3 }}>
          <span style={{ color: '#a1a1a1' }}>Türkiye</span>
          <span>İdeolojik</span>
        </div>
        <div style={{ fontSize: 40, color: '#9ca3af', marginTop: 24 }}>
          Kaydır, cevapla, siyasi kimliğini keşfet.
        </div>
        <div style={{ display: 'flex', gap: 16, marginTop: 56, fontSize: 28 }}>
          {['13 İdeoloji', '4 Eksen', '40 Soru', 'Lider Uyumu'].map(label => (
            <div
              key={label}
              style={{ padding: '12px 24px', borderRadius: 16, border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
