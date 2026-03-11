import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import HealthLogin from './login.jsx'
import PatientDashboard from './patient-dashboard.jsx'
import VitalsPage from './vitals.jsx'
import AlertsPage from './alerts.jsx'
import JarvisChat from './jarvis-chat.jsx'
import LogoutPage from './logout.jsx'
import Medication from './medication.jsx'
import Reports from './reports.jsx'
import Settings from './settings.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <HashRouter>
            <Routes>
                <Route path="/" element={<HealthLogin />} />
                <Route path="/dashboard" element={<PatientDashboard />} />
                <Route path="/vitals" element={<VitalsPage />} />
                <Route path="/alerts" element={<AlertsPage />} />
                <Route path="/jarvis-chat" element={<JarvisChat />} />
                <Route path="/logout" element={<LogoutPage />} />
                <Route path="/medication" element={<Medication />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/settings" element={<Settings />} />
            </Routes>
        </HashRouter>
    </React.StrictMode>,
)
