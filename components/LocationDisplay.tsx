import { ReactNode } from 'react';
import { GameData } from '../types/game';

interface LocationDisplayProps {
    data: GameData | null;
    children?: ReactNode;
}

export function LocationDisplay({ data, children }: LocationDisplayProps) {
    if (!data) return null;

    return (
        <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-8 duration-700">
            {/* Re-instating the Location Title as requested */}
            <h2 className="text-[#ffde00] font-sans text-2xl md:text-3xl font-black uppercase tracking-[0.2em] border-b-2 border-[#ffde00]/30 inline-block pb-4 mb-0">
                {data.title}
            </h2>

            <div className="flex flex-col lg:flex-row gap-16">
                {data.image && (
                    <div className="lg:w-1/2 flex-shrink-0">
                        <div className="w-full min-h-[300px] md:min-h-[500px] aspect-[16/10] overflow-hidden rounded-3xl border-2 border-green-500/20 shadow-[0_0_50px_rgba(0,0,0,0.8)] relative bg-[#050a05] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-70% after:to-[#050a05]/60 after:pointer-events-none lg:sticky lg:top-8">
                            <img
                                src={data.image}
                                alt={data.title}
                                className={`w-full h-full object-cover block mx-auto transition-transform duration-500 ease-out hover:scale-105 ${data.imageClass || 'sepia hue-rotate-[80deg] brightness-80 contrast-125'}`}
                            />
                        </div>
                    </div>
                )}

                <div className={`flex flex-col ${data.image ? 'lg:w-1/2' : 'w-full'} pt-4 gap-16`}>
                    <div className="text-[1.2rem] md:text-[1.4rem] leading-relaxed space-y-8">
                        {data.lines.map((line, index) => (
                            <p
                                key={index}
                                className="opacity-0 translate-y-2 animate-[fadeInUp_0.5s_ease_forwards]"
                                style={{ animationDelay: `${index * 0.2}s` }}
                            >
                                {line}
                            </p>
                        ))}
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
