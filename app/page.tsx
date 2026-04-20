'use client';

import { useEffect, useState } from 'react';
import { useProceduralAudio } from '../hooks/useProceduralAudio';
import { LocationDisplay } from '../components/LocationDisplay';
import { OptionsList } from '../components/OptionsList';
import InventoryManager from '../components/InventoryManager';
import VisualMap from '../components/VisualMap';
import ScoreDisplay from '../components/ScoreDisplay';
import AdvisorOverlay from '../components/AdvisorOverlay';

// NEW: Core Gameplay Hooks
import { useGameEngine } from '../hooks/useGameEngine';
import { useInventory } from '../hooks/useInventory';

export default function Game() {
  const [mounted, setMounted] = useState(false);
  const { 
    data, currentLocation, totalScore, sanity, discoveredEndings, 
    visitedLocations, consecutiveLoopCount, isLoading, error, 
    loadGameData, setConsecutiveLoopCount 
  } = useGameEngine();

  const { 
    inventory, droppedItems, corpses, dropItem, pickupItem, addItem, dropAllToCorpse 
  } = useInventory(currentLocation);

  const { playClickSound, playZombieSound } = useProceduralAudio();

  // Initialization & Death Handling
  useEffect(() => {
    setMounted(true);
    if (!data) loadGameData(currentLocation, { 
      onDeath, 
      onPickup: (item) => addItem(item) 
    });
  }, []);

  const onDeath = () => {
    playZombieSound();
    dropAllToCorpse(currentLocation);
  };

  const handleOptionClick = (link: string) => {
    playClickSound();
    loadGameData(link, { 
      onDeath, 
      onPickup: (item) => addItem(item) 
    });
  };

  // Guard: Loading State
  if (isLoading && !data) {
    return (
      <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-[#00ff41]/20 rounded-xl p-16 shadow-[0_0_40px_rgba(0,255,65,0.1),inset_0_0_20px_rgba(0,255,65,0.05)] relative animate-[flicker_0.15s_infinite_alternate]">
        <div className="mb-10 text-[1.4rem]">Initializing terminal...</div>
      </main>
    );
  }

  // Guard: Error State
  if (error) {
    return (
      <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-red-500/20 rounded-xl p-16 shadow-[0_0_40px_rgba(255,49,49,0.1),inset_0_0_20px_rgba(255,49,49,0.05)] relative animate-[flicker_0.15s_infinite_alternate]">
        <h1 className="text-red-500 font-sans text-5xl font-extrabold text-center uppercase tracking-widest mb-8 drop-shadow-[0_0_15px_rgba(255,49,49,0.6)]">ERROR</h1>
        <div className="mb-10 text-[1.4rem]">{error}</div>
        <button onClick={() => loadGameData('index.json')} className="p-4 px-6 bg-[#00ff41]/5 border border-[#00ff41]/10 rounded-lg cursor-pointer transition-all hover:bg-[#00ff41]/15">
          Reset System
        </button>
      </main>
    );
  }

  const currentDroppedItems = droppedItems[currentLocation] || [];

  return (
    <main className="w-full max-w-[1500px] bg-[#0d1a0d]/70 backdrop-blur-md border border-[#00ff41]/20 rounded-2xl p-6 md:p-12 shadow-[0_0_50px_rgba(0,255,65,0.15),inset_0_0_30px_rgba(0,255,65,0.05)] relative animate-[flicker_0.15s_infinite_alternate] flex flex-col gap-6">
      
      {/* 1. Dashboard Header */}
      <div className="w-full flex flex-col items-center gap-1 mb-2">
        {currentLocation === 'index.json' && (
          <h1 className={`${data?.type === 'DEAD' ? 'text-red-500 drop-shadow-[0_0_10px_rgba(255,49,49,0.8)]' : 'text-[#00ff41] drop-shadow-[0_0_10px_rgba(0,255,65,0.8)]'} font-black text-[10px] md:text-xs uppercase tracking-[0.8em] text-center antialiased mb-2`}>
            STZ: SURVIVE THE ZOMBIES
          </h1>
        )}
        {mounted && <ScoreDisplay score={totalScore} discoveredCount={discoveredEndings.length} sanity={sanity} />}
      </div>

      {/* 2. Narrative Engine */}
      <LocationDisplay data={data}>
        {data?.options && (
          <OptionsList
            options={data.options}
            inventory={inventory}
            droppedItems={currentDroppedItems}
            linesCount={data.lines ? data.lines.length : 0}
            totalScore={totalScore}
            onOptionClick={handleOptionClick}
            onPickupDroppedItem={(id) => pickupItem(id, 'dropped')}
          />
        )}

        {/* 3. Lootable Corpses */}
        {corpses[currentLocation]?.length > 0 && (
          <div className="mt-8 mb-8 p-8 bg-[#ff3131]/5 border-2 border-dashed border-[#ff3131]/30 rounded-xl relative group">
            <h3 className="text-[#ff3131] font-bold uppercase tracking-[0.3em] mb-4 flex items-center gap-3 relative z-10">
              <span className="text-2xl animate-pulse">💀</span> <span>Salvage remains</span>
            </h3>
            <div className="flex flex-wrap gap-4 relative z-10">
              {corpses[currentLocation].map((id, idx) => (
                <button key={`${id}-${idx}`} onClick={() => pickupItem(id, 'corpse')} className="px-6 py-3 bg-[#ff3131]/10 hover:bg-[#ff3131]/20 border border-[#ff3131]/40 rounded-lg text-[#ff3131] text-xs font-bold uppercase tracking-widest transition-all">
                  Collect {id}
                </button>
              ))}
            </div>
          </div>
        )}
      </LocationDisplay>

      {/* 4. Equipment Management */}
      {mounted && data?.type !== 'DEAD' && (
        <InventoryManager inventory={inventory} onDropItem={(id) => { playClickSound(); dropItem(id); }} />
      )}

      {/* 5. Utility Overlays */}
      <VisualMap visitedLocations={visitedLocations} />
      <AdvisorOverlay loopCount={consecutiveLoopCount} onClose={() => setConsecutiveLoopCount(0)} />
    </main>
  );
}
