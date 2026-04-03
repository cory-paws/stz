import { GameOption, InventoryState } from '../types/game';

interface OptionsListProps {
    options: GameOption[];
    inventory: InventoryState;
    droppedItems: string[]; // Items currently dropped at this location
    linesCount: number;
    onOptionClick: (link: string) => void;
    onPickupDroppedItem: (itemId: string) => void;
}

export function OptionsList({
    options,
    inventory,
    droppedItems,
    linesCount,
    onOptionClick,
    onPickupDroppedItem,
}: OptionsListProps) {
    const shouldSkipOption = (option: GameOption) => {
        if (!option.with && !option.without) return false;
        const requirement = option.with || option.without;
        const hasItem = requirement ? inventory[requirement] : false;
        return (option.with && !hasItem) || (option.without && hasItem);
    };

    return (
        <ul className="list-none flex flex-col gap-4">
            {options.map((option, index) => {
                if (shouldSkipOption(option)) return null;
                return (
                    <li
                        key={option.id || index}
                        onClick={() => onOptionClick(option.link)}
                        style={{ animationDelay: `${(linesCount + index) * 0.2}s` }}
                        className="p-4 px-6 bg-[#00ff41]/5 border border-[#00ff41]/10 rounded-lg cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden hover:bg-[#00ff41]/15 hover:border-[#00ff41] hover:translate-x-2 hover:shadow-[0_0_15px_rgba(0,255,65,0.2)] before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-[#00ff41] before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 opacity-0 translate-y-2 animate-[fadeInUp_0.5s_ease_forwards]"
                    >
                        {option.desc}
                    </li>
                );
            })}

            {/* Render dropped items that can be picked up back */}
            {droppedItems.map((itemId, index) => (
                <li
                    key={`dropped-${itemId}`}
                    onClick={() => onPickupDroppedItem(itemId)}
                    style={{ animationDelay: `${(linesCount + options.length + index) * 0.2}s` }}
                    className="p-4 px-6 bg-yellow-500/5 border border-yellow-500/20 rounded-lg cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden hover:bg-yellow-500/15 hover:border-yellow-500 hover:translate-x-2 hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] before:content-[''] before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-yellow-500 before:scale-y-0 before:transition-transform before:duration-300 hover:before:scale-y-100 opacity-0 translate-y-2 animate-[fadeInUp_0.5s_ease_forwards] text-yellow-500"
                >
                    Pick up {itemId}
                </li>
            ))}
        </ul>
    );
}
