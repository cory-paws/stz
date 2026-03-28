import { render, screen, fireEvent } from '@testing-library/react';
import { InventoryManager } from '../components/InventoryManager';

describe('InventoryManager Component', () => {
    it('does not render when inventory is empty', () => {
        const { container } = render(<InventoryManager inventory={{}} onDropItem={jest.fn()} />);
        expect(container.firstChild).toBeNull();
    });

    it('renders items in the inventory', () => {
        const inventory = {
            'cattleprod': true,
            'apple': true,
            'key': false
        };
        render(<InventoryManager inventory={inventory} onDropItem={jest.fn()} />);

        expect(screen.getByText('Inventory')).toBeInTheDocument();
        expect(screen.getByText('cattleprod')).toBeInTheDocument();
        expect(screen.getByText('apple')).toBeInTheDocument();
        expect(screen.queryByText('key')).not.toBeInTheDocument();
    });

    it('calls onDropItem when Drop button is clicked', () => {
        const handleDropItem = jest.fn();
        const inventory = { 'cattleprod': true };

        render(<InventoryManager inventory={inventory} onDropItem={handleDropItem} />);

        const dropButton = screen.getByText('Drop');
        fireEvent.click(dropButton);

        expect(handleDropItem).toHaveBeenCalledWith('cattleprod');
        expect(handleDropItem).toHaveBeenCalledTimes(1);
    });
});
