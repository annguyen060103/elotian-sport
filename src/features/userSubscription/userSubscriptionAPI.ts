// src/features/userSubscription/userSubscriptionAPI.ts

import { API_URL } from "@/constants/env";
import { UserSubscription } from "@/interfaces/UserSubscription"; // Import UserSubscription interface
import axios from "axios";

// Get all subscriptions by user ID
export const getSubscriptionsByUserId = async (userId: string, token: string) => {
    const response = await axios.get(`${API_URL}/subscriptions/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get subscriptions by status (ACTIVE, EXPIRED, CANCELLED)
export const getSubscriptionsByStatus = async (status: string, token: string) => {
    const response = await axios.get(`${API_URL}/subscriptions/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Assign a subscription plan to a user
export const addSubscriptionToUser = async (
    subscriptionData: UserSubscription,
    token: string
) => {
    const response = await axios.post(`${API_URL}/subscriptions/add`, subscriptionData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Cancel an active subscription
export const cancelSubscription = async (subscriptionId: string, token: string) => {
    const response = await axios.put(
        `${API_URL}/subscriptions/${subscriptionId}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
};
