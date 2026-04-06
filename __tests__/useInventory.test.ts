import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useInventory } from '../hooks/useInventory';

describe('useInventory Hook', () => {
    beforeEach(() => {
        window.localStorage.clear();
        vi.clearAllMocks();
    });

    it('should initialize with empty state', () => {
        const { result } = renderHook(() => useInventory('test.json'));
        expect(result.current.inventory).toEqual({});
    });

    it('should add item to inventory', () => {
        const { result } = renderHook(() => useInventory('test.json'));
        act(() => {
            result.current.updateInventory((prev) => ({ ...prev, 'crowbar': true }));
        });
        expect(result.current.inventory).toHaveProperty('crowbar');
    });

    it('should drop item and add to droppedState', () => {
        const { result } = renderHook(() => useInventory('location-a.json'));
        
        // 1. Initial State
        act(() => {
            result.current.updateInventory((prev) => ({ ...prev, 'flashlight': true }));
        });

        // 2. Drop Item
        act(() => {
            result.current.dropItem('flashlight');
        });

        expect(result.current.inventory).not.toHaveProperty('flashlight');
        expect(result.current.droppedItems['location-a.json']).toContain('flashlight');
    });

    it('should pickup dropped item', () => {
        const { result } = renderHook(() => useInventory('location-b.json'));

        // Mock a dropped item
        act(() => {
            result.current.dropItem('batteries');
        });

        // Pickup Item
        act(() => {
            result.current.pickupItem('batteries', 'dropped');
        });

        expect(result.current.inventory).toHaveProperty('batteries');
        expect(result.current.droppedItems['location-b.json']).toBeUndefined();
    });

    it('should clear all and drop to corpse on death', () => {
        const { result } = renderHook(() => useInventory('death-spot.json'));

        act(() => {
            result.current.updateInventory((prev) => ({ ...prev, 'machete': true, 'map': true }));
        });

        act(() => {
            result.current.dropAllToCorpse('death-spot.json');
        });

        expect(result.current.inventory).toEqual({});
        expect(result.current.corpses['death-spot.json']).toContain('machete');
        expect(result.current.corpses['death-spot.json']).toContain('map');
    });
});
