// src/features/facility/facilityAPI.ts

import { API_URL } from "@/constants/env";
import axios from "axios";

export const getAllFacilities = async (token: string) => {
    const response = await axios.get(`${API_URL}/facilities`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getFacilityById = async (facilityId: string, token: string) => {
    const response = await axios.get(`${API_URL}/facilities/${facilityId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export const getFacilitiesByBranch = async (branchId: string, token: string) => {
    const response = await axios.get(
        `${API_URL}/facilities/branches/${branchId}`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const createFacility = async (branchId: string, facilityData: any, token: string) => {
    const response = await axios.post(
        `${API_URL}/facilities/branches/${branchId}`,
        facilityData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const updateFacility = async (
    facilityId: string,
    facilityData: any,
    token: string
) => {
    const response = await axios.put(
        `${API_URL}/facilities/${facilityId}`,
        facilityData,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );
    return response.data;
};

export const deleteFacility = async (facilityId: string, token: string) => {
    const response = await axios.delete(`${API_URL}/facilities/${facilityId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
