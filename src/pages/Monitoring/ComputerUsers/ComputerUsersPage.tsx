import React from 'react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import ComputerUsersList from './_components/ComputerUsersList';
import { searchValue } from 'types/search';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';

function ComputerUsersPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const searchValue: searchValue = paramsStrToObj(location.search);
  
  const breadCrumbs = [
    {
      label: t('Computer users'),
      url: '/monitoring/computerUsers',
    },
  ];

  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Computer users')}
          </h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
      </div>
      <ComputerUsersList searchValue={searchValue} />
    </PageContentWrapper>
  );
}

export default ComputerUsersPage;
