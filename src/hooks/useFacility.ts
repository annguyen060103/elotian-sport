// src/hooks/useFacility.ts

import type { AppDispatch, RootState } from "@/app/store";
import {
    clearFacilityState,
    createFacilityAction,
    deleteFacilityAction,
    fetchAllFacilities,
    fetchFacilitiesByBranch,
    fetchFacilityById,
    updateFacilityAction,
} from "@/features/facility/facilitySlice";
import { useDispatch, useSelector } from "react-redux";

import { Facility } from "@/interfaces/Facility";

export const useFacility = () => {
    const dispatch = useDispatch<AppDispatch>();

    const { facilities, currentFacility, loading, error } = useSelector(
        (state: RootState) => state.facility
    );
    const auth = useSelector((state: RootState) => state.auth);
    const token = auth.accessToken;

    const getAll = () => dispatch(fetchAllFacilities(token));
    const getById = (facilityId: string) =>
        dispatch(fetchFacilityById({ facilityId, token }));
    const getByBranch = (branchId: string) =>
        dispatch(fetchFacilitiesByBranch({ branchId, token }));
    const create = (branchId: string, facilityData: Facility) =>
        dispatch(createFacilityAction({ branchId, facilityData, token }));
    const update = (facilityId: string, facilityData: Facility) =>
        dispatch(updateFacilityAction({ facilityId, facilityData, token }));
    const remove = (facilityId: string) =>
        dispatch(deleteFacilityAction({ facilityId, token }));

    const clear = () => dispatch(clearFacilityState());

    return {
        facilities,
        currentFacility,
        loading,
        error,
        getAll,
        getById,
        getByBranch,
        create,
        update,
        remove,
        clear,
    };
};
