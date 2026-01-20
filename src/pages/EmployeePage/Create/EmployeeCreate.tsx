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
          // variant="primary"
            className={`
                text-sm w-[230px]
                bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
                [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
              `}
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
