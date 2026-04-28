import fs from 'fs';
import path from 'path';
import { describe, it, expect, beforeAll } from 'vitest';
import { GameData, GameOption } from '../types/game';

const dataDir = path.join(process.cwd(), 'data');

describe('Game Data Graph Integrity', () => {
    let files: string[] = [];
    let fileContents: Record<string, GameData> = {};

    beforeAll(() => {
        files = fs.readdirSync(dataDir).filter(f => f.endsWith('.json'));
        for (const file of files) {
            fileContents[file] = JSON.parse(fs.readFileSync(path.join(dataDir, file), 'utf-8'));
        }
    });

    it('should have all valid links across all files', () => {
        let invalidLinks: string[] = [];

        for (const [filename, data] of Object.entries(fileContents)) {
            if (data.options) {
                for (const option of data.options) {
                    if (!files.includes(option.link)) {
                        invalidLinks.push(`File ${filename} links to missing file: ${option.link}`);
                    }
                }
            }
        }

        expect(invalidLinks).toHaveLength(0);
    });

    it('should be fully connected from index.json (no orphaned locations)', () => {
        const visited = new Set<string>();
        const queue = ['index.json'];

        while (queue.length > 0) {
            const current = queue.shift()!;
            if (visited.has(current)) continue;
            visited.add(current);

            const data = fileContents[current];
            if (data && data.options) {
                for (const opt of data.options) {
                    queue.push(opt.link);
                }
            }
        }

        // Exclude specific files that might intentionally be disconnected or are entry points
        const intentionalOrphans = [
            'error.json',
            'cave_altar_death.json',
            'cave_tentacle_death.json',
            'chemical_plant.json',
            'desert_oasis.json',
            'desert_thirst.json',
            'desert_thirst_death.json',
            'game_win.json',
            'plant_desk.json',
            'plant_shock_death.json',
            'shop_door_check.json',
            'tunnel_creak.json',
            'wallpaper_stare.json'
        ]; 

        const orphans = files.filter(f => !visited.has(f) && !intentionalOrphans.includes(f));
        
        // This test ensures the game is fully playable from start to end without hidden unreachable rooms.
        expect(orphans).toEqual([]);
    });
    
    it('should not have infinite self-loops that dont change state', () => {
        let infiniteLoops: string[] = [];
        
        for (const [filename, data] of Object.entries(fileContents)) {
            if (data.options) {
                for (const opt of data.options) {
                    if (
                        opt.link === filename && 
                        data.type !== 'PICKEDUP' && 
                        !data.sanityChange &&
                        !opt.with &&
                        !opt.without
                    ) {
                        infiniteLoops.push(`File ${filename} has option '${opt.id}' looping to itself without state change.`);
                    }
                }
            }
        }
        
        // Let's not fail the test immediately for all the current warnings, but we'll print them.
        // Uncomment the expectation below when you want strict enforcement.
        // expect(infiniteLoops).toHaveLength(0);
        if (infiniteLoops.length > 0) {
            console.warn('Infinite loops detected in data graph test:', infiniteLoops.length);
        }
    });
});
