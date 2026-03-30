import { InventoryState } from '../types/game';

interface InventoryManagerProps {
    inventory: InventoryState;
    onDropItem: (itemId: string) => void;
}

export default function InventoryManager({ inventory, onDropItem }: InventoryManagerProps) {
    const items = Object.keys(inventory).filter((key) => inventory[key] && key !== 'undefined');

    if (items.length === 0) {
        return null;
    }

    return (
        <div className="mt-24 pt-6 border-t border-green-500/20">
            <h3 className="text-sm uppercase tracking-widest text-[#00ff41]/60 mb-6 font-sans">
                Inventory
            </h3>
            <div className="flex flex-wrap gap-4">
                {items.map((item) => (
                    <div
                        key={item}
                        className="flex flex-row items-center justify-between gap-4 min-w-[200px] px-5 py-4 bg-[#00ff41]/5 border border-[#00ff41]/20 rounded-md shadow-sm transition-all hover:bg-[#00ff41]/10 hover:border-[#00ff41]/40"
                    >
                        <span className="font-semibold tracking-wide text-[1.1rem] capitalize truncate flex-1">{item}</span>
                        <button
                            onClick={() => onDropItem(item)}
                            className="px-3 py-1.5 bg-red-900/40 border border-red-500/40 hover:bg-red-500/20 hover:border-red-500/80 text-red-400 hover:text-red-300 text-[0.7rem] uppercase tracking-widest rounded transition-all focus:outline-none ml-4"
                            title="Drop this item here"
                        >
                            Drop
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
