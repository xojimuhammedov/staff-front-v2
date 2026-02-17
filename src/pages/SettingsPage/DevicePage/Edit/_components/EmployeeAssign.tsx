import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import deviceType from 'configs/deviceType';
import LeftEmployee from './LeftEmployee';
import FinalEmployee from './FinalEmployee';

function EmployeeAssign({ deviceId }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [statusRefetch, setStatusRefetch] = useState('');

  const deviceTypeOptions =
    deviceType?.map((d: any) => ({
      label: d.label,
      value: d.value,
    })) ?? [];

  return (
    <>
      <div className="w-full rounded-md bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">
        <div className="flex items-center justify-between">
          <LabelledCaption
            title={deviceId ? t('Edit employees') : t('Add employees')}
            subtitle={t('Create employees group and link to the door')}
          />
          <MyButton
            variant="primary"
            onClick={() => navigate('/settings?current-setting=deviceControl')}
            type="submit"
          >
            {t('Save changes')}
          </MyButton>
        </div>

        <MyDivider />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* LEFT PANEL */}
          <LeftEmployee
            deviceId={deviceId}
            deviceTypeOptions={deviceTypeOptions}
            statusRefetch={statusRefetch}
            setStatusRefetch={setStatusRefetch}
          />

          {/* RIGHT PANEL */}
          <FinalEmployee deviceId={deviceId} statusRefetch={statusRefetch}
            setStatusRefetch={setStatusRefetch} />
        </div>
      </div>
    </>
  );
}

export default EmployeeAssign;
