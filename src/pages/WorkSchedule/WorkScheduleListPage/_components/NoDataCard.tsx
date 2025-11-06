import React from 'react';
import NoDataIcon from 'assets/icons/NoDataIcon';
import { useTranslation } from 'react-i18next';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function NoDataCard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <NoDataIcon />
      <h2 className="text-xl font-medium leading-8  text-text-base">
        {t('You have not created any schedule yet')}
      </h2>
      <p className="text-base font-normal leading-8">
        {t("Click the 'Creat schedule' button and create a work schedule")}
      </p>
      <MyButton
        onClick={() => navigate('/policy/create')}
        variant="primary"
        className="[&_svg]:stroke-bg-white  text-sm"
        startIcon={<Plus />}>
        {t('Create a schedule')}
      </MyButton>
    </div>
  );
}

export default NoDataCard;
