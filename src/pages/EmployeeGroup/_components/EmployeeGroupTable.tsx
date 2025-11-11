import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useNavigate } from 'react-router-dom';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { IFilter } from 'interfaces/filter.interface';
import { FilterTypeEnum } from 'enums/filter-type.enum';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';


const EmployeeGroupTable = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false)
  const [groupId, setGroupdId] = useState<any | null>(null)

  const { data, isLoading, refetch } = useGetAllQuery({
    key: KEYS.getEmployeeGroups,
    url: URLS.getEmployeeGroups,
    params: {}
  });
  const columns: DataGridColumnType[] = useMemo(
    () => [
      {
        key: 'fullName',
        label: t('Employees'),
        headerClassName: 'w-1/2',
        cellRender: (row) => (
          <div className="flex items-center gap-4 dark:text-text-title-dark">
            <MyAvatar size="medium" imageUrl={`${config.FILE_URL}storage/${row?.photo}`} />
            {row?.name}
          </div>
        )
      },
      {
        key: 'policy',
        label: t('Policy'),
        headerClassName: 'w-1/2',
        cellRender: (row) => <div className="department-text">{row?.policy?.title ?? '--'}</div>
      },
    ],
    [t]
  );

  const dataColumn = [
    {
      id: 1,
      label: t('Employees'),
      headerClassName: 'w-1/2'
    },
    {
      id: 2,
      label: t('Department'),
      headerClassName: 'w-1/2'
    },
  ];

  const filter: IFilter[] = useMemo(
    () => [
      {
        label: t('State'),
        key: 'online',
        type: FilterTypeEnum.multiselect,
        value: [],
        options: [
          { value: 'yes', label: t('Online') },
          { value: 'no', label: t('Offline') }
        ]
      },
      {
        label: t('Deleted'),
        key: 'deleted',
        type: FilterTypeEnum.multiselect,
        value: [],
        options: [
          { value: 'yes', label: t('Not deleted') },
          { value: 'no', label: t('Deleted') }
        ]
      },
      {
        label: t('Monitored'),
        key: 'monitored',
        type: FilterTypeEnum.multiselect,
        value: [],
        options: [
          { value: 'yes', label: t('Monitored') },
          { value: 'no', label: t('Not monitored') }
        ]
      }
    ],
    [t]
  );

  const rowActions: IAction[] = useMemo(
    () => [
      // {
      //   icon: <AreaChart size={DEFAULT_ICON_SIZE} />,
      //   type: 'primary',
      //   name: t('Employee statistics'),
      //   action: (row, $e) => {
      //     navigate(`/employees/${row.id}`);
      //   }
      // },
      {
        icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
        type: 'primary',
        name: t('Edit employee group'),
        action: (row, $e) => {
          navigate(`/employee-group/${row.id}`);
        }
      },
      {
        icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
        type: 'danger',
        name: t('Delete employee group'),
        action: (row, $e) => {
          setShow(true)
          setGroupdId(row?.id)
        }
      }
    ],
    [t]
  );

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getEmployeeGroups
  });

  const deleteItem = () => {
    deleteRequest(
      {
        url: `${URLS.getEmployeeGroups}/${groupId}`
      },
      {
        onSuccess: () => {
          refetch();
          setShow(false)
        }
      }
    );
  };

  if (isLoading) {
    return (
      <div className="absolute flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <TableProvider<IEmployee, IFilter[]>
        values={{
          columns,
          filter,
          rows: get(data, 'data', []),
          keyExtractor: 'id'
        }}>
        <DataGrid
          isLoading={isLoading}
          hasAction={false}
          hasCustomizeColumns={true}
          hasFilters={false}
          dataColumn={dataColumn}
          hasExport={false}
          hasCheckbox={false}
          rowActions={rowActions}
          pagination={data}
          hasButton={
            <>
              <MyButton
                onClick={() => {
                  navigate('/employee-group/create');
                }}
                startIcon={<Plus />}
                variant="primary"
                className="[&_svg]:stroke-bg-white w-[230px] text-sm">
                {t('Create an employee group')}
              </MyButton>
            </>
          }
        />
      </TableProvider>
      <ConfirmationModal
        title={t("Bu hodimni o'chirmoqchimisiz?")}
        subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
        open={show} setOpen={setShow} confirmationDelete={deleteItem} />
    </>
  );
};

export default EmployeeGroupTable;
