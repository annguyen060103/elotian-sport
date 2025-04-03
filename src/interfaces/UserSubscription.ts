// src/interfaces/UserSubscription.ts
export interface UserSubscription {
    id: string;
    userId: string;
    planId: string;
    planName: string;
    startDate: string;
    endDate: string;
    status: SubscriptionStatus;
    leftDays: number;
}

export type SubscriptionStatus = "ACTIVE" | "EXPIRED" | "CANCELED";
