// src/features/subscription/subscriptionSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createSubscriptionPlan,
    deleteSubscriptionPlan,
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    getSubscriptionPlanByName,
    updateSubscriptionPlan,
} from "./subscriptionAPI";

import { SubscriptionPlan } from "@/interfaces/SubscriptionPlan"; // Import SubscriptionPlan interface

interface SubscriptionState {
    plans: SubscriptionPlan[];
    currentPlan: SubscriptionPlan | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    plans: [],
    currentPlan: null,
    loading: false,
    error: null,
};

// Fetch all subscription plans
export const fetchAllSubscriptionPlans = createAsyncThunk(
    "subscription/fetchAll",
    async (token: string) => {
        const data = await getAllSubscriptionPlans(token);
        return data.result;
    }
);

// Fetch a subscription plan by ID
export const fetchSubscriptionPlanById = createAsyncThunk(
    "subscription/fetchById",
    async ({ planId, token }: { planId: string; token: string }) => {
        const data = await getSubscriptionPlanById(planId, token);
        return data.result;
    }
);

// Fetch a subscription plan by name
export const fetchSubscriptionPlanByName = createAsyncThunk(
    "subscription/fetchByName",
    async ({ planName, token }: { planName: string; token: string }) => {
        const data = await getSubscriptionPlanByName(planName, token);
        return data.result;
    }
);

// Create a new subscription plan
export const createSubscriptionPlanAction = createAsyncThunk(
    "subscription/create",
    async ({ planData, token }: { planData: SubscriptionPlan; token: string }) => {
        const data = await createSubscriptionPlan(planData, token);
        return data.result;
    }
);

// Update a subscription plan
export const updateSubscriptionPlanAction = createAsyncThunk(
    "subscription/update",
    async ({
        planId,
        planData,
        token,
    }: { planId: string; planData: SubscriptionPlan; token: string }) => {
        const data = await updateSubscriptionPlan(planId, planData, token);
        return data.result;
    }
);

// Delete a subscription plan
export const deleteSubscriptionPlanAction = createAsyncThunk(
    "subscription/delete",
    async ({ planId, token }: { planId: string; token: string }) => {
        const data = await deleteSubscriptionPlan(planId, token);
        return data.result;
    }
);

const subscriptionSlice = createSlice({
    name: "subscription",
    initialState,
    reducers: {
        clearSubscriptionState: (state) => {
            state.plans = [];
            state.currentPlan = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllSubscriptionPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllSubscriptionPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchAllSubscriptionPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch subscription plans";
            })
            .addCase(fetchSubscriptionPlanById.fulfilled, (state, action) => {
                state.currentPlan = action.payload;
            })
            .addCase(fetchSubscriptionPlanByName.fulfilled, (state, action) => {
                state.currentPlan = action.payload;
            })
            .addCase(createSubscriptionPlanAction.fulfilled, (state, action) => {
                state.plans.push(action.payload);
            })
            .addCase(updateSubscriptionPlanAction.fulfilled, (state, action) => {
                state.plans = state.plans.map((plan) =>
                    plan.planId === action.payload.planId ? action.payload : plan
                );
            })
            .addCase(deleteSubscriptionPlanAction.fulfilled, (state, action) => {
                state.plans = state.plans.filter(
                    (plan) => plan.planId !== action.meta.arg.planId
                );
            });
    },
});

export const { clearSubscriptionState } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
