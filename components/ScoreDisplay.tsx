'use client';

interface ScoreDisplayProps {
    score: number;
    discoveredCount: number;
}

export default function ScoreDisplay({ score, discoveredCount }: ScoreDisplayProps) {
    return (
        <div className="flex items-center justify-between gap-6 p-4 px-6 bg-[#00ff41]/5 border border-[#00ff41]/10 rounded-xl backdrop-blur-sm shadow-[inset_0_0_15px_rgba(0,255,65,0.05)]">
            <div className="flex flex-col">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#00ff41]/50 mb-1">
                    Total Discovery Score
                </span>
                <div className="text-2xl font-mono text-[#00ff41] font-bold drop-shadow-[0_0_10px_rgba(0,255,65,0.4)]">
                    {score.toLocaleString()} <span className="text-sm font-normal opacity-50 ml-1">pts</span>
                </div>
            </div>

            <div className="h-10 w-px bg-[#00ff41]/10 ml-auto" />

            <div className="flex flex-col items-end">
                <span className="text-[0.6rem] uppercase tracking-[0.2em] text-[#00ff41]/50 mb-1">
                    Endings Found
                </span>
                <div className="text-xl font-mono text-[#00ff41] opacity-80">
                    <span className="text-2xl font-bold">{discoveredCount}</span>
                </div>
            </div>
            
            <div className="absolute -top-px -left-px h-2 w-2 border-t border-l border-[#00ff41]/40" />
            <div className="absolute -top-px -right-px h-2 w-2 border-t border-r border-[#00ff41]/40" />
            <div className="absolute -bottom-px -left-px h-2 w-2 border-b border-l border-[#00ff41]/40" />
            <div className="absolute -bottom-px -right-px h-2 w-2 border-b border-r border-[#00ff41]/40" />
        </div>
    );
}
