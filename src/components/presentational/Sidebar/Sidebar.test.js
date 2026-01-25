import React from 'react';
import { render, screen } from '@testing-library/react';
import { Sidebar } from './Sidebar';

describe('Sidebar', () => {
    it('should render children content', () => {
        render(
            <Sidebar>
                <div data-testid="sidebar-content">Content</div>
            </Sidebar>
        );
        expect(screen.getByTestId('sidebar-content')).toBeInTheDocument();
        // Check structural class if possible, but children rendering is main responsibility
    });
});
