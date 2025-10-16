import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import { Plus, Search, } from 'lucide-react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { MyInput } from 'components/Atoms/Form';
import { useLocation } from 'react-router-dom';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import { Organization } from './interface/organization.interface';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';
import OrganizationList from './_components/OrganizationList';

const OrganizationPage = () => {
  const { t } = useTranslation()
  const location = useLocation()
  const [showModal, setShowModal] = useState(false);
  const searchValue: any = paramsStrToObj(location.search)
  const { search, setSearch, handleSearch } = useSearch();

  const breadCrumbs = [
    {
      label: t('Organization'),
      url: '#'
    }
  ];

  const { data, refetch } = useGetAllQuery<{ data: Organization[] }>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {
      search: searchValue.search
    }
  })

  return (
    <PageContentWrapper paginationProps={<MyPagination total={get(data, "total")} />}>
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Organization')}</h1>
        <MyBreadCrumb items={breadCrumbs} />
      </div>

      <MyDivider />
      <div className='flex items-center justify-between'>
        <MyInput
          onKeyUp={(event) => {
            if (event.key === KeyTypeEnum.enter) {
              handleSearch();
            } else {
              setSearch((event.target as HTMLInputElement).value);
            }
          }}
          defaultValue={search}
          startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
          className="w-[300px] dark:bg-bg-input-dark"
          placeholder={t('Search...')}
        />
        <div className='flex items-center gap-4'>
          <MyButton
            startIcon={<Plus />}
            onClick={() => setShowModal(true)}
            allowedRoles={['ADMIN']}
            variant="primary"
            className="[&_svg]:stroke-bg-white text-sm w-[200px] dark:text-text-base">
            {t('Add Organization')}
          </MyButton>
          <MyButton allowedRoles={['ADMIN']} variant='secondary'>{t("Filters")}</MyButton>
        </div>
      </div>
      <MyDivider />
      <OrganizationList data={data} refetch={refetch} setShowModal={setShowModal} showModal={showModal} />
    </PageContentWrapper>
  );
}

export default OrganizationPage;
