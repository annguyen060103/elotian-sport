import { Button, Modal, Popconfirm } from 'antd';
import {
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from '@mui/material';
import { DeleteOutlined } from '@ant-design/icons';
import { useEffect, useState } from 'react';

import { Text } from '@/components/Text';
import styles from './Facility.module.scss';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import plus from '@/assets/icons/plus.svg';
import edit from '@/assets/icons/edit.png';
import { Button as CustomButton } from '@/components/Button';
import { Input } from '@/components/Input';
import { Controller, set, useForm } from 'react-hook-form';
import { User } from '@/interfaces/User';
import { useBranch } from '@/hooks/useBranch';
import { useFacility } from '@/hooks/useFacility';
import { Facility as Facility_Partial } from '@/interfaces/Facility';

export const Facility = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayFacilities, setDisplayedFacilities] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedFacility, setSelectedFacility] = useState<
    Facility_Partial & { id?: string }
  >();
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {
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
  } = useFacility();

  const {
    branches,
    currentBranch,
    loading: branchLoading,
    error: branchError,
    getAll: getAllBranches,
    getById: getBranchById,
    create: createBranch,
    update: updateBranch,
    remove: removeBranch,
    addUser: addUserToBranch,
    removeUser: removeUserFromBranch,
    clear: clearBranchState,
  } = useBranch();

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    handleSubmit,
  } = useForm<Partial<Facility_Partial>>();

  useEffect(() => {
    // Gọi API getByRole khi load page
    getAll();

    getAllBranches();
    console.log('Branches', branches);

    console.log('Facility', facilities);
  }, []);

  useEffect(() => {
    console.log('Fetched facilities:', facilities);
    setDisplayedFacilities(facilities);
  }, [facilities]);

  const data = displayFacilities.map((facility) => ({
    id: facility.facilityId,
    facilityName: facility.facilityName,
    // age: calculateAge(user.dob),
    capacity: facility.capacity,
    status: facility.status,
  }));

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = () => {
    const isAsc = order === 'asc';
    const sorted = [...displayFacilities].sort((a, b) =>
      isAsc
        ? a.facilityName.localeCompare(b.facilityName)
        : b.facilityName.localeCompare(a.facilityName),
    );
    setDisplayedFacilities(sorted);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const refetch = async () => {
    try {
      await getAll(); // Fetch the latest data
      console.log('Data refetched successfully!');
    } catch (err) {
      console.error('Failed to refetch data:', err);
    }
  };

  const onSaveFacility = async (facilityData: Partial<Facility_Partial>) => {
    try {
      const newFacility = {
        facilityId: '',
        facilityName: facilityData.facilityName || '',
        status: facilityData.status,
        capacity: facilityData.capacity || 0,
        branchId: selectedId,
      };

      console.log('💥 newFacility = ', newFacility);

      const result = await create(selectedId, newFacility);
      console.log('Facility created:', result);

      alert('Upload successful!');

      setDisplayedFacilities((prev) => [
        ...prev,
        {
          facilityId: facilityData.facilityId,
          facilityName: facilityData.facilityName,
          capacity: facilityData.capacity,
          status: facilityData.status,
          branchId: selectedId,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateFacility = async (facilityData: Partial<Facility_Partial>) => {
    try {
      const updatedFacility = {
        facilityId: selectedFacility?.id,
        facilityName: facilityData.facilityName,
        capacity: facilityData.capacity,
        status: facilityData.status,
        createdAt: facilityData.createdAt,
        updatedAt: facilityData.updatedAt,
        branchId: selectedId,
      };

      console.log('💥 updatedFacility = ', updatedFacility);

      await update(updatedFacility.facilityId, updatedFacility);

      alert('Facility updated successfully!');
      setSelectedFacility(undefined);

      setValue('facilityName', '');
      setValue('capacity', 0);
      setValue('status', '');

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Failed to update facility:', err);
      alert('Failed to update facility. Please try again.');
    }
  };

  const onDeleteFacility = async (facilityId: string) => {
    try {
      await remove(facilityId);

      alert('Facility deleted successfully!');

      setDisplayedFacilities((prev) =>
        prev.filter((facility) => facility.facilityId !== facilityId),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete facility:', err);
      alert('Failed to delete facility. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('facilityManagement')}</Text>
        </span>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text
                    className={styles.facilityNameText}
                    type="Caption 1 Bold"
                  >
                    Facility name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Capacity</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Status</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.facilityName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.capacity}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.status}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <Button
                        icon={<img src={edit} />}
                        onClick={() => {
                          const facilityToEdit = displayFacilities.find(
                            (facility) => facility.facilityId === row.id,
                          );

                          if (facilityToEdit) {
                            setSelectedFacility({
                              ...facilityToEdit,
                              id: row.id,
                            });
                            setCreateModalVisible(true);
                            setValue(
                              'facilityName',
                              facilityToEdit.facilityName,
                            );
                            setValue('status', facilityToEdit.status);
                            setValue('capacity', facilityToEdit.capacity);
                            setValue(
                              'thumbnailUrl',
                              facilityToEdit.thumbnailUrl,
                            );
                            setValue('createdAt', facilityToEdit.createdAt);
                            setValue('updatedAt', facilityToEdit.updatedAt);
                            setValue('imageUrls', facilityToEdit.imageUrls);
                            setValue('branchId', facilityToEdit.branchId);
                          }
                        }}
                      />
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          onDeleteFacility(row.id);
                        }}
                      >
                        <Button icon={<DeleteOutlined />} danger />
                      </Popconfirm>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <div className={styles.addNewContainer}>
          <CustomButton
            className={styles.addNewButton}
            type="primary"
            title={t('addNew')}
            icon={<img src={plus} />}
            onClick={() => {
              setSelectedFacility(undefined);
              setCreateModalVisible(true);
            }}
          />
        </div>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      {createModalVisible && (
        <Modal closable={false} open={createModalVisible} footer={null}>
          <div className={styles.modal}>
            <Text type="Headline 1">
              {selectedFacility ? t('editFacility') : t('createNewFacility')}
            </Text>
            <Controller
              control={control}
              rules={{
                required: t('facilityNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('facilityName')}
                  placeholder={t('facilityNamePlaceholder')}
                  onClear={() => setValue('facilityName', '')}
                  error={errors.facilityName?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="facilityName"
            />

            <Controller
              control={control}
              rules={{
                required: t('facilityStatusRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('facilityStatus')}
                  placeholder={t('facilityStatusPlaceholder')}
                  onClear={() => setValue('status', '')}
                  error={errors.status?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="status"
            />

            <Controller
              control={control}
              rules={{
                required: t('facilityCapacityRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('facilityCapacity')}
                  placeholder={t('facilityCapacityPlaceholder')}
                  onClear={() => setValue('capacity', 0)}
                  error={errors.capacity?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="capacity"
            />

            {selectedFacility && (
              <>
                <Controller
                  control={control}
                  rules={{
                    required: t('createdAtRequired'),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('createdAt')}
                      placeholder={t('createdAtPlaceholder')}
                      onClear={() => setValue('createdAt', '')}
                      error={errors.createdAt?.message}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  name="createdAt"
                />

                <Controller
                  control={control}
                  rules={{
                    required: t('updatedAtRequired'),
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label={t('updatedAt')}
                      placeholder={t('updatedAtPlaceholder')}
                      onClear={() => setValue('updatedAt', '')}
                      error={errors.updatedAt?.message}
                      onBlur={onBlur}
                      onChange={onChange}
                      value={value}
                    />
                  )}
                  name="updatedAt"
                />
              </>
            )}

            <Controller
              control={control}
              rules={{ required: t('branchNameRequired') }}
              render={({ field: { onBlur } }) => (
                <select
                  className={styles.select}
                  onBlur={onBlur}
                  onChange={(e) => {
                    setSelectedId(e.target.value);
                  }}
                  value={selectedId}
                >
                  {branches.map((branch) => (
                    <option key={branch.branchId} value={branch.branchId}>
                      {branch.branchName}
                    </option>
                  ))}
                </select>
              )}
              name="facilityName"
            />

            <div className={styles.modalFooter}>
              <CustomButton
                type="outline"
                title={t('cancel')}
                onClick={() => setCreateModalVisible(false)}
              />
              <CustomButton
                title={t('save')}
                onClick={handleSubmit((data) => {
                  if (selectedFacility) {
                    onUpdateFacility(data);
                  } else {
                    onSaveFacility(data);
                  }
                })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
