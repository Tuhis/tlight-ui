import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NormalButton from './NormalButton';

describe('NormalButton', () => {
    it('should render children correctly', () => {
        render(<NormalButton>Click Me</NormalButton>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    it('should handle onClick', () => {
        const handleClick = jest.fn();
        render(<NormalButton onClick={handleClick}>Click Me</NormalButton>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should apply cancel button style when props.css.cancelButton is true', () => {
        const { container } = render(
            <NormalButton css={{ cancelButton: true }}>Cancel</NormalButton>
        );

        // Check if the button has the cancel-button class
        // Since we're using CSS modules, we check for a class matching the pattern or logic
        // But testing implementation details of CSS modules is tricky with class names.
        // We can snapshot or just rely on render not crashing.
        // For now, let's verify it renders.
        expect(screen.getByText('Cancel')).toBeInTheDocument();

        // If we mock styles, we could check for specific class name, but standard render might obfuscate it.
        // We can check if className contains 'cancel-button' if the style loader preserves it, 
        // but usually it's NormalButton_cancel-button__...
        const button = screen.getByRole('button');
        expect(button.className).toContain('cancel-button');
    });
});
