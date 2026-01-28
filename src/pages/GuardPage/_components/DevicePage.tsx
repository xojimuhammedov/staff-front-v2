import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import MyBadge from 'components/Atoms/MyBadge';
import Loading from 'assets/icons/Loading';
import MyButton from 'components/Atoms/MyButton/MyButton';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import MyDivider from 'components/Atoms/MyDivider';

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

const DeviceList = () => {
    const { t } = useTranslation()

    const { mutate } = usePostQuery({
        listKeyId: KEYS.deviceForDoor
    });

    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.getDoorForDevices,
        url: URLS.getDoorForDevices,
        params: {},
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
                headerClassName: 'sm:w-1/3'
            },
            {
                key: 'isActive',
                label: t('Status'),
                headerClassName: 'sm:w-1/3',
                cellRender: (row) => (
                    <>
                        <MyBadge variant={row.isActive ? 'green' : 'neutral'}>
                            {row.isActive ? t("Success") : t("Badge")}
                        </MyBadge>
                    </>
                )
            },
            {
                key: 'openDevice',
                label: t('Device open'),
                headerClassName: 'sm:w-1/3',
                cellRender: (row) => (
                    <MyButton onClick={() => employeeForDoor(row?.id)} variant='secondary'>
                        {t("Click device")}
                    </MyButton>
                )
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Device name'),
            headerClassName: 'sm:w-1/3'
        },
        {
            id: 2,
            label: t('Status'),
            headerClassName: 'sm:w-1/3'
        },
        {
            id: 3,
            label: t('Device open'),
            headerClassName: 'sm:w-1/3',
        },
    ];


    if (isLoading) {
        return (
            <div className="absolute flex h-full w-[calc(100%-350px)] items-center justify-center">
                <Loading />
            </div>
        );
    }
    return (
        <>
            <LabelledCaption
                title={t('Device control')}
                subtitle={t('System notifications for selected employees')}
            />
            <MyDivider />
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
                    dataColumn={dataColumn}
                    hasCheckbox={false}
                    isLoading={isLoading}
                />
            </TableProvider>
        </>
    );
}

export default DeviceList;
