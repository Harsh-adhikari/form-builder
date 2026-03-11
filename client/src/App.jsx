import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar'
import AdminFormsList from './pages/AdminFormsList'
import AdminFormBuilder from './pages/AdminFormBuilder'
import FillForm from './pages/FillForm'
import FormResponses from './pages/FormResponses'
import './index.css';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="page-container">
        <Routes>
          <Route path="/"                          element={<Navigate to="/admin/forms" />} />
          <Route path="/admin/forms"               element={<AdminFormsList />} />
          <Route path="/admin/create-form"         element={<AdminFormBuilder />} />
          <Route path="/admin/edit-form/:id"       element={<AdminFormBuilder />} />
          <Route path="/admin/responses/:formId"   element={<FormResponses />} />
          <Route path="/form/:id"                  element={<FillForm />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
