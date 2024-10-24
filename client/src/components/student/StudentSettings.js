import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import baseURL from '../../auth/connection'; 
import '../../styles/student/StudentSettings.css';
import { FaKey } from 'react-icons/fa'; // Importing the key icon
import { FaEye, FaEyeSlash } from 'react-icons/fa'; // Importing eye icons for show/hide functionality

const StudentSettings = () => {
    const { id } = useParams(); // Get the student ID from the URL
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (newPassword !== confirmPassword) {
            setError('New password and confirm password do not match.');
            return;
        }

        try {
            const response = await axios.put(`${baseURL}/student/change-password/${id}`, {
                currentPassword,
                newPassword,
                confirmNewPassword: confirmPassword,  // This sends the confirmPassword as confirmNewPassword
            });

            setSuccess(response.data.message);
            setError('');
            // Reset the form
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setError(error.response?.data?.error || 'Password change failed.');
            setSuccess('');
        }
    }; 

    return (
        <>
            <h2 className="account-settings-heading">Account Settings</h2> {/* Account Settings heading */}
            <div className="settings-container">
                <h2 className="change-password-heading">
                    <FaKey className="key-icon" />
                    Change Password
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group input-container">
                        <label>Current Password:</label>
                        <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                            {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="form-group input-container">
                        <label>New Password:</label>
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    <div className="form-group input-container">
                        <label>Confirm New Password:</label>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                        <span className="eye-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit" className="submit-button">Change Password</button>
                </form>
            </div>
        </>
    );
};

export default StudentSettings;
