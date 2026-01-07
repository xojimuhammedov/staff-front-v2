import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import { useMemo, useState } from 'react';
import TableProvider from 'providers/TableProvider/TableProvider';
import DataGrid from 'components/Atoms/DataGrid';
import { useDeleteQuery, useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit3, Trash2 } from 'lucide-react';
import Create from './Create';
import MyModal from 'components/Atoms/MyModal';
import Edit from './Edit';

type FilterType = {
    search: string;
};

type TItem = {
    name: string;
    type: string;
    ipAddress: string;
};

const JobList = () => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [typeId, setTypeId] = useState(null)
    const currentLang = i18n.resolvedLanguage;
    const { data, isLoading, refetch } = useGetAllQuery({
        key: KEYS.employeeJobPosition,
        url: URLS.employeeJobPosition,
        params: {}
    });

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.employeeJobPosition
    });

    const deleteItem = (id: number) => {
        deleteRequest(
            {
                url: `${URLS.employeeJobPosition}/${id}`
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
                key: 'value',
                label: t('Position'),
                headerClassName: 'sm:w-1/4 lg:flex-1',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                      {row?.[`${currentLang}`]}
                    </div>
                  )
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Position'),
            headerClassName: 'sm:w-1/4 lg:flex-1'
        },
    ];

    const rowActions: IAction[] = useMemo(
        () => [
            {
                icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
                type: 'primary',
                name: t('Edit'),
                action: (row) => {
                    setOpen(true)
                    setTypeId(row?.id)
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
        <div>
            <div className={'flex justify-between'}>
                <LabelledCaption
                    title={t('Job name')}
                    subtitle={t('Employee list for position name')}
                />
                <Create refetch={refetch} />
            </div>
            <MyDivider />
            <TableProvider<TItem, FilterType>
                values={{
                    columns,
                    filter: { search: '' },
                    rows: get(data, 'items', []),
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
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="dark:text-text-title-dark">{t('Position')}</h2>
                }}
                bodyProps={{
                    children: (
                        <Edit setOpen={setOpen} refetch={refetch} typeId={typeId} />
                    ),
                    className: 'py-[10px]'
                }}
            />
        </div>
    );
};

export default JobList;
