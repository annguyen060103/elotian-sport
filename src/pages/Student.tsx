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
import styles from './Student.module.scss';
import { useTranslation } from 'react-i18next';
import { useUser } from '@/hooks/useUser';
import plus from '@/assets/icons/plus.svg';
import edit from '@/assets/icons/edit.png';
import { Button as CustomButton } from '@/components/Button';
import { Input } from '@/components/Input';
import { Controller, set, useForm } from 'react-hook-form';
import { User } from '@/interfaces/User';
import { useBranch } from '@/hooks/useBranch';

export const Student = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<
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
    getByRole('CLIENT');

    getMyInfo();

    getAllBranches();
    console.log('Branches', branches);

    console.log('Student', users);
  }, []);

  useEffect(() => {
    console.log('Fetched users:', users);
    setDisplayedUsers(users);
  }, [users]);

  const data = displayedUsers.map((user) => ({
    id: user.userId,
    studentName: user.fullName,
    // age: calculateAge(user.dob),
    age: user.dob,
    healthIssues: user.healthIssues,
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
      await getByRole('CLIENT'); // Fetch the latest data
      console.log('Data refetched successfully!');
    } catch (err) {
      console.error('Failed to refetch data:', err);
    }
  };

  const onSaveStudent = async (studentData: Partial<User>) => {
    try {
      const newStudent = {
        username: studentData.username || '',
        password: studentData.password || '',
        email: studentData.email,
        fullName: studentData.fullName,
        phone: studentData.phone || '',
        gender: studentData.gender || '',
        dob: studentData.dob || '',
        cccd: studentData.cccd || '',
        address: studentData.address || '',
        height: studentData.height || 0,
        weight: studentData.weight || 0,
        healthIssues: studentData.healthIssues || '',
        roles: ['CLIENT'],
        status: 'ACTIVE',
        branchId: selectedId,
        // salary: studentData.salary || '',
        // specialization: studentData.specialization || '',
        // experienceYears: studentData.experienceYears || '',
        // certifications: studentData.certifications || '',
      };

      console.log('💥 newStudent = ', newStudent);

      // Call the API to create the student
      const result = await register(newStudent);
      console.log('Student created:', result);

      alert('Upload successful!');

      // Update the displayedUsers state with the new student
      setDisplayedUsers((prev) => [
        ...prev,
        {
          userId: studentData.userId, // Ensure this matches the API response
          fullName: studentData.fullName,
          dob: studentData.dob,
          healthIssues: studentData.healthIssues,
          roles: studentData.roles,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateStudent = async (studentData: Partial<User>) => {
    try {
      // Prepare the updated student data
      const updateStudent = {
        userId: selectedStudent?.id, // Use the selected student's ID
        fullName: studentData.fullName,
        email: studentData.email,
        dob: studentData.dob,
        healthIssues: studentData.healthIssues,
        status: 'ACTIVE',
      };

      // Call the update function from useUser
      await update(updateStudent.userId, updateStudent);

      alert('Student updated successfully!');
      setSelectedStudent(undefined);
      setValue('fullName', '');
      setValue('email', '');
      setValue('dob', '');
      setValue('healthIssues', '');

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Failed to update student:', err);
      alert('Failed to update student. Please try again.');
    }
  };

  const onDeleteStudent = async (studentId: string) => {
    try {
      // Call the remove function from useUser to delete the student
      await remove(studentId);

      alert('Student deleted successfully!');

      // Update the displayedUsers state to remove the deleted student
      setDisplayedUsers((prev) =>
        prev.filter((student) => student.userId !== studentId),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete student:', err);
      alert('Failed to delete student. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('studentManagement')}</Text>
        </span>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text
                    className={styles.studentNameText}
                    type="Caption 1 Bold"
                  >
                    Student name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Date of birth</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Health issues</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.studentName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.healthIssues}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <Button
                        icon={<img src={edit} />}
                        onClick={() => {
                          const studentToEdit = displayedUsers.find(
                            (user) => user.userId === row.id,
                          );

                          if (studentToEdit) {
                            setSelectedStudent({
                              ...studentToEdit,
                              id: row.id,
                            });
                            setCreateModalVisible(true);

                            // Pre-fill the form fields with the student's data
                            setValue('fullName', studentToEdit.fullName);
                            setValue('email', studentToEdit.email);
                            setValue('username', studentToEdit.username);
                            setValue('password', studentToEdit.password);
                            setValue('dob', studentToEdit.dob);
                            setValue('cccd', studentToEdit.cccd);
                            setValue('height', studentToEdit.height);
                            setValue('weight', studentToEdit.weight);
                            setValue(
                              'healthIssues',
                              studentToEdit.healthIssues,
                            );
                            // setValue(
                            //   'specialization',
                            //   studentToEdit.specialization,
                            // );
                            setValue('phone', studentToEdit.phone);
                            setValue('gender', studentToEdit.gender);
                            setValue('address', studentToEdit.address);
                            // setValue('salary', studentToEdit.salary);
                            // setValue(
                            //   'experienceYears',
                            //   studentToEdit.experienceYears,
                            // );
                            // setValue(
                            //   'certifications',
                            //   studentToEdit.certifications,
                            // );
                            setValue('branchId', studentToEdit.branchId);
                          }
                        }}
                      />
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          onDeleteStudent(row.id);
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
              setSelectedStudent(undefined);
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
              {selectedStudent ? t('editStudent') : t('createNewStudent')}
            </Text>
            <Controller
              control={control}
              rules={{
                required: t('studentNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('studentName')}
                  placeholder={t('studentNamePlaceholder')}
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
                required: t('studentEmailRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('studentEmail')}
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
                required: t('studentUsernameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('studentUsername')}
                  placeholder={t('studentUsernamePlaceholder')}
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
                required: t('studentPhoneRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('studentPhone')}
                  placeholder={t('studentPhonePlaceholder')}
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

            {/* <Controller
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
            /> */}

            {/* <Controller
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
            /> */}

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
                  if (selectedStudent) {
                    onUpdateStudent(data);
                  } else {
                    onSaveStudent(data);
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
