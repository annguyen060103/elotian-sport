export interface ClassSchedule {
    classScheduleId: string;
    branchId: string;
    teacherId: string;
    facilityId: string;
    startTime: string; // ISO Date string
    endTime: string;   // ISO Date string
    status: "SCHEDULED" | "CANCELED" | "COMPLETED";
    classType: "OFFLINE" | "ONLINE";
    weekOfYear: number;
    month: number;
    year: number;
    shift: "MORNING" | "AFTERNOON" | "EVENING";
}
