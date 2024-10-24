import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';
import baseURL from '../../auth/connection';
import '../../styles/admin/AdminCredits.css';

const AdminCredits = () => {
  const [selectedRegulation, setSelectedRegulation] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('');
  const [subjectData, setSubjectData] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [editSubjectId, setEditSubjectId] = useState(null);
  const [formData, setFormData] = useState({
    subject_code: '',
    subject_name: '',
    credits: '',
  });

  const navigate = useNavigate();

  const handleAddSubjectClick = () => {
    navigate('/admin/dashboard/credits/addcredits');
  };

  const handleFetchSubjects = async () => {
    if (!selectedRegulation || !selectedDepartment || !selectedSemester) {
      alert("Please fill in all fields: Regulation, Department, and Semester.");
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch(`${baseURL}/admin/fetchsubjects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          regulation: selectedRegulation,
          department: selectedDepartment,
          semester: selectedSemester,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subjects');
      }

      const data = await response.json();
      setSubjectData(data.subjects || []);
    } catch (error) {
      console.error('Error fetching subjects:', error);
      alert('Failed to fetch subjects: ' + error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleEditClick = (subject) => {
    setEditSubjectId(subject.id);
    setFormData({
      subject_code: subject.subject_code,
      subject_name: subject.subject_name,
      credits: subject.credits,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleUpdateSubject = async (subjectId) => {
    try {
      const response = await fetch(`${baseURL}/admin/subjects/update/${subjectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update subject');
      }

      alert('Subject updated successfully');
      setEditSubjectId(null);
      setFormData({ subject_code: '', subject_name: '', credits: '' });
      handleFetchSubjects(); // Refresh subjects after update
    } catch (error) {
      console.error('Error updating subject:', error);
      alert('Failed to update subject: ' + error.message);
    }
  };

  const handleDeleteSubject = async (subjectId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this subject?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${baseURL}/admin/subjects/delete/${subjectId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete subject');
      }

      alert('Subject deleted successfully');
      handleFetchSubjects(); // Refresh subjects after delete
    } catch (error) {
      console.error('Error deleting subject:', error);
      alert('Failed to delete subject: ' + error.message);
    }
  };

  const closeModal = () => {
    setEditSubjectId(null);
  };

  return (
    <div className="admin-cgpa-container">
      <div className="add-subject-btn-container">
        <button onClick={handleAddSubjectClick} className="add-subject-button">
          Add Credits
        </button>
      </div>

      <div className="input-section">
        <h2>Fetch Subjects</h2>
        <div className="input-group">
          <label>Regulation:</label>
          <select
            value={selectedRegulation}
            onChange={(e) => setSelectedRegulation(e.target.value)}
          >
            <option value="">Select Regulation</option>
            <option value="2017">2017</option>
            <option value="2021">2021</option>
          </select>
        </div>

        <div className="input-group">
          <label>Department:</label>
          <select
            value={selectedDepartment}
            onChange={(e) => setSelectedDepartment(e.target.value)}
          >
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="EEE">EEE</option>
            <option value="Mech">Mechanical</option>
            <option value="Civil">Civil</option>
          </select>
        </div>

        <div className="input-group">
          <label>Semester:</label>
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
          >
            <option value="">Select Semester</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
            <option value="7">7</option>
            <option value="8">8</option>
          </select>
        </div>

        <button onClick={handleFetchSubjects} className="fetch-subjects-button">
          {isFetching ? 'Fetching...' : 'Fetch Subjects'}
        </button>
      </div>

      {subjectData.length > 0 && (
        <div className="subject-box-container">
          {subjectData.map((subject) => (
            <div key={subject.id} className="subject-box">
              <div className="subject-details">
                <div className="subject-field">
                  <strong>Subject Code:</strong> {subject.subject_code}
                </div>
                <div className="subject-field">
                  <strong>Subject Name:</strong> {subject.subject_name}
                </div>
                <div className="subject-field">
                  <strong>Credits:</strong> {subject.credits}
                </div>
              </div>
              <div className="subject-actions">
                <button onClick={() => handleEditClick(subject)} className="action-button">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDeleteSubject(subject.id)} className="action-button">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Editing Subject */}
      {editSubjectId && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>Edit Subject</h3>
              <button onClick={closeModal} className="close-modal-button">
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdateSubject(editSubjectId); }}>
              <div className="input-group">
                <label>Subject Code:</label>
                <input
                  type="text"
                  name="subject_code"
                  value={formData.subject_code}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Subject Name:</label>
                <input
                  type="text"
                  name="subject_name"
                  value={formData.subject_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="input-group">
                <label>Credits:</label>
                <input
                  type="number"
                  name="credits"
                  value={formData.credits}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="save-button">Save</button>
              <button onClick={closeModal} className="cancel-button">Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCredits;
