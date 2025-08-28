import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import PatientForm from './pages/PatientForm.jsx'
import PatientsList from './pages/PatientsList.jsx'
import Analytics from './pages/Analytics.jsx'

const root = createRoot(document.getElementById('root'))
root.render(
  <BrowserRouter>
    <Routes>
      {/* Login is now the index ("/") */}
      <Route path="/" element={<Login />} />

      {/* Protected routes inside App */}
      <Route path="/" element={<App />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="new" element={<PatientForm />} />
        <Route path="patients" element={<PatientsList />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>
)
