export interface GameOption {
    id: string;
    link: string;
    desc: string;
    with?: string;    // Item required to show this option
    without?: string; // Item whose absence is required to show this option
    scoreRequirement?: number; // Minimum Total Survival Score to show this option
    sanityRequirement?: number; // Minimum current sanity to show this option
}

export interface GameData {
    title: string;
    type?: 'DEAD' | 'PICKEDUP' | 'WIN' | string;
    objectName?: string; // present when type === 'PICKEDUP'
    image?: string;
    imageClass?: string; // Optional CSS classes for custom filters/styling
    discoveryScore?: number; // Score granted for discovering this specific location/ending
    sanityChange?: number; // Amount to change current sanity (positive or negative)
    lines: string[];
    options: GameOption[];
}

// Key is the item ID (e.g. 'cattleprod'), value is a boolean representing ownership.
export type InventoryState = Record<string, boolean>;

// Tracks items dropped per location. Key is location filename (e.g. "hill.json"), value is an array of item IDs.
export type DroppedItemsState = Record<string, string[]>;

// Tracks your own corpse's items per location from previous deaths.
export type CorpseItemsState = Record<string, string[]>;

export interface VisitedLocation {
    filename: string;
    title: string;
}
