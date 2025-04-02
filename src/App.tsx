// src/App.tsx
import React, { JSX } from 'react';
import {
  Equipment,
  Login,
  Student,
  Trainer,
  Report,
  Token,
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
        path="/equipment"
        element={
          <RequireAuth>
            <Equipment />
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
        path="/token"
        element={
          <RequireAuth>
            <Token />
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
