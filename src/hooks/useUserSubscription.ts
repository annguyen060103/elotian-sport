// src/hooks/useUserSubscription.ts

import type { AppDispatch, RootState } from "@/app/store";
import {
    assignSubscriptionToUser,
    cancelUserSubscription,
    clearUserSubscriptionState,
    fetchSubscriptionsByStatus,
    fetchSubscriptionsByUserId,
} from "@/features/userSubscription/userSubscriptionSlice";
import { useDispatch, useSelector } from "react-redux";

import { UserSubscription } from "@/interfaces/UserSubscription"; // Import UserSubscription interface

export const useUserSubscription = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { subscriptions, currentSubscription, loading, error } = useSelector(
        (state: RootState) => state.userSubscription
    );
    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.accessToken;

    // Fetch all subscriptions by user ID
    const getByUserId = (userId: string) => dispatch(fetchSubscriptionsByUserId({ userId, token }));

    // Fetch subscriptions by status (ACTIVE, EXPIRED, CANCELLED)
    const getByStatus = (status: "ACTIVE" | "EXPIRED" | "CANCELLED") => dispatch(fetchSubscriptionsByStatus({
        status, token
    }));

    // Assign a subscription plan to a user
    const assignSubscription = (subscriptionData: UserSubscription) =>
        dispatch(assignSubscriptionToUser({ subscriptionData, token }));

    // Cancel a user subscription
    const cancelSubscription = (subscriptionId: string) =>
        dispatch(cancelUserSubscription({ subscriptionId, token }));

    // Clear subscription state
    const clear = () => dispatch(clearUserSubscriptionState());

    return {
        subscriptions,
        currentSubscription,
        loading,
        error,
        getByUserId,
        getByStatus,
        assignSubscription,
        cancelSubscription,
        clear,
    };
};
