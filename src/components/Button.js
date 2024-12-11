// src/components/Button.js
import React from 'react';

function Button({ onClick, children, type = 'button', className = '', disabled = false }) {
    return (
        <button
            type={type}
            className={`btn ${className}`}
            onClick={onClick}
            disabled={disabled}
            style={{
                padding: '12px 24px',
                borderRadius: '8px',
                cursor: 'pointer',
                backgroundColor: '#007bff',
                color: '#fff',
                border: 'none',
                fontSize: '16px',
                transition: 'background-color 0.3s ease, transform 0.2s ease',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            }}
            onMouseOver={(e) => {
                e.target.style.backgroundColor = '#0056b3';
                e.target.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
                e.target.style.backgroundColor = '#007bff';
                e.target.style.transform = 'scale(1)';
            }}
        >
            {children}
        </button>
    );
}

export default Button;