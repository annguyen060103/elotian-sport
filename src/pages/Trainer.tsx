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
import styles from './Trainer.module.scss';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import plus from '@/assets/icons/plus.svg';
import edit from '@/assets/icons/edit.png';
import { Button as CustomButton } from '@/components/Button';
import { Input } from '@/components/Input';
import { Controller, set, useForm } from 'react-hook-form';
import { User } from '@/interfaces/User';
import { useBranch } from '@/hooks/useBranch';

// interface TrainerData {
//   id: string;
//   trainerName: string;
//   age: string;
//   contractPeriod: string;
//   seniority: string;
// }

export const Trainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedTrainer, setSelectedTrainer] = useState<
    User & { id?: string }
  >();
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

    console.log('Coach', users);
  }, []);

  useEffect(() => {
    console.log('Fetched users:', users);
    setDisplayedUsers(users);
  }, [users]);

  // const calculateAge = (dob: string): string => {
  //   const birthDate = new Date(dob);
  //   const today = new Date();
  //   let age = today.getFullYear() - birthDate.getFullYear();
  //   const m = today.getMonth() - birthDate.getMonth();
  //   if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
  //     age--;
  //   }
  //   return age.toString();
  // };

  const data = displayedUsers.map((user) => ({
    id: user.userId,
    trainerName: user.fullName,
    // age: calculateAge(user.dob),
    age: user.dob,
    specialization: user.specialization,
  }));

  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? data.map((item) => item.id) : []);
  };

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

  const handleDeleteSelected = () => {
    if (!currentUser.roles.includes('ADMIN')) {
      alert('Only admins can delete trainers.');
      return;
    }

    const filtered = displayedUsers.filter(
      (user) => !selected.includes(user.userId),
    );
    setDisplayedUsers(filtered);
    setSelected([]);
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

  const onSaveTrainer = async (trainerData: Partial<User>) => {
    try {
      const newTrainer = {
        username: trainerData.username || '',
        password: trainerData.password || '',
        email: trainerData.email,
        fullName: trainerData.fullName,
        phone: trainerData.phone || '',
        gender: trainerData.gender || '',
        dob: trainerData.dob || '',
        cccd: trainerData.cccd || '',
        address: trainerData.address || '',
        height: trainerData.height || 0,
        weight: trainerData.weight || 0,
        healthIssues: trainerData.healthIssues || '',
        roles: ['COACH'],
        status: 'ACTIVE',
        branchId: selectedId,
        salary: trainerData.salary || '',
        specialization: trainerData.specialization || '',
        experienceYears: trainerData.experienceYears || '',
        certifications: trainerData.certifications || '',
      };

      console.log('💥 newTrainer = ', newTrainer);

      // Call the API to create the trainer
      const result = await registerCoachUser(newTrainer);
      console.log('Trainer created:', result);

      alert('Upload successful!');

      // Update the displayedUsers state with the new trainer
      setDisplayedUsers((prev) => [
        ...prev,
        {
          userId: trainerData.userId, // Ensure this matches the API response
          fullName: trainerData.fullName,
          dob: trainerData.dob,
          specialization: trainerData.specialization,
          roles: trainerData.roles,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateTrainer = async (trainerData: Partial<User>) => {
    try {
      // Prepare the updated trainer data
      const updatedTrainer = {
        userId: selectedTrainer?.id, // Use the selected trainer's ID
        fullName: trainerData.fullName,
        email: trainerData.email,
        dob: trainerData.dob,
        specialization: trainerData.specialization,
        status: 'ACTIVE',
      };

      // Call the update function from useUser
      await update(updatedTrainer.userId, updatedTrainer);

      alert('Trainer updated successfully!');
      setSelectedTrainer(undefined);
      setValue('fullName', '');
      setValue('email', '');
      setValue('dob', '');
      setValue('specialization', '');

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Failed to update trainer:', err);
      alert('Failed to update trainer. Please try again.');
    }
  };

  const onDeleteTrainer = async (trainerId: string) => {
    try {
      // Call the remove function from useUser to delete the trainer
      await remove(trainerId);

      alert('Trainer deleted successfully!');

      // Update the displayedUsers state to remove the deleted trainer
      setDisplayedUsers((prev) =>
        prev.filter((trainer) => trainer.userId !== trainerId),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete trainer:', err);
      alert('Failed to delete trainer. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('trainerManagement')}</Text>
        </span>
        <div className={styles.deleteButtonWrapper}>
          {selected.length > 0 && (
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={handleDeleteSelected}
            >
              <Button icon={<DeleteOutlined />} danger>
                Delete ({selected.length})
              </Button>
            </Popconfirm>
          )}
        </div>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  checked={selected.length === data.length}
                  indeterminate={
                    selected.length > 0 && selected.length < data.length
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </TableCell>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text
                    className={styles.trainerNameText}
                    type="Caption 1 Bold"
                  >
                    Trainer name
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
                <TableRow
                  key={row.id}
                  hover
                  selected={selected.includes(row.id)}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selected.includes(row.id)}
                      onChange={() => handleSelect(row.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.trainerName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.specialization}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <img
                        src={edit}
                        onClick={() => {
                          const trainerToEdit = displayedUsers.find(
                            (user) => user.userId === row.id,
                          );

                          if (trainerToEdit) {
                            setSelectedTrainer({
                              ...trainerToEdit,
                              id: row.id,
                            });
                            setCreateModalVisible(true);

                            // Pre-fill the form fields with the trainer's data
                            setValue('fullName', trainerToEdit.fullName);
                            setValue('email', trainerToEdit.email);
                            setValue('username', trainerToEdit.username);
                            setValue('password', trainerToEdit.password);
                            setValue('dob', trainerToEdit.dob);
                            setValue('cccd', trainerToEdit.cccd);
                            setValue('height', trainerToEdit.height);
                            setValue('weight', trainerToEdit.weight);
                            setValue(
                              'healthIssues',
                              trainerToEdit.healthIssues,
                            );
                            setValue(
                              'specialization',
                              trainerToEdit.specialization,
                            );
                            setValue('phone', trainerToEdit.phone);
                            setValue('gender', trainerToEdit.gender);
                            setValue('address', trainerToEdit.address);
                            setValue('salary', trainerToEdit.salary);
                            setValue(
                              'experienceYears',
                              trainerToEdit.experienceYears,
                            );
                            setValue(
                              'certifications',
                              trainerToEdit.certifications,
                            );
                            setValue('branchId', trainerToEdit.branchId);
                          }
                        }}
                      />
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          onDeleteTrainer(row.id);
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
              setSelectedTrainer(undefined);
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
              {selectedTrainer ? t('editTrainer') : t('createNewTrainer')}
            </Text>
            <Controller
              control={control}
              rules={{
                required: t('trainerNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('trainerName')}
                  placeholder={t('trainerUsernamePlaceholder')}
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
                required: t('trainerEmailRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('trainerEmail')}
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
                required: t('trainerUsernameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('trainerUsername')}
                  placeholder={t('trainerUsernamePlaceholder')}
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
                required: t('trainerPhoneRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('trainerPhone')}
                  placeholder={t('trainerPhonePlaceholder')}
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

            <Controller
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
            />

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
                  if (selectedTrainer) {
                    onUpdateTrainer(data);
                  } else {
                    onSaveTrainer(data);
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
