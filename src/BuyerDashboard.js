// src/BuyerDashboard.js
import React, { useState } from 'react';
import InputField from './components/InputField';
import Button from './components/Button';

function BuyerDashboard() {
    const [ticketsToBuy, setTicketsToBuy] = useState('');
    const [totalCost, setTotalCost] = useState(null);
    const ticketPrice = 50; // Assuming each ticket costs $50

    const handleShowCost = () => {
        const cost = ticketsToBuy * ticketPrice;
        setTotalCost(cost);
    };

    const handleBuyTickets = () => {
        alert(`You have bought ${ticketsToBuy} tickets for a total cost of $${totalCost}.`);
        setTicketsToBuy('');
        setTotalCost(null);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
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
        </div>
    );
}

export default BuyerDashboard;