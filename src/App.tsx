// src/App.tsx
import React, { JSX } from 'react';
import {
  Facility,
  Login,
  Student,
  Trainer,
  Report,
  SubscriptionPlan,
  Admin,
  Course,
  Staff,
} from '@/pages';
import { Navigate, Route, Routes } from 'react-router-dom';
import { PrimaryHeader } from '@/components/PrimaryHeader';

import './App.css';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/course" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <RequireAuth>
            <Admin />
          </RequireAuth>
        }
      />
      <Route
        path="/course"
        element={
          <RequireAuth>
            <Course />
          </RequireAuth>
        }
      />
      <Route
        path="/trainer"
        element={
          <RequireAuth>
            <Trainer />
          </RequireAuth>
        }
      />
      <Route
        path="/student"
        element={
          <RequireAuth>
            <Student />
          </RequireAuth>
        }
      />
      <Route
        path="/staff"
        element={
          <RequireAuth>
            <Staff />
          </RequireAuth>
        }
      />
      <Route
        path="/Facility"
        element={
          <RequireAuth>
            <Facility />
          </RequireAuth>
        }
      />
      <Route
        path="/report"
        element={
          <RequireAuth>
            <Report />
          </RequireAuth>
        }
      />
      <Route
        path="/subscription-plan"
        element={
          <RequireAuth>
            <SubscriptionPlan />
          </RequireAuth>
        }
      />
    </Routes>
  );
}

function RequireAuth({ children }: { children: JSX.Element }) {
  return (
    <>
      <PrimaryHeader />
      {children}
    </>
  );
}
