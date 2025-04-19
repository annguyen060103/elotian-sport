// src/hooks/useBranch.ts

import type { AppDispatch, RootState } from '@/app/store';
import {
  addUserToBranchAction,
  clearBranchState,
  createBranchAction,
  deleteBranchAction,
  fetchAllBranches,
  fetchBranchById,
  removeUserFromBranchAction,
  updateBranchAction,
} from '@/features/branch/branchSlice';
import { useDispatch, useSelector } from 'react-redux';

import { Branch } from "@/interfaces/Branch";

export const useBranch = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { branches, currentBranch, loading, error } = useSelector(
    (state: RootState) => state.branch,
  );
  const auth = useSelector((state: RootState) => state.auth);
  const token = auth.accessToken;

  const getAll = () => dispatch(fetchAllBranches(token));
  const getById = (branchId: string) =>
    dispatch(fetchBranchById({ branchId, token }));
  const create = (branchData: any) =>
    dispatch(createBranchAction({ branchData, token }));
  const update = (branchId: string, branchData: any) =>
    dispatch(updateBranchAction({ branchId, branchData, token }));
  const remove = (branchId: string) =>
    dispatch(deleteBranchAction({ branchId, token }));
  const addUser = (branchId: string, userId: string) =>
    dispatch(addUserToBranchAction({ branchId, userId, token }));
  const removeUser = (branchId: string, userId: string) =>
    dispatch(removeUserFromBranchAction({ branchId, userId, token }));
  
    const getAll = () => dispatch(fetchAllBranches(token));

    const getById = (branchId: string) =>
        dispatch(fetchBranchById({ branchId, token }));

    const create = (branchData: Branch) =>
        dispatch(createBranchAction({ branchData, token }));

    const update = (branchId: string, branchData: Branch) =>
        dispatch(updateBranchAction({ branchId, branchData, token }));

    const remove = (branchId: string) =>
        dispatch(deleteBranchAction({ branchId, token }));

    const addUser = (branchId: string, userId: string) =>
        dispatch(addUserToBranchAction({ branchId, userId, token }));

    const removeUser = (branchId: string, userId: string) =>
        dispatch(removeUserFromBranchAction({ branchId, userId, token }));

  const clear = () => dispatch(clearBranchState());

  return {
    branches,
    currentBranch,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
    addUser,
    removeUser,
    clear,
  };
};
