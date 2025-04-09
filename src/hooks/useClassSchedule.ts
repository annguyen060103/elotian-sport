// src/hooks/useClassSchedule.ts

import { AppDispatch, RootState } from "@/app/store";
import {
    clearSchedules,
    createFixed,
    deleteById,
    fetchAllSchedules,
    fetchByBranch,
    fetchScheduleById,
    filterByQuery,
} from "@/features/classSchedule/classScheduleSlice";
import { useDispatch, useSelector } from "react-redux";

import { ClassSchedule } from "@/interfaces/ClassSchedule";

export const useClassSchedule = () => {
    const dispatch = useDispatch<AppDispatch>();

    const {
        schedules,
        currentSchedule,
        loading,
        error,
    } = useSelector((state: RootState) => state.classSchedule);

    const token = useSelector((state: RootState) => state.auth.accessToken);

    const getAll = () => dispatch(fetchAllSchedules(token)).unwrap();

    const getById = (id: string) =>
        dispatch(fetchScheduleById({ id, token })).unwrap();

    const getByBranch = (branchId: string) =>
        dispatch(fetchByBranch({ branchId, token })).unwrap();

    const filter = (query: Record<string, any>) =>
        dispatch(filterByQuery({ query, token })).unwrap();

    const createFixedSchedule = (
        query: { classType: string; shift: string; weekMode: string },
        body: ClassSchedule
    ) => dispatch(createFixed({ query, body, token })).unwrap();

    const remove = (id: string) =>
        dispatch(deleteById({ id, token })).unwrap();

    const clear = () => dispatch(clearSchedules());

    return {
        schedules,
        currentSchedule,
        loading,
        error,
        getAll,
        getById,
        getByBranch,
        filter,
        createFixedSchedule,
        remove,
        clear,
    };
};
