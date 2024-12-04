// src/AdminRegister.js
import React from 'react';
import AuthForm from './components/AuthForm';

function AdminRegister() {
    const handleRegister = async ({ username, password }) => {
        const response = await fetch('http://localhost:8080/admins/register', {
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

    return <AuthForm type="register" title="Admin Register" onSubmit={handleRegister} />;
}

export default AdminRegister;