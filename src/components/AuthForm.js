// src/AuthForm.js
import React, { useState } from 'react';
import Button from './Button';
import InputField from './InputField';

function AuthForm({ type,title, onSubmit }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (type === 'register' && password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        try {
            await onSubmit({ username, password });
        } catch (error) {
            setMessage(error.message);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>{title}</h2>
            <form onSubmit={handleSubmit}>
                <InputField
                    label="Username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <InputField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {type === 'register' && (
                    <InputField
                        label="Confirm Password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                )}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Button type="submit" className="primary">
                        {type}
                    </Button>
                </div>
            </form>
            {message && <p style={{ textAlign: 'center', color: 'red' }}>{message}</p>}
        </div>
    );
}

export default AuthForm;