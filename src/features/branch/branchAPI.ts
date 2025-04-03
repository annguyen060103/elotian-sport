// src/features/branch/branchAPI.ts

import { API_URL } from "@/constants/env";
import axios from "axios";

export const getAllBranches = async (token: string) => {
    const response = await axios.get(`${API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getBranchById = async (branchId: string, token: string) => {
    const response = await axios.get(`${API_URL}/branches/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const createBranch = async (branchData: any, token: string) => {
    const response = await axios.post(`${API_URL}/branches`, branchData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const updateBranch = async (
    branchId: string,
    branchData: any,
    token: string
) => {
    const response = await axios.put(
        `${API_URL}/branches/${branchId}`,
        branchData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const deleteBranch = async (branchId: string, token: string) => {
    const response = await axios.delete(`${API_URL}/branches/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const addUserToBranch = async (
    branchId: string,
    userId: string,
    token: string
) => {
    const response = await axios.put(
        `${API_URL}/branches/${branchId}/add-user/${userId}`,
        {},
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const removeUserFromBranch = async (
    branchId: string,
    userId: string,
    token: string
) => {
    const response = await axios.delete(
        `${API_URL}/branches/${branchId}/delete-users/${userId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};
