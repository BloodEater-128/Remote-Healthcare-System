import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import HealthLogin from './login.jsx'
import PatientDashboard from './patient-dashboard.jsx'
import VitalsPage from './vitals.jsx'
import AlertsPage from './alerts.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HealthLogin />} />
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/vitals" element={<VitalsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>,
)
