// src/AdminLogin.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';

function AdminLogin() {
    const navigate = useNavigate();

    const handleLogin = async ({ username, password }) => {
        const response = await fetch('http://localhost:8080/admins/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok) {
            throw new Error('Invalid credentials');
        }

        const data = await response.json();
        const adminId = data.id; // Assuming the response contains the admin ID

        navigate('/admin/dashboard', { state: { adminId } });
    };

    return <AuthForm type="login" title="Admin Login" onSubmit={handleLogin} />;
}

export default AdminLogin;