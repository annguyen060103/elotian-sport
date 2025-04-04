import { Button, Popconfirm } from 'antd';
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

import { Text } from '@/components/Text';
import styles from './Equipment.module.scss';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import plus from '@/assets/icons/plus.svg';
import { Button as CustomButton } from '@/components/Button';

interface ReportData {
  id: string;
  equipmentName: string;
  purchaseDate: string;
  condition: string;
}

export const Report = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialData: ReportData[] = [
    {
      id: '1',
      equipmentName: 'John Doe',
      purchaseDate: '35',
      condition: '2023-2026',
    },
    {
      id: '2',
      equipmentName: 'Jane Smith',
      purchaseDate: '29',
      condition: '2022-2025',
    },
    {
      id: '3',
      equipmentName: 'Alice Johnson',
      purchaseDate: '40',
      condition: '2021-2024',
    },
    {
      id: '4',
      equipmentName: 'Bob Williams',
      purchaseDate: '32',
      condition: '2024-2027',
    },
    {
      id: '5',
      equipmentName: 'Eva Brown',
      purchaseDate: '27',
      condition: '2023-2026',
    },
    {
      id: '6',
      equipmentName: 'Chris Green',
      purchaseDate: '45',
      condition: '2020-2023',
    },
    {
      id: '7',
      equipmentName: 'Diana Prince',
      purchaseDate: '30',
      condition: '2023-2026',
    },
    {
      id: '8',
      equipmentName: 'Tony Stark',
      purchaseDate: '38',
      condition: '2022-2025',
    },
    {
      id: '9',
      equipmentName: 'Bruce Wayne',
      purchaseDate: '41',
      condition: '2021-2024',
    },
    {
      id: '10',
      equipmentName: 'Clark Kent',
      purchaseDate: '36',
      condition: '2023-2026',
    },
  ];

  const [data, setData] = useState<ReportData[]>(initialData);
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
        ? a.equipmentName.localeCompare(b.equipmentName)
        : b.equipmentName.localeCompare(a.equipmentName),
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
          <Text type="Headline 1">{t('reportManagement')}</Text>
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
                    className={styles.equipmentNameText}
                    type="Caption 1 Bold"
                  >
                    Equipment name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Purchase of day</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Condition</Text>
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
                    <Text type="Body 2 Bold">{row.equipmentName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.purchaseDate}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.condition}</Text>
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
