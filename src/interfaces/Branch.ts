import { User } from "./User";

export interface Branch {
    branchId: string;
    branchName: string;
    address: string;
    phone: string;
    status: string;
    users: User[];
}
