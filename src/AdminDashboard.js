import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Pie } from 'react-chartjs-2';
import InputField from './components/InputField';
import Button from './components/Button';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function AdminDashboard() {
    // Initializing state variables
    const [ticketsToRelease, setTicketsToRelease] = useState('');
    const [releasedMessage, setReleasedMessage] = useState('');
    const [chartData, setChartData] = useState({
        labels: ['Released', 'Sold', 'Max Tickets'],
        datasets: [{
            data: [0, 0, 0],
            backgroundColor: ['#f18278', '#49b1f3', '#FFCE56'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
        }]
    });
    const [transactions, setTransactions] = useState([]);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const adminId = location.state?.adminId;

    // Checking if adminId is present, if not, navigating to login page
    useEffect(() => {
        if (!adminId) {
            navigate('/admin/login');
            return;
        }

        // Fetching username based on adminId
        const fetchUsername = async () => {
            try {
                const response = await fetch(`http://localhost:8080/admins/${adminId}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch username');
                }
                const data = await response.json();
                setUsername(data.username);
            } catch (error) {
                console.error('Error fetching username:', error);
            }
        };

        fetchUsername();
    }, [adminId, navigate]);

    // Fetching transactions periodically
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await fetch('http://localhost:8080/transactions');
                if (!response.ok) {
                    throw new Error('Failed to fetch transactions');
                }
                const data = await response.json();
                setTransactions(data);
            } catch (error) {
                console.error('Error fetching transactions:', error);
            }
        };

        fetchTransactions();
        const interval = setInterval(fetchTransactions, 5000);

        return () => clearInterval(interval);
    }, []);

    // Fetching chart data periodically
    useEffect(() => {
        const interval = setInterval(() => {
            Promise.all([
                fetch('http://localhost:8080/transactions/totals').then(response => response.json()),
                fetch('http://localhost:8080/settings/latest').then(response => response.json())
            ])
                .then(([transactionsData, settingsData]) => {
                    setChartData({
                        labels: ['Released', 'Sold', 'Max Tickets'],
                        datasets: [{
                            data: [transactionsData.released, transactionsData.sold, settingsData.maxTickets],
                            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
                            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
                        }]
                    });
                })
                .catch(error => console.error('Error fetching data:', error));
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    // Handling ticket release
    const handleRelease = async () => {
        try {
            const settingsResponse = await fetch('http://localhost:8080/settings/latest');
            if (!settingsResponse.ok) {
                throw new Error('Failed to fetch the latest settings');
            }
            const settingsData = await settingsResponse.json();
            const maxTickets = settingsData.maxTickets;
            const maxReleaseRate = settingsData.releaseRate;

            const transactionsResponse = await fetch('http://localhost:8080/transactions/totals');
            if (!transactionsResponse.ok) {
                throw new Error('Failed to fetch the total released tickets');
            }
            const transactionsData = await transactionsResponse.json();
            const totalReleased = transactionsData.released;

            if (parseInt(ticketsToRelease) > maxReleaseRate) {
                setReleasedMessage(`Cannot release more than ${maxReleaseRate} tickets at a time.`);
                return;
            }

            if (totalReleased + parseInt(ticketsToRelease) > maxTickets) {
                setReleasedMessage(`Cannot release tickets. Total released tickets would exceed the maximum limit of ${maxTickets}.`);
                return;
            }

            const response = await fetch('http://localhost:8080/transactions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userType: 'admin',
                    ticketNo: parseInt(ticketsToRelease),
                    action: 'released',
                    username: username,
                }),
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(`Failed to release tickets: ${errorMessage}`);
            }

            setReleasedMessage(`${ticketsToRelease} tickets have been released to the pool.`);
            setTicketsToRelease('');
        } catch (error) {
            console.error(error.message);
            setReleasedMessage(`Error: ${error.message}`);
        }
    };

    // Handling logout
    const handleLogout = () => {
        navigate('/admin/login');
    };

    return (
        <div className="container2">
            <h2 style={{ textAlign: 'center' }}>Admin Dashboard</h2>
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                <Button onClick={handleLogout} className="primary">
                    Logout
                </Button>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Button onClick={() => navigate('/admin/settings', { state: { adminId } })} className="primary">
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
                <div style={{ flex: 1, marginLeft: '20px' }}>
                    <h3>Transaction History</h3>
                    <div className="transaction-history">
                        {transactions.map((transaction, index) => (
                            <div key={index}>
                                <strong>{transaction.userType}</strong>: {transaction.ticketNo} tickets {transaction.action} {transaction.username}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;