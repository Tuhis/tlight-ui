import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Slider from './Slider';

describe('Slider', () => {
    const defaultProps = {
        minValue: 0,
        maxValue: 100,
        value: 50,
        onChange: jest.fn()
    };

    it('should render with initial value', () => {
        render(<Slider {...defaultProps} />);
        const input = screen.getByRole('slider', { hidden: true }); // inputs type=range act as sliders
        // Note: getByRole('slider') might need hidden: true if styles hide it or semantic issues
        // Actually, input type="range" maps to role "slider"

        // Let's use getByRole or direct query
        // const slider = container.querySelector('input[type="range"]'); // fallback
        // expect(slider).toHaveValue('50');
        expect(screen.getByRole('slider')).toHaveValue('50');
    });

    it('should fire onChange when value changes', () => {
        const handleChange = jest.fn();
        render(<Slider {...defaultProps} onChange={handleChange} />);

        const slider = screen.getByRole('slider');
        fireEvent.change(slider, { target: { value: '75' } });

        expect(handleChange).toHaveBeenCalledWith({ value: 75 });
    });

    it('should respect min/max constraints', () => {
        const handleChange = jest.fn();
        render(<Slider {...defaultProps} minValue={0} maxValue={100} onChange={handleChange} />);

        const slider = screen.getByRole('slider');

        // Attempt to set above max (though input range normally clamps, our handler logic also does)
        // We need to simulate the change event which triggers handleChange

        // The component's handleChange does:
        // if (newValue > this.props.maxValue) newValue = this.props.maxValue;

        fireEvent.change(slider, { target: { value: '150' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 100 });

        fireEvent.change(slider, { target: { value: '-10' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 0 });
    });
});
