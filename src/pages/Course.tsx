import { useTranslation } from 'react-i18next';
import styles from './Course.module.scss';
import { Text } from '@/components/Text';
import { Button, Table, TableColumnsType } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

export const Course = () => {
  const { t } = useTranslation();

  interface CourseData {
    key: string;
    courseName: string;
    timetable: string;
    schedule: string;
    trainerName: string;
  }

  const dataSource: CourseData[] = [
    {
      key: '1',
      courseName: 'React Basic',
      timetable: 'Monday - Wednesday',
      schedule: 'July 2025',
      trainerName: 'John Doe',
    },
    {
      key: '2',
      courseName: 'Node.js Advanced',
      timetable: 'Tuesday - Thursday',
      schedule: 'August 2025',
      trainerName: 'Jane Smith',
    },
    {
      key: '3',
      courseName: 'Python for Data Science',
      timetable: 'Weekend',
      schedule: 'September 2025',
      trainerName: 'Alice Johnson',
    },
    {
      key: '4',
      courseName: 'DevOps Essentials',
      timetable: 'Monday - Friday',
      schedule: 'October 2025',
      trainerName: 'Bob Williams',
    },
    {
      key: '5',
      courseName: 'UI/UX Design',
      timetable: 'Tuesday - Thursday',
      schedule: 'November 2025',
      trainerName: 'Eva Brown',
    },
    {
      key: '6',
      courseName: 'Cloud Computing',
      timetable: 'Wednesday - Friday',
      schedule: 'December 2025',
      trainerName: 'Chris Green',
    },
    {
      key: '7',
      courseName: 'Cybersecurity Basics',
      timetable: 'Weekend',
      schedule: 'January 2026',
      trainerName: 'Diana Prince',
    },
    {
      key: '8',
      courseName: 'AI & Machine Learning',
      timetable: 'Monday - Thursday',
      schedule: 'February 2026',
      trainerName: 'Tony Stark',
    },
    {
      key: '9',
      courseName: 'Mobile App Development',
      timetable: 'Tuesday - Saturday',
      schedule: 'March 2026',
      trainerName: 'Bruce Wayne',
    },
    {
      key: '10',
      courseName: 'Database Management',
      timetable: 'Monday - Wednesday',
      schedule: 'April 2026',
      trainerName: 'Clark Kent',
    },
  ];

  const columns: TableColumnsType<CourseData> = [
    {
      title: (
        <Text className={styles.courseNameText} type="Caption 1 Bold">
          Course name
        </Text>
      ),
      dataIndex: 'courseName',
      render: (text) => <Text type="Body 2 Bold">{text}</Text>,
    },
    {
      title: (
        <Text className={styles.remainingText} type="Caption 1 Medium">
          Timetable
        </Text>
      ),
      dataIndex: ['timetable'],
      render: (text) => <Text type="Body 2 Regular">{text}</Text>,
    },
    {
      title: (
        <Text className={styles.remainingText} type="Caption 1 Medium">
          Training schedule
        </Text>
      ),
      dataIndex: 'schedule',
      render: (text) => <Text type="Body 2 Regular">{text}</Text>,
    },
    {
      title: (
        <Text className={styles.remainingText} type="Caption 1 Medium">
          Trainer
        </Text>
      ),
      dataIndex: 'trainerName',
      render: (text) => <Text type="Body 2 Regular">{text}</Text>,
    },
    {
      title: '',
      render: () => (
        <div className={styles.userActions}>
          <Button
            icon={<DeleteOutlined />}
            className={styles.deletedButton}
          ></Button>
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.topSection}>
        <span className={styles.title}>
          <Text type="Headline 1"> {t('courseManagement')}</Text>
        </span>
        <Button
          icon={<PlusOutlined />}
          className={styles.addNewButton}
        ></Button>
      </div>
      <div className={styles.table}>
        <Table columns={columns} dataSource={dataSource}></Table>
      </div>
    </div>
  );
};
