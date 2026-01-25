import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SliderAndInput from './SliderAndInput';

describe('SliderAndInput', () => {
    const defaultProps = {
        minValue: 0,
        maxValue: 100,
        value: 50,
        onChange: jest.fn()
    };

    it('should render both slider and input', () => {
        render(<SliderAndInput {...defaultProps} />);
        expect(screen.getByRole('slider')).toBeInTheDocument();
        expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('should sync value change from slider', () => {
        const handleChange = jest.fn();
        render(<SliderAndInput {...defaultProps} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('slider'), { target: { value: '75' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 75 });
    });

    it('should sync value change from input', () => {
        const handleChange = jest.fn();
        render(<SliderAndInput {...defaultProps} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: '25' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 25 });
    });
});
