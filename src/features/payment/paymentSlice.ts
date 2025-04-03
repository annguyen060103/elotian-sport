// src/features/payment/paymentSlice.ts

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    createPayment,
    getPaymentByTransactionId,
    getPaymentsByStatus,
    getPaymentsByUserId,
} from "./paymentAPI";

import { Payment } from "@/interfaces/Payment"; // Import Payment interface

// Define Payment State
interface PaymentState {
    payments: Payment[];
    currentPayment: Payment | null;
    loading: boolean;
    error: string | null;
}

const initialState: PaymentState = {
    payments: [],
    currentPayment: null,
    loading: false,
    error: null,
};

// Thunks for async actions
export const fetchPaymentsByUserId = createAsyncThunk(
    "payment/fetchByUserId",
    async ({ userId, token }: { userId: string; token: string }) => {
        const data = await getPaymentsByUserId(userId, token);
        return data.result;
    }
);

export const fetchPaymentsByTransactionId = createAsyncThunk(
    "payment/fetchByTransactionId",
    async ({ transactionId, token }: { transactionId: string; token: string }) => {
        const data = await getPaymentByTransactionId(transactionId, token);
        return data.result;
    }
);

export const fetchPaymentsByStatus = createAsyncThunk(
    "payment/fetchByStatus",
    async ({ status, token }: { status: string; token: string }) => {
        const data = await getPaymentsByStatus(status, token);
        return data.result;
    }
);

export const createPaymentAction = createAsyncThunk(
    "payment/create",
    async ({ paymentData, token }: { paymentData: Payment; token: string }) => {
        const data = await createPayment(paymentData, token);
        return data.result;
    }
);

const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: {
        clearPaymentState: (state) => {
            state.payments = [];
            state.currentPayment = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPaymentsByUserId.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentsByUserId.fulfilled, (state, action) => {
                state.loading = false;
                state.payments = action.payload;
            })
            .addCase(fetchPaymentsByUserId.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch payments by user ID";
            })
            .addCase(fetchPaymentsByTransactionId.fulfilled, (state, action) => {
                state.currentPayment = action.payload;
            })
            .addCase(fetchPaymentsByStatus.fulfilled, (state, action) => {
                state.payments = action.payload;
            })
            .addCase(createPaymentAction.fulfilled, (state, action) => {
                state.payments.push(action.payload);
            });
    },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
