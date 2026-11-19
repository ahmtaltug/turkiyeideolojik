import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { ideologies, IdeologyId } from '@/data/ideologies';
import { calculateScores, decodeResponses } from '@/utils/scoring';
import { SHARE_PARAM } from '@/lib/site';

// Social preview image: a generic card, or the shared result when `?s=` holds a valid code.
const size = { width: 1200, height: 630 };
const BG =
    'radial-gradient(circle at 12% 15%, rgba(220,38,38,0.30), transparent 45%), radial-gradient(circle at 88% 85%, rgba(37,99,235,0.30), transparent 45%), #050505';

const Brand = () => (
    <div style={{ display: 'flex', fontSize: 30, fontWeight: 800, fontFamily: 'Inter', letterSpacing: -0.5, gap: 8 }}>
        <span style={{ color: '#a1a1a1' }}>Türkiye</span>
        <span>İdeolojik</span>
    </div>
);

function genericCard() {
    return (
        <div style={{ ...size, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 80, background: BG, color: 'white' }}>
            <div style={{ display: 'flex', fontSize: 96, fontWeight: 800, fontFamily: 'Inter', letterSpacing: -3, gap: 20 }}>
                <span style={{ color: '#a1a1a1' }}>Türkiye</span>
                <span>İdeolojik</span>
            </div>
            <div style={{ fontSize: 40, color: '#9ca3af', marginTop: 24 }}>Kaydır, cevapla, siyasi kimliğini keşfet.</div>
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
    );
}

function resultCard(code: string) {
    const responses = decodeResponses(code);
    if (!responses) return null;
    const r = calculateScores(responses);
    const name = r.topIdeology.name;
    const color = r.topIdeology.color;
    const ranking = (Object.entries(r.allScores) as [IdeologyId, number][])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

    return (
        <div style={{ ...size, display: 'flex', padding: 64, background: BG, color: 'white', gap: 56 }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: 560, flexShrink: 0 }}>
                <Brand />
                <div style={{ fontSize: 26, color: '#9ca3af', marginTop: 40 }}>Siyasi kimliğim</div>
                <div style={{ fontSize: name.length > 22 ? 60 : 84, fontWeight: 800, fontFamily: 'Inter', color, letterSpacing: -2, lineHeight: 1.05, marginTop: 8 }}>
                    {name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginTop: 24 }}>
                    <span style={{ fontSize: 64, fontWeight: 800, fontFamily: 'Inter' }}>%{r.matchPercentage}</span>
                    <span style={{ fontSize: 28, color: '#9ca3af' }}>uyum</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 'auto' }}>
                    {r.axisScores.map(axis => (
                        <div key={axis.id} style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 20 }}>
                            <span style={{ width: 130, flexShrink: 0, color: '#9ca3af' }}>{axis.name}</span>
                            <div style={{ display: 'flex', position: 'relative', width: 220, flexShrink: 0, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }}>
                                <div style={{ position: 'absolute', left: 109, top: -3, width: 2, height: 16, background: 'rgba(255,255,255,0.35)' }} />
                                <div
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        height: 10,
                                        borderRadius: 5,
                                        background: color,
                                        left: axis.value < 0 ? 110 - (Math.abs(axis.value) * 110) / 100 : 110,
                                        width: (Math.abs(axis.value) * 110) / 100,
                                    }}
                                />
                            </div>
                            <span style={{ color: '#d1d5db', fontSize: 18, whiteSpace: 'nowrap' }}>
                                {axis.value === 0 ? 'Merkez' : (axis.value < 0 ? axis.labels[0] : axis.labels[1]).split(' / ')[0]}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'center', gap: 22, padding: 36, borderRadius: 32, border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: 22, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 2 }}>En yakın ideolojiler</div>
                {ranking.map(([id, score]) => (
                    <div key={id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
                            <span>{ideologies[id].name}</span>
                            <span style={{ fontWeight: 800 }}>%{score}</span>
                        </div>
                        <div style={{ display: 'flex', height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }}>
                            <div style={{ width: `${score}%`, height: 10, borderRadius: 5, background: ideologies[id].color }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Inter (SIL Open Font License); the built-in font has no bold weight.
const fontFile = (name: string) => readFile(join(process.cwd(), 'assets/fonts', name));
const regularFont = fontFile('Inter-Regular.ttf');
const boldFont = fontFile('Inter-ExtraBold.ttf');

export async function GET(request: Request) {
    const code = new URL(request.url).searchParams.get(SHARE_PARAM);
    const card = (code && resultCard(code)) || genericCard();
    return new ImageResponse(card, {
        ...size,
        fonts: [
            { name: 'Inter', data: await regularFont, weight: 400, style: 'normal' },
            { name: 'Inter', data: await boldFont, weight: 800, style: 'normal' },
        ],
        // s-maxage lets Vercel's CDN serve repeat requests without running the function again.
        headers: { 'Cache-Control': 'public, max-age=86400, s-maxage=86400' },
    });
}
