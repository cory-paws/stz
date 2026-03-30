'use client';

import { useState, useEffect } from 'react';
import { GameData, InventoryState, DroppedItemsState, VisitedLocation } from '../types/game';
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
  const [visitedLocations, setVisitedLocations] = useState<VisitedLocation[]>([]);
  const [currentLocation, setCurrentLocation] = useState<string>('index.json');
  const [isLoading, setIsLoading] = useState(true);

  const { playClickSound, playZombieSound } = useProceduralAudio();

  const loadGameData = async (filename: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/data/${filename}`);
      if (!response.ok) {
        if (filename === 'error.json') {
          throw new Error('Critical error: could not load error.json');
        }
        return loadGameData('error.json');
      }
      const jsonData: GameData = await response.json();
      setData(jsonData);
      setCurrentLocation(filename);

      setVisitedLocations((prev) => {
        if (!prev.some(loc => loc.filename === filename)) {
          const newVisited = [...prev, { filename, title: jsonData.title }];
          localStorage.setItem('visitedLocations', JSON.stringify(newVisited));
          return newVisited;
        }
        return prev;
      });

      // Trigger zombie sound if player is dead
      if (jsonData.type === 'DEAD') {
        playZombieSound();
      }

      // Handle special data types (picking up an item natively from a location)
      if (jsonData.type === 'PICKEDUP' && jsonData.objectName) {
        setInventory((prev) => {
          const newInventory = { ...prev, [jsonData.objectName as string]: true };
          if (newInventory.undefined) delete newInventory.undefined;
          localStorage.setItem('inventory', JSON.stringify(newInventory));
          return newInventory;
        });
      }

      localStorage.setItem('current', filename);
    } catch (err) {
      console.error('Failed to load game data:', err);
      setError('Failed to load game data.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedCurrent = localStorage.getItem('current') || 'index.json';
    const savedInventory = JSON.parse(localStorage.getItem('inventory') || '{}');
    if (savedInventory.undefined) {
      delete savedInventory.undefined;
      localStorage.setItem('inventory', JSON.stringify(savedInventory));
    }
    const savedDropped = JSON.parse(localStorage.getItem('droppedItems') || '{}');
    const savedVisited = JSON.parse(localStorage.getItem('visitedLocations') || '[]');

    setInventory(savedInventory);
    setDroppedItems(savedDropped);
    setVisitedLocations(savedVisited);
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
    if (!data || data.type === 'DEAD') return; // Can't drop items when dead

    // Remove from inventory
    const newInventory = { ...inventory };
    delete newInventory[itemId];
    setInventory(newInventory);
    localStorage.setItem('inventory', JSON.stringify(newInventory));

    // Add to dropped items at current location
    const currentDroppedAtLocation = droppedItems[currentLocation] || [];
    const newDropped = {
      ...droppedItems,
      [currentLocation]: [...currentDroppedAtLocation, itemId],
    };
    setDroppedItems(newDropped);
    localStorage.setItem('droppedItems', JSON.stringify(newDropped));

    playClickSound(); // Feedback sound for dropping
  };

  const handlePickupDroppedItem = (itemId: string) => {
    // Add to inventory
    const newInventory = { ...inventory, [itemId]: true };
    setInventory(newInventory);
    localStorage.setItem('inventory', JSON.stringify(newInventory));

    // Remove from dropped items at current location
    const currentDroppedAtLocation = droppedItems[currentLocation] || [];
    const newDropped = {
      ...droppedItems,
      [currentLocation]: currentDroppedAtLocation.filter((id) => id !== itemId),
    };
    setDroppedItems(newDropped);
    localStorage.setItem('droppedItems', JSON.stringify(newDropped));

    playClickSound(); // Feedback sound for picking up
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
    <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-[#00ff41]/20 rounded-xl p-8 md:p-16 shadow-[0_0_40px_rgba(0,255,65,0.1),inset_0_0_20px_rgba(0,255,65,0.05)] relative animate-[flicker_0.15s_infinite_alternate]">
      <LocationDisplay data={data}>
        {data && data.options && (
          <OptionsList
            options={data.options}
            inventory={inventory}
            droppedItems={currentDroppedItems}
            linesCount={data.lines ? data.lines.length : 0}
            onOptionClick={handleOptionClick}
            onPickupDroppedItem={handlePickupDroppedItem}
          />
        )}
      </LocationDisplay>

      {data && data.type !== 'DEAD' && (
        <InventoryManager inventory={inventory} onDropItem={handleDropItem} />
      )}

      <VisualMap visitedLocations={visitedLocations} />
    </main>
  );
}
