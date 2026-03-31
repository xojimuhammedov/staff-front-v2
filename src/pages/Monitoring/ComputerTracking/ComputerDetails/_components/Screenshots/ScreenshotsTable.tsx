import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import config from '@/configs';
import MyModal from '@/components/Atoms/MyModal/MyModal';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import { MyInput } from '@/components/Atoms/Form';
import { useSearch } from '@/hooks/useSearch';
import { KeyTypeEnum } from '@/enums/key-type.enum';

interface ScreenshotsTableProps {
    user?: any;
}

const ScreenshotsTable = ({ user }: ScreenshotsTableProps) => {
    const { t, i18n } = useTranslation();
    const currentLang: any = i18n.resolvedLanguage;
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);
    const { search, setSearch, handleSearch } = useSearch();

    const [selectedData, setSelectedData] = useState<any>(null);

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getScreenShot,
        url: URLS.getScreenShot,
        params: {
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            search: searchValue?.search,
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
        },
        enabled: !!user?.employee?.id,
    });

    const columns: DataGridColumnType[] = useMemo(() => [
        {
            key: 'filePath',
            label: "Skrinshot",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => {
                const imgUrl = `${config.FILE_URL}api/storage/${row?.filePath}`;
                return (
                    <div className="h-8 w-12 rounded overflow-hidden bg-gray-100 flex items-center justify-center cursor-pointer border dark:border-gray-200 dark:bg-gray-800"
                        onClick={(e) => {
                            e.stopPropagation(); // modal open double trigger prevention
                            if (row?.filePath) {
                                setSelectedData(row);
                            }
                        }}
                    >
                        {row?.filePath ? (
                            <img src={imgUrl} alt="screenshot" className="object-cover h-full w-full hover:scale-110 transition-transform" />
                        ) : (
                             <span className="text-xs text-gray-400">Rasm yo'q</span>
                        )}
                    </div>
                )
            },
        },
        {
            key: 'title',
            label: "Sarlavha",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark truncate max-w-[300px]" title={row?.title}>
                    {row?.title ?? '--'}
                </div>
            ),
        },
        {
            key: 'processName',
            label: "Jarayon nomi",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark">
                    {row?.processName ?? '--'}
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: "Yaratilgan vaqt",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark">
                    {row?.createdAt ? dayjs(row.createdAt).format('DD.MM.YYYY HH:mm') : '--'}
                </div>
            ),
        },
        {
            key: 'datetime',
            label: "Olingan vaqti",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark font-mono">
                     {row?.datetime ? dayjs(row.datetime).format('DD.MM.YYYY HH:mm') : '--'}
                </div>
            ),
        },
    ], [currentLang]);

    if (!user?.employee?.id) {
        return null;
    }

    return (
        <>
            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden mb-6">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="w-full max-w-sm">
                        <MyInput
                            onKeyUp={(event) => {
                                if (event.key === KeyTypeEnum.enter) {
                                    handleSearch();
                                } else {
                                    setSearch((event.target as HTMLInputElement).value);
                                }
                            }}
                            defaultValue={search}
                            startIcon={<Search className="stroke-text-muted cursor-pointer" onClick={handleSearch} />}
                            className="dark:bg-bg-input-dark"
                            placeholder={t('Search...')}
                        />
                    </div>
                </div>
                <DynamicTable
                    data={get(data, 'data')}
                    pagination={{
                        total: data?.total || 0,
                        page: data?.page || 1,
                        limit: data?.limit || 10,
                    }}
                    columns={columns}
                    hasIndex={true}
                    onRowClick={(row) => {
                        if (row?.filePath) {
                            setSelectedData(row);
                        }
                    }}
                />
            </div>

            <MyModal
                modalProps={{
                    show: !!selectedData,
                    onClose: () => setSelectedData(null),
                    size: '2xl',
                    position: 'center',
                }}
                headerProps={{
                    children: (
                        <div className="flex flex-col">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">
                                {selectedData?.title || 'Sarlavha yo\'q'}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {selectedData?.datetime ? dayjs(selectedData.datetime).format('DD.MM.YYYY HH:mm:ss') : '--'}
                            </p>
                        </div>
                    )
                }}
            >
                <div className="relative flex justify-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                    {selectedData?.filePath && (
                        <img 
                            src={`${config.FILE_URL}api/storage/${selectedData.filePath}`} 
                            alt="Screenshot detail" 
                            className="max-w-full h-[50vh] object-cover rounded"
                        />
                    )}
                </div>
            </MyModal>
        </>
    );
};

export default ScreenshotsTable;
