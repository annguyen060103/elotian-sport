// src/App.tsx
import React, { JSX } from 'react';
import {
  Facility,
  Login,
  Student,
  Trainer,
  Payment,
  SubscriptionPlan,
  Course,
  Staff,
  MyCalendar,
  Timekeeping,
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
        path="/payment"
        element={
          <RequireAuth>
            <Payment />
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
      <Route
        path="/my-calendar"
        element={
          <RequireAuth>
            <MyCalendar />
          </RequireAuth>
        }
      />
      <Route
        path="/timekeeping"
        element={
          <RequireAuth>
            <Timekeeping />
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
