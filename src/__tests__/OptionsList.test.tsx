import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { OptionsList } from '../components/OptionsList';
describe('OptionsList Component', () => {
    const mockOptions = [
        { id: '1', desc: 'Go North', link: 'north.json' },
        { id: '2', desc: 'Use Key', link: 'open.json', with: 'key' },
        { id: '3', desc: 'Break door', link: 'break.json', without: 'key' }
    ];

    it('renders base options and handles click', () => {
        const handleClick = vi.fn();
        render(
            <OptionsList
                options={[mockOptions[0]]}
                inventory={{}}
                droppedItems={[]}
                linesCount={1}
                onOptionClick={handleClick}
                onPickupDroppedItem={vi.fn()}
            />
        );

        const option = screen.getByText('Go North');
        expect(option).toBeInTheDocument();

        fireEvent.click(option);
        expect(handleClick).toHaveBeenCalledWith('north.json');
    });

    it('shows options requiring an item only if present', () => {
        const { rerender } = render(
            <OptionsList
                options={mockOptions}
                inventory={{}}
                droppedItems={[]}
                linesCount={1}
                onOptionClick={vi.fn()}
                onPickupDroppedItem={vi.fn()}
            />
        );

        // Without key
        expect(screen.getByText('Go North')).toBeInTheDocument();
        expect(screen.queryByText('Use Key')).not.toBeInTheDocument();
        expect(screen.getByText('Break door')).toBeInTheDocument();

        // With key
        rerender(
            <OptionsList
                options={mockOptions}
                inventory={{ 'key': true }}
                droppedItems={[]}
                linesCount={1}
                onOptionClick={vi.fn()}
                onPickupDroppedItem={vi.fn()}
            />
        );

        expect(screen.getByText('Go North')).toBeInTheDocument();
        expect(screen.getByText('Use Key')).toBeInTheDocument();
        expect(screen.queryByText('Break door')).not.toBeInTheDocument();
    });

    it('renders dropped items and handles pickup', () => {
        const handlePickup = vi.fn();
        render(
            <OptionsList
                options={[]}
                inventory={{}}
                droppedItems={['cattleprod']}
                linesCount={1}
                onOptionClick={vi.fn()}
                onPickupDroppedItem={handlePickup}
            />
        );

        const pickupItem = screen.getByText('Pick up cattleprod');
        expect(pickupItem).toBeInTheDocument();

        fireEvent.click(pickupItem);
        expect(handlePickup).toHaveBeenCalledWith('cattleprod');
    });
});
