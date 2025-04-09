// src/features/classSchedule/classScheduleSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createFixedSchedules,
    deleteSchedule,
    filterSchedules,
    getAllSchedules,
    getScheduleById,
    getSchedulesByBranch,
} from "./classScheduleAPI";

import { ClassSchedule } from "@/interfaces/ClassSchedule";

interface ClassScheduleState {
    schedules: ClassSchedule[];
    currentSchedule: ClassSchedule | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClassScheduleState = {
    schedules: [],
    currentSchedule: null,
    loading: false,
    error: null,
};

// Async Thunks
export const fetchAllSchedules = createAsyncThunk(
    "schedules/all",
    async (token: string) => {
        const res = await getAllSchedules(token);
        return res.result;
    }
);

export const fetchScheduleById = createAsyncThunk(
    "schedules/byId",
    async ({ id, token }: { id: string; token: string }) => {
        const res = await getScheduleById(id, token);
        return res.result;
    }
);

export const fetchByBranch = createAsyncThunk(
    "schedules/byBranch",
    async ({ branchId, token }: { branchId: string; token: string }) => {
        const res = await getSchedulesByBranch(branchId, token);
        return res.result;
    }
);

export const filterByQuery = createAsyncThunk(
    "schedules/filter",
    async ({ query, token }: { query: Record<string, any>; token: string }) => {
        const res = await filterSchedules(query, token);
        return res.result;
    }
);

export const createFixed = createAsyncThunk(
    "schedules/createFixed",
    async ({
        query,
        body,
        token,
    }: {
        query: { classType: string; shift: string; weekMode: string };
        body: any;
        token: string;
    }) => {
        const res = await createFixedSchedules(query, body, token);
        return res.result;
    }
);

export const deleteById = createAsyncThunk(
    "schedules/delete",
    async ({ id, token }: { id: string; token: string }) => {
        const res = await deleteSchedule(id, token);
        return { id };
    }
);

// Slice
const scheduleSlice = createSlice({
    name: "classSchedule",
    initialState,
    reducers: {
        clearSchedules: (state) => {
            state.schedules = [];
            state.currentSchedule = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all
            .addCase(fetchAllSchedules.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSchedules.fulfilled, (state, action) => {
                state.loading = false;
                state.schedules = action.payload;
            })
            .addCase(fetchAllSchedules.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to load schedules";
            })

            // By ID
            .addCase(fetchScheduleById.fulfilled, (state, action) => {
                state.currentSchedule = action.payload;
            })

            // By branch
            .addCase(fetchByBranch.fulfilled, (state, action) => {
                state.schedules = action.payload;
            })

            // Filter
            .addCase(filterByQuery.fulfilled, (state, action) => {
                state.schedules = action.payload;
            })

            // Create fixed
            .addCase(createFixed.fulfilled, (state, action) => {
                state.schedules.push(...action.payload);
            })

            // Delete
            .addCase(deleteById.fulfilled, (state, action) => {
                state.schedules = state.schedules.filter(
                    (s) => s.classScheduleId !== action.payload.id
                );
            });
    },
});

export const { clearSchedules } = scheduleSlice.actions;
export default scheduleSlice.reducer;
