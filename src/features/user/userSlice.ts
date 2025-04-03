import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
    deleteUser,
    getAllUsers,
    getMyInfo,
    getUserById,
    getUsersByRole,
    registerCoach,
    registerUser,
    updateUser,
} from "./userAPI";

import { User } from "@/interfaces/User";

interface UserState {
    users: User[];
    currentUser: User | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    users: [],
    currentUser: null,
    loading: false,
    error: null,
};

export const fetchAllUsers = createAsyncThunk(
    "user/fetchAll",
    async (token: string) => {
        const data = await getAllUsers(token);
        return data.result;
    }
);

export const fetchUserById = createAsyncThunk(
    "user/fetchById",
    async ({ userId, token }: { userId: string; token: string }) => {
        const data = await getUserById(userId, token);
        return data.result;
    }
);

export const fetchUsersByRole = createAsyncThunk(
    "user/fetchByRole",
    async ({ roleName, token }: { roleName: string; token: string }) => {
        const data = await getUsersByRole(roleName, token);
        return data.result;
    }
);

export const fetchMyInfo = createAsyncThunk(
    "user/fetchMyInfo",
    async (token: string) => {
        const data = await getMyInfo(token);
        return data.result;
    }
);

export const createUser = createAsyncThunk(
    "user/register",
    async ({ userData, token }: { userData: any; token: string }) => {
        const data = await registerUser(userData, token);
        return data.result;
    }
);

export const createCoach = createAsyncThunk(
    "user/registerCoach",
    async ({ coachData, token }: { coachData: any; token: string }) => {
        const data = await registerCoach(coachData, token);
        return data.result;
    }
);

export const updateUserInfo = createAsyncThunk(
    "user/update",
    async ({
        userId,
        userData,
        token,
    }: {
        userId: string;
        userData: any;
        token: string;
    }) => {
        const data = await updateUser(userId, userData, token);
        return data.result;
    }
);


export const deleteUserById = createAsyncThunk(
    "user/delete",
    async ({ userId, token }: { userId: string; token: string }) => {
        const data = await deleteUser(userId, token);
        return data.result;
    }
);

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearUserState: (state) => {
            state.users = [];
            state.currentUser = null;
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || "Failed to fetch users";
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(fetchUsersByRole.fulfilled, (state, action) => {
                state.users = action.payload;
            })
            .addCase(fetchMyInfo.fulfilled, (state, action) => {
                state.currentUser = action.payload;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })

            .addCase(createCoach.fulfilled, (state, action) => {
                state.users.push(action.payload);
            })
            .addCase(updateUserInfo.fulfilled, (state, action) => {
                state.users = state.users.map((user) =>
                    user.userId === action.payload.userId ? action.payload : user
                );
            })
            .addCase(deleteUserById.fulfilled, (state, action) => {
                state.users = state.users.filter(
                    (user) => user.userId !== action.meta.arg.userId
                );
            });
    },
});

export const { clearUserState } = userSlice.actions;
export default userSlice.reducer;
