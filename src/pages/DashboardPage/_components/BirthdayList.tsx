import { useTranslation } from 'react-i18next';
import { useDashboard } from '../hooks/useDashboard';
import { BirthdayCard } from './BirthdayCard';

const BirthdayList = () => {
  const { birthdayData } = useDashboard();
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="headers-core text-sm  dark:text-text-title-dark mb-4">
        {t('Birthdays')}
      </h1>
      <div className="flex flex-col gap-3">
        {birthdayData?.map((employee: any, idx: number) => (
          <BirthdayCard employee={employee} index={idx + 1} />
        ))}
      </div>
    </div>
  );
};

export default BirthdayList;
