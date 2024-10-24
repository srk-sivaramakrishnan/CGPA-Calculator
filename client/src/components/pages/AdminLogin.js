import React, { useState } from 'react';
import axios from 'axios';
import baseURL from '../../auth/connection'; // Import the base URL
import { useNavigate } from 'react-router-dom';
// import './AdminLogin.css'; 

const AdminLogin = () => {
    const [adminId, setAdminId] = useState(''); // Updated state for admin_id
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${baseURL}/admin/login`, {
                admin_id: adminId, // Sending admin_idZZ
                password
            });

            if (response.data.message === 'Login successful') {
                // Redirect to dashboard
                navigate('/admin/dashboard/home');
            }
        } catch (error) {
            setError('Invalid admin ID or password'); // Updated error message
        }
    };

    return (
        <div className="login-container">
            <h2>Admin Login</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Admin ID:</label>
                    <input
                        type="text"
                        value={adminId}
                        onChange={(e) => setAdminId(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-btn">Login</button>
            </form>
        </div>
    );
};

export default AdminLogin;
