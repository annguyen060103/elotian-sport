// src/hooks/useSubscription.ts

import type { AppDispatch, RootState } from "@/app/store";
import {
    clearSubscriptionState,
    createSubscriptionPlanAction,
    deleteSubscriptionPlanAction,
    fetchAllSubscriptionPlans,
    fetchSubscriptionPlanById,
    fetchSubscriptionPlanByName,
    updateSubscriptionPlanAction,
} from "@/features/subscription/subscriptionSlice";
import { useDispatch, useSelector } from "react-redux";

import { SubscriptionPlan } from "@/interfaces/SubscriptionPlan"; // Import SubscriptionPlan interface

export const useSubscription = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { plans, currentPlan, loading, error } = useSelector(
        (state: RootState) => state.subscription
    );
    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.accessToken;

    // Fetch all subscription plans
    const getAll = () => dispatch(fetchAllSubscriptionPlans(token));

    // Fetch subscription plan by ID
    const getById = (planId: string) => dispatch(fetchSubscriptionPlanById({ planId, token }));

    // Fetch subscription plan by name
    const getByName = (planName: string) =>
        dispatch(fetchSubscriptionPlanByName({ planName, token }));

    // Create a new subscription plan
    const create = (planData: SubscriptionPlan) =>
        dispatch(createSubscriptionPlanAction({ planData, token }));

    // Update a subscription plan
    const update = (planId: string, planData: SubscriptionPlan) =>
        dispatch(updateSubscriptionPlanAction({ planId, planData, token }));

    // Delete a subscription plan
    const remove = (planId: string) => dispatch(deleteSubscriptionPlanAction({ planId, token }));

    // Clear subscription state
    const clear = () => dispatch(clearSubscriptionState());

    return {
        plans,
        currentPlan,
        loading,
        error,
        getAll,
        getById,
        getByName,
        create,
        update,
        remove,
        clear,
    };
};
