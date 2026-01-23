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
import { Edit3, Plus, Trash2, Eye, Search } from 'lucide-react';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { useLocation, useNavigate } from 'react-router-dom';
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
        key: 'countDevices',
        label: t('Devices'),
        cellRender: (row) => (
          <div className="dark:text-text-title-dark">{row?._count?.devices ?? '--'}</div>
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
      label: t('Devices'),
    },
  ];

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Eye size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('View door'),
        action: (row) => {
          navigate(`/settings/maingate/${row.id}`);
        },
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
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
      <div className="absolute flex h-full w-[calc(100%-350px)] items-center justify-center">
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
            className={` text-sm w-[230px] [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
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
