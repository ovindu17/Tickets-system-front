// src/components/InputField.js
import React from 'react';

function InputField({ label, type = 'text', value, onChange, required = false }) {
    return (
        <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                required={required}
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    boxSizing: 'border-box',
                }}
            />
        </div>
    );
}

export default InputField;