import { useTranslation } from 'react-i18next';
import styles from './Token.module.scss';
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

interface TokenData {
  id: string;
  token: string;
  userId: string;
  createAt: string;
  tokenExpiration: string;
  status: string;
}

export const Token = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialData: TokenData[] = [
    {
      id: '1',
      token: 'John Doe',
      userId: '35',
      createAt: '2023-2026',
      tokenExpiration: '5 years',
      status: 'Active',
    },
    {
      id: '2',
      token: 'Jane Smith',
      userId: '29',
      createAt: '2022-2025',
      tokenExpiration: '3 years',
      status: 'Active',
    },
    {
      id: '3',
      token: 'Alice Johnson',
      userId: '40',
      createAt: '2021-2024',
      tokenExpiration: '10 years',
      status: 'Active',
    },
    {
      id: '4',
      token: 'Bob Williams',
      userId: '32',
      createAt: '2024-2027',
      tokenExpiration: '4 years',
      status: 'Active',
    },
    {
      id: '5',
      token: 'Eva Brown',
      userId: '27',
      createAt: '2023-2026',
      tokenExpiration: '2 years',
      status: 'Active',
    },
    {
      id: '6',
      token: 'Chris Green',
      userId: '45',
      createAt: '2020-2023',
      tokenExpiration: '15 years',
      status: 'Active',
    },
    {
      id: '7',
      token: 'Diana Prince',
      userId: '30',
      createAt: '2023-2026',
      tokenExpiration: '6 years',
      status: 'Active',
    },
    {
      id: '8',
      token: 'Tony Stark',
      userId: '38',
      createAt: '2022-2025',
      tokenExpiration: '12 years',
      status: 'Active',
    },
    {
      id: '9',
      token: 'Bruce Wayne',
      userId: '41',
      createAt: '2021-2024',
      tokenExpiration: '8 years',
      status: 'Active',
    },
    {
      id: '10',
      token: 'Clark Kent',
      userId: '36',
      createAt: '2023-2026',
      tokenExpiration: '7 years',
      status: 'Active',
    },
  ];

  const [data, setData] = useState<TokenData[]>(initialData);
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
      isAsc ? a.token.localeCompare(b.token) : b.token.localeCompare(a.token),
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
          <Text type="Headline 1">{t('tokenManagement')}</Text>
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
                  <Text className={styles.tokenNameText} type="Caption 1 Bold">
                    Token id
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">User id</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Create of day</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Token expiration</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Token status</Text>
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
                    <Text type="Body 2 Bold">{row.token}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.userId}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.createAt}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.tokenExpiration}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.status}</Text>
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
