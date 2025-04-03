// src/features/facility/facilitySlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createFacility,
    deleteFacility,
    getAllFacilities,
    getFacilitiesByBranch,
    getFacilityById,
    updateFacility,
} from "./facilityAPI";

import { Facility } from "@/interfaces/Facility";

interface FacilityState {
    facilities: Facility[];
    currentFacility: Facility | null;
    loading: boolean;
    error: string | null;
}

const initialState: FacilityState = {
    facilities: [],
    currentFacility: null,
    loading: false,
    error: null,
};

export const fetchAllFacilities = createAsyncThunk(
    "facility/fetchAll",
    async (token: string) => {
        const data = await getAllFacilities(token);
        return data.result;
    }
);

export const fetchFacilityById = createAsyncThunk(
    "facility/fetchById",
    async ({ facilityId, token }: { facilityId: string; token: string }) => {
        const data = await getFacilityById(facilityId, token);
        return data.result;
    }
);

export const fetchFacilitiesByBranch = createAsyncThunk(
    "facility/fetchByBranch",
    async ({ branchId, token }: { branchId: string; token: string }) => {
        const data = await getFacilitiesByBranch(branchId, token);

        return data.result;
    }
);

export const createFacilityAction = createAsyncThunk(
    "facility/create",
    async ({ branchId, facilityData, token }: { branchId: string; facilityData: any; token: string }) => {
        const data = await createFacility(branchId, facilityData, token);
        return data.result;
    }
);

export const updateFacilityAction = createAsyncThunk(
    "facility/update",
    async ({
        facilityId,
        facilityData,
        token,
    }: {
        facilityId: string;
        facilityData: any;
        token: string;
    }) => {
        const data = await updateFacility(facilityId, facilityData, token);
        return data.result;
    }
);

export const deleteFacilityAction = createAsyncThunk(
    "facility/delete",
    async ({ facilityId, token }: { facilityId: string; token: string }) => {
        const data = await deleteFacility(facilityId, token);
        return data.result;
    }
);

const facilitySlice = createSlice({
    name: "facility",
    initialState,
    reducers: {
        clearFacilityState: (state) => {
            state.facilities = [];
            state.currentFacility = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllFacilities.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllFacilities.fulfilled, (state, action) => {
                state.loading = false;
                state.facilities = action.payload;
            })
            .addCase(fetchAllFacilities.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch facilities";
            })
            .addCase(fetchFacilityById.fulfilled, (state, action) => {
                state.currentFacility = action.payload;
            })
            .addCase(fetchFacilitiesByBranch.fulfilled, (state, action) => {
                state.facilities = action.payload;
                console.log(action.payload)
                console.log(state.facilities)
            })
            .addCase(createFacilityAction.fulfilled, (state, action) => {
                state.facilities.push(action.payload);
            })
            .addCase(updateFacilityAction.fulfilled, (state, action) => {
                state.facilities = state.facilities.map((facility) =>
                    facility.facilityId === action.payload.facilityId ? action.payload : facility
                );
            })
            .addCase(deleteFacilityAction.fulfilled, (state, action) => {
                state.facilities = state.facilities.filter(
                    (facility) => facility.facilityId !== action.meta.arg.facilityId
                );
            });
    },
});

export const { clearFacilityState } = facilitySlice.actions;
export default facilitySlice.reducer;
