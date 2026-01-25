import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BaseCard from './BaseCard';

describe('BaseCard', () => {
    it('should render title and children', () => {
        render(
            <BaseCard title="My Card">
                <div data-testid="content">Child Content</div>
            </BaseCard>
        );
        expect(screen.getByText('My Card')).toBeInTheDocument();
        expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should show editable title input when editableTitle is true', () => {
        render(<BaseCard title="Edit Me" editableTitle={true} />);
        expect(screen.getByRole('textbox')).toHaveValue('Edit Me');
        expect(screen.queryByText('Edit Me', { selector: 'h2' })).not.toBeInTheDocument();
    });

    it('should call onTitleChange when input changes', () => {
        const handleTitleChange = jest.fn();
        render(<BaseCard title="Edit Me" editableTitle={true} onTitleChange={handleTitleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'New Title' } });
        expect(handleTitleChange).toHaveBeenCalledWith('New Title');
    });

    it('should not show title if showTitle is false', () => {
        render(<BaseCard title="Hidden" showTitle={false} />);
        expect(screen.queryByText('Hidden')).not.toBeInTheDocument();
    });
});
