'use client';

import { useState, useCallback } from 'react';
import { InventoryState, DroppedItemsState, CorpseItemsState } from '../types/game';
import { save, load } from '../utils/storage';

export const useInventory = (currentLocation: string) => {
    const [inventory, setInventory] = useState<InventoryState>(() => load('inventory', {}));
    const [droppedItems, setDroppedItems] = useState<DroppedItemsState>(() => load('droppedItems', {}));
    const [corpses, setCorpses] = useState<CorpseItemsState>(() => load('corpses', {}));

    const updateInventory = useCallback((updater: (prev: InventoryState) => InventoryState) => {
        setInventory(prev => {
            const next = updater(prev);
            save('inventory', next);
            return next;
        });
    }, []);

    const dropItem = useCallback((itemId: string) => {
        setInventory(prev => {
            const next = { ...prev };
            delete next[itemId];
            save('inventory', next);
            return next;
        });

        setDroppedItems(prev => {
            const next = { ...prev, [currentLocation]: [...(prev[currentLocation] || []), itemId] };
            save('droppedItems', next);
            return next;
        });
    }, [currentLocation]);

    const pickupItem = useCallback((itemId: string, type: 'dropped' | 'corpse') => {
        setInventory(prev => {
            const next = { ...prev, [itemId]: true };
            save('inventory', next);
            return next;
        });

        if (type === 'dropped') {
            setDroppedItems(prev => {
                const filtered = (prev[currentLocation] || []).filter(id => id !== itemId);
                const next = { ...prev, [currentLocation]: filtered };
                if (filtered.length === 0) delete next[currentLocation];
                save('droppedItems', next);
                return next;
            });
        } else {
            setCorpses(prev => {
                const filtered = (prev[currentLocation] || []).filter(id => id !== itemId);
                const next = { ...prev, [currentLocation]: filtered };
                if (filtered.length === 0) delete next[currentLocation];
                save('corpses', next);
                return next;
            });
        }
    }, [currentLocation]);

    const clearInventory = useCallback(() => {
        setInventory({});
        save('inventory', {});
    }, []);

    const dropAllToCorpse = useCallback((location: string) => {
        const items = Object.keys(inventory);
        if (items.length === 0) return;

        setCorpses(prev => {
            const next = { ...prev, [location]: [...(prev[location] || []), ...items] };
            save('corpses', next);
            return next;
        });
        clearInventory();
    }, [inventory, clearInventory]);

    return { 
        inventory, 
        droppedItems, 
        corpses, 
        updateInventory, 
        dropItem, 
        pickupItem, 
        clearInventory,
        dropAllToCorpse 
    };
};
