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
import styles from './Payment.module.scss';
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
import {
  Payment as Payment_Partial,
  PaymentStatus,
} from '@/interfaces/Payment';
import { useSubscription } from '@/hooks/useSubscription';
import { usePayment } from '@/hooks/usePayment';
import { v4 as uuidv4 } from 'uuid';

export const Payment = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [displayedPayments, setDisplayedPayments] = useState([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    Payment_Partial & { id?: string }
  >();
  const [selectedBranch, setSelectedBranch] = useState([]);
  const [selectedId, setSelectedId] = useState('');

  const {
    payments,
    currentPayment,
    loading,
    error,
    getPaymentsByUserId,
    getPaymentByTransactionId,
    getPaymentsByStatus,
    createPayment,
    clear,
  } = usePayment();

  const { users } = useUser();

  const {
    formState: { errors },
    control,
    setValue,
    getValues,
    handleSubmit,
  } = useForm<Partial<Payment_Partial>>();

  useEffect(() => {
    getPaymentsByStatus('PAID');

    console.log('Payments', payments);
  }, []);

  useEffect(() => {
    console.log('Fetched payments:', payments);
    setDisplayedPayments(payments);
  }, [payments]);

  const data = displayedPayments.map((payment) => ({
    id: payment.paymentId,
    paymentMethod: payment.paymentMethod,
    amount: payment.amount,
    status: payment.status,
    paymentDate: payment.paymentDate,
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
    const sorted = [...displayedPayments].sort((a, b) =>
      isAsc
        ? a.paymentId.localeCompare(b.paymentId)
        : b.paymentId.localeCompare(a.paymentId),
    );
    setDisplayedPayments(sorted);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  // const handleDeleteSelected = () => {
  //   if (!currentUser.roles.includes('ADMIN')) {
  //     alert('Only admins can delete tfacilities.');
  //     return;
  //   }

  //   const filtered = displayedPayments.filter(
  //     (user) => !selected.includes(user.userId),
  //   );
  //   setDisplayedPayments(filtered);
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
      await [getPaymentsByStatus('PAID')];
      console.log('Data refetched successfully!');
    } catch (err) {
      console.error('Failed to refetch data:', err);
    }
  };

  const onSavePayment = async (paymentData: Partial<Payment_Partial>) => {
    try {
      const newPayment = {
        // paymentId: '',
        userId: selectedId,
        // transactionId: paymentData.transactionId || '',
        paymentMethod: paymentData.paymentMethod || 'CASH',
        amount: Number(paymentData.amount) || 0,
        status: (paymentData.status as PaymentStatus) || 'PAID',
        paymentDate: new Date().toISOString(),
      };

      console.log('💥 newPayment = ', newPayment);

      const result = await createPayment(newPayment);
      console.log('Payment created:', result);

      alert('Upload successful!');

      setDisplayedPayments((prev) => [
        ...prev,
        {
          // paymentId: paymentData.paymentId,
          userId: paymentData.userId,
          // transactionId: paymentData.transactionId,
          paymentMethod: paymentData.paymentMethod,
          amount: paymentData.amount,
          status: paymentData.status,
          paymentDate: paymentData.paymentDate,
        },
      ]);

      setCreateModalVisible(false);
      refetch();
    } catch (err) {
      console.error('Upload failed!', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('paymentManagement')}</Text>
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
                    className={styles.paymentNameText}
                    type="Caption 1 Bold"
                  >
                    Payment id
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Payment method</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Amount</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Status</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Payment date</Text>
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
                    <Text type="Body 2 Bold">{row.id}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.paymentMethod}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.amount}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.status}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.paymentDate}</Text>
                  </TableCell>
                  {/* <TableCell>
                    <div className={styles.userActions}>
                      <img
                        src={edit}
                        onClick={() => {
                          const planToEdit = displayedPayments.find(
                            (plan) => plan.planId === row.id,
                          );

                          if (planToEdit) {
                            setSelectedPayment({
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
                  </TableCell> */}
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
              setSelectedPayment(undefined);
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
              {selectedPayment ? t('editPlan') : t('createNewPayment')}
            </Text>

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
                  {users.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.fullName}
                    </option>
                  ))}
                </select>
              )}
              name="userId"
            />

            <Controller
              control={control}
              rules={{
                required: t('amountRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('amount')}
                  placeholder={t('amountPlaceholder')}
                  onClear={() => setValue('amount', 0)}
                  error={errors.amount?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="amount"
            />

            <Controller
              control={control}
              rules={{
                required: t('paymentDateRequired'),
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label={t('paymentDate')}
                  placeholder={t('paymentDatePlaceholder')}
                  onClear={() => setValue('paymentDate', '')}
                  error={errors.paymentDate?.message}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                />
              )}
              name="paymentDate"
            />

            {/* <Controller
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
                  {payments.map((payment) => (
                    <option key={payment.paymentId} value={payment.paymentId}>
                      {payment.paymentMethod}
                    </option>
                  ))}
                </select>
              )}
              name="paymentMethod"
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
                  if (!selectedPayment) onSavePayment(data);
                })}
              />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
