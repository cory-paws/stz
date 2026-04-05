'use client';

interface ScoreDisplayProps {
    score: number;
    discoveredCount: number;
    sanity: number;
}

export default function ScoreDisplay({ score, discoveredCount, sanity }: ScoreDisplayProps) {
    const sanityColor = sanity > 70 ? '#00ff41' : sanity > 30 ? '#ffde00' : '#ff3131';

    return (
        <div className="flex flex-col gap-4 p-4 px-6 bg-[#0d1a0d]/80 border border-[#00ff41]/20 rounded-xl backdrop-blur-md shadow-[0_0_20px_rgba(0,255,65,0.05),inset_0_0_15px_rgba(0,255,65,0.05)] relative overflow-hidden">
            <div className="flex items-center justify-between gap-6">
                <div className="flex flex-col">
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#00ff41]/50 mb-1">
                        Survival Rating
                    </span>
                    <div className="text-2xl font-mono text-[#00ff41] font-bold drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                        {score.toLocaleString()} <span className="text-sm font-normal opacity-50 ml-1">pts</span>
                    </div>
                </div>

                <div className="h-10 w-px bg-[#00ff41]/10" />

                <div className="flex flex-col items-end">
                    <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#00ff41]/50 mb-1">
                        Endings Found
                    </span>
                    <div className="text-xl font-mono text-[#00ff41] opacity-80">
                        <span className="text-2xl font-bold">{discoveredCount}</span>
                    </div>
                </div>
            </div>

            {/* Sanity Meter */}
            <div className="flex flex-col gap-2 pt-2 border-t border-[#00ff41]/10">
                <div className="flex justify-between items-center text-[0.6rem] uppercase tracking-widest text-[#00ff41]/60">
                    <span>Mental Stability (Santy)</span>
                    <span style={{ color: sanityColor }}>{Math.round(sanity)}%</span>
                </div>
                <div className="h-1.5 w-full bg-[#00ff41]/5 rounded-full overflow-hidden border border-[#00ff41]/10">
                    <div 
                        className="h-full transition-all duration-500 ease-out"
                        style={{ 
                            width: `${sanity}%`, 
                            backgroundColor: sanityColor,
                            boxShadow: `0 0 10px ${sanityColor}80`
                        }}
                    />
                </div>
            </div>
            
            <div className="absolute -top-px -left-px h-2 w-2 border-t border-l border-[#00ff41]/40" />
            <div className="absolute -top-px -right-px h-2 w-2 border-t border-r border-[#00ff41]/40" />
            <div className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-[#00ff41]/40" />
            <div className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-[#00ff41]/40" />
        </div>
    );
}
