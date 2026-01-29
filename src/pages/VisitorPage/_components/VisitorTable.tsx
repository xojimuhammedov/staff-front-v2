import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { Edit3, AreaChart, Trash2, Briefcase, Clock } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import { IFilter } from 'interfaces/filter.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import MyBadge from 'components/Atoms/MyBadge';
import { useLocation, useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';


const VisitorTable = () => {
  const { t } = useTranslation();
  const location = useLocation()
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [visitorId, setVisitorId] = useState(null);
  const searchValue: searchValue = paramsStrToObj(location.search)
  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getVisitorList,
    url: URLS.getVisitorList,
    params: {
      search: searchValue?.search,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
    },
  });


  // const { data: validateMap, isLoading: validating } = useValidateCodes(uniqueCodes);
  const STATUS_BADGE_CLASSES: Record<'green' | 'blue' | 'neutral', string> = {
    green:
      ' border border-tag-green-icon [&_p]:text-tag-green-text  dark:border-tag-green-icon dark:[&_p]:text-tag-green-text',
    blue:
      ' border border-tag-blue-icon [&_p]:text-tag-blue-text  dark:border-tag-blue-icon dark:[&_p]:text-tag-blue-text',
    neutral:
      ' border border-tag-neutral-icon [&_p]:text-tag-neutral-text  dark:border-tag-neutral-icon dark:[&_p]:text-tag-neutral-text',
  };

  const renderStatus = (row: any) => {
    const statusRaw =
      row?.onetimeCodes?.find((code: any) => code?.isActive)?.status ??
      row?.onetimeCodes?.[0]?.status ??
      '';
    if (!statusRaw) return '--';
    const status = String(statusRaw).toUpperCase();
    if (status === 'USED') {
      return (
        <MyBadge className={STATUS_BADGE_CLASSES.green} variant="green">
          {t('Used')}
        </MyBadge>
      );
    }
    if (status === 'EXPIRED') {
      return (
        <MyBadge className={STATUS_BADGE_CLASSES.neutral} variant="neutral">
          {t('Expired')}
        </MyBadge>
      );
    }
    if (status === 'UNUSED') {
      return (
        <MyBadge className={STATUS_BADGE_CLASSES.blue} variant="blue">
          {t('Unused')}
        </MyBadge>
      );
    }
    return <>{statusRaw}</>;
  };

  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'firstName',
        label: t('Full Name'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className="flex flex-col gap-1">
            <div className="dark:text-text-title-dark">
              {row?.firstName ?? '--'} {row?.lastName ?? '--'}
            </div>
            <div className="text-xs text-text-muted">{row?.phone ?? '--'}</div>
          </div>
        ),
      },
      {
        key: 'creator',
        label: t('Creator'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.creator?.name || row?.creator?.username || '--'}</>,
      },
      {
        key: 'createdAt',
        label: t('Created Time'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className='flex items-center gap-1'>
            <Clock size={16} className="dark:text-white" />
            <p className='dark:text-white'>{row?.createdAt ? dayjs(row?.createdAt).format("YYYY-MM-DD, HH:mm") : '--'}</p>
          </div>
        ),
      },
      {
        key: 'visiting',
        label: t('Visiting'),
        headerClassName: 'w-1/3',
        cellRender: (row) => <>{row?.attached?.name ?? '--'}</>,
      },
      {
        key: 'workPlace',
        label: t('Work Place'),
        headerClassName: 'w-1/3',
        cellRender: (row) => (
          <div className='flex items-center gap-1'>
            {row?.workPlace ? <Briefcase size={16} className="dark:text-white" /> : null}
            <p className='dark:text-white'>{row?.workPlace ?? '--'}</p>
          </div>
        ),
      },
      {
        key: 'status',
        label: t('Status'),
        headerClassName: 'w-1/5',
        cellRender: renderStatus,
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
    {
      id: 5,
      label: t('Work Place'),
      headerClassName: 'w-1/3',
    },
    {
      id: 6,
      label: t('Status'),
      headerClassName: 'w-1/5',
    },
    // {
    //   id: 6,
    //   label: t('Using type'),
    //   headerClassName: 'w-1/3',
    // },
  ];

  const filter: IFilter[] = useMemo(() => [], [t]);

  const rowActions: IAction[] = useMemo(
    () => [
      {
        icon: <AreaChart size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('Details'),
        action: (row, $e) => {
          navigate(`/visitor/about/${row?.id}`);
        },
        allowedRoles: ['ADMIN', 'HR', 'GUARD'],
      },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'secondary',
        name: t('Edit'),
        action: (row, $e) => {
          navigate(`/visitor/edit/${row?.id}`);
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete'),
        action: (row, $e) => {
          setOpen(true);
          setVisitorId(row?.id);
        },
        allowedRoles: ['ADMIN', 'HR'],
      },
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getVisitorList,
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getVisitorList}/${visitorId}`,
      },
      {
        onSuccess: () => {
          refetch();
          setOpen(false);
        },
      }
    );
  };

  return (
    <>
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
          rowActions={rowActions}
          pagination={data}
        />
      </TableProvider>
      <ConfirmationModal
        title={t('Are you sure you want to delete this visitor?')}
        subTitle={t('This action cannot be undone!')}
        open={open}
        setOpen={setOpen}
        confirmationDelete={deleteItem}
      />
    </>
  );
};

export default VisitorTable;
