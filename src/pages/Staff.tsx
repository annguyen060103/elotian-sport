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
import styles from './Staff.module.scss';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import plus from '@/assets/icons/plus.svg';
import edit from '@/assets/icons/edit.png';
import { Button as CustomButton } from '@/components/Button';
import { Input } from '@/components/Input';
import { Controller, set, useForm } from 'react-hook-form';
import { User } from '@/interfaces/User';
import { useBranch } from '@/hooks/useBranch';

export const Staff = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<User & { id?: string }>();
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {
    users,
    currentUser,
    loading,
    error,
    getAll,
    getById,
    getByRole,
    getMyInfo,
    register,
    clear,
    remove,
    registerCoachUser,
    update,
  } = useUser();

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
  } = useForm<Partial<User>>();

  useEffect(() => {
    // Gọi API getByRole khi load page
    getByRole('COACH');

    getMyInfo();

    getAllBranches();
    console.log('Branches', branches);

    console.log('Staff', users);
  }, []);

  useEffect(() => {
    console.log('Fetched users:', users);
    setDisplayedUsers(users);
  }, [users]);

  const data = displayedUsers.map((user) => ({
    id: user.userId,
    staffName: user.fullName,
    // age: calculateAge(user.dob),
    age: user.dob,
    specialization: user.specialization,
  }));

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = () => {
    const isAsc = order === 'asc';
    const sorted = [...displayedUsers].sort((a, b) =>
      isAsc
        ? a.fullName.localeCompare(b.fullName)
        : b.fullName.localeCompare(a.fullName),
    );
    setDisplayedUsers(sorted);
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
      await getByRole('COACH'); // Fetch the latest data
      console.log('Data refetched successfully!');
    } catch (err) {
      console.error('Failed to refetch data:', err);
    }
  };

  const onSaveStaff = async (staffData: Partial<User>) => {
    try {
      const newStaff = {
        username: staffData.username || '',
        password: staffData.password || '',
        email: staffData.email,
        fullName: staffData.fullName,
        phone: staffData.phone || '',
        gender: staffData.gender || '',
        dob: staffData.dob || '',
        cccd: staffData.cccd || '',
        address: staffData.address || '',
        height: staffData.height || 0,
        weight: staffData.weight || 0,
        // healthIssues: staffData.healthIssues || '',
        roles: ['STAFF'],
        status: 'ACTIVE',
        branchId: selectedId,
        salary: staffData.salary || '',
        specialization: staffData.specialization || '',
        experienceYears: staffData.experienceYears || '',
        certifications: staffData.certifications || '',
      };

      console.log('💥 newStaff = ', newStaff);

      // Call the API to create the staff
      const result = await register(newStaff);
      console.log('Staff created:', result);

      alert('Upload successful!');

      // Update the displayedUsers state with the new staff
      setDisplayedUsers((prev) => [
        ...prev,
        {
          userId: staffData.userId, // Ensure this matches the API response
          fullName: staffData.fullName,
          dob: staffData.dob,
          specialization: staffData.specialization,
          roles: staffData.roles,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateStaff = async (staffData: Partial<User>) => {
    try {
      // Prepare the updated staff data
      const updateStaff = {
        userId: selectedStaff?.id, // Use the selected staff's ID
        fullName: staffData.fullName,
        email: staffData.email,
        dob: staffData.dob,
        specialization: staffData.specialization,
        status: 'ACTIVE',
      };

      // Call the update function from useUser
      await update(updateStaff.userId, updateStaff);

      alert('Staff updated successfully!');
      setSelectedStaff(undefined);
      setValue('fullName', '');
      setValue('email', '');
      setValue('dob', '');
      setValue('specialization', '');

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Failed to update staff:', err);
      alert('Failed to update staff. Please try again.');
    }
  };

  const onDeleteStaff = async (staffId: string) => {
    try {
      // Call the remove function from useUser to delete the staff
      await remove(staffId);

      alert('Staff deleted successfully!');

      // Update the displayedUsers state to remove the deleted staff
      setDisplayedUsers((prev) =>
        prev.filter((staff) => staff.userId !== staffId),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete staff:', err);
      alert('Failed to delete staff. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('staffManagement')}</Text>
        </span>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text className={styles.staffNameText} type="Caption 1 Bold">
                    Staff name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Date of birth</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Specialization</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.staffName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.specialization}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <Button
                        icon={<img src={edit} />}
                        onClick={() => {
                          const staffToEdit = displayedUsers.find(
                            (user) => user.userId === row.id,
                          );

                          if (staffToEdit) {
                            setSelectedStaff({
                              ...staffToEdit,
                              id: row.id,
                            });
                            setCreateModalVisible(true);

                            // Pre-fill the form fields with the staff's data
                            setValue('fullName', staffToEdit.fullName);
                            setValue('email', staffToEdit.email);
                            setValue('username', staffToEdit.username);
                            setValue('password', staffToEdit.password);
                            setValue('dob', staffToEdit.dob);
                            setValue('cccd', staffToEdit.cccd);
                            setValue('height', staffToEdit.height);
                            setValue('weight', staffToEdit.weight);
                            // setValue(
                            //   'healthIssues',
                            //   staffToEdit.healthIssues,
                            // );
                            setValue(
                              'specialization',
                              staffToEdit.specialization,
                            );
                            setValue('phone', staffToEdit.phone);
                            setValue('gender', staffToEdit.gender);
                            setValue('address', staffToEdit.address);
                            setValue('salary', staffToEdit.salary);
                            setValue(
                              'experienceYears',
                              staffToEdit.experienceYears,
                            );
                            setValue(
                              'certifications',
                              staffToEdit.certifications,
                            );
                            setValue('branchId', staffToEdit.branchId);
                          }
                        }}
                      />
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          onDeleteStaff(row.id);
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
              setSelectedStaff(undefined);
              // setValue('fullName', '');
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
              {selectedStaff ? t('editStaff') : t('createnewStaff')}
            </Text>
            <Controller
              control={control}
              rules={{
                required: t('staffNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('staffName')}
                  placeholder={t('staffNamePlaceholder')}
                  onClear={() => setValue('fullName', '')}
                  error={errors.fullName?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="fullName"
            />

            <Controller
              control={control}
              rules={{
                required: t('staffEmailRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('staffEmail')}
                  placeholder={t('emailPlaceholder')}
                  onClear={() => setValue('email', '')}
                  error={errors.email?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                required: t('staffUsernameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('staffUsername')}
                  placeholder={t('staffUsernamePlaceholder')}
                  onClear={() => setValue('username', '')}
                  error={errors.username?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="username"
            />

            <Controller
              control={control}
              rules={{
                required: t('passwordRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('password')}
                  placeholder={t('passwordPlaceholder')}
                  onClear={() => setValue('password', '')}
                  error={errors.password?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="password"
            />

            <Controller
              control={control}
              rules={{
                required: t('staffPhoneRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('staffPhone')}
                  placeholder={t('staffPhonePlaceholder')}
                  onClear={() => setValue('phone', '')}
                  error={errors.phone?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="phone"
            />

            <Controller
              control={control}
              rules={{
                required: t('genderRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('gender')}
                  placeholder={t('genderPlaceholder')}
                  onClear={() => setValue('gender', '')}
                  error={errors.gender?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="gender"
            />

            <Controller
              control={control}
              rules={{
                required: t('dobRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('dob')}
                  placeholder={t('dobPlaceholder')}
                  onClear={() => setValue('dob', '')}
                  error={errors.dob?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="dob"
            />

            <Controller
              control={control}
              rules={{
                required: t('identificationRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('identification')}
                  placeholder={t('identificationPlaceholder')}
                  onClear={() => setValue('cccd', '')}
                  error={errors.cccd?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="cccd"
            />

            <Controller
              control={control}
              rules={{
                required: t('addressRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('address')}
                  placeholder={t('addressPlaceholder')}
                  onClear={() => setValue('address', '')}
                  error={errors.address?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="address"
            />

            <Controller
              control={control}
              rules={{
                required: t('heightRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('height')}
                  placeholder={t('heightPlaceholder')}
                  onClear={() => setValue('height', 0)}
                  error={errors.height?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="height"
            />

            <Controller
              control={control}
              rules={{
                required: t('weightRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('weight')}
                  placeholder={t('weightPlaceholder')}
                  onClear={() => setValue('weight', 0)}
                  error={errors.weight?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="weight"
            />

            {/* <Controller
              control={control}
              rules={{
                required: t('healthIssuesRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('healthIssues')}
                  placeholder={t('healthIssuesPlaceholder')}
                  onClear={() => setValue('healthIssues', '')}
                  error={errors.healthIssues?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="healthIssues"
            /> */}

            <Controller
              control={control}
              rules={{
                required: t('salaryRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('salary')}
                  placeholder={t('salaryPlaceholder')}
                  onClear={() => setValue('salary', 0)}
                  error={errors.salary?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="salary"
            />

            <Controller
              control={control}
              rules={{
                required: t('specializationRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('specialization')}
                  placeholder={t('specializationPlaceholder')}
                  onClear={() => setValue('specialization', '')}
                  error={errors.specialization?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="specialization"
            />

            <Controller
              control={control}
              rules={{
                required: t('experienceYearsRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('experienceYears')}
                  placeholder={t('experienceYearsPlaceholder')}
                  onClear={() => setValue('experienceYears', 0)}
                  error={errors.experienceYears?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="experienceYears"
            />

            <Controller
              control={control}
              rules={{
                required: t('certificationsRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('certifications')}
                  placeholder={t('certificationsPlaceholder')}
                  onClear={() => setValue('certifications', '')}
                  error={errors.certifications?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="certifications"
            />

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
              name="email"
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
                  if (selectedStaff) {
                    onUpdateStaff(data);
                  } else {
                    onSaveStaff(data);
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
