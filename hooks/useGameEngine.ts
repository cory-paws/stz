'use client';

import { useState, useCallback, useEffect } from 'react';
import { GameData, VisitedLocation } from '../types/game';
import { save, load } from '../utils/storage';
import { calculateSanity, getDiscoveryReward, isLooping } from '../utils/gameLogic';

export const useGameEngine = () => {
    const [data, setData] = useState<GameData | null>(null);
    const [currentLocation, setCurrentLocation] = useState<string>(() => load('current', 'index.json'));
    const [totalScore, setTotalScore] = useState<number>(() => load('totalScore', 0));
    const [sanity, setSanity] = useState<number>(() => load('sanity', 100));
    const [discoveredEndings, setDiscoveredEndings] = useState<string[]>(() => load('discoveredEndings', []));
    const [visitedLocations, setVisitedLocations] = useState<VisitedLocation[]>(() => load('visitedLocations', []));
    const [consecutiveLoopCount, setConsecutiveLoopCount] = useState<number>(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadGameData = useCallback(async (
        filename: string, 
        callbacks?: { onDeath?: () => void; onPickup?: (item: string) => void }
    ) => {
        setIsLoading(true);
        try {
            const response = await fetch(`/api/data/${filename}`);
            if (!response.ok) return loadGameData('error.json', callbacks);

            const jsonData: GameData = await response.json();
            
            // 1. Update State & Track Loops
            setData(jsonData);
            setConsecutiveLoopCount(prev => isLooping(filename, currentLocation) ? prev + 1 : 0);
            setCurrentLocation(filename);
            save('current', filename);

            // 2. Track Navigation
            setVisitedLocations(prev => {
                const exists = prev.some(loc => loc.filename === filename);
                if (exists) return prev;
                const next = [...prev, { filename, title: jsonData.title }];
                save('visitedLocations', next);
                return next;
            });

            // 3. Handle Sanity
            if (jsonData.sanityChange) {
                setSanity(prev => {
                    const next = calculateSanity(prev, jsonData.sanityChange);
                    save('sanity', next);
                    if (next <= 0) loadGameData('cave_madness_death.json', callbacks);
                    return next;
                });
            }

            // 4. Handle Items
            if (jsonData.type === 'PICKEDUP' && jsonData.objectName) {
                callbacks?.onPickup?.(jsonData.objectName);
            }

            // 5. Handle Discovery & Death
            if (jsonData.type === 'DEAD' || jsonData.type === 'WIN') {
                const reward = getDiscoveryReward(filename, discoveredEndings, jsonData);
                if (reward > 0) {
                    setTotalScore(prev => {
                        const next = prev + reward;
                        save('totalScore', next);
                        return next;
                    });
                    setDiscoveredEndings(prev => {
                        const next = [...prev, filename];
                        save('discoveredEndings', next);
                        return next;
                    });
                }
                
                if (jsonData.type === 'DEAD') {
                    setSanity(100); 
                    save('sanity', 100);
                    callbacks?.onDeath?.();
                }
            }
        } catch (err) {
            setError('Failed to load portal data.');
        } finally {
            setIsLoading(false);
        }
    }, [currentLocation, discoveredEndings]);

    return {
        data,
        currentLocation,
        totalScore,
        sanity,
        discoveredEndings,
        visitedLocations,
        consecutiveLoopCount,
        isLoading,
        error,
        loadGameData,
        setConsecutiveLoopCount
    };
};
