import React, { useEffect, useState } from 'react';
import { Badge, Calendar } from 'antd';
import type { BadgeProps, CalendarProps } from 'antd';
import type { Dayjs } from 'dayjs';
import { useClassSchedule } from '@/hooks/useClassSchedule';
import dayjs from 'dayjs';

export const MyCalendar = ({ branchId }: { branchId: string }) => {
  const { filter, schedules } = useClassSchedule();
  const [filteredSchedules, setFilteredSchedules] = useState<any[]>([]);

  useEffect(() => {
    const today = dayjs();
    const startOfMonth = today.startOf('month').toISOString();
    const endOfMonth = today.endOf('month').toISOString();

    filter({ branchId, startTime: startOfMonth, endTime: endOfMonth })
      .then(() => setFilteredSchedules(schedules))
      .catch(console.error);
  }, [branchId]);

  const dateCellRender = (value: Dayjs) => {
    const daySchedules = filteredSchedules.filter((schedule) =>
      dayjs(schedule.startTime).isSame(value, 'day'),
    );

    return (
      <ul className="events">
        {daySchedules.map((item) => (
          <li key={item.classScheduleId}>
            <Badge
              status={getStatusColor(item.status)}
              text={`Shift: ${item.shift}, ${item.classType}`}
            />
          </li>
        ))}
      </ul>
    );
  };

  const getStatusColor = (status: string): BadgeProps['status'] => {
    switch (status) {
      case 'SCHEDULED':
        return 'processing';
      case 'COMPLETED':
        return 'success';
      case 'CANCELED':
        return 'error';
      default:
        return 'default';
    }
  };

  const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
    if (info.type === 'date') return dateCellRender(current);
    return info.originNode;
  };

  return <Calendar cellRender={cellRender} />;
};
