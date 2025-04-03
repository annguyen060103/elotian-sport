// src/features/branch/branchSlice.ts

import {
    addUserToBranch,
    createBranch,
    deleteBranch,
    getAllBranches,
    getBranchById,
    removeUserFromBranch,
    updateBranch,
} from "./branchAPI";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { Branch } from "@/interfaces/Branch";

interface BranchState {
    branches: Branch[];
    currentBranch: Branch | null;
    loading: boolean;
    error: string | null;
}

const initialState: BranchState = {
    branches: [],
    currentBranch: null,
    loading: false,
    error: null,
};

export const fetchAllBranches = createAsyncThunk(
    "branch/fetchAll",
    async (token: string) => {
        const data = await getAllBranches(token);
        return data.result;
    }
);

export const fetchBranchById = createAsyncThunk(
    "branch/fetchById",
    async ({ branchId, token }: { branchId: string; token: string }) => {
        const data = await getBranchById(branchId, token);
        return data.result;
    }
);

export const createBranchAction = createAsyncThunk(
    "branch/create",
    async ({ branchData, token }: { branchData: any; token: string }) => {
        const data = await createBranch(branchData, token);
        return data.result;
    }
);

export const updateBranchAction = createAsyncThunk(
    "branch/update",
    async ({
        branchId,
        branchData,
        token,
    }: {
        branchId: string;
        branchData: any;
        token: string;
    }) => {
        const data = await updateBranch(branchId, branchData, token);
        return data.result;
    }
);

export const deleteBranchAction = createAsyncThunk(
    "branch/delete",
    async ({ branchId, token }: { branchId: string; token: string }) => {
        const data = await deleteBranch(branchId, token);
        return data.result;
    }
);

export const addUserToBranchAction = createAsyncThunk(
    "branch/addUser",
    async ({
        branchId,
        userId,
        token,
    }: {
        branchId: string;
        userId: string;
        token: string;
    }) => {
        const data = await addUserToBranch(branchId, userId, token);
        return data.result;
    }
);

export const removeUserFromBranchAction = createAsyncThunk(
    "branch/removeUser",
    async ({
        branchId,
        userId,
        token,
    }: {
        branchId: string;
        userId: string;
        token: string;
    }) => {
        const data = await removeUserFromBranch(branchId, userId, token);
        return data.result;
    }
);

const branchSlice = createSlice({
    name: "branch",
    initialState,
    reducers: {
        clearBranchState: (state) => {
            state.branches = [];
            state.currentBranch = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBranches.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllBranches.fulfilled, (state, action) => {
                state.loading = false;
                state.branches = action.payload;
            })
            .addCase(fetchAllBranches.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch branches";
            })
            .addCase(fetchBranchById.fulfilled, (state, action) => {
                state.currentBranch = action.payload;
            })
            .addCase(createBranchAction.fulfilled, (state, action) => {
                state.branches.push(action.payload);
            })
            .addCase(updateBranchAction.fulfilled, (state, action) => {
                state.branches = state.branches.map((branch) =>
                    branch.branchId === action.payload.branchId ? action.payload : branch
                );
            })
            .addCase(deleteBranchAction.fulfilled, (state, action) => {
                state.branches = state.branches.filter(
                    (branch) => branch.branchId !== action.meta.arg.branchId
                );
            });
    },
});

export const { clearBranchState } = branchSlice.actions;
export default branchSlice.reducer;
