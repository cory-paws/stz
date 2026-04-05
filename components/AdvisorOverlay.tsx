'use client';

import { useState, useEffect } from 'react';
import { advisorMessages, AdvisorMessage } from '../utils/AdvisorContent';

interface AdvisorOverlayProps {
    loopCount: number;
    onClose: () => void;
}

export default function AdvisorOverlay({ loopCount, onClose }: AdvisorOverlayProps) {
    const [message, setMessage] = useState<AdvisorMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (loopCount >= 3 && !isVisible) {
            const randomMsg = advisorMessages[Math.floor(Math.random() * advisorMessages.length)];
            setMessage(randomMsg);
            setIsVisible(true);
            
            // Auto-hide after 8 seconds
            const timer = setTimeout(() => {
                handleClose();
            }, 8000);
            return () => clearTimeout(timer);
        }
    }, [loopCount]);

    const handleClose = () => {
        setIsVisible(false);
        onClose();
    };

    if (!isVisible || !message) return null;

    const isSloth = message.type === 'SLOTH';

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center p-8 md:p-16 backdrop-blur-md bg-black/40 cursor-pointer animate-in fade-in duration-500"
            onClick={handleClose}
        >
            <div 
                className={`relative w-full max-w-2xl bg-[#050a05] border-2 rounded-2xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,1)] overflow-hidden ${
                    isSloth ? 'border-sky-500/40 shadow-sky-500/10' : 'border-red-500/40 shadow-red-500/10'
                }`}
            >
                {/* Scanline / Distortion Effect */}
                <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />
                
                {/* Animal Icon */}
                <div className="flex flex-col items-center text-center gap-8 relative z-10">
                    <div className={`text-6xl md:text-8xl animate-bounce filter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`}>
                        {isSloth ? '🦥' : '🐨'}
                    </div>
                    
                    <div className="space-y-4">
                        <h3 className={`text-xs md:text-sm font-black uppercase tracking-[0.5em] ${isSloth ? 'text-sky-500/60' : 'text-red-500/60'}`}>
                            {isSloth ? 'Spectral Sloth Advisor' : 'Drop Bear Warning'}
                        </h3>
                        
                        <div className="relative">
                            {/* The Backwards Text */}
                            <p className={`text-xl md:text-3xl font-mono font-black tracking-[0.2em] break-words leading-tight filter blur-[0.3px] select-none ${
                                isSloth ? 'text-[#00ff41] drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]' : 'text-[#ff3131] drop-shadow-[0_0_10px_rgba(255,49,49,0.4)] md:animate-pulse'
                            }`}>
                                {message.reversedText}
                            </p>
                        </div>

                        <p className="text-[10px] uppercase font-bold tracking-[0.2em] opacity-30 mt-8">
                            Click anywhere to dismiss terminal distortion
                        </p>
                    </div>
                </div>

                {/* Decorative Edges */}
                <div className={`absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-2xl ${isSloth ? 'border-sky-500/20' : 'border-red-500/20'}`} />
                <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-2xl ${isSloth ? 'border-sky-500/20' : 'border-red-500/20'}`} />
            </div>
        </div>
    );
}
