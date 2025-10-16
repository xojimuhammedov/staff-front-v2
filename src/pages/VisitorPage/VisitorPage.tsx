import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import VisitorTable from './_components/VisitorTable';

const VisitorPage = () => {
  const { t } = useTranslation()

  const breadCrumbs = [
    {
      label: t('Visitor'),
      url: '#'
    }
  ];

  return (
    <PageContentWrapper>
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Visitor')}</h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>
      <MyDivider />
      <VisitorTable />
    </PageContentWrapper>
  );
}

export default VisitorPage;
