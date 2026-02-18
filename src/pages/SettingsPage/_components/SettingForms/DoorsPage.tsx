import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { IAction } from 'interfaces/action.interface';
import { Edit3, Plus, Trash2, Eye, Search, Building2, Cpu } from 'lucide-react';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import Loading from 'assets/icons/Loading';
import { MyInput } from 'components/Atoms/Form';
import { useSearch } from 'hooks/useSearch';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { searchValue } from 'types/search';
import { paramsStrToObj } from 'utils/helper';

type FilterType = {
  search: string;
};

type TItem = {
  employeeName: string;
  status: string;
  timeline: string;
  action: string;
  id: string;
};

const DoorsPage = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [doorId, setDoorId] = useState<string | null>(null);
  const [show, setShow] = useState(false);
  const { search, setSearch, handleSearch } = useSearch();
  const searchValue: searchValue = paramsStrToObj(location.search)
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {
      search: searchValue?.search
    },
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Door name'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?.name ?? '--'}</div>,
      },
      {
        key: 'organizations',
        label: t('Organization count'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/organization?gateId=${row?.id}`);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-bg-subtle px-3 py-1 text-xs font-semibold text-text-base shadow-sm transition hover:border-emerald-600 hover:shadow-md dark:border-emerald-400 dark:bg-bg-darkBg dark:text-text-title-dark dark:hover:border-emerald-300"
          >
            <Building2 className="h-4.5 w-4.5 text-text-muted dark:text-white-600 " />
            {row?._count?.organizations ?? '--'}
          </button>
        ),
      },
      {
        key: 'countDevices',
        label: t('Devices'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              searchParams.set('current-setting', 'deviceControl');
              searchParams.set('gateId', String(row?.id));
              setSearchParams(searchParams);
            }}
            className="inline-flex items-center gap-2 rounded-full border border-emerald-500 bg-bg-subtle px-3 py-1 text-xs font-semibold text-text-base shadow-sm transition hover:border-emerald-600 hover:shadow-md dark:border-emerald-400 dark:bg-bg-darkBg dark:text-text-title-dark dark:hover:border-emerald-300"
            >
            <Cpu className="h-4.5 w-4.5 text-text-muted dark:text-white-600" />
            {row?._count?.devices ?? '--'}
          </button>
        ),
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Door name'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
    },
    {
      id: 2,
      label: t('Organization count'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
      header: (
        <span className="inline-flex items-center gap-2">
          {t('Organizations')}
        </span>
      ),
    },
    {
      id: 3,
      label: t('Devices'),
      headerClassName: 'sm:w-1/4 lg:flex-1',
      header: (
        <span className="inline-flex items-center gap-2">
          {t('Devices')}
        </span>
      ),
    },
  ];

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Eye size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('View door'),
        action: (row) => {
          navigate(`/settings/maingate/${row.id}`);
        },
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/settings/door/edit/${row?.id}`);
        },
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row) => {
          setDoorId(row?.id);
          setShow(true);
        },
      },
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getDoorGates,
  });

  const deleteItem = () => {
    if (!doorId) return;
    deleteRequest(
      {
        url: `${URLS.getDoorGates}/${doorId}`,
      },
      {
        onSuccess: () => {
          refetch();
          setShow(false);
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className={'flex justify-between'}>
        <LabelledCaption
          title={t('Doors')}
          subtitle={t('System notifications for selected employees')}
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
            onClick={() => navigate('/settings/door/create')}
            startIcon={<Plus />}
            variant='primary'
            className={` text-sm min-w-max [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          >
            {t('Add new door')}
          </MyButton>
        </div>
      </div>

      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data', []),
          keyExtractor: 'id',
        }}
      >
        <DataGrid
          hasCustomizeColumns={false}
          dataColumn={dataColumn}
          isLoading={isLoading}
          rowActions={rowActions}
          handleRowClick={(row: any) => navigate(`/settings/maingate/${row?.id}`)}
        />
      </TableProvider>
      <ConfirmationModal
        title={t('Are you sure you want to delete this door?')}
        subTitle={t(
          'This action cannot be undone. The door will be deleted and all devices linked to it will be removed.'
        )}
        open={show}
        setOpen={setShow}
        confirmationDelete={deleteItem}
      />
    </>
  );
};

export default DoorsPage;
