import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminLogin from './AdminLogin';
import AdminRegister from './AdminRegister';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/register" element={<AdminRegister />} />
            </Routes>
        </Router>
    );
}

export default App;