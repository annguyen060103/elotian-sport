import { useTranslation } from 'react-i18next';
import styles from './Student.module.scss';
import { Text } from '@/components/Text';
import { Button, Popconfirm } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
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

interface StudentData {
  id: string;
  studentName: string;
  age: string;
  seniority: string;
}

export const Student = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const initialData: StudentData[] = [
    {
      id: '1',
      studentName: 'React Basic',
      age: 'Monday - Wednesday',
      seniority: 'July 2025',
    },
    {
      id: '2',
      studentName: 'Node.js Advanced',
      age: 'Tuesday - Thursday',
      seniority: 'August 2025',
    },
    {
      id: '3',
      studentName: 'Python for Data Science',
      age: 'Weekend',
      seniority: 'September 2025',
    },
    {
      id: '4',
      studentName: 'UI/UX Design',
      age: 'Tuesday - Thursday',
      seniority: 'November 2025',
    },
    {
      id: '5',
      studentName: 'Mobile App Development',
      age: 'Tuesday - Saturday',
      seniority: 'March 2026',
    },
    {
      id: '6',
      studentName: 'Kubernetes Administration',
      age: 'Wednesday - Friday',
      seniority: 'May 2026',
    },
    {
      id: '7',
      studentName: 'Blockchain Fundamentals',
      age: 'Monday - Thursday',
      seniority: 'June 2026',
    },
    {
      id: '8',
      studentName: 'Java Spring Boot',
      age: 'Weekend',
      seniority: 'July 2026',
    },
    {
      id: '9',
      studentName: 'AWS Cloud Practitioner',
      age: 'Monday - Wednesday',
      seniority: 'August 2026',
    },
    {
      id: '10',
      studentName: 'Data Visualization with D3.js',
      age: 'Tuesday - Friday',
      seniority: 'September 2026',
    },
  ];

  const [data, setData] = useState<StudentData[]>(initialData);
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
        ? a.studentName.localeCompare(b.studentName)
        : b.studentName.localeCompare(a.studentName),
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
    setPage(0); // reset về page đầu
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <span className={styles.title}>
            <Text type="Headline 1">{t('studentManagement')}</Text>
          </span>
        </div>
        <div className={styles.rightSection}>
          <Button
            icon={<PlusOutlined />}
            className={styles.addNewButton}
          ></Button>
          <div className={styles.deleteButtonWrapper}>
            <Popconfirm
              title="Are you sure you want to delete?"
              onConfirm={handleDeleteSelected}
            >
              <Button
                icon={<DeleteOutlined />}
                danger
                className={`${selected.length === 0 ? styles.hideDelete : ''}`}
              >
                Delete ({selected.length})
              </Button>
            </Popconfirm>
          </div>
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
                    className={styles.studentNameText}
                    type="Caption 1 Bold"
                  >
                    Student name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Age</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Seniority</Text>
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
                    <Text type="Body 2 Bold">{row.studentName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.seniority}</Text>
                  </TableCell>
                  <TableCell></TableCell>
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
