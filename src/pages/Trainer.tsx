import { Button, Popconfirm } from "antd";
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
} from "@mui/material";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";

import { Text } from "@/components/Text";
import styles from "./Trainer.module.scss";
import { useTranslation } from "react-i18next";
import { useUser } from "@/hooks/useUser";

interface TrainerData {
  id: string;
  trainerName: string;
  age: string;
  contractPeriod: string;
  seniority: string;
}

export const Trainer = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
  } = useUser();

  useEffect(() => {
    // Gọi API getByRole khi load page
    getByRole("COACH");

    getMyInfo();

    console.log("Coach", users);
    //console.log(currentUser);
  }, []);

  const initialData: TrainerData[] = [
    {
      id: "1",
      trainerName: "John Doe",
      age: "35",
      contractPeriod: "2023-2026",
      seniority: "5 years",
    },
    {
      id: "2",
      trainerName: "Jane Smith",
      age: "29",
      contractPeriod: "2022-2025",
      seniority: "3 years",
    },
    {
      id: "3",
      trainerName: "Alice Johnson",
      age: "40",
      contractPeriod: "2021-2024",
      seniority: "10 years",
    },
    {
      id: "4",
      trainerName: "Bob Williams",
      age: "32",
      contractPeriod: "2024-2027",
      seniority: "4 years",
    },
    {
      id: "5",
      trainerName: "Eva Brown",
      age: "27",
      contractPeriod: "2023-2026",
      seniority: "2 years",
    },
    {
      id: "6",
      trainerName: "Chris Green",
      age: "45",
      contractPeriod: "2020-2023",
      seniority: "15 years",
    },
    {
      id: "7",
      trainerName: "Diana Prince",
      age: "30",
      contractPeriod: "2023-2026",
      seniority: "6 years",
    },
    {
      id: "8",
      trainerName: "Tony Stark",
      age: "38",
      contractPeriod: "2022-2025",
      seniority: "12 years",
    },
    {
      id: "9",
      trainerName: "Bruce Wayne",
      age: "41",
      contractPeriod: "2021-2024",
      seniority: "8 years",
    },
    {
      id: "10",
      trainerName: "Clark Kent",
      age: "36",
      contractPeriod: "2023-2026",
      seniority: "7 years",
    },
  ];

  const [data, setData] = useState<TrainerData[]>(initialData);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  const handleSelect = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelected(checked ? data.map((item) => item.id) : []);
  };

  const handleSort = () => {
    const isAsc = order === "asc";
    const sorted = [...data].sort((a, b) =>
      isAsc
        ? a.trainerName.localeCompare(b.trainerName)
        : b.trainerName.localeCompare(a.trainerName)
    );
    setData(sorted);
    setOrder(isAsc ? "desc" : "asc");
  };

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((item) => !selected.includes(item.id)));
    setSelected([]);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // reset về page đầu
  };

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <div className={styles.leftSection}>
          <span className={styles.title}>
            <Text type="Headline 1">{t("trainerManagement")}</Text>
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
                className={`${selected.length === 0 ? styles.hideDelete : ""}`}
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
                <Text type="Caption 1 Medium">Contract period</Text>
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
                    <Text type="Body 2 Bold">{row.trainerName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.age}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.contractPeriod}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.seniority}</Text>
                  </TableCell>
                  <TableCell>
                    <Popconfirm
                      title="Are you sure you want to delete?"
                      onConfirm={() =>
                        setData((prev) =>
                          prev.filter((item) => item.id !== row.id)
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
