import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Search } from 'lucide-react';
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
import { useLocation, useNavigate } from 'react-router-dom';

interface searchValue {
  page?: string,
  search?: string,
  organizationId?: string,
  subdepartmentId?: string
}

const DepartmentPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false);
  const location = useLocation()
  const searchValue: searchValue = paramsStrToObj(location.search)
  const { search, setSearch, handleSearch } = useSearch();
  const { data, refetch, isLoading } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {
      search: searchValue.search,
      organizationId: searchValue.organizationId,
      parentId: searchValue.subdepartmentId
    }
  })

  const breadCrumbs = [
    {
      label: searchValue.subdepartmentId ? t("Sub Department") : t("Department"),
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
      <div className='flex items-center justify-between'>
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">{searchValue?.subdepartmentId ? t("Sub Department") : t("Department")}</h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <div className='flex items-center gap-4'>
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
            className="dark:bg-bg-input-dark"
            placeholder={t('Search...')}
          />
          <div className='flex items-center gap-4'>
            <MyButton
              startIcon={<Plus />}
              onClick={() => setShowModal(true)}
              variant="primary"
              allowedRoles={['ADMIN', "HR"]}
              className="[&_svg]:stroke-bg-white text-sm w-[180px] dark:text-text-base">
              {t('Add department')}
            </MyButton>
            {
              searchValue.subdepartmentId && (
                <MyButton
                  onClick={() => navigate('/department')}
                  className={'w-[220px]'}
                  variant="secondary"
                  startIcon={<ArrowLeft />}>
                  {t('Back to department list')}
                </MyButton>
              )
            }
          </div>
        </div>
      </div>
      <MyDivider />
      <DepartmentList data={data} refetch={refetch} showModal={showModal} setShowModal={setShowModal} />
    </PageContentWrapper>
  );
}

export default DepartmentPage;
