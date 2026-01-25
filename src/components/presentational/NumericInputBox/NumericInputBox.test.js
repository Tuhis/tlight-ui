import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import NumericInputBox from './NumericInputBox';

describe('NumericInputBox', () => {
    const defaultProps = {
        minValue: 0,
        maxValue: 100,
        value: 50,
        onChange: jest.fn()
    };

    it('should render initial value', () => {
        render(<NumericInputBox {...defaultProps} />);
        expect(screen.getByRole('textbox')).toHaveValue('50');
    });

    it('should call onChange with parsed number', () => {
        const handleChange = jest.fn();
        render(<NumericInputBox {...defaultProps} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: '75' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 75 });
    });

    it('should clamp value to max', () => {
        const handleChange = jest.fn();
        render(<NumericInputBox {...defaultProps} maxValue={100} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: '150' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 100 });
    });

    it('should clamp value to min', () => {
        const handleChange = jest.fn();
        render(<NumericInputBox {...defaultProps} minValue={0} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: '-10' } });
        expect(handleChange).toHaveBeenCalledWith({ value: 0 });
    });

    it('should ignore NaN input', () => {
        const handleChange = jest.fn();
        render(<NumericInputBox {...defaultProps} onChange={handleChange} />);

        fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });
        expect(handleChange).not.toHaveBeenCalled();
    });
});
