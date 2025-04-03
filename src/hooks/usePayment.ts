// src/hooks/usePayment.ts

import type { AppDispatch, RootState } from "@/app/store";
import {
    clearPaymentState,
    createPaymentAction,
    fetchPaymentsByStatus,
    fetchPaymentsByTransactionId,
    fetchPaymentsByUserId,
} from "@/features/payment/paymentSlice";
import { useDispatch, useSelector } from "react-redux";

import { Payment } from "@/interfaces/Payment"; // Import Payment interface

export const usePayment = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { payments, currentPayment, loading, error } = useSelector(
        (state: RootState) => state.payment
    );
    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.accessToken;

    // Fetch payments by user ID
    const getPaymentsByUserId = (userId: string) =>
        dispatch(fetchPaymentsByUserId({ userId, token }));

    // Fetch payment by transaction ID
    const getPaymentByTransactionId = (transactionId: string) =>
        dispatch(fetchPaymentsByTransactionId({ transactionId, token }));

    // Fetch payments by status (PAID, PENDING, etc.)
    const getPaymentsByStatus = (status: "PAID" | "PENDING" | "FAILED") =>
        dispatch(fetchPaymentsByStatus({ status, token }));

    // Create a new payment transaction
    const createPayment = (paymentData: Payment) =>
        dispatch(createPaymentAction({ paymentData, token }));

    // Clear payment state
    const clear = () => dispatch(clearPaymentState());

    return {
        payments,
        currentPayment,
        loading,
        error,
        getPaymentsByUserId,
        getPaymentByTransactionId,
        getPaymentsByStatus,
        createPayment,
        clear,
    };
};
