import React, { useState } from 'react';
import axios from 'axios';
import './InPatientEntry.css';
import api from '../api'

export default function InPatientEntry() {
  const [hospitalNo, setHospitalNo] = useState('');
  const [patient, setPatient] = useState(null);
  const [ward, setWard] = useState('');
  const [bedNo, setBedNo] = useState('');
  const [refDoctor, setRefDoctor] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    try {
      const res = await api.get(`/inpatients/${hospitalNo}`);
      setPatient(res.data);
      setMessage('');
    } catch (err) {
      setPatient(null);
      setMessage('Patient not found!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/inpatients', {
        hospitalNo,
        ward,
        bedNo,
        refDoctor
      });
      setMessage(res.data.message);
      setWard('');
      setBedNo('');
      setRefDoctor('');
      setPatient(null);
      setHospitalNo('');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error saving data');
    }
  };

  return (
    <div className="inpatient-container">
      <h2>In-Patient Entry</h2>

      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Hospital No"
          value={hospitalNo}
          onChange={(e) => setHospitalNo(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {message && <p className="message">{message}</p>}

      {patient && (
        <div className="patient-details">
          <h3>Patient Details</h3>
          <p><b>Name:</b> {patient.name}</p>
          <p><b>Age:</b> {patient.age}</p>
          <p><b>Sex:</b> {patient.sex}</p>
          <p><b>Address:</b> {patient.addressLine}, {patient.state}</p>
          <p><b>Phone:</b> {patient.phoneNumber}</p>

          <form onSubmit={handleSubmit}>
            <h4>In-Patient Information</h4>
            <label>Ward</label>
            <input value={ward} onChange={(e) => setWard(e.target.value)} required />

            <label>Bed No</label>
            <input value={bedNo} onChange={(e) => setBedNo(e.target.value)} required />

            <label>Ref Doctor Name</label>
            <input value={refDoctor} onChange={(e) => setRefDoctor(e.target.value)} required />

            <button type="submit">Save In-Patient Record</button>
          </form>
        </div>
      )}
    </div>
  );
}
