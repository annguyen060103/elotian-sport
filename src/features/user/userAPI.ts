// src/features/user/userAPI.ts

import { API_URL, TOKEN_KEY } from '@/constants/env';

import axios from 'axios';

export const getAllUsers = async (token: string) => {
    const response = await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getUserById = async (userId: string, token: string) => {
    const response = await axios.get(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getUsersByRole = async (roleName: string, token: string) => {
    const response = await axios.get(`${API_URL}/users/role/${roleName}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getMyInfo = async (token: string) => {
    const response = await axios.get(`${API_URL}/users/my-info`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};


export const registerUser = async (userData: any, token: string) => {
    const response = await axios.post(`${API_URL}/users/registration`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const registerCoach = async (coachData: any, token: string) => {
    const response = await axios.post(
        `${API_URL}/users/registration-coach`,
        coachData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const updateUser = async (
    userId: string,
    userData: any,
    token: string
) => {
    const response = await axios.put(`${API_URL}/users/${userId}`, userData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const deleteUser = async (userId: string, token: string) => {
    const response = await axios.delete(`${API_URL}/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
