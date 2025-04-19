import { API_URL } from "@/constants/env";
import axios from "axios";

export const getAllSchedules = async (token: string) => {
    const res = await axios.get(`${API_URL}/class-schedules`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const getScheduleById = async (id: string, token: string) => {
    const res = await axios.get(`${API_URL}/class-schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const getSchedulesByBranch = async (branchId: string, token: string) => {
    const res = await axios.get(`${API_URL}/class-schedules/branch/${branchId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const filterSchedules = async (query: Record<string, any>, token: string) => {
    const params = new URLSearchParams(query as any).toString();
    const res = await axios.get(`${API_URL}/class-schedules/filter?${params}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const createFixedSchedules = async (
    query: { classType: string; shift: string; weekMode: string },
    body: any,
    token: string
) => {
    const queryStr = new URLSearchParams(query).toString();
    const res = await axios.post(`${API_URL}/class-schedules/fixed?${queryStr}`, body, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};

export const deleteSchedule = async (id: string, token: string) => {
    const res = await axios.delete(`${API_URL}/class-schedules/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return res.data;
};
