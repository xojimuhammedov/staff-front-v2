import { useTranslation } from 'react-i18next';
import MyDivider from 'components/Atoms/MyDivider';

const TableSettings = () => {
  const { t } = useTranslation();

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Table settings')}
          </h1>
          <p className="text-text-base dark:text-text-title-dark">
            {t('Configure table settings and preferences')}
          </p>
        </div>
      </div>
      <MyDivider />
      <div className="mt-6">
        <p className="text-text-base dark:text-text-title-dark">
          {t('Settings content will be displayed here')}
        </p>
      </div>
    </>
  );
};

export default TableSettings;
