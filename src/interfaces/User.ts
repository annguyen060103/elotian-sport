// src/interfaces/User.ts

export interface User {
    userId: string;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    gender: string;
    dob: string;
    cccd: string;
    address: string;
    height: number;
    weight: number;
    healthIssues: string;
    roles: string[];
    status: string;
    imageUrl: string | null;
    coachId: string | null;
    branchId: string;
    balance: number;
    createdAt: string;
    updatedAt: string;
    salary: number | null;
    specialization: string | null;
    experienceYears: number | null;
    certifications: string | null;
}
