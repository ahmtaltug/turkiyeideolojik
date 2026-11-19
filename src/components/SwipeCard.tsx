'use client';

import { motion, PanInfo, useMotionValue, useTransform } from 'framer-motion';
import { Check, X } from 'lucide-react';

export type SwipeDirection = 'left' | 'right';

interface SwipeCardProps {
    text: string;
    onSwipe: (direction: SwipeDirection) => void;
}

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

const variants = {
    enter: { scale: 0.95, y: 16, opacity: 0 },
    center: { scale: 1, y: 0, opacity: 1 },
    exit: (direction: SwipeDirection | null) => ({
        x: direction === 'left' ? -500 : direction === 'right' ? 500 : 0,
        rotate: direction === 'left' ? -25 : direction === 'right' ? 25 : 0,
        opacity: 0,
        transition: { duration: 0.3 },
    }),
};

export default function SwipeCard({ text, onSwipe }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-20, 20]);
    const agreeOpacity = useTransform(x, [30, 120], [0, 1]);
    const disagreeOpacity = useTransform(x, [-30, -120], [0, 1]);

    const handleDragEnd = (_: unknown, info: PanInfo) => {
        const { offset, velocity } = info;
        if (offset.x > SWIPE_THRESHOLD || velocity.x > VELOCITY_THRESHOLD) onSwipe('right');
        else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -VELOCITY_THRESHOLD) onSwipe('left');
    };

    return (
        <motion.div
            style={{ x, rotate }}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.9}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 z-10 bg-[#0d0d0d] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing touch-pan-y select-none shadow-xl will-change-transform"
        >
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white leading-tight" aria-live="polite">
                {text}
            </p>

            <motion.div
                style={{ opacity: agreeOpacity }}
                aria-hidden="true"
                className="absolute top-8 right-8 flex flex-col items-center text-green-500"
            >
                <div className="p-3 rounded-full border-4 border-green-500 mb-2">
                    <Check className="w-7 h-7" />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Katılıyorum</span>
            </motion.div>

            <motion.div
                style={{ opacity: disagreeOpacity }}
                aria-hidden="true"
                className="absolute top-8 left-8 flex flex-col items-center text-red-500"
            >
                <div className="p-3 rounded-full border-4 border-red-500 mb-2">
                    <X className="w-7 h-7" />
                </div>
                <span className="font-bold text-sm uppercase tracking-widest">Katılmıyorum</span>
            </motion.div>
        </motion.div>
    );
}
