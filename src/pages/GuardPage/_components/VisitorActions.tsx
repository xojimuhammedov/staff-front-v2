import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { IFilter } from 'interfaces/filter.interface';
import dayjs from 'dayjs';
import { Plus, Search } from 'lucide-react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSearch } from 'hooks/useSearch';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';
import { MyInput } from 'components/Atoms/Form';

const VisitorActions = () => {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const location = useLocation()
  const { search, setSearch, handleSearch } = useSearch();
  const searchValue: searchValue = paramsStrToObj(location.search)
  const { data, isLoading } = useGetAllQuery({
    key: KEYS.getVisitorList,
    url: URLS.getVisitorList,
    params: {
      search: searchValue?.search
    },
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: t('Full Name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex items-center gap-4 text-text-base dark:text-text-title-dark">
            {row?.firstName ?? '--'} {row?.lastName ?? '--'}
          </div>
        ),
      },
      {
        key: 'creator',
        label: t('Creator'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.creator?.name || row?.creator?.username || '--'}
          </div>
        ),
      },
      {
        key: 'createdAt',
        label: t('Created Time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.createdAt ? dayjs(row?.createdAt).format("YYYY-MM-DD, HH:mm") : '--'}
          </div>
        ),
      },
      {
        key: 'visiting',
        label: t('Visiting'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="text-text-base dark:text-text-title-dark">
            {row?.attached?.name ?? '--'}
          </div>
        ),
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Full Name'),
      headerClassName: 'w-1/3',
    },
    {
      id: 2,
      label: t('Creator'),
      headerClassName: 'w-1/3',
    },
    {
      id: 3,
      label: t('Created Time'),
      headerClassName: 'w-1/3',
    },
    {
      id: 4,
      label: t('Visiting'),
      headerClassName: 'w-1/3',
    },
  ];

  const filter: IFilter[] = useMemo(() => [], [t]);

  return (
    <>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Visitors list')}
          subtitle={t('')}
        />
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
          <MyButton
            onClick={() => {
              navigate('/visitor/create');
            }}
            allowedRoles={['ADMIN', 'HR', "GUARD"]}
            startIcon={<Plus />}
            variant='primary'
            className={`text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          >
            {t('Create visitor')}
          </MyButton>
        </div>
      </div>
      <TableProvider<IEmployee, IFilter[]>
        values={{
          columns,
          filter,
          rows: get(data, 'data', []),
          keyExtractor: 'id',
        }}
      >
        <DataGrid
          isLoading={isLoading}
          hasCustomizeColumns={true}
          dataColumn={dataColumn}
          pagination={data}
        />
      </TableProvider>
    </>
  );
};

export default VisitorActions;
