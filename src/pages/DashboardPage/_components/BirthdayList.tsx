import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';
import { BirthdayCard } from './BirthdayCard';

const BirthdayList = () => {
  const { birthdayData } = useDashboard();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-4">
        <h1 className="headers-core text-base dark:text-text-title-dark">
          {t('Birthdays')}
        </h1>
      </div>
      <div className="flex flex-col gap-3 overflow-y-auto pr-1 h-[370px]">
        {birthdayData?.map((employee: any, idx: number) => (
          <BirthdayCard employee={employee} index={idx + 1} />
        ))}
      </div>
    </div>
  );
};

export default BirthdayList;
