// src/interfaces/Payment.ts
export interface Payment {
    paymentId: string;
    userId: string;
    paymentMethod: "CASH" | "CARD" | "ONLINE";
    amount: number;
    status: PaymentStatus;
    transactionId: string;
    paymentDate: string;
}

export type PaymentStatus = "PAID" | "PENDING" | "FAILED";
