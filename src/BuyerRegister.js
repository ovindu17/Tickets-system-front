import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthForm from './components/AuthForm';

function BuyerRegister() {
    const [successMessage, setSuccessMessage] = useState('');

    const handleRegister = async ({ username, password }) => {
        try {
            const response = await fetch('http://localhost:8080/buyers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            setSuccessMessage('Registration successful!');
        } catch (error) {
            console.error(error.message);
            setSuccessMessage('');
        }
    };

    return (
        <div>
            <AuthForm type="register" title="Buyer Register" onSubmit={handleRegister} />
            {successMessage && <div style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>{successMessage}</div>}
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <Link to="/buyer/login">Already have an account? Login here</Link>
            </div>
        </div>
    );
}

export default BuyerRegister;