import React from 'react';
import { ChromePicker } from 'react-color';
import PropTypes from 'prop-types';
import styles from './ColorWrapper.module.css';

const ColorWrapper = ({ r, g, b, onChange }) => {
    const color = { r: r || 0, g: g || 0, b: b || 0 };

    const handleChange = (colorResult) => {
        onChange({
            r: colorResult.rgb.r,
            g: colorResult.rgb.g,
            b: colorResult.rgb.b
        });
    };

    const pickerStyles = {
        default: {
            picker: {
                width: '100%', // Fix overflow
                background: 'transparent',
                boxShadow: 'none',
                borderRadius: '0',
                fontFamily: 'inherit'
            },
            body: {
                backgroundColor: 'transparent',
                padding: '10px 0 0 0',
            },
            active: {
                display: 'none'
            },
            controls: {
                display: 'none'
            },
            saturation: {
                paddingBottom: '40%' // Make it shorter (default 55%)
            },
            input: {
                color: '#fff',
                fontFamily: 'inherit',
                backgroundColor: 'rgba(0,0,0,0.2)',
                boxShadow: 'none',
                border: '1px solid rgba(255,255,255,0.2)',
            },
            label: {
                color: '#fff',
                fontFamily: 'inherit',
                textTransform: 'uppercase',
                fontSize: '10px',
            },
            svg: {
                fill: '#fff !important',
            },
            hue: {
            }
        }
    };

    return (
        <div className={styles['minimal-color-picker']} style={{ display: 'flex', width: '100%', maxWidth: '250px', margin: '0 auto 10px auto' }}>
            <ChromePicker
                color={color}
                onChange={handleChange}
                disableAlpha={true}
                styles={pickerStyles}
            />
        </div>
    );
};

ColorWrapper.propTypes = {
    r: PropTypes.number,
    g: PropTypes.number,
    b: PropTypes.number,
    onChange: PropTypes.func.isRequired
};

export default ColorWrapper;
