// src/features/payment/paymentAPI.ts

import { API_URL } from "@/constants/env";
import axios from "axios";

// Get payment by transaction ID
export const getPaymentByTransactionId = async (transactionId: string, token: string) => {
    const response = await axios.get(`${API_URL}/payments/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get payments by user ID
export const getPaymentsByUserId = async (userId: string, token: string) => {
    const response = await axios.get(`${API_URL}/payments/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Get payments by status
export const getPaymentsByStatus = async (status: string, token: string) => {
    const response = await axios.get(`${API_URL}/payments/status/${status}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

// Create a new payment transaction
export const createPayment = async (paymentData: any, token: string) => {
    const response = await axios.post(`${API_URL}/payments/add`, paymentData, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};
