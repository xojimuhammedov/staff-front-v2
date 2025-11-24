import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import VisitorTable from './_components/VisitorTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';
import { useState } from 'react';

const VisitorPage = () => {
  const { t } = useTranslation()
  const [show, setShow] = useState(false)
  const breadCrumbs = [
    {
      label: t('Visitor'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper>
      <div className='flex items-center justify-between'>
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Visitor')}</h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          startIcon={<Plus />}
          onClick={() => setShow(true)}
          allowedRoles={['ADMIN', "HR", "GUARD"]}
          variant="primary"
          className="[&_svg]:stroke-bg-white w-[160px] text-sm">
          {t('Create visitor')}
        </MyButton>
      </div>
      <VisitorTable show={show} setShow={setShow} />
    </PageContentWrapper>
  );
}

export default VisitorPage;
