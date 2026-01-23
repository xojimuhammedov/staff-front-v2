import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import React from 'react';
import Form from './_components/Form';
import { ArrowLeft } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const EmployeeCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Employees'),
      url: '#'
    }
  ];
  return (
    <PageContentWrapper>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col">
          <h1 className="headers-core text-text-base dark:text-text-title-dark">
            {t('Add new employee')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => navigate('/employees')}
          variant="primary"
            className={`text-sm w-[230px] [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          startIcon={<ArrowLeft />}>
          {t('Back to employees list')}
        </MyButton>
      </div>
      <MyDivider />
      <Form />
    </PageContentWrapper>
  );

}

export default EmployeeCreate;
