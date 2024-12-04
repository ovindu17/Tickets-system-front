// src/AdminDashboard.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from './components/InputField';
import Button from './components/Button';

function AdminDashboard() {
    const [ticketsToRelease, setTicketsToRelease] = useState('');
    const [releasedMessage, setReleasedMessage] = useState('');
    const navigate = useNavigate();

    const handleRelease = () => {
        setReleasedMessage(`${ticketsToRelease} tickets have been released to the pool.`);
        setTicketsToRelease('');
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2 style={{ textAlign: 'center' }}>Admin Dashboard</h2>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <Button onClick={() => navigate('/admin/settings')} className="primary">
                    Update Configuration
                </Button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleRelease(); }}>
                <InputField
                    label="Number of Tickets to Release"
                    type="number"
                    value={ticketsToRelease}
                    onChange={(e) => setTicketsToRelease(e.target.value)}
                    required
                />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button type="submit" className="primary">
                        Release to Pool
                    </Button>
                </div>
            </form>
            {releasedMessage && (
                <div style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>
                    {releasedMessage}
                </div>
            )}
        </div>
    );
}

export default AdminDashboard;