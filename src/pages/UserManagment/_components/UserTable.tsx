import DataGrid from 'components/Atoms/DataGrid';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { IAction } from 'interfaces/action.interface';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { IFilter } from 'interfaces/filter.interface';
import { get } from 'lodash';
import { AreaChart, Edit3, Plus, Trash2 } from 'lucide-react';
import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Loading from 'assets/icons/Loading'
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import Form from './Form';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import EditForm from './EditForm';

const UserTable = () => {
    const {t} = useTranslation()
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false)
    const [deleteModal, setDeleteModal] = useState(false)
    const [userId, setUserId] = useState<string | number | null>(null)
    const [editUserId, setEditUserId] = useState<string | number | null>(null)
    const {data, isLoading, refetch} = useGetAllQuery({
        key: KEYS.getListUsersManagment,
        url: URLS.getListUsersManagment,
        params:{}
    })

    const { mutate: deleteRequest } = useDeleteQuery({
      listKeyId: KEYS.getListUsersManagment
    });

    const columns: DataGridColumnType[] = useMemo(
        () => [
          {
            key: 'name',
            label: t('Employees'),
            headerClassName: 'w-1/3',
            cellRender: (row) => (
              <div className="flex items-center gap-4 dark:text-text-title-dark">
                 {row?.name}
              </div>
            )
          },
          {
            key: 'username',
            label: t('Username'),
            headerClassName: 'w-1/3',
            cellRender: (row) => <>{row?.username ?? '--'}</>
          },
          {
            key: 'role',
            label: t('Role'),
            headerClassName: 'w-1/3',
            cellRender: (row) => <>{row?.role ?? '--'}</>
          },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Name'),
            headerClassName: 'w-1/3',
        },
        {
            id: 2,
            label: t('Username'),
            headerClassName: 'w-1/3',
        },
        {
            id: 3,
            label: t('Role'),
            headerClassName: 'w-1/3',
        }
    ];

    const handleDeleteModal = (row: string | number | null) => {
      setDeleteModal(true)
      setUserId(row)
    }

    const handleEditModal = (row: string | number | null) => {
      setShow(true)
      setEditUserId(row)
    }

    const rowActions: IAction[] = useMemo(
        () => [
          {
            icon: <AreaChart size={DEFAULT_ICON_SIZE} />,
            type: 'primary',
            name: t('Deactive'),
            action: (row, $e) => {
            //   navigate(`/employees/${row.id}`);
            }
          },
          {
            icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
            type: 'primary',
            name: t('Edit'),
            action: (row, $e) => {
              handleEditModal(row?.id)
            }
          },
          {
            icon: <Trash2 color='red' size={DEFAULT_ICON_SIZE} />,
            type: 'danger',
            name: t('Delete'),
            action: (row, $e) => {
              handleDeleteModal(row?.id)
            }
          }
        ],
        [t]
    );

    const deleteItem = () => {
      deleteRequest(
        {
          url: `${URLS.getListUsersManagment}/${userId}`
        },
        {
          onSuccess: () => {
            refetch();
            setDeleteModal(false)
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
                  filter: [],
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
                  pagination={get(data, 'meta')}
                  hasButton={
                      <>
                      <MyButton
                          onClick={() => {
                            setOpen(true)
                          }}
                          startIcon={<Plus />}
                          variant="primary"
                          className="[&_svg]:stroke-bg-white w-[150px] text-sm">
                          {t('Add a user')}
                      </MyButton>
                      </>
                  }
              />
          </TableProvider>
          <Form refetch={refetch} open={open} setOpen={setOpen} />
          <EditForm refetch={refetch} setOpen={setShow} open={show} userId={editUserId} />
          <ConfirmationModal
              title={t("Ushbu foydalanuvchini o'chirmoqchimisiz?")}
              subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
              open={deleteModal} setOpen={setDeleteModal} confirmationDelete={deleteItem} />
        </>
    );
}

export default UserTable;
