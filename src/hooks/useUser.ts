// src/hooks/useUser.ts

import type { AppDispatch, RootState } from '@/app/store';
import {
  clearUserState,
  createCoach,
  createUser,
  deleteUserById,
  fetchAllUsers,
  fetchMyInfo,
  fetchUserById,
  fetchUsersByRole,
  updateUserInfo,
} from '@/features/user/userSlice';
import { useDispatch, useSelector } from 'react-redux';

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, currentUser, loading, error } = useSelector(
    (state: RootState) => state.user,
  );

  const auth = useSelector((state: RootState) => state.auth);
  const token = auth.accessToken;

  const getAll = () => dispatch(fetchAllUsers(token));
  const getById = (userId: string) =>
    dispatch(fetchUserById({ userId, token }));
  const getByRole = (roleName: string) =>
    dispatch(fetchUsersByRole({ roleName, token }));
  const getMyInfo = () => dispatch(fetchMyInfo(token));
  const register = (userData: any) => dispatch(createUser({ userData, token }));
  const registerCoachUser = (coachData: any) =>
    dispatch(createCoach({ coachData, token }));
  const update = (userId: string, userData: any) =>
    dispatch(updateUserInfo({ userId, userData, token }));
  const remove = (userId: string) =>
    dispatch(deleteUserById({ userId, token }));

  const clear = () => dispatch(clearUserState());

  return {
    users,
    currentUser,
    loading,
    error,
    getAll,
    getById,
    getByRole,
    getMyInfo,
    register,
    registerCoachUser,
    update,
    remove,
    clear,
  };
};
