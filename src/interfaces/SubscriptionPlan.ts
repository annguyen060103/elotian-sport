// src/interfaces/SubscriptionPlan.ts
export interface SubscriptionPlan {
  planId: string;
  planName: string;
  duration: number; // Duration in days
  price: number; //VND
  description: string;
  createdAt?: string;
  updatedAt?: string;
}
