// src/components/Button.js
import React from 'react';

function Button({ onClick, children, type = 'button', className = '', disabled = false }) {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{ padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
        >
            {children}
        </button>
    );
}

export default Button;