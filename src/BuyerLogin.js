import React from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Button from './components/Button';

function BuyerLogin() {
    const navigate = useNavigate();

    const handleLogin = async ({ username, password }) => {
        const response = await fetch('http://localhost:8080/buyers/login', {
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
        const buyerId = data.id; // Assuming the response contains the buyer ID
        console.log(buyerId);
        navigate('/buyer/dashboard', { state: { buyerId } });
    };

    return (
        <div>
            <AuthForm type="login" title="Buyer Login" onSubmit={handleLogin} />
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <p>Don't have an account?</p>
                <Button onClick={() => navigate('/buyer/register')} className="primary">
                    Register
                </Button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button onClick={() => navigate('/')} className="secondary">
                    Back
                </Button>
            </div>
        </div>
    );
}

export default BuyerLogin;