import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Form from './_components/Form';
import Button from 'components/Atoms/MyButton';

const EditVisitor = () => {
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
            {t('Edit Visitor')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <Button
          onClick={() => navigate('/visitor')}
          startIcon={<ArrowLeft />}
          variant="primary"
         className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}>
          {t('Back to visitors list')}
        </Button>
      </div>
      <MyDivider />
      <Form />
    </PageContentWrapper>
  );
};

export default EditVisitor;
