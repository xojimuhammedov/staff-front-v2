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
import { Edit3, Plus, Trash2, Eye } from 'lucide-react';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import Loading from 'assets/icons/Loading';

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
  const navigate = useNavigate();
  const [doorId, setDoorId] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {}
  });

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'name',
        label: t('Door name'),
        headerClassName: 'sm:w-1/4 lg:flex-1',
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?.name ?? '--'}</div>
      },
      {
        key: 'countDevices',
        label: t('Devices'),
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?._count?.devices ?? '--'}</div>
      },
      {
        key: 'actions',
        label: t('Allowed employees'),
        cellRender: (row) => <div className="dark:text-text-title-dark">{row?._count?.employees ?? '--'}</div>
      }
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Door name'),
      headerClassName: 'sm:w-1/4 lg:flex-1'
    },
    {
      id: 2,
      label: t('Devices')
    },
    {
      id: 3,
      label: t('Allowed employees')
    }
  ];

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <Eye size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('View door'),
        action: (row) => {
          navigate(`/settings/maingate/${row.id}`);
        }
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/settings/door/edit/${row?.id}`)
        }
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row) => {
          setDoorId(row?.id);
          setShow(true);
        }
      }
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getDoorGates
  });

  const deleteItem = () => {
    if (!doorId) return;
    deleteRequest(
      {
        url: `${URLS.getDoorGates}/${doorId}`
      },
      {
        onSuccess: () => {
          refetch();
          setShow(false);
        }
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
        <MyButton
          onClick={() => navigate('/settings/door/create')}
          startIcon={<Plus />}
          variant="primary"
          className="[&_svg]:stroke-bg-white w-[170px]">
          {t('Add new door')}
        </MyButton>
      </div>

      <TableProvider<TItem, FilterType>
        values={{
          columns,
          filter: { search: '' },
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          hasCustomizeColumns={false}
          dataColumn={dataColumn}
          isLoading={isLoading}
          rowActions={rowActions}
        />
      </TableProvider>
      <ConfirmationModal
        title={t("Bu xonani o'chirmoqchimisiz?")}
        subTitle={t("Bu amalni qaytarib bo'lmaydi! Xona o'chiriladi va unga bog'langan barcha qurilmalar o'chiriladi.")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default DoorsPage;
