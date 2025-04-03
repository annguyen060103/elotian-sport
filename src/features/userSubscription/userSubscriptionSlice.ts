// src/features/userSubscription/userSubscriptionSlice.ts

import {
    addSubscriptionToUser,
    cancelSubscription,
    getSubscriptionsByStatus,
    getSubscriptionsByUserId,
} from "./userSubscriptionAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { UserSubscription } from "@/interfaces/UserSubscription"; // Import UserSubscription interface

interface UserSubscriptionState {
    subscriptions: UserSubscription[];
    currentSubscription: UserSubscription | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserSubscriptionState = {
    subscriptions: [],
    currentSubscription: null,
    loading: false,
    error: null,
};

// Fetch all subscriptions by user ID
export const fetchSubscriptionsByUserId = createAsyncThunk(
    "userSubscription/fetchByUserId",
    async ({ userId, token }: { userId: string; token: string }) => {
        const data = await getSubscriptionsByUserId(userId, token);
        return data.result;
    }
);

// Fetch subscriptions by status
export const fetchSubscriptionsByStatus = createAsyncThunk(
    "userSubscription/fetchByStatus",
    async ({ status, token }: { status: string; token: string }) => {
        const data = await getSubscriptionsByStatus(status, token);
        return data.result;
    }
);

// Assign a subscription plan to a user
export const assignSubscriptionToUser = createAsyncThunk(
    "userSubscription/assign",
    async ({ subscriptionData, token }: { subscriptionData: UserSubscription; token: string }) => {
        const data = await addSubscriptionToUser(subscriptionData, token);
        return data.result;
    }
);

// Cancel an active subscription
export const cancelUserSubscription = createAsyncThunk(
    "userSubscription/cancel",
    async ({ subscriptionId, token }: { subscriptionId: string; token: string }) => {
        const data = await cancelSubscription(subscriptionId, token);
        return data.result;
    }
);

const userSubscriptionSlice = createSlice({
    name: "userSubscription",
    initialState,
    reducers: {
        clearUserSubscriptionState: (state) => {
            state.subscriptions = [];
            state.currentSubscription = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptionsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptionsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptions = action.payload;
            })
            .addCase(fetchSubscriptionsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch subscriptions by user ID";
            })
            .addCase(fetchSubscriptionsByStatus.fulfilled, (state, action) => {
                state.subscriptions = action.payload;
            })
            .addCase(assignSubscriptionToUser.fulfilled, (state, action) => {
                state.subscriptions.push(action.payload);
            })
            .addCase(cancelUserSubscription.fulfilled, (state, action) => {
                state.subscriptions = state.subscriptions.filter(
                    (subscription) => subscription.id !== action.payload.id
                );
            });
    },
});

export const { clearUserSubscriptionState } = userSubscriptionSlice.actions;
export default userSubscriptionSlice.reducer;
