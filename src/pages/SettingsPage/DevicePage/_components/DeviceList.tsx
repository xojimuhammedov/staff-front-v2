import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useDeleteQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit, ExternalLink, Eye, Trash2 } from 'lucide-react';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { useNavigate } from 'react-router-dom';

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

const DeviceList = ({ data, isLoading, refetch }: any) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const [deviceId, setDeviceId] = useState("")
    const [show, setShow] = useState(false)

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getDoorForDevices
    });

    const deleteItem = () => {
        if (!deviceId) return;
        deleteRequest(
            {
                url: `${URLS.getDoorForDevices}/${deviceId}`
            },
            {
                onSuccess: () => {
                    refetch();
                }
            }
        );
    };

    const { mutate } = usePostQuery({
        listKeyId: KEYS.deviceForDoor
    });

    const employeeForDoor = (id: number) => {
        mutate(
            {
                url: `${URLS.deviceForDoor}/${id}`,
                attributes: {}
            },
            {
                onSuccess: () => {
                    refetch();
                }
            }
        );
    };

    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'name',
                label: t('Device name'),
                headerClassName: 'sm:w-1/4 lg:flex-1'
            },
            {
                key: 'isActive',
                label: t('Status'),
                headerClassName: 'sm:w-1/4 lg:flex-1',
                cellRender: (row) => (
                    <>
                        <MyBadge variant={row.isActive ? 'green' : 'neutral'}>
                            {row.isActive ? t("Success") : t("Badge")}
                        </MyBadge>
                    </>
                )
            },
            {
                key: 'ipAddress',
                label: t('Ip address'),
                headerClassName: 'sm:w-1/4 lg:flex-1'
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Device name'),
            headerClassName: 'sm:w-1/4 lg:flex-1'
        },
        {
            id: 2,
            label: t('Status'),
            headerClassName: 'sm:w-1/4 lg:flex-1'
        },
        {
            id: 3,
            label: t('Ip address'),
            headerClassName: 'sm:w-1/4 lg:flex-1'
        },
    ];

    const rowActions: IAction[] = useMemo(
        () => [
            {
                icon: <Eye size={DEFAULT_ICON_SIZE} />,
                type: 'primary',
                name: t('View device'),
                action: (row) => {
                    navigate(`/settings/device/${row.id}`);
                }
            },
            {
                icon: <Edit size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Edit'),
                action: (row) => {
                    navigate(`/device/edit/${row?.id}`)
                }
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete'),
                action: (row) => {
                    setDeviceId(row?.id);
                    setShow(true);
                }
            },
            {
                icon: <ExternalLink size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Open door'),
                action: (row) => {
                    employeeForDoor(row?.id)
                }
            }
        ],
        [t]
    );

    if (isLoading) {
        return (
            <div className="absolute flex h-full w-[calc(100%-350px)] items-center justify-center">
                <Loading />
            </div>
        );
    }
    return (
        <>
            <TableProvider<TItem, FilterType>
                values={{
                    columns,
                    filter: { search: '' },
                    rows: get(data, 'data', []),
                    keyExtractor: 'id'
                }}>
                <DataGrid
                    hasCustomizeColumns={false}
                    hasExport={false}
                    hasSearch={false}
                    rowActions={rowActions}
                    dataColumn={dataColumn}
                    hasCheckbox={false}
                    isLoading={isLoading}
                />
            </TableProvider>

            <ConfirmationModal
                title={t("Bu device o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi! Device o'chiriladi va unga bog'langan barcha qurilmalar o'chiriladi.")}
                open={show} setOpen={setShow} confirmationDelete={deleteItem} />
        </>
    );
}

export default DeviceList;
