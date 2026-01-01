'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Check, X } from 'lucide-react';
import { useState } from 'react';

interface SwipeCardProps {
    text: string;
    onSwipe: (direction: 'left' | 'right') => void;
    isFront: boolean;
}

export default function SwipeCard({ text, onSwipe, isFront }: SwipeCardProps) {
    const x = useMotionValue(0);
    const rotate = useTransform(x, [-200, 200], [-25, 25]);
    const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

    // Indicators
    const agreeOpacity = useTransform(x, [50, 150], [0, 1]);
    const disagreeOpacity = useTransform(x, [-50, -150], [0, 1]);

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x > 100) {
            onSwipe('right');
        } else if (info.offset.x < -100) {
            onSwipe('left');
        }
    };

    if (!isFront) {
        return (
            <div className="absolute inset-0 glass rounded-3xl p-8 flex items-center justify-center text-center opacity-50 scale-95 translate-y-4 -z-10">
                <p className="text-2xl font-medium text-gray-500 blur-sm">{text}</p>
            </div>
        );
    }

    return (
        <motion.div
            style={{ x, rotate, opacity }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onDragEnd={handleDragEnd}
            whileDrag={{ scale: 1.05 }}
            className="absolute inset-0 glass rounded-3xl p-8 flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing touch-none select-none shadow-2xl border-white/5"
        >
            <p className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {text}
            </p>

            {/* Swipe Indicators */}
            <motion.div
                style={{ opacity: agreeOpacity }}
                className="absolute top-10 right-10 flex flex-col items-center text-green-500"
            >
                <div className="p-4 rounded-full border-4 border-green-500 mb-2">
                    <Check className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg uppercase tracking-widest">Katılıyorum</span>
            </motion.div>

            <motion.div
                style={{ opacity: disagreeOpacity }}
                className="absolute top-10 left-10 flex flex-col items-center text-red-500"
            >
                <div className="p-4 rounded-full border-4 border-red-500 mb-2">
                    <X className="w-8 h-8" />
                </div>
                <span className="font-bold text-lg uppercase tracking-widest">Katılmıyorum</span>
            </motion.div>

            <div className="absolute bottom-10 text-gray-500 text-sm font-medium flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" /> Sola: Hayır
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" /> Sağa: Evet
                </div>
            </div>
        </motion.div>
    );
}
