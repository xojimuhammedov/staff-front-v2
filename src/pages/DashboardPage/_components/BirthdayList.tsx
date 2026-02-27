import { useDashboard } from '../hooks/useDashboard';
import { BirthdayCard } from './BirthdayCard';

const BirthdayList = () => {
  const { birthdayData } = useDashboard();

  return (
    <div>
      <div className="flex flex-col gap-3">
        {birthdayData?.map((employee: any, idx: number) => (
          <BirthdayCard employee={employee} index={idx + 1} />
        ))}
      </div>
    </div>
  );
};

export default BirthdayList;
