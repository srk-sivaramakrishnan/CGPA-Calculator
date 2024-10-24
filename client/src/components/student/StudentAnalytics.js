import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import baseURL from '../../auth/connection'; 
import '../../styles/student/StudentAnalytics.css';
import 'chart.js/auto'; // Automatically register chart components

const StudentAnalytics = () => {
    const { id } = useParams(); // Get student ID from URL
    const [analyticsData, setAnalyticsData] = useState({
        attendance: [],
        marks: [],
        performance: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch analytics data from the backend
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${baseURL}/student/analytics/${id}`);
                setAnalyticsData(response.data);
            } catch (err) {
                console.error(err); // Log the error for debugging
                setError('Failed to fetch analytics data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loading">Loading...</div>;
    if (error) return <div className="error">{error}</div>;

    // Chart data for attendance
    const attendanceData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Attendance',
                backgroundColor: '#AD49E1',
                borderColor: '#9a39c4',
                borderWidth: 1,
                hoverBackgroundColor: '#9a39c4',
                hoverBorderColor: '#AD49E1',
                data: analyticsData.attendance.length ? analyticsData.attendance : [0, 0, 0, 0, 0, 0],
            },
        ],
    };

    // Chart data for marks
    const marksData = {
        labels: ['Math', 'Science', 'English', 'History', 'Computer'],
        datasets: [
            {
                label: 'Marks',
                data: analyticsData.marks.length ? analyticsData.marks : [0, 0, 0, 0, 0],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            },
        ],
    };

    // Chart data for performance
    const performanceData = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June'],
        datasets: [
            {
                label: 'Performance Trend',
                data: analyticsData.performance.length ? analyticsData.performance : [0, 0, 0, 0, 0, 0],
                fill: false,
                backgroundColor: '#AD49E1',
                borderColor: '#AD49E1',
            },
        ],
    };

    return (
        <div className="analytics-container">
            <h2>Student Analytics</h2>

            <div className="chart-section">
                <h3>Attendance Over Time</h3>
                <Bar data={attendanceData} />

                <h3>Marks Distribution</h3>
                <Doughnut data={marksData} />

                <h3>Performance Trend</h3>
                <Line data={performanceData} />
            </div>
        </div>
    );
};

export default StudentAnalytics;
