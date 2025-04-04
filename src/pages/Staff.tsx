import { useTranslation } from 'react-i18next';
import styles from './Staff.module.scss';
import { Text } from '@/components/Text';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Paper,
  TableSortLabel,
  TablePagination,
} from '@mui/material';
import { useState } from 'react';
import plus from '@/assets/icons/plus.svg';
import { Button as CustomButton } from '@/components/Button';

interface TrainerData {
  id: string;
  staffName: string;
  age: string;
  contractPeriod: string;
  role: string;
}

export const Staff = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialData: TrainerData[] = [
    {
      id: '1',
      staffName: 'John Doe',
      age: '35',
      contractPeriod: '2023-2026',
      role: '5 years',
    },
    {
      id: '2',
      staffName: 'Jane Smith',
      age: '29',
      contractPeriod: '2022-2025',
      role: '3 years',
    },
    {
      id: '3',
      staffName: 'Alice Johnson',
      age: '40',
      contractPeriod: '2021-2024',
      role: '10 years',
    },
    {
      id: '4',
      staffName: 'Bob Williams',
      age: '32',
      contractPeriod: '2024-2027',
      role: '4 years',
    },
    {
      id: '5',
      staffName: 'Eva Brown',
      age: '27',
      contractPeriod: '2023-2026',
      role: '2 years',
    },
    {
      id: '6',
      staffName: 'Chris Green',
      age: '45',
      contractPeriod: '2020-2023',
      role: '15 years',
    },
    {
      id: '7',
      staffName: 'Diana Prince',
      age: '30',
      contractPeriod: '2023-2026',
      role: '6 years',
    },
    {
      id: '8',
      staffName: 'Tony Stark',
      age: '38',
      contractPeriod: '2022-2025',
      role: '12 years',
    },
    {
      id: '9',
      staffName: 'Bruce Wayne',
      age: '41',
      contractPeriod: '2021-2024',
      role: '8 years',
    },
    {
      id: '10',
      staffName: 'Clark Kent',
      age: '36',
      contractPeriod: '2023-2026',
      role: '7 years',
    },
  ];

  const [data, setData] = useState<TrainerData[]>(initialData);
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
    const sorted = [...data].sort((a, b) =>
      isAsc
        ? a.staffName.localeCompare(b.staffName)
        : b.staffName.localeCompare(a.staffName),
    );
    setData(sorted);
    setOrder(isAsc ? 'desc' : 'asc');
  };

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((item) => !selected.includes(item.id)));
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

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1">{t('staffManagement')}</Text>
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
                  <Text className={styles.staffNameText} type="Caption 1 Bold">
                    Staff name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Age</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Contract period</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Role</Text>
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
                    <Text type="Body 2 Bold">{row.staffName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.contractPeriod}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.role}</Text>
                  </TableCell>
                  <TableCell>
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      onConfirm={() =>
                        setData((prev) =>
                          prev.filter((item) => item.id !== row.id),
                        )
                      }
                    >
                      <Button icon={<DeleteOutlined />} danger />
                    </Popconfirm>
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
    </div>
  );
};
