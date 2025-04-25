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
import { useState } from 'react';

import { Text } from '@/components/Text';
import styles from './Timekeeping.module.scss';
import { useTranslation } from 'react-i18next';
import { Button as CustomButton } from '@/components/Button';
import edit from '@/assets/icons/edit.png';
import { DeleteOutlined } from '@ant-design/icons';

export const Timekeeping = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  // Mock data for timekeeping
  const timekeepingData = [
    {
      id: '1',
      coachName: 'John Doe',
      branchName: 'Gym Hà Đông',
      facilityName: 'Gym 8',
      startTime: '08:00 AM',
    },
    {
      id: '2',
      coachName: 'Jane Smith',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Yoga 6',
      startTime: '09:00 AM',
    },
    {
      id: '3',
      coachName: 'Mike Johnson',
      branchName: 'Gym Quận 1',
      facilityName: 'Relaxing',
      startTime: '10:00 AM',
    },
    {
      id: '4',
      coachName: 'Emily Davis',
      branchName: 'Gym Hà Đông',
      facilityName: 'Super Vip',
      startTime: '07:30 AM',
    },
    {
      id: '5',
      coachName: 'Chris Wilson',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Relaxing',
      startTime: '11:00 AM',
    },
    {
      id: '6',
      coachName: 'Sarah Brown',
      branchName: 'Gym Hà Đông',
      facilityName: 'Gym 10',
      startTime: '06:00 AM',
    },
    {
      id: '7',
      coachName: 'David Miller',
      branchName: 'Gym Quận 1',
      facilityName: 'Sakuna 1',
      startTime: '08:30 AM',
    },
    {
      id: '8',
      coachName: 'Laura Taylor',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Relax 8',
      startTime: '09:30 AM',
    },
    {
      id: '9',
      coachName: 'James Anderson',
      branchName: 'Gym Hà Đông',
      facilityName: 'Lyon',
      startTime: '10:30 AM',
    },
    {
      id: '10',
      coachName: 'Linda Thomas',
      branchName: 'Gym Quận 1',
      facilityName: 'Crossfit',
      startTime: '07:00 AM',
    },
    {
      id: '11',
      coachName: 'Robert Jackson',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Push up 7',
      startTime: '11:30 AM',
    },
    {
      id: '12',
      coachName: 'Patricia White',
      branchName: 'Gym Quận 1',
      facilityName: 'Gym 11',
      startTime: '12:00 PM',
    },
    {
      id: '13',
      coachName: 'Charles Harris',
      branchName: 'Gym Hà Đông',
      facilityName: 'Relax 6',
      startTime: '06:30 AM',
    },
    {
      id: '14',
      coachName: 'Barbara Martin',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Pull up 5',
      startTime: '01:00 PM',
    },
    {
      id: '15',
      coachName: 'Thomas Thompson',
      branchName: 'Gym Quận 1',
      facilityName: 'Relaxing 9',
      startTime: '02:00 PM',
    },
    {
      id: '16',
      coachName: 'Susan Garcia',
      branchName: 'Gym Quận 1',
      facilityName: 'Muscle 2',
      startTime: '03:00 PM',
    },
    {
      id: '17',
      coachName: 'Daniel Martinez',
      branchName: 'Gym Hà Đông',
      facilityName: 'Fitness 8',
      startTime: '04:00 PM',
    },
    {
      id: '18',
      coachName: 'Jessica Robinson',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Gym 12',
      startTime: '05:00 PM',
    },
    {
      id: '19',
      coachName: 'Paul Clark',
      branchName: 'Gym Biên Hòa',
      facilityName: 'Support room',
      startTime: '06:00 PM',
    },
    {
      id: '20',
      coachName: 'Nancy Rodriguez',
      branchName: 'Gym Hà Đông',
      facilityName: 'Motivating 10',
      startTime: '07:00 PM',
    },
  ];

  const handleSort = () => {
    const isAsc = order === 'asc';
    const sorted = [...timekeepingData].sort((a, b) =>
      isAsc
        ? a.coachName.localeCompare(b.coachName)
        : b.coachName.localeCompare(a.coachName),
    );
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

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('timekeepingManagement')}</Text>
        </span>
      </div>
      <TableContainer component={Paper} className={styles.table}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel active direction={order} onClick={handleSort}>
                  <Text className={styles.coachNameText} type="Caption 1 Bold">
                    Coach name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Branch Name</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Facility Name</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Start Time</Text>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {timekeepingData
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id} hover>
                  <TableCell>
                    <Text type="Body 2 Bold">{row.coachName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.branchName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.facilityName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.startTime}</Text>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 20]}
        component="div"
        count={timekeepingData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </div>
  );
};
