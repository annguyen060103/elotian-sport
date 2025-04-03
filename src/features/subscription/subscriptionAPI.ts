// src/features/subscription/subscriptionAPI.ts

import { API_URL } from "@/constants/env";
import { SubscriptionPlan } from "@/interfaces/SubscriptionPlan"; // Import SubscriptionPlan interface
import axios from "axios";

// Get all subscription plans
export const getAllSubscriptionPlans = async (token: string) => {
    const response = await axios.get(`${API_URL}/plans`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get subscription plan by ID
export const getSubscriptionPlanById = async (planId: string, token: string) => {
    const response = await axios.get(`${API_URL}/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get subscription plan by name
export const getSubscriptionPlanByName = async (planName: string, token: string) => {
    const response = await axios.get(`${API_URL}/plans/name/${planName}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Create a new subscription plan
export const createSubscriptionPlan = async (planData: SubscriptionPlan, token: string) => {
    const response = await axios.post(`${API_URL}/plans`, planData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Update a subscription plan
export const updateSubscriptionPlan = async (
    planId: string,
    planData: SubscriptionPlan,
    token: string
) => {
    const response = await axios.put(`${API_URL}/plans/${planId}`, planData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Delete a subscription plan
export const deleteSubscriptionPlan = async (planId: string, token: string) => {
    const response = await axios.delete(`${API_URL}/plans/${planId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
