// src/AdminSettings.js
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import InputField from './components/InputField';
import Button from './components/Button';

function AdminSettings() {
    const location = useLocation();
    const adminId = location.state?.adminId;

    const [maxTickets, setMaxTickets] = useState('');
    const [releaseRate, setReleaseRate] = useState('');
    const [buyingRate, setBuyingRate] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [validationMessage, setValidationMessage] = useState('');

    const handleSave = async () => {
        if (parseInt(releaseRate) > parseInt(maxTickets)) {
            setValidationMessage('Release rate cannot be greater than the maximum number of tickets.');
            return;
        }
        setValidationMessage('');

        try {
            const response = await fetch(`http://localhost:8080/settings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    maxTickets: parseInt(maxTickets),
                    releaseRate: parseInt(releaseRate),
                    buyingRate: parseInt(buyingRate),
                    ticketPrice: parseInt(ticketPrice),
                    adminId: parseInt(adminId),

                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to update admin settings: ${errorMessage}`);
            }

            console.log('Admin settings updated successfully');
            console.log(adminId)    ;
        } catch (error) {
            console.error(error.message);
            setValidationMessage(error.message);
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Admin Settings</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSave(); }}>
                <InputField
                    label="Max Tickets"
                    type="number"
                    value={maxTickets}
                    onChange={(e) => setMaxTickets(e.target.value)}
                    required
                />
                <InputField
                    label="Release Rate"
                    type="number"
                    value={releaseRate}
                    onChange={(e) => setReleaseRate(e.target.value)}
                    max={maxTickets}
                    required
                />
                {validationMessage && (
                    <div style={{ color: 'red', marginBottom: '10px' }}>
                        {validationMessage}
                    </div>
                )}
                <InputField
                    label="Buying Rate"
                    type="number"
                    value={buyingRate}
                    onChange={(e) => setBuyingRate(e.target.value)}
                    required
                />
                <InputField
                    label="Price of a Ticket"
                    type="number"
                    value={ticketPrice}
                    onChange={(e) => setTicketPrice(e.target.value)}
                    required
                />
                <div style={{ textAlign: 'center' }}>
                    <Button type="submit" className="primary">
                        Save
                    </Button>
                </div>
            </form>
        </div>
    );
}

export default AdminSettings;