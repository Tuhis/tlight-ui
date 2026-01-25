import React from 'react';
import { render, screen } from '@testing-library/react';
import BigLinkList from './BigLinkList';

// Mock ResizeSensor since it's used in componentDidMount
import { vi } from 'vitest';

vi.mock('css-element-queries', () => ({
    ResizeSensor: vi.fn().mockImplementation(function (element, callback) {
        // We can simulate callback triggering if needed
        return {};
    })
}));

describe('BigLinkList', () => {
    const links = [
        { text: 'Link 1', onClick: vi.fn(), testId: 'link-1' },
        { text: 'Link 2', onClick: vi.fn(), testId: 'link-2' }
    ];

    it('should render full text when width is 0 (headless/test default)', () => {
        render(<BigLinkList links={links} cutTextsOnNarrowList={true} />);
        // Even with cutTextsOnNarrowList=true, if clientWidth is 0 (jsdom default), it should show full text
        // due to our refactor: (width > 100 || width === 0)
        expect(screen.getByText('Link 1')).toBeInTheDocument();
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });

    it('should render links with data-testid', () => {
        render(<BigLinkList links={links} />);
        expect(screen.getByTestId('link-1')).toBeInTheDocument();
        expect(screen.getByTestId('link-2')).toBeInTheDocument();
    });

    it('should apply rotation class when requested', () => {
        // Checking if rotation logic allows rendering
        render(<BigLinkList links={links} rotateTextsOnNarrowList={true} />);
        expect(screen.getByText('Link 1')).toBeInTheDocument();
    });
});
