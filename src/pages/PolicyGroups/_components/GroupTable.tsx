import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import DataGrid from 'components/Atoms/DataGrid';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { URLS } from 'constants/url';
import { FilterTypeEnum } from 'enums/filter-type.enum';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { IAction } from 'interfaces/action.interface';
import { IEmployee } from 'interfaces/employee/employee.interface';
import { IFilter } from 'interfaces/filter.interface';
import { get } from 'lodash';
import { Edit3, Plus, Trash2 } from 'lucide-react';
import TableProvider from 'providers/TableProvider/TableProvider';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const GroupTable = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [open, setOpen] = useState(false)
    const [groupId, setGroupId] = useState(null)
    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.getPolicyGroups,
        url: URLS.getPolicyGroups,
        params: {}
    });
    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'name',
                label: t('Name'),
                headerClassName: 'w-1/2',
                cellRender: (row) => (
                    <div className="">
                        {row?.name}
                    </div>
                )
            },
            {
                key: 'type',
                label: t('Type'),
                headerClassName: 'w-1/2',
                cellRender: (row) => <div className="department-text">{row?.type ?? '--'}</div>
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Name'),
            headerClassName: 'w-1/2'
        },
        {
            id: 2,
            label: t('Type'),
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
                name: t('Edit group'),
                action: (row, $e) => {
                    // setShowEdit(true)
                    // setVisitorId(row?.id)
                }
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete group'),
                action: (row, $e) => {
                    setOpen(true)
                    setGroupId(row?.id)
                }
            }
        ],
        [t]
    );

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getPolicyGroups
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.getPolicyGroups}/${groupId}`
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
                    hasButton={
                        <>
                            <MyButton
                                startIcon={<Plus />}
                                variant="primary"
                                onClick={() => navigate('/policy/groups/create')}
                                className="[&_svg]:stroke-bg-white w-[160px] text-sm">
                                {t('Create group')}
                            </MyButton>
                        </>
                    }
                />
            </TableProvider>
            <ConfirmationModal
                title={t("Bu guruhni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
        </>
    );
}

export default GroupTable;
