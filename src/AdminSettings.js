import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import InputField from './components/InputField';
import Button from './components/Button';

function AdminSettings() {
    // Getting the location and adminId from the state
    const location = useLocation();
    const adminId = location.state?.adminId;

    // Initializing state variables
    const [maxTickets, setMaxTickets] = useState('');
    const [releaseRate, setReleaseRate] = useState('');
    const [buyingRate, setBuyingRate] = useState('');
    const [ticketPrice, setTicketPrice] = useState('');
    const [validationMessage, setValidationMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Checking if adminId is present, if not, navigating to login page
    useEffect(() => {
        if (!adminId) {
            navigate('/admin/login');
            return;
        }

        // Fetching the latest settings
        const fetchLatestSettings = async () => {
            try {
                const response = await fetch('http://localhost:8080/settings/latest');
                if (!response.ok) {
                    throw new Error('Failed to fetch the latest settings');
                }
                const data = await response.json();
                setMaxTickets(data.maxTickets);
                setReleaseRate(data.releaseRate);
                setBuyingRate(data.buyingRate);
                setTicketPrice(data.ticketPrice);
            } catch (error) {
                console.error('Error fetching latest settings:', error);
            }
        };

        fetchLatestSettings();
    }, [adminId, navigate]);

    // Handling the save action
    const handleSave = async () => {
        if (parseInt(releaseRate) > parseInt(maxTickets)) {
            setValidationMessage('Release rate cannot be greater than the maximum number of tickets.');
            return;
        }
        setValidationMessage('');
        setSuccessMessage('');

        try {
            const response = await fetch('http://localhost:8080/settings', {
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

            setSuccessMessage('Settings updated successfully.');
        } catch (error) {
            console.error(error.message);
            setValidationMessage(error.message);
        }
    };

    // Handling the back action
    const handleBack = () => {
        navigate('/admin/dashboard', { state: { adminId } });
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
                {successMessage && (
                    <div style={{ color: 'green', marginBottom: '10px' }}>
                        {successMessage}
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
            <div style={{ textAlign: 'center', marginTop: '10px' }}>
                <Button type="button" onClick={handleBack} className="secondary">
                    Back
                </Button>
            </div>
        </div>
    );
}

export default AdminSettings;