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
import styles from './SubscriptionPlan.module.scss';
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
import { SubscriptionPlan as SubcriptionPlan_Partial } from '@/interfaces/SubscriptionPlan';
import { useSubscription } from '@/hooks/useSubscription';

export const SubscriptionPlan = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedPlans, setDisplayedPlans] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<
    SubcriptionPlan_Partial & { id?: string }
  >();
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {
    plans,
    currentPlan,
    loading,
    error,
    getAll,
    getById,
    getByName,
    create,
    update,
    remove,
    clear,
  } = useSubscription();

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    handleSubmit,
  } = useForm<Partial<SubcriptionPlan_Partial>>();

  useEffect(() => {
    getAll();

    console.log('Subscription plans', plans);
  }, []);

  useEffect(() => {
    console.log('Fetched facilities:', plans);
    setDisplayedPlans(plans);
  }, [plans]);

  const data = displayedPlans.map((plan) => ({
    id: plan.planId,
    planName: plan.planName,
    duration: plan.duration,
    price: plan.price,
    description: plan.description,
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
    const sorted = [...displayedPlans].sort((a, b) =>
      isAsc
        ? a.planName.localeCompare(b.planName)
        : b.planName.localeCompare(a.planName),
    );
    setDisplayedPlans(sorted);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  // const handleDeleteSelected = () => {
  //   if (!currentUser.roles.includes('ADMIN')) {
  //     alert('Only admins can delete tfacilities.');
  //     return;
  //   }

  //   const filtered = displayedPlans.filter(
  //     (user) => !selected.includes(user.userId),
  //   );
  //   setDisplayedPlans(filtered);
  //   setSelected([]);
  // };

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

  const onSavePlan = async (planData: Partial<SubcriptionPlan_Partial>) => {
    try {
      const newPlan = {
        planId: '',
        planName: planData.planName || '',
        duration: planData.duration,
        price: planData.price || 0,
        description: planData.description || '',
      };

      console.log('💥 newPlan = ', newPlan);

      const result = await create(newPlan);
      console.log('Subcription plan created:', result);

      alert('Upload successful!');

      setDisplayedPlans((prev) => [
        ...prev,
        {
          planId: planData.planId,
          planName: planData.planName,
          duration: planData.duration,
          price: planData.price,
          description: planData.description,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  const onUpdateFacility = async (
    planData: Partial<SubcriptionPlan_Partial>,
  ) => {
    try {
      const updatePlan = {
        planId: selectedPlan?.id,
        planName: planData.planName,
        duration: planData.duration,
        price: planData.price,
        description: planData.description,
        createdAt: planData.createdAt,
        updatedAt: planData.updatedAt,
      };

      console.log('💥 updatePlan = ', updatePlan);

      await update(updatePlan.planId, updatePlan);

      alert('Plan updated successfully!');
      setSelectedPlan(undefined);

      setValue('planName', '');
      setValue('duration', 0);
      setValue('price', 0);
      setValue('description', '');

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Failed to update subcription plan:', err);
      alert('Failed to update subcription plan. Please try again.');
    }
  };

  const onDeletePlan = async (planId: string) => {
    try {
      await remove(planId);

      alert('Plan deleted successfully!');

      setDisplayedPlans((prev) =>
        prev.filter((plan) => plan.planId !== planId),
      );
      refetch();
    } catch (err) {
      console.error('Failed to delete plan:', err);
      alert('Failed to delete plan. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('planManagement')}</Text>
        </span>
        <div className={styles.deleteButtonWrapper}>
          {selected.length > 0 && (
            <Popconfirm
              title="Are you sure you want to delete?"
              // onConfirm={handleDeleteSelected}
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
                    className={styles.planNameText}
                    type="Caption 1 Bold"
                  >
                    Plan name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Duration</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Price</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Description</Text>
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
                    <Text type="Body 2 Bold">{row.planName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.duration}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.price}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.description}</Text>
                  </TableCell>
                  <TableCell>
                    <div className={styles.userActions}>
                      <img
                        src={edit}
                        onClick={() => {
                          const planToEdit = displayedPlans.find(
                            (plan) => plan.planId === row.id,
                          );

                          if (planToEdit) {
                            setSelectedPlan({
                              ...planToEdit,
                              id: row.id,
                            });
                            setCreateModalVisible(true);
                            setValue('planName', planToEdit.planName);
                            setValue('duration', planToEdit.duration);
                            setValue('price', planToEdit.price);
                            setValue('description', planToEdit.description);
                            setValue('createdAt', planToEdit.createdAt);
                            setValue('updatedAt', planToEdit.updatedAt);
                          }
                        }}
                      />
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
              setSelectedPlan(undefined);
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
              {selectedPlan ? t('editPlan') : t('createNewPlan')}
            </Text>
            <Controller
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

            {selectedPlan && (
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
                  if (selectedPlan) {
                    onUpdateFacility(data);
                  } else {
                    onSavePlan(data);
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
