import { GameData } from '../types/game';

/**
 * Pure Game Logic Utilities
 * Functional, side-effect free logic for survival mechanics.
 */

/**
 * Calculate the next sanity value based on a change.
 * Use constants and clamps for reliability.
 */
export const calculateSanity = (currentSanity: number, change: number = 0): number => {
    const MIN_SANITY = 0;
    const MAX_SANITY = 100;
    return Math.max(MIN_SANITY, Math.min(MAX_SANITY, currentSanity + change));
};

/**
 * Determine if an ending is new and what its value is.
 * Logic: only return score if ending is not in discoveredEndings.
 */
export const getDiscoveryReward = (
    filename: string, 
    discoveredEndings: string[], 
    data: GameData
): number => {
    if (discoveredEndings.includes(filename)) return 0;
    return data.discoveryScore || 50;
};

/**
 * Check if a player transition constitutes a 'loop'.
 */
export const isLooping = (newFilename: string, currentFilename: string): boolean => {
    return newFilename === currentFilename;
};
