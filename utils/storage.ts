/**
 * Functional Storage Utilities
 * Provides safe, immutable-friendly access to localStorage.
 */

export const save = (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(value));
};

export const load = <T>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') return fallback;
    
    const item = localStorage.getItem(key);
    if (!item) return fallback;

    try {
        return JSON.parse(item) as T;
    } catch {
        return fallback;
    }
};


