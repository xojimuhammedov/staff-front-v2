import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useDeleteQuery, useGetAllQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit, ExternalLink, Trash2 } from 'lucide-react';
import FormDeviceEdit from './Edit';
import MyModal from 'components/Atoms/MyModal';

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
    const [openEditModal, setOpenEditModal] = useState(false)
    const [deviceId, setDeviceId] = useState("")


    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.getDoorForDevices
    });

    const deleteItem = (id: number) => {
        deleteRequest(
            {
                url: `${URLS.getDoorForDevices}/${id}`
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
            // {
            //   key: 'type',
            //   label: t('Device type'),
            //   headerClassName: 'sm:w-1/4 lg:flex-1'
            // },
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
        // {
        //   id: 2,
        //   label: t('Device type'),
        //   headerClassName: 'sm:w-1/4 lg:flex-1'
        // },
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
                icon: <Edit size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Edit'),
                action: (row) => {
                    setDeviceId(row.id)
                    setOpenEditModal(true)
                }
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete'),
                action: (row) => {
                    deleteItem(row?.id)
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

            <MyModal
                modalProps={{
                    show: Boolean(openEditModal),
                    onClose: () => setOpenEditModal(false),
                    size: "md",
                }}
                headerProps={{
                    children: <h2 className="text-20 font-inter tracking-tight text-black">{t("Edit device")}</h2>,
                }}
                bodyProps={{
                    children: (
                        <FormDeviceEdit
                            setOpenModal={setOpenEditModal}
                            deviceId={deviceId}
                            refetch={refetch}
                        />
                    ),
                    className: "py-[15px]",
                }}
            />
        </>
    );
}

export default DeviceList;
