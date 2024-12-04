// src/BuyerRegister.js
import React from 'react';
import AuthForm from './components/AuthForm';

function BuyerRegister() {
    const handleRegister = async ({ username, password }) => {
        const response = await fetch('http://localhost:8080/buyers/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Registration failed');
        }
    };

    return <AuthForm type="register" title="Buyer Register" onSubmit={handleRegister} />;
}

export default BuyerRegister;