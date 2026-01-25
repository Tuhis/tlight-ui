import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Dropdown from './Dropdown';

describe('Dropdown', () => {
    const mockData = [
        { label: 'Option 1', value: 1 },
        { label: 'Option 2', value: 2 },
        { label: 'Option 3', value: 3 }
    ];

    const defaultProps = {
        data: mockData,
        selectedItemIndex: 0,
        onChange: jest.fn()
    };

    it('should render selected item initially', () => {
        render(<Dropdown {...defaultProps} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should open menu when clicked', () => {
        render(<Dropdown {...defaultProps} />);

        // Find the header/trigger. It renders selected item text.
        fireEvent.click(screen.getByText('Option 1'));

        // Now the list should be visible.
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should fire onChange when an item is selected', () => {
        const handleChange = jest.fn();
        render(<Dropdown {...defaultProps} onChange={handleChange} />);

        // Open
        fireEvent.click(screen.getByText('Option 1'));

        // Select Option 2
        fireEvent.click(screen.getByText('Option 2'));

        // Option 2 is at index 1.
        expect(handleChange).toHaveBeenCalledWith(mockData[1], 1);
    });

    it('should update selected item from props', () => {
        const { rerender } = render(<Dropdown {...defaultProps} />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();

        rerender(<Dropdown {...defaultProps} selectedItemIndex={2} />);
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
});
