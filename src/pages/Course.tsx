import { Button, Modal, Popconfirm } from 'antd';
import {
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
import styles from './Course.module.scss';
import { useTranslation } from 'react-i18next';
import plus from '@/assets/icons/plus.svg';
import { Button as CustomButton } from '@/components/Button';
import { useForm } from 'react-hook-form';
import { useClassSchedule } from '@/hooks/useClassSchedule';
import { ClassSchedule } from '@/interfaces/ClassSchedule';

export const Course = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedCourses, setDisplayedCourses] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<
    ClassSchedule & { id?: string }
  >();
  const [selectedId] = useState('');

  const { schedules, getAll, createFixedSchedule, remove } = useClassSchedule();

  const { handleSubmit } = useForm<Partial<ClassSchedule>>();

  useEffect(() => {
    getAll();

    console.log('Courses', schedules);
  }, [getAll, schedules]);

  useEffect(() => {
    console.log('Fetched courses:', schedules);
    setDisplayedCourses(schedules);
  }, [schedules]);

  const data = displayedCourses.map((schedule) => ({
    id: schedule.classScheduleId,
    startTime: schedule.startTime,
    endTime: schedule.endTime,
    status: schedule.status,
    classType: schedule.classType,
    shift: schedule.shift,
    teacherId: schedule.teacherId,
  }));

  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = () => {
    const isAsc = order === 'asc';
    const sorted = [...displayedCourses].sort((a, b) =>
      isAsc
        ? a.classScheduleId.localeCompare(b.classScheduleId)
        : b.classScheduleId.localeCompare(a.classScheduleId),
    );
    setDisplayedCourses(sorted);
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
      await getAll();
      console.log('Data refetched successfully!');
    } catch (err) {
      console.error('Failed to refetch data:', err);
    }
  };

  const onSaveCourse = async (courseData: Partial<ClassSchedule>) => {
    try {
      const newCourse = {
        classScheduleId: '',
        startTime: courseData.startTime || '',
        endTime: courseData.endTime || '',
        status:
          (courseData.status as 'CANCELED' | 'SCHEDULED' | 'COMPLETED') ||
          'SCHEDULED',
        classType: (courseData.classType as 'ONLINE' | 'OFFLINE') || 'ONLINE',
        shift:
          (courseData.shift as 'MORNING' | 'AFTERNOON' | 'EVENING') ||
          'MORNING',
        branchId: selectedId,
        teacherId: courseData.teacherId || '',
        facilityId: courseData.facilityId || '',
        weekOfYear: courseData.weekOfYear || 1,
        month: courseData.month || 1,
        year: courseData.year || new Date().getFullYear(),
      };

      console.log('💥 newCourse = ', newCourse);

      const result = await createFixedSchedule(
        {
          classType: newCourse.classType,
          shift: newCourse.shift,
          weekMode: 'default',
        },
        newCourse,
      );
      console.log('Course created:', result);

      alert('Upload successful!');

      setDisplayedCourses((prev) => [
        ...prev,
        {
          classScheduleId: courseData.classScheduleId,
          startTime: courseData.startTime,
          endTime: courseData.endTime,
          status: courseData.status,
          classType: courseData.classType,
          shift: courseData.shift,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  // const onUpdateFacility = async (courseData: Partial<ClassSchedule>) => {
  //   try {
  //     const updatePlan = {
  //       classScheduleId: selectedCourse?.id,
  //       startTime: courseData.startTime,
  //       endTime: courseData.endTime,
  //       status: courseData.status,
  //       classType: courseData.classType,
  //       shift: courseData.shift,
  //     };

  //     console.log('💥 updatePlan = ', updatePlan);

  //     await update(updatePlan.planId, updatePlan);

  //     alert('Plan updated successfully!');
  //     setSelectedCourse(undefined);

  //     setValue('planName', '');
  //     setValue('duration', 0);
  //     setValue('price', 0);
  //     setValue('description', '');

  //     setCreateModalVisible(false);
  //     refetch();
  //   } catch (err) {
  //     console.error('Failed to update subcription plan:', err);
  //     alert('Failed to update subcription plan. Please try again.');
  //   }
  // };

  const onDeletePlan = async (classScheduleId: string) => {
    try {
      await remove(classScheduleId);

      alert('Class schedule deleted successfully!');

      setDisplayedCourses((prev) =>
        prev.filter(
          (classSchedule) => classSchedule.classScheduleId !== classScheduleId,
        ),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete class schedule:', err);
      alert('Failed to delete class schedule. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('courseManagement')}</Text>
        </span>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text className={styles.courseNameText} type="Caption 1 Bold">
                    Trainer id
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Status</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Shift</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Start time - End time</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Class type</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.teacherId}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.status}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.shift}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">
                      {row.startTime} - {row.endTime}
                    </Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.classType}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <Popconfirm
                        title="Are you sure you want to delete?"
                        onConfirm={() => {
                          console.log('ID to delete:', row.id);
                          onDeletePlan(row.id);
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
              setSelectedCourse(undefined);
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
              {selectedCourse ? t('editCourse') : t('createNewCourse')}
            </Text>
            {/* <Controller
              control={control}
              rules={{
                required: t('planNameRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('planName')}
                  placeholder={t('planNamePlaceholder')}
                  onClear={() => setValue('planName', '')}
                  error={errors.planName?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="planName"
            />

            <Controller
              control={control}
              rules={{
                required: t('durationRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('duration')}
                  placeholder={t('durationPlaceholder')}
                  onClear={() => setValue('duration', 0)}
                  error={errors.duration?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="duration"
            />

            <Controller
              control={control}
              rules={{
                required: t('priceRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('price')}
                  placeholder={t('pricePlaceholder')}
                  onClear={() => setValue('price', 0)}
                  error={errors.price?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="price"
            />

            {selectedCourse && (
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
              rules={{
                required: t('descriptionRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('description')}
                  placeholder={t('descriptionPlaceholder')}
                  onClear={() => setValue('description', '')}
                  error={errors.description?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="description"
            /> */}

            <div className={styles.modalFooter}>
              <CustomButton
                type="outline"
                title={t('cancel')}
                onClick={() => setCreateModalVisible(false)}
              />
              <CustomButton
                title={t('save')}
                onClick={handleSubmit((data) => {
                  if (!selectedCourse) {
                    onSaveCourse(data);
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
