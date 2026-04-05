'use client';

interface ScoreDisplayProps {
    score: number;
    discoveredCount: number;
    sanity: number;
}

export default function ScoreDisplay({ score, discoveredCount, sanity }: ScoreDisplayProps) {
    const sanityColor = sanity > 70 ? 'bg-sky-500/40' : sanity > 30 ? 'bg-yellow-500/40' : 'bg-red-500/40';

    return (
        <div className="w-full bg-[#0d1a0d]/40 backdrop-blur-md border border-[#00ff41]/20 rounded-xl p-2 md:p-3 shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] relative overflow-hidden">
            {/* Background scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

            {/* Full-Width Desktop Row - Consistent Label [Badge] Style */}
            <div className="flex flex-col md:flex-row items-center justify-between m-100 gap-4 md:gap-0 w-full relative z-10 px-4 md:px-8">

                {/* Panel 1: Discovery Rating */}
                <div className="flex items-center gap-2.5 flex-1 justify-start p-10">
                    <span className="opacity-50">🎖️</span>
                    <div className="flex flex-col">
                        <div className="text-[20px] text-[#00ff41]/80 font-bold uppercase m-10 tracking-wider">
                            Discovery Rating:
                            <span className=" rounded px-2 py-0.5 pl-10 ml-10 text-[#00ff41] font-black">
                                {score.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-6 bg-[#00ff41]/10 mx-6" />

                {/* Panel 2: Mental Strength */}
                <div className="flex items-center gap-2.5 flex-1 justify-center">
                    <span className={`text-xs ${sanity < 30 ? 'animate-bounce' : 'opacity-50'}`}>🧠</span>
                    <div className="flex flex-col">
                        <div className="text-[20px] text-[#00ff41]/80 font-bold uppercase tracking-wider">
                            Mental Strength:
                            <span className={`${sanityColor} rounded px-2 py-0.5 ml-2 text-[#00ff41] font-black`}>
                                {Math.round(sanity)}%
                            </span>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="hidden md:block w-px h-6 bg-[#00ff41]/10 mx-6" />

                {/* Panel 3: Unique Endings */}
                <div className="flex items-center gap-2.5 flex-1 justify-end">
                    <span className="opacity-50">📂</span>
                    <div className="flex flex-col items-end md:items-start text-right md:text-left">
                        <div className="text-[20px] text-[#00ff41]/80 font-bold uppercase tracking-wider">
                            Unique Endings:
                            <span className="rounded px-2 py-0.5 ml-2 text-[#00ff41] font-black">
                                {discoveredCount}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Edges */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#00ff41]/10 rounded-tl-md" />
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#00ff41]/10 rounded-tr-md" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#00ff41]/10 rounded-bl-md" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#00ff41]/10 rounded-br-md" />
        </div >
    );
}
