import React from 'react';
import { useTranslation } from 'react-i18next';

const GuardInfo = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-text-base dark:text-text-title-dark mb-4">
        {t('Guard Info')}
      </h1>
      <p className="text-text-base dark:text-text-title-dark">
        {t('Guard information will be displayed here')}
      </p>
    </div>
  );
};

export default GuardInfo;
