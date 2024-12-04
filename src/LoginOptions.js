// src/LoginOptions.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './components/Button';

function LoginOptions() {
    const navigate = useNavigate();

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px', textAlign: 'center' }}>
            <h2>Login Options</h2>
            <div style={{ marginBottom: '15px' }}>
                <Button onClick={() => navigate('/admin/login')} className="primary">
                    Admin Login
                </Button>
            </div>
            <div>
                <Button onClick={() => navigate('/buyer/login')} className="primary">
                    Buyer Login
                </Button>
            </div>
        </div>
    );
}

export default LoginOptions;