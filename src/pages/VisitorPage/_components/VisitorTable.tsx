import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { IFilter } from 'interfaces/filter.interface';
import { FilterTypeEnum } from 'enums/filter-type.enum';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { IAction } from 'interfaces/action.interface';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import Form from './Form';
import EditForm from './EditForm';

const VisitorTable = ({ show, setShow }: { show: boolean, setShow: React.Dispatch<React.SetStateAction<boolean>> }) => {
    const { t } = useTranslation();
    const [showEdit, setShowEdit] = useState(false)
    const [open, setOpen] = useState(false)
    const [visitorId, setVisitorId] = useState(null)
    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.getVisitorList,
        url: URLS.getVisitorList,
        params: {}
    });
    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'fullName',
                label: t('Employees'),
                headerClassName: 'w-1/3',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        {/* <MyAvatar size="medium" imageUrl={row?.photoBase64} /> */}
                        {row?.firstName} {row?.lastName}
                    </div>
                )
            },
            {
                key: 'workPlace',
                label: t('Work Place'),
                headerClassName: 'w-1/3',
                cellRender: (row) => <div className="department-text">{row?.workPlace ?? '--'}</div>
            },
            {
                key: 'additionalDetails',
                label: t('Position'),
                headerClassName: 'w-56',
                cellRender: (row) => <>{row?.additionalDetails ?? '--'}</>
            },
            {
                key: 'phone',
                label: t('Phone Number'),
                headerClassName: 'w-40',
                cellRender: (row) => <>{row?.phone ?? '--'}</>
            }
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Employees'),
            headerClassName: 'w-1/3'
        },
        {
            id: 2,
            label: t('Department'),
            headerClassName: 'w-1/3'
        },
        {
            id: 3,
            label: t('Position'),
            headerClassName: 'w-56'
        },
        {
            id: 5,
            label: t('Phone Number'),
            headerClassName: 'w-40'
        }
    ];

    const filter: IFilter[] = useMemo(
        () => [
        ],
        [t]
    );

    const rowActions: IAction[] = useMemo(
        () => [
            {
                icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
                type: 'primary',
                name: t('Edit'),
                action: (row, $e) => {
                    setShowEdit(true)
                    setVisitorId(row?.id)
                },
                allowedRoles: ['ADMIN', 'HR'],
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete'),
                action: (row, $e) => {
                    setOpen(true)
                    setVisitorId(row?.id)
                },
                allowedRoles: ['ADMIN', 'HR'],
            }
        ],
        [t]
    );

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getVisitorList
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.getVisitorList}/${visitorId}`
            },
            {
                onSuccess: () => {
                    refetch();
                    setOpen(false)
                }
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
                />
            </TableProvider>
            <Form show={show} setShow={setShow} refetch={refetch} />
            <ConfirmationModal
                title={t("Bu mehmonni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
            <EditForm show={showEdit} setShow={setShowEdit} refetch={refetch} visitorId={visitorId} />
        </>
    );
}

export default VisitorTable;
