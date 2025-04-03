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
import styles from "./Course.module.scss";
import { useBranch } from "@/hooks/useBranch";
import { useFacility } from "@/hooks/useFacility";
import { useTranslation } from "react-i18next";

interface CourseData {
  id: string;
  courseName: string;
  timetable: string;
  schedule: string;
  trainerName: string;
}

export const Course = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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
    addUser,
    removeUser,
    clear: clearBranch,
  } = useBranch();

  const {
    facilities,
    currentFacility,
    loading: facilityLoading,
    error: facilityError,
    getAll: getAllFacilities,
    getById: getFacilityById,
    getByBranch: getFacilitiesByBranch,
    create: createFacility,
    update: updateFacility,
    remove: removeFacility,
    clear: clearFacility,
  } = useFacility();

  useEffect(() => {
    getAllBranches();
    //getBranchById(branches[0].branchId);
    console.log("Branchs", branches);
    //console.log("This branch", currentBranch.branchId);

    return () => {};
  }, []);

  useEffect(() => {
    // getAllFacilities();
    //console.log("facilities", facilities);

    return () => {};
  }, []);

  useEffect(() => {
    getFacilitiesByBranch(currentBranch.branchId);
    console.log("facilites of branch", facilities);
    return () => {};
  }, []);

  const initialData: CourseData[] = [
    {
      id: "1",
      courseName: "React Basic",
      timetable: "Monday - Wednesday",
      schedule: "July 2025",
      trainerName: "John Doe",
    },
    {
      id: "2",
      courseName: "Node.js Advanced",
      timetable: "Tuesday - Thursday",
      schedule: "August 2025",
      trainerName: "Jane Smith",
    },
    {
      id: "3",
      courseName: "Python for Data Science",
      timetable: "Weekend",
      schedule: "September 2025",
      trainerName: "Alice Johnson",
    },
    {
      id: "4",
      courseName: "UI/UX Design",
      timetable: "Tuesday - Thursday",
      schedule: "November 2025",
      trainerName: "Eva Brown",
    },
    {
      id: "5",
      courseName: "Mobile App Development",
      timetable: "Tuesday - Saturday",
      schedule: "March 2026",
      trainerName: "Bruce Wayne",
    },
    {
      id: "6",
      courseName: "Kubernetes Administration",
      timetable: "Wednesday - Friday",
      schedule: "May 2026",
      trainerName: "Peter Parker",
    },
    {
      id: "7",
      courseName: "Blockchain Fundamentals",
      timetable: "Monday - Thursday",
      schedule: "June 2026",
      trainerName: "Natasha Romanoff",
    },
    {
      id: "8",
      courseName: "Java Spring Boot",
      timetable: "Weekend",
      schedule: "July 2026",
      trainerName: "Stephen Strange",
    },
    {
      id: "9",
      courseName: "AWS Cloud Practitioner",
      timetable: "Monday - Wednesday",
      schedule: "August 2026",
      trainerName: "Steve Rogers",
    },
    {
      id: "10",
      courseName: "Data Visualization with D3.js",
      timetable: "Tuesday - Friday",
      schedule: "September 2026",
      trainerName: "Wanda Maximoff",
    },
  ];

  const [data, setData] = useState<CourseData[]>(initialData);
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
        ? a.courseName.localeCompare(b.courseName)
        : b.courseName.localeCompare(a.courseName)
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
            <Text type="Headline 1">{t("courseManagement")}</Text>
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
                  <Text className={styles.courseNameText} type="Caption 1 Bold">
                    Course name
                  </Text>
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Timetable</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Training schedule</Text>
              </TableCell>
              <TableCell>
                <Text type="Caption 1 Medium">Trainer</Text>
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
                    <Text type="Body 2 Bold">{row.courseName}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.timetable}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.schedule}</Text>
                  </TableCell>
                  <TableCell>
                    <Text type="Body 2 Regular">{row.trainerName}</Text>
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
