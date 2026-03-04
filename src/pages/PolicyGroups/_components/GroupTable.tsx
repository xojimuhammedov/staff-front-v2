import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { KEYS } from 'constants/key';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { IAction } from 'interfaces/action.interface';
import { get } from 'lodash';
import { Edit3, Trash2 } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

const GroupTable = () => {
    const { t } = useTranslation()
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

    const rowActions: IAction[] = useMemo(
        () => [
            {
                icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
                type: 'secondary',
                name: t('Edit'),
                action: (row, $e) => { }
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete'),
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
            <DynamicTable
                data={get(data, 'data', [])}
                pagination={data}
                columns={columns}
                rowActions={rowActions}
                hasIndex={true}
            />
            <ConfirmationModal
                title={t("Bu guruhni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={open} setOpen={setOpen} confirmationDelete={deleteItem} />
        </>
    );
}

export default GroupTable;
