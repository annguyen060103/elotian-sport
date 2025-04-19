import { Button, Modal, Popconfirm, Select } from 'antd';
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
import { ImageUpload, Input } from '@/components/Input';
import { Controller, useForm } from 'react-hook-form';
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
  const [file, setFile] = useState(null);
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
    // console.log(currentUser);
  }, []);

  useEffect(() => {
    console.log('Fetched users:', users);
    setDisplayedUsers(users);
  }, [users]);

  const calculateAge = (dob: string): string => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const data = displayedUsers.map((user) => ({
    id: user.userId,
    trainerName: user.fullName,
    age: calculateAge(user.dob),
    specialization: user.specialization,
    // imageUrl: user.imageUrl,
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

  const onSaveTrainer = async (trainerData: Partial<User>) => {
    try {
      const newTrainer = {
        username: trainerData.username || 'coach_nghia2',
        password: trainerData.password || '123456',
        email: trainerData.email,
        fullName: trainerData.fullName,
        phone: trainerData.phone || '0987654321',
        gender: trainerData.gender || 'Male',
        dob: trainerData.dob || '1995-06-15',
        cccd: trainerData.cccd || '012345678912',
        address: trainerData.address || '123 Lê Lợi, District 1, HCM',
        height: trainerData.height || 1.75,
        weight: trainerData.weight || 68.5,
        healthIssues: trainerData.healthIssues || 'None',
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

      // Clear form and close modal
      setFile(null);
      setValue('fullName', '');
      setValue('email', '');
      setCreateModalVisible(false);
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateTrainer = async (trainerData: Partial<User>) => {
    try {
      if (file) {
        // Simulate deleting the old avatar and uploading a new one
        const newImageUrl = URL.createObjectURL(file);

        // Update the trainer with the new avatar
        await registerCoachUser({
          fullName: trainerData.fullName,
          email: trainerData.email,
          imageUrl: newImageUrl,
          status: 'ACTIVE',
        });
      } else {
        // Update the trainer without changing the avatar
        await registerCoachUser({
          fullName: trainerData.fullName,
          email: trainerData.email,
          status: 'ACTIVE',
        });
      }

      alert('Upload successful!');
      setSelectedTrainer(undefined);
      setFile(null);
      setValue('fullName', '');
      setValue('email', '');

      getByRole('COACH'); // Refresh the list of trainers
      setCreateModalVisible(false);
    } catch (err) {
      console.error(t('uploadFailed'), err);
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
                <Text type="Caption 1 Medium">Age</Text>
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
                          setSelectedTrainer({
                            ...displayedUsers.find(
                              (user) => user.userId === row.id,
                            ),
                            id: row.id,
                          });
                          setCreateModalVisible(true);
                          setValue('fullName', row.trainerName);
                          setValue('dob', row.age);
                          // setValue('imageUrl', row.imageUrl);
                        }}
                      />
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          remove(row.id);
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
              setFile(undefined);
              setValue('fullName', '');
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
            {/* <ImageUpload
              onSelected={setFile}
              label={t('trainerImage')}
              imageURL={selectedTrainer?.imageUrl}
            /> */}
            <Controller
              control={control}
              rules={{
                required: t('trainerNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={styles.name}
                  label={t('trainerName')}
                  placeholder={t('trainerNamePlaceHolder')}
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
                required: t('emailRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={styles.name}
                  label={t('email')}
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
                required: t('emailRequired'),
              }}
              render={({ field: { onBlur } }) => (
                <select
                  className={styles.name}
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

            {/* username: trainerData.username || 'coach_nghia2',
        password: trainerData.password || '123456',
        email: trainerData.email,
        fullName: trainerData.fullName,
        phone: trainerData.phone || '0987654321',
        gender: trainerData.gender || 'Male',
        dob: trainerData.dob || '1995-06-15',
        cccd: trainerData.cccd || '012345678912',
        address: trainerData.address || '123 Lê Lợi, District 1, HCM',
        height: trainerData.height || 1.75,
        weight: trainerData.weight || 68.5,
        healthIssues: trainerData.healthIssues || 'None',
        roles: ['COACH'],
        status: 'ACTIVE',
        branchId: selectedId,
        salary: trainerData.salary || '',
        specialization: trainerData.specialization || '',
        experienceYears: trainerData.experienceYears || '',
        certifications: trainerData.certifications || '', */}

            <Controller
              control={control}
              rules={{
                required: t('passwordRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={styles.name}
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
                required: t('usernameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={styles.name}
                  label={t('username')}
                  placeholder={t('usernamePlaceHolder')}
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
                required: t('phoneRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  className={styles.name}
                  label={t('phone')}
                  placeholder={t('phonePlaceholder')}
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
                  className={styles.name}
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
                  className={styles.name}
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
