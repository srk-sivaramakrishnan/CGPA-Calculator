import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { useParams } from 'react-router-dom';
import baseURL from '../../auth/connection';
import '../../styles/student/StudentAnalytics.css';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables); // Register chart components

const StudentAnalytics = () => {
    const { id } = useParams();
    const [pieChartData, setPieChartData] = useState({});
    const [error, setError] = useState(null);
    const [uGradeCount, setUGradeCount] = useState(0); // State for U grade count
    const [modalVisible, setModalVisible] = useState(false); // State for modal visibility
    const [subjects, setSubjects] = useState([]); // State for subjects

    useEffect(() => {
        const fetchCGPAData = async () => {
            try {
                const response = await fetch(`${baseURL}/student/analytics/${id}`);
                if (!response.ok) throw new Error('Failed to fetch CGPA data');
                const data = await response.json();

                // Prepare data for the pie chart
                if (data && Array.isArray(data.pieChartData)) {
                    const labels = data.pieChartData.map(item => item.name);
                    const values = data.pieChartData.map(item => item.value);
                    setPieChartData({
                        labels: labels,
                        datasets: [{
                            data: values,
                            backgroundColor: ['#0088FE', '#FF8042'], // Colors for the chart
                        }],
                    });
                } else {
                    setPieChartData({});
                }
            } catch (error) {
                console.error('Error fetching CGPA data:', error);
                setError(error.message);
            }
        };

        const fetchUGradeCount = async () => {
            try {
                const response = await fetch(`${baseURL}/student/backlogs/${id}`);
                if (!response.ok) throw new Error('Failed to fetch U grade count');
                const data = await response.json();

                // Set the U grade count in state
                setUGradeCount(data.uGradeCount || 0);
            } catch (error) {
                console.error('Error fetching U grade count:', error);
                setError(error.message);
            }
        };

        fetchCGPAData();
        fetchUGradeCount();
    }, [id]);

    // Fetch subjects when the modal is opened
    const handleShowSubjects = async () => {
        try {
            const response = await fetch(`${baseURL}/student/subjects/backlogs/${id}`); // Assuming this is the correct endpoint
            if (!response.ok) throw new Error('Failed to fetch subjects');
            const data = await response.json();
            setSubjects(data.subjects || []); // Set only U grade subjects
        } catch (error) {
            console.error('Error fetching subjects:', error);
            setError(error.message);
        }
        setModalVisible(true); // Show modal after fetching data
    };
    

    const handleCloseModal = () => {
        setModalVisible(false); // Close modal
    };

    if (error) {
        return <div className="error-message">Error: {error}</div>;
    }

    // Check if pieChartData is empty
    if (!pieChartData.labels || pieChartData.labels.length === 0) {
        return <div className="no-data-message">No CGPA data available for this student.</div>;
    }

    return (
        <>
            <div className="analytics-container">
                <h2 className="analytics-title">CGPA Analytics for Student {id}</h2>
                <h3 className="analytics-subtitle">Student CGPA Distribution</h3>
                <div className="pie-chart-container">
                    <Pie data={pieChartData} />
                </div>
                {/* Display the dataset below the pie chart */}
                <div className="dataset-container">
                    <h4>Dataset:</h4>
                    <ul>
                        {pieChartData.labels.map((label, index) => (
                            <li key={index}>
                                {label}: {pieChartData.datasets[0].data[index].toFixed(2)}
                            </li>
                        ))}
                        <li>Total CGPA: 10.00</li> {/* Adding the Total CGPA entry */}
                    </ul>
                </div>
            </div>
            {/* Current Backlogs Section */}
            <div className="backlogs-container">
                <h4>
                    Current Backlogs: <span>{uGradeCount}</span>
                </h4>
                <button className="show-subjects-button" onClick={handleShowSubjects}>
                    Show Subjects
                </button>
            </div>

            {/* Modal for showing subjects */}
            {modalVisible && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Subjects</h3>
                        <button className="close-modal-button" onClick={handleCloseModal}>X</button>
                        <table>
                            <thead>
                                <tr>
                                    <th>Semester</th>
                                    <th>Subject Code</th>
                                    <th>Subject Name</th>
                                    <th>Grade</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subjects.length > 0 ? (
                                    subjects.map((subject, index) => (
                                        <tr key={index}>
                                            <td>{subject.semester}</td>
                                            <td>{subject.subject_code}</td>
                                            <td>{subject.subject_name}</td>
                                            <td>{subject.grade}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4">No subjects available.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </>
    );
};

export default StudentAnalytics;
