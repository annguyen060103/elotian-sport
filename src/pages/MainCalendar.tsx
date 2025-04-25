import { MyCalendar } from './MyCalendar';

export const MainCalendar = () => {
  const branchId = 'eee33365-06ec-4043-a758-e10130830f21'; // Replace with actual teacher ID logic

  return (
    <div style={{ padding: '20px', backgroundColor: 'red' }}>
      <MyCalendar branchId={branchId} />
    </div>
  );
};
