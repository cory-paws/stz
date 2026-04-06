import { describe, it, expect } from 'vitest';
import { calculateSanity, getDiscoveryReward, isLooping } from '../utils/gameLogic';
import { GameData } from '../types/game';

describe('Game Logic Utilities', () => {
    describe('calculateSanity', () => {
        it('should correctly add sanity', () => {
            expect(calculateSanity(50, 10)).toBe(60);
        });

        it('should correctly subtract sanity', () => {
            expect(calculateSanity(50, -10)).toBe(40);
        });

        it('should clamp sanity at 100', () => {
            expect(calculateSanity(95, 20)).toBe(100);
        });

        it('should clamp sanity at 0', () => {
            expect(calculateSanity(5, -20)).toBe(0);
        });
    });

    describe('getDiscoveryReward', () => {
        const mockData = { discoveryScore: 100 } as GameData;

        it('should return 0 if ending is already discovered', () => {
            expect(getDiscoveryReward('test.json', ['test.json'], mockData)).toBe(0);
        });

        it('should return reward if ending is new', () => {
            expect(getDiscoveryReward('new.json', ['test.json'], mockData)).toBe(100);
        });

        it('should use default reward of 50 if no score defined', () => {
            expect(getDiscoveryReward('new.json', [], {} as GameData)).toBe(50);
        });
    });

    describe('isLooping', () => {
        it('should return true when filenames match', () => {
            expect(isLooping('index.json', 'index.json')).toBe(true);
        });

        it('should return false when filenames differ', () => {
            expect(isLooping('index.json', 'other.json')).toBe(false);
        });
    });
});
