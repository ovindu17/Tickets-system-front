import { useEffect } from 'react';
import {useLocation, useNavigate} from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();

    const isAuthenticated = !!localStorage.getItem('authToken'); // Example check, adjust as needed

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    return isAuthenticated;
};

export default useAuth;