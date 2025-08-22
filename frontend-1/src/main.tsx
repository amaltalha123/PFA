import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import './tailwind.css';
import DashboardLayout from './pages/admin/DashboardLayout';
import DashboardLayoutEncadrant from './pages/encadrant/DashboardLayout';
import DashboardHomeEncadrant from  './pages/encadrant/DashboardHome'
import DashboardHome from './pages/admin/DashboardHome';
import AffectationsEncadrant from './pages/encadrant/affectations';
import AssignmentDetailEncadrant from './pages/encadrant/AssignmentDetail';


import DashboardLayoutStagiaire from './pages/stagiaire/DashboardLayout';
import DashboardHomeStagiaire from  './pages/stagiaire/DashboardHome'
import AffectationsStagiaire from './pages/stagiaire/affectations'
import AssignmentDetailStagiaire from './pages/stagiaire/AssignmentDetail';

import Users from './pages/admin/Users';
import Departments from './pages/admin/Departments';
import Assignments from './pages/admin/Assignments';
import ActivateAccount from './pages/ActivateAccount';
import AssignmentDetail from './pages/admin/AssignmentDetail';




ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/ActivateAccount" element={<ActivateAccount />} />
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="dashboard" element={<DashboardHome />} />
          <Route path="users" element={<Users />} />
          <Route path="departments" element={<Departments />} />
          <Route path="assignments" element={<Assignments />} />
          <Route path="assignments/:id" element={<AssignmentDetail />} /> 
        </Route>
        <Route path="/encadrant" element={<DashboardLayoutEncadrant />}>
        <Route index element={<DashboardHomeEncadrant />} />
        <Route path="dashboard" element={<DashboardHomeEncadrant />} />
        <Route path="affectations" element={<AffectationsEncadrant />} />
        <Route path="AssignmentDetailEncadrant" element={<AssignmentDetailEncadrant />}>
          <Route index element={<AssignmentDetailEncadrant />} />
          <Route path="detail/*" element={<AssignmentDetailEncadrant />} /> {/* Utilisez un astérisque pour les sous-routes */}
        </Route>
        </Route>
        <Route path="/stagiaire" element={<DashboardLayoutStagiaire />}>
        <Route index element={<DashboardHomeStagiaire />} />
        <Route path="dashboard" element={<DashboardHomeStagiaire />} />
        <Route path="affectations" element={<AffectationsStagiaire />} />
        <Route path="AssignmentDetailStagiaire" element={<AssignmentDetailStagiaire />}>
          <Route index element={<AssignmentDetailStagiaire />} />
          <Route path="detailStagiaire/*" element={<AssignmentDetailStagiaire />} /> {/* Utilisez un astérisque pour les sous-routes */}
        </Route>
      </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
