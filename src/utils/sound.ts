// Tiny synthesized "swipe" click: no external audio file, no network request.
let ctx: AudioContext | null = null;

const getContext = (): AudioContext | null => {
    if (typeof window === 'undefined') return null;
    const AudioCtx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    ctx ??= new AudioCtx();
    if (ctx.state === 'suspended') void ctx.resume();
    return ctx;
};

/** Create the AudioContext on first touch so the first swipe doesn't hitch. */
export const warmUpAudio = () => {
    try { getContext(); } catch { /* ignore */ }
};

export const playSwipeSound = (direction: 'left' | 'right') => {
    try {
        const ctx = getContext();
        if (!ctx) return;

        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(direction === 'right' ? 520 : 360, now);
        osc.frequency.exponentialRampToValueAtTime(direction === 'right' ? 880 : 220, now + 0.09);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.08, now + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain).connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
    } catch {
        // Audio is a nice-to-have; ignore failures.
    }
};

export const vibrate = (ms = 12) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try { navigator.vibrate(ms); } catch { /* ignore */ }
    }
};
