import React from 'react';
import { VisitedLocation } from '../types/game';

interface MapTrackerProps {
  visitedLocations: VisitedLocation[];
}

export default function MapTracker({ visitedLocations }: MapTrackerProps) {
  if (visitedLocations.length === 0) return null;

  return (
    <div className="mt-8 pt-8 border-t border-[#00ff41]/20">
      <h2 className="text-[#00ff41] font-sans text-2xl font-bold uppercase tracking-widest mb-4 flex items-center gap-3 drop-shadow-[0_0_8px_rgba(0,255,65,0.4)]">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon>
          <line x1="9" y1="3" x2="9" y2="21"></line>
          <line x1="15" y1="3" x2="15" y2="21"></line>
        </svg>
        Exploration Log
      </h2>
      <div className="bg-black/50 p-6 rounded-lg border border-[#00ff41]/20">
        <div className="flex flex-wrap gap-3">
          {visitedLocations.map((loc, index) => (
            <div 
              key={`${loc.filename}-${index}`}
              className="px-4 py-2 bg-[#00ff41]/5 border border-[#00ff41]/30 rounded-full text-sm font-mono text-[#00ff41]/80 shadow-[0_0_10px_rgba(0,255,65,0.05)] flex items-center space-x-2"
            >
              <div className="w-1.5 h-1.5 bg-[#00ff41] rounded-full animate-pulse"></div>
              <span>{loc.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
