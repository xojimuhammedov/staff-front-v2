import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import Form from './_components/Form';
import { ArrowLeft } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';


const VisitorCreate = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const breadCrumbs = [
    {
      label: t('Visitors'),
      url: '#'
    }
  ];
  return (
    <PageContentWrapper>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col">
          <h1 className="headers-core text-text-base dark:text-text-title-dark">
            {t('Create new visitor')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => navigate('/visitor')}
          variant="primary"
          className={`text-sm min-w-max dark:bg-bg-form dark:text-white [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          startIcon={<ArrowLeft />}>
          {t('Back to visitors list')}
        </MyButton>
      </div>
      <MyDivider />
      <Form />
    </PageContentWrapper>
  );

}

export default VisitorCreate;
