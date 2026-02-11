import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useTranslation } from 'react-i18next';
import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import VisitorTable from './_components/VisitorTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { MyInput } from 'components/Atoms/Form';
import { useSearch } from 'hooks/useSearch';
import { DataTable } from 'dgz-ui-shared/components/datatable';
import { KEYS } from 'constants/key';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo } from 'react';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { ColumnType, TranslationArgsType } from 'dgz-ui-shared/types';

interface PaginationInterface {
  data?: VisitorInterfaceData[];
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}

interface VisitorInterfaceData {
  firstName: string;
  lastName: string;
  creator: string[];
  visiting: string[];
  id: number;
}

const VisitorPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { search, setSearch, handleSearch } = useSearch();
  const breadCrumbs = [
    {
      label: t('Visitor'),
      url: '#',
    },
  ];

  const { data, isLoading, refetch } = useGetAllQuery<any>({
    key: KEYS.getVisitorList,
    url: URLS.getVisitorList,
    params: {},
  });

  const columns = (): ColumnType<VisitorInterfaceData>[] => [
    {
      key: 'firstName',
      dataIndex: 'firstName',
      name: t('Full Name'),
      // render: (row: any) => (
      //   <div className="flex flex-col gap-1">
      //     <div className="dark:text-text-title-dark">
      //       {row?.firstName ?? '--'} {row?.lastName ?? '--'}
      //     </div>
      //     <div className="text-xs text-text-muted">{row?.phone ?? '--'}</div>
      //   </div>
      // ),
    },
    {
      key: 'creator',
      dataIndex: 'creator',
      name: t('Creator'),
      render: (row: any) => <>{row?.creator?.name || row?.creator?.username || '--'}</>,
    },
    {
      key: 'visiting',
      dataIndex: 'visiting',
      name: t('Visiting'),
      render: (row: any) => <>{row?.attached?.name ?? '--'}</>,
    },
  ];

  return (
    // <PageContentWrapper>

    <>
      <DataTable<VisitorInterfaceData, PaginationInterface>
        tableKey={URLS.getVisitorList}
        hasNumbers
        hasSearch
        isStickyHeader
        hasPagination
        loading={isLoading}
        // params={params}
        // onParamChange={handleFilter}
        rowKey={'id'}
        dataSource={data}
        dataKey={'data'}
        columns={columns()}
      />
    </>

    // {/* <div className="flex items-center justify-between">
    //   <div className="flex flex-col">
    //     <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Visitor')}</h1>
    //     <MyBreadCrumb items={breadCrumbs} />
    //   </div>
    //   <div className='flex items-center gap-4'>
    //     <MyInput
    //       onKeyUp={(event) => {
    //         if (event.key === KeyTypeEnum.enter) {
    //           handleSearch();
    //         } else {
    //           setSearch((event.target as HTMLInputElement).value);
    //         }
    //       }}
    //       defaultValue={search}
    //       startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
    //       className="dark:bg-bg-input-dark"
    //       placeholder={t('Search...')}
    //     />
    //     <MyButton
    //       startIcon={<Plus />}
    //       onClick={() => {
    //         navigate('/visitor/create');
    //       }}
    //       allowedRoles={['ADMIN', 'HR', 'GUARD']}
    //       variant='primary'
    //       className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}>
    //       {t('Create visitor')}
    //     </MyButton>
    //   </div>
    // </div> */}
    // {/* <VisitorTable /> */}
    // </PageContentWrapper>
  );
};

export default VisitorPage;
