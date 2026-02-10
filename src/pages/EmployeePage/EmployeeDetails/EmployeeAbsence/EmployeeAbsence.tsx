import MyDivider from 'components/Atoms/MyDivider';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import Create from './_components/Create';

const EmployeeAbsence = () => {
  const { t } = useTranslation();
  const { id } = useParams();

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="headers-core text-text-base dark:text-text-title-dark">{t('Employee absences')}</h1>
        <Create employeeId={id} />
      </div>
      <MyDivider />
    </>
  );
};

export default EmployeeAbsence;