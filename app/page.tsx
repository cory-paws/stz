'use client';

import { useState, useEffect } from 'react';
import { GameData, InventoryState, DroppedItemsState, CorpseItemsState, VisitedLocation } from '../types/game';
import { useProceduralAudio } from '../hooks/useProceduralAudio';
import { LocationDisplay } from '../components/LocationDisplay';
import { OptionsList } from '../components/OptionsList';
import InventoryManager from '../components/InventoryManager';
import VisualMap from '../components/VisualMap';

export default function Game() {
  const [data, setData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inventory, setInventory] = useState<InventoryState>({});
  const [droppedItems, setDroppedItems] = useState<DroppedItemsState>({});
  const [corpses, setCorpses] = useState<CorpseItemsState>({});
  const [visitedLocations, setVisitedLocations] = useState<VisitedLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('index.json');
  const [isLoading, setIsLoading] = useState(true);

  const { playClickSound, playZombieSound } = useProceduralAudio();

  // Functional Storage Helpers
  const save = (key: string, value: any) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(value));
    }
  };

  const load = (key: string, fallback: any) => {
    if (typeof window === 'undefined') return fallback;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const updateInventory = (updater: (prev: InventoryState) => InventoryState) => {
    setInventory((prev) => {
      const next = updater(prev);
      save('inventory', next);
      return next;
    });
  };

  const loadGameData = async (filename: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/data/${filename}`);

      if (!response.ok) {
        if (filename === 'error.json') throw new Error('Critical error: could not load error.json');
        return loadGameData('error.json');
      }

      const jsonData: GameData = await response.json();
      setData(jsonData);
      setCurrentLocation(filename);
      save('current', filename);

      setVisitedLocations((prev) => {
        if (prev.some(loc => loc.filename === filename)) return prev;
        const next = [...prev, { filename, title: jsonData.title }];
        save('visitedLocations', next);
        return next;
      });

      // Handle Death
      if (jsonData.type === 'DEAD') {
        playZombieSound();
        const inventoryKeys = Object.keys(inventory);
        if (inventoryKeys.length > 0) {
          setCorpses((prev) => {
            const next = { ...prev, [currentLocation]: [...(prev[currentLocation] || []), ...inventoryKeys] };
            save('corpses', next);
            return next;
          });
          updateInventory(() => ({}));
        }
      }

      // Handle Auto-Pickup
      if (jsonData.type === 'PICKEDUP' && jsonData.objectName) {
        updateInventory((prev) => ({ ...prev, [jsonData.objectName as string]: true }));
      }

    } catch (err) {
      console.error('Failed to load game data:', err);
      setError('Failed to load game data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedCurrent = localStorage.getItem('current') || 'index.json';
    setInventory(load('inventory', {}));
    setDroppedItems(load('droppedItems', {}));
    setCorpses(load('corpses', {}));
    setVisitedLocations(load('visitedLocations', []));
    loadGameData(savedCurrent);
  }, []);

  // Auto-scroll to top when a new location is rendered
  useEffect(() => {
    if (data) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [data]);

  const handleOptionClick = (link: string) => {
    playClickSound();
    loadGameData(link);
  };

  const handleDropItem = (itemId: string) => {
    if (!data || data.type === 'DEAD') return;

    updateInventory((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });

    setDroppedItems((prev) => {
      const next = { ...prev, [currentLocation]: [...(prev[currentLocation] || []), itemId] };
      save('droppedItems', next);
      return next;
    });

    playClickSound();
  };

  const pickupItem = (itemId: string, type: 'dropped' | 'corpse') => {
    updateInventory((prev) => ({ ...prev, [itemId]: true }));

    const setter = type === 'dropped' ? setDroppedItems : setCorpses;
    const storageKey = type === 'dropped' ? 'droppedItems' : 'corpses';

    setter((prev) => {
      const filtered = (prev[currentLocation] || []).filter(id => id !== itemId);
      const next = { ...prev, [currentLocation]: filtered };
      if (filtered.length === 0) delete next[currentLocation];
      save(storageKey, next);
      return next;
    });

    playClickSound();
  };

  if (isLoading && !data) {
    return (
      <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-[#00ff41]/20 rounded-xl p-16 shadow-[0_0_40px_rgba(0,255,65,0.1),inset_0_0_20px_rgba(0,255,65,0.05)] relative animate-[flicker_0.15s_infinite_alternate]">
        <div className="mb-10 text-[1.4rem]">Loading game data...</div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-red-500/20 rounded-xl p-16 shadow-[0_0_40px_rgba(255,49,49,0.1),inset_0_0_20px_rgba(255,49,49,0.05)] relative animate-[flicker_0.15s_infinite_alternate]">
        <h1 className="text-red-500 font-sans text-5xl font-extrabold text-center uppercase tracking-widest mb-8 drop-shadow-[0_0_15px_rgba(255,49,49,0.6)]">
          ERROR
        </h1>
        <div className="mb-10 text-[1.4rem]">{error}</div>
        <ul className="list-none flex flex-col gap-4">
          <li
            onClick={() => loadGameData('index.json')}
            className="p-4 px-6 bg-[#00ff41]/5 border border-[#00ff41]/10 rounded-lg cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#00ff41]/15 hover:border-[#00ff41] hover:translate-x-2"
          >
            Restart Game
          </li>
        </ul>
      </main>
    );
  }

  const currentDroppedItems = droppedItems[currentLocation] || [];

  return (
    <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-[#00ff41]/20 rounded-xl p-8 md:p-16 shadow-[0_0_40px_rgba(0,255,65,0.1),inset_0_0_20px_rgba(0,255,65,0.05)] relative animate-[flicker_0.15s_infinite_alternate] flex flex-col gap-16">
      <LocationDisplay data={data}>
        {data && data.options && (
          <OptionsList
            options={data.options}
            inventory={inventory}
            droppedItems={currentDroppedItems}
            linesCount={data.lines ? data.lines.length : 0}
            onOptionClick={handleOptionClick}
            onPickupDroppedItem={(id) => pickupItem(id, 'dropped')}
          />
        )}

        {corpses[currentLocation] && corpses[currentLocation].length > 0 && (
          <div className="mt-8 mb-8 p-6 bg-[#ffde00]/10 border-2 border-dashed border-[#ffde00]/30 rounded-xl relative overflow-hidden group">
            <h3 className="text-[#ffde00] font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="text-xl">💀</span> Search Player Corpse
            </h3>
            <div className="flex flex-wrap gap-3">
              {corpses[currentLocation].map((itemId) => (
                <button
                  key={itemId}
                  onClick={() => pickupItem(itemId, 'corpse')}
                  className="px-4 py-2 bg-[#ffde00]/20 hover:bg-[#ffde00]/40 border border-[#ffde00]/50 rounded text-[#ffde00] text-sm font-medium transition-all duration-300 hover:scale-105"
                >
                  Retrieve {itemId}
                </button>
              ))}
            </div>
          </div>
        )}
      </LocationDisplay>

      {data && data.type !== 'DEAD' && (
        <InventoryManager inventory={inventory} onDropItem={handleDropItem} />
      )}

      <VisualMap visitedLocations={visitedLocations} />
    </main>
  );
}
