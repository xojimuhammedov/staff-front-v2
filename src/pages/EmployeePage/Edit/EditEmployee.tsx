import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { ArrowLeft } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from './_components/Form';

const EditEmployee = () => {
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
            {t('Edit employee')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => navigate('/employees')}
          
          variant="secondary"
          startIcon={<ArrowLeft />}>
          {t('Back to employees list')}
        </MyButton>
      </div>
      <MyDivider />
      <Form />
    </PageContentWrapper>
  );

}

export default EditEmployee;
