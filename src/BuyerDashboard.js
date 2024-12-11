import React, { useState } from 'react';
import InputField from './components/InputField';
import Button from './components/Button';
import { useLocation, useNavigate } from 'react-router-dom';

function BuyerDashboard() {
    const [ticketsToBuy, setTicketsToBuy] = useState('');
    const [totalCost, setTotalCost] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');
    const ticketPrice = 50;

    const navigate = useNavigate();
    const location = useLocation();
    const buyerId = location.state?.buyerId;

    const handleShowCost = () => {
        const cost = ticketsToBuy * ticketPrice;
        setTotalCost(cost);
    };

    const handleBuyTickets = async () => {
        try {
            // Fetch the total number of unsold tickets
            const settingsResponse = await fetch('http://localhost:8080/settings/latest');
            if (!settingsResponse.ok) {
                throw new Error('Failed to fetch the latest settings');
            }
            const settingsData = await settingsResponse.json();
            const maxTickets = settingsData.maxTickets;

            const transactionsResponse = await fetch('http://localhost:8080/transactions/totals');
            if (!transactionsResponse.ok) {
                throw new Error('Failed to fetch the total released tickets');
            }
            const transactionsData = await transactionsResponse.json();
            const totalReleased = transactionsData.released;
            const totalSold = transactionsData.sold;

            const unsoldTickets = transactionsData.unsold;
            console.log(unsoldTickets);

            // Validate the number of unsold tickets
            if (unsoldTickets-ticketsToBuy < 0) {
                setValidationMessage('Cannot buy tickets. No unsold tickets available.');
                return;
            }

            // Proceed with buying tickets
            const response = await fetch('http://localhost:8080/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userType: 'buyer',
                    ticketNo: parseInt(ticketsToBuy),
                    action: 'sold',
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to buy tickets: ${errorMessage}`);
            }

            setValidationMessage(`You have bought ${ticketsToBuy} tickets for a total cost of $${totalCost}.`);
            setTicketsToBuy('');
            setTotalCost(null);
        } catch (error) {
            console.error(error.message);
            setValidationMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className="container">
            <h2 style={{ textAlign: 'center' }}>Buyer Dashboard</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleBuyTickets(); }}>
                <InputField
                    label="Number of Tickets to Buy"
                    type="number"
                    value={ticketsToBuy}
                    onChange={(e) => setTicketsToBuy(e.target.value)}
                    required
                />
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button type="button" onClick={handleShowCost} className="primary">
                        Show Total Cost
                    </Button>
                </div>
                {totalCost !== null && (
                    <div style={{ color: 'green', marginTop: '20px', textAlign: 'center' }}>
                        Total Cost: ${totalCost}
                    </div>
                )}
                <div style={{ textAlign: 'center', marginTop: '10px' }}>
                    <Button type="submit" className="primary">
                        Buy Tickets
                    </Button>
                </div>
            </form>
            {validationMessage && (
                <div style={{ color: 'red', marginTop: '20px', textAlign: 'center' }}>
                    {validationMessage}
                </div>
            )}
        </div>
    );
}

export default BuyerDashboard;