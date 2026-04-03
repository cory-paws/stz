import React from 'react';
import { VisitedLocation } from '../types/game';

interface VisualMapProps {
  visitedLocations: VisitedLocation[];
}

// Coordinates map game locations to X/Y/Radius percentage coordinates on the background image.
const mapCoordinates: Record<string, { x: number; y: number; r: number }> = {
  // Center
  "index.json": { x: 50, y: 35, r: 15 },
  // Under the hill (Caves)
  "cave_drop.json": { x: 50, y: 35, r: 18 },
  "cave_frozen.json": { x: 50, y: 35, r: 22 },
  "cave_lake.json": { x: 50, y: 35, r: 25 },
  "cave_shrine.json": { x: 50, y: 35, r: 28 },
  "cave_portal.json": { x: 50, y: 35, r: 30 },
  "mountains_of_madness.json": { x: 50, y: 35, r: 35 },
  // Hill
  "hill.json": { x: 50, y: 20, r: 20 },
  "picnic.json": { x: 50, y: 20, r: 20 },
  // Town (Left)
  "village.json": { x: 20, y: 30, r: 15 },
  // Sewers (Bottom Left -> Center Bottom -> Right Bottom)
  "sewer_entrance.json": { x: 25, y: 65, r: 15 },
  "sewer_rubble.json": { x: 25, y: 65, r: 15 },
  "sewer_left.json": { x: 15, y: 80, r: 15 },
  "sewer_cheese.json": { x: 15, y: 80, r: 15 },
  "sewer_spider_death.json": { x: 15, y: 80, r: 15 },
  "sewer_right.json": { x: 35, y: 65, r: 15 },
  "rat_friend.json": { x: 35, y: 65, r: 15 },
  "sewer_goo.json": { x: 50, y: 75, r: 15 },
  // Plant (Bottom Right)
  "chemical_plant.json": { x: 75, y: 75, r: 20 },
  "plant_desk.json": { x: 75, y: 75, r: 20 },
  "game_win.json": { x: 75, y: 75, r: 20 },
  // Farm (Right)
  "farmer.json": { x: 80, y: 30, r: 15 },
  "talk.json": { x: 80, y: 30, r: 15 },
  "barn_hub.json": { x: 85, y: 35, r: 15 },
  "barn_door.json": { x: 85, y: 35, r: 15 },
  "barn_keypad.json": { x: 85, y: 35, r: 15 },
  "barn_search.json": { x: 85, y: 35, r: 15 },
  "barn_ice.json": { x: 85, y: 35, r: 15 },
  "barn_panel.json": { x: 85, y: 35, r: 15 },
  "barn_escape.json": { x: 85, y: 35, r: 18 },
  "fields_safe.json": { x: 80, y: 45, r: 20 },
};

export default function VisualMap({ visitedLocations }: VisualMapProps) {
  if (visitedLocations.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-[#00ff41]/20">
      <h2 className="text-[#00ff41] font-sans text-2xl font-bold uppercase tracking-widest mb-6 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        Survivor's Map
      </h2>
      
      <div className="relative w-full aspect-square md:aspect-video rounded-xl overflow-hidden border border-[#00ff41]/30 shadow-[0_0_20px_rgba(0,255,65,0.15)] bg-black">
        {/* The Base Map Image */}
        <img 
          src="/images/expanded_survival_map.png" 
          alt="World Map" 
          className="absolute inset-0 w-full h-full object-cover sepia-[0.3] hue-rotate-[10deg]"
        />

        {/* The SVG Mask overlay (Fog of War) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <mask id="fogOfWarMask">
              {/* White background = masked (covered in black box) */}
              <rect width="100%" height="100%" fill="white" />
              {/* Black circles punch holes through the mask */}
              {visitedLocations.map((loc) => {
                const coord = mapCoordinates[loc.filename];
                if (!coord) return null;
                return (
                  <circle
                    key={`mask-${loc.filename}`}
                    cx={`${coord.x}%`}
                    cy={`${coord.y}%`}
                    r={`${coord.r}%`}
                    fill="black"
                    style={{ filter: "blur(20px)" }}
                  />
                );
              })}
            </mask>
          </defs>
          <rect
            width="100%"
            height="100%"
            fill="#050a05"
            mask="url(#fogOfWarMask)"
          />
        </svg>

        {/* Small glowing blips at the visited locations on top of fog */}
        {visitedLocations.map((loc) => {
          const coord = mapCoordinates[loc.filename];
          if (!coord) return null;
          return (
            <div 
              key={`blip-${loc.filename}`} 
              className="absolute w-2 h-2 rounded-full bg-[#00ff41] animate-pulse"
              style={{
                left: `calc(${coord.x}% - 4px)`,
                top: `calc(${coord.y}% - 4px)`,
                boxShadow: "0 0 10px 2px rgba(0,255,65,0.5)"
              }}
              title={loc.title}
            />
          );
        })}
      </div>
    </div>
  );
}
