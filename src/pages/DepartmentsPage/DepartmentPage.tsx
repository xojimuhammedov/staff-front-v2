import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import { Plus, Search } from 'lucide-react';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import MyDivider from 'components/Atoms/MyDivider';
import { MyInput } from 'components/Atoms/Form';
import MyPagination from 'components/Atoms/MyPagination/Pagination';
import { Department } from './interface/department.interface';
import DepartmentList from './_components/DepartmentList';
import { paramsStrToObj } from 'utils/helper';
import { useSearch } from 'hooks/useSearch';
import { KeyTypeEnum } from 'enums/key-type.enum';
import Loading from 'assets/icons/Loading';

const DepartmentPage = () => {
  const { t } = useTranslation()
  const [showModal, setShowModal] = useState(false);
  const searchValue: any = paramsStrToObj(location.search)
  const { search, setSearch, handleSearch } = useSearch();

  const { data, refetch, isLoading } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {
      search: searchValue.search
    }
  })

  const breadCrumbs = [
    {
      label: t('Department'),
      url: '#'
    }
  ];

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <PageContentWrapper paginationProps={<MyPagination total={get(data, 'total')} />} >
      <div className="flex flex-col">
        <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Department')}</h1>
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
            variant="primary"
            allowedRoles={['ADMIN', "HR"]}
            className="[&_svg]:stroke-bg-white text-sm w-[200px] dark:text-text-base">
            {t('Add department')}
          </MyButton>
          <MyButton allowedRoles={['ADMIN', "HR"]} variant='secondary'>{t("Filters")}</MyButton>
        </div>
      </div>
      <MyDivider />
      <DepartmentList data={data} refetch={refetch} showModal={showModal} setShowModal={setShowModal} />
    </PageContentWrapper>
  );
}

export default DepartmentPage;
