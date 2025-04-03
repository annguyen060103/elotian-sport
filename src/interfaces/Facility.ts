// src/interfaces/Facility.ts
export interface Facility {
    facilityId: string;
    branchId: string;
    facilityName: string;
    status: string;
    capacity: number;
    thumbnailUrl: string;
    imageUrls: string[];
    createdAt: string;
    updatedAt: string;
}
