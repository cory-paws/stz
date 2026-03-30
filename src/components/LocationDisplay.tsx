import { ReactNode } from 'react';
import { GameData } from '../types/game';

interface LocationDisplayProps {
    data: GameData | null;
    children?: ReactNode;
}

export function LocationDisplay({ data, children }: LocationDisplayProps) {
    if (!data) return null;

    return (
        <>
            {data.type === 'DEAD' ? (
                <h1 className="text-red-500 font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold text-center uppercase tracking-wide mb-8 drop-shadow-[0_0_15px_rgba(255,49,49,0.6)] break-words">
                    Survive The Zombies
                </h1>
            ) : (
                <h1 className="text-[#00ff41] font-sans text-3xl md:text-4xl lg:text-5xl font-extrabold text-center uppercase tracking-wide mb-8 drop-shadow-[0_0_15px_rgba(0,255,65,0.6)] break-words">
                    STZ: Survive The Zombies
                </h1>
            )}

            <h2 className="text-[#ffde00] font-sans text-2xl md:text-3xl mb-8 border-b-2 border-[#ffde00] inline-block pb-2">
                {data.title}
            </h2>

            <div className="flex flex-col lg:flex-row gap-12">
                {data.image && (
                    <div className="lg:w-1/2 flex-shrink-0">
                        <div className="w-full max-h-[700px] overflow-hidden rounded-lg border border-green-500/20 shadow-[0_0_20px_rgba(0,255,65,0.1)] relative bg-[#050a05] after:absolute after:inset-0 after:bg-gradient-to-b after:from-transparent after:from-70% after:to-[#050a05]/60 after:pointer-events-none lg:sticky lg:top-8">
                            <img
                                src={data.image}
                                alt={data.title}
                                className="w-full h-auto object-cover block mx-auto sepia hue-rotate-[80deg] brightness-80 contrast-125 transition-transform duration-500 ease-out hover:scale-105"
                            />
                        </div>
                    </div>
                )}

                <div className={`flex flex-col ${data.image ? 'lg:w-1/2' : 'w-full'} pt-4`}>
                    <div className="mb-24 text-[1.2rem] md:text-[1.4rem] leading-relaxed space-y-4">
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
        </>
    );
}
