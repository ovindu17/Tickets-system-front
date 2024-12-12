import React, { useState, useEffect } from 'react';
import InputField from './components/InputField';
import Button from './components/Button';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function BuyerDashboard() {
    const [ticketsToBuy, setTicketsToBuy] = useState('');
    const [totalCost, setTotalCost] = useState(null);
    const [validationMessage, setValidationMessage] = useState('');
    const [chartData, setChartData] = useState({
        labels: ['Unsold Tickets', 'Sold Tickets'],
        datasets: [{
            data: [0, 0],
            backgroundColor: ['#FF6384', '#36A2EB'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB']
        }]
    });
    const [username, setUsername] = useState('');
    const [ticketPrice, setTicketPrice] = useState(50); // Default ticket price

    const navigate = useNavigate();
    const location = useLocation();
    const buyerId = location.state?.buyerId;

    useEffect(() => {
        if (!buyerId) {
            navigate('/buyer/login');
            return;
        }

        const fetchChartData = async () => {
            try {
                const settingsResponse = await fetch('http://localhost:8080/settings/latest');
                if (!settingsResponse.ok) {
                    throw new Error('Failed to fetch the latest settings');
                }
                const settingsData = await settingsResponse.json();
                setTicketPrice(settingsData.ticketPrice);
                console.log(settingsData.ticketPrice)//; Set ticket price from settings

                const transactionsResponse = await fetch('http://localhost:8080/transactions/totals');
                if (!transactionsResponse.ok) {
                    throw new Error('Failed to fetch the total released tickets');
                }
                const transactionsData = await transactionsResponse.json();
                const totalSold = transactionsData.sold;
                const totalReleased = transactionsData.released;

                setChartData({
                    labels: ['Unsold Tickets', 'Sold Tickets'],
                    datasets: [{
                        data: [totalReleased, totalSold],
                        backgroundColor: ['#FF6384', '#36A2EB'],
                        hoverBackgroundColor: ['#FF6384', '#36A2EB']
                    }]
                });
            } catch (error) {
                console.error('Error fetching chart data:', error);
            }
        };

        fetchChartData();
        const interval = setInterval(fetchChartData, 5000);

        return () => clearInterval(interval);
    }, [buyerId, navigate]);

    useEffect(() => {
        const fetchUsername = async () => {
            try {
                const response = await fetch(`http://localhost:8080/buyers/${buyerId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch username');
                }
                const data = await response.json();
                setUsername(data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        if (buyerId) {
            fetchUsername();
        }
    }, [buyerId]);

    const handleShowCost = () => {
        const cost = ticketsToBuy * Number(ticketPrice);
        setTotalCost(cost);
    };

    const handleBuyTickets = async () => {
        try {
            const settingsResponse = await fetch('http://localhost:8080/settings/latest');
            if (!settingsResponse.ok) {
                throw new Error('Failed to fetch the latest settings');
            }
            const settingsData = await settingsResponse.json();
            const maxTickets = settingsData.maxTickets;
            const ticketPrice = settingsData.ticketPrice;

            const transactionsResponse = await fetch('http://localhost:8080/transactions/totals');
            if (!transactionsResponse.ok) {
                throw new Error('Failed to fetch the total released tickets');
            }
            const transactionsData = await transactionsResponse.json();
            const totalSold = transactionsData.sold;
            const unsoldTickets = transactionsData.unsold;

            if (unsoldTickets - ticketsToBuy < 0) {
                setValidationMessage('Cannot buy tickets. No unsold tickets available.');
                return;
            }

            const response = await fetch('http://localhost:8080/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userType: 'buyer',
                    ticketNo: parseInt(ticketsToBuy),
                    action: 'sold',
                    username: username,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to buy tickets: ${errorMessage}`);
            }

            setValidationMessage(`You have bought ${ticketsToBuy} tickets.`);
            setTicketsToBuy('');
            setTotalCost(null);
        } catch (error) {
            console.error(error.message);
            setValidationMessage(`Error: ${error.message}`);
        }
    };

    const handleLogout = () => {
        navigate('/buyer/login');
    };

    return (
        <div className="container2">
            <h2 style={{ textAlign: 'center' }}>Buyer Dashboard</h2>
            <div style={{ position: 'absolute', top: '10px', left: '400px', zIndex: 1 }}>
                <Button onClick={handleLogout} className="primary">
                    Logout
                </Button>
            </div>
            <h3 style={{ textAlign: 'center' }}>Welcome, {username}</h3>
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
            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
                <div style={{ width: '300px', height: '300px' }}>
                    <Pie
                        data={chartData}
                        options={{
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'bottom',
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default BuyerDashboard;