// src/interfaces/User.ts

export interface User {
  userId: string;
  username: string | null;
  fullName: string;
  email: string;
  phone: string | null;
  gender: string | null;
  dob: string | null;
  cccd: string | null;
  address: string | null;
  height: number | 0;
  weight: number | 0;
  healthIssues: string | null;
  roles: string[];
  status: string;
  imageUrl: string | null;
  coachId: string;
  branchId: string;
  balance: number | 0;
  createdAt: string;
  updatedAt: string;
  salary: number | null;
  specialization: string | null;
  experienceYears: number | null;
  certifications: string | null;
  password: string;
}
