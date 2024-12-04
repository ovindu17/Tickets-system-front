// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminRegister from './AdminRegister';
import BuyerLogin from './BuyerLogin';
import BuyerRegister from './BuyerRegister';
import LoginOptions from './LoginOptions';
import AdminSettings from './AdminSettings';
import AdminDashboard from './AdminDashboard';
import BuyerDashboard from './BuyerDashboard';


function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginOptions />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/buyer/login" element={<BuyerLogin />} />
                <Route path="/buyer/register" element={<BuyerRegister />} />
                <Route path="/buyer/dashboard" element={<BuyerDashboard />} />

            </Routes>
        </Router>
    );
}

export default App;