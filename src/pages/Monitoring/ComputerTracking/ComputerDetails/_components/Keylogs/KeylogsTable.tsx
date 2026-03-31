import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import MyModal from '@/components/Atoms/MyModal/MyModal';
import MyBadge from '@/components/Atoms/MyBadge';
import dayjs from 'dayjs';
import { Search } from 'lucide-react';
import { MyInput } from '@/components/Atoms/Form';
import { useSearch } from '@/hooks/useSearch';
import { KeyTypeEnum } from '@/enums/key-type.enum';

interface KeylogsTableProps {
    user?: any;
}

const KeylogsTable = ({ user }: KeylogsTableProps) => {
    const { t, i18n } = useTranslation();
    const currentLang: any = i18n.resolvedLanguage;
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);
    const { search, setSearch, handleSearch } = useSearch();

    const [selectedData, setSelectedData] = useState<any>(null);

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getKeyLogs,
        url: URLS.getKeyLogs,
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
            key: 'title',
            label: "Dastur / Oyna nomi",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="flex items-center gap-3 max-w-[350px]">
                    {row?.icon ? (
                        <img 
                            src={`data:image/png;base64,${row.icon}`} 
                            alt="icon" 
                            className="w-5 h-5 object-contain flex-shrink-0"
                        />
                    ) : (
                        <div className="w-5 h-5 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400">?</span>
                        </div>
                    )}
                    <div className="text-sm dark:text-text-title-dark font-medium truncate" title={row?.title}>
                        {row?.title ?? '--'}
                    </div>
                </div>
            ),
        },
        {
            key: 'content',
            label: "Kiritilgan matn",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-gray-300 font-mono bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded truncate max-w-[400px]" title={row?.content}>
                    {row?.content ?? '--'}
                </div>
            ),
        },
        {
            key: 'processName',
            label: "Jarayon",
            headerClassName: 'dark:text-text-title-dark min-w-max w-[120px]',
            cellRender: (row) => (
                <MyBadge variant="neutral" className="border-gray-300 [&_p]:text-gray-600 dark:border-gray-600 dark:[&_p]:text-gray-400">
                    {row?.processName ?? '--'}
                </MyBadge>
            ),
        },
        {
            key: 'datetime',
            label: "Vaqt",
            headerClassName: 'dark:text-text-title-dark min-w-max w-[150px]',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark font-mono text-gray-500 whitespace-nowrap">
                     {row?.datetime ? dayjs(row.datetime).format('YYYY-MM-DD HH:mm') : '--'}
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
                    hasIndex={false}
                    onRowClick={(row) => setSelectedData(row)}
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
                        <div className="flex items-center gap-3">
                            {selectedData?.icon && (
                                <img 
                                    src={`data:image/png;base64,${selectedData.icon}`} 
                                    alt="icon" 
                                    className="w-6 h-6 object-contain shadow-sm rounded-sm"
                                />
                            )}
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                {selectedData?.title || 'Noma\'lum oyna'}
                            </h3>
                        </div>
                    )
                }}
                footerProps={{
                    children: (
                        <div className="w-full flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                            <span>Belgilar soni: <span className="font-semibold text-gray-700 dark:text-gray-300">{selectedData?.content?.length || 0}</span></span>
                            <span>{selectedData?.datetime ? dayjs(selectedData.datetime).format('YYYY-MM-DD HH:mm') : ''}</span>
                        </div>
                    )
                }}
            >
                <div className="p-2 space-y-4">
                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Jarayon</p>
                        <MyBadge variant="neutral" className="border-gray-300 bg-gray-100 [&_p]:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:[&_p]:text-gray-300 inline-flex shadow-sm">
                            {selectedData?.processName || '--'}
                        </MyBadge>
                    </div>

                    <div>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Kiritilgan Matn</p>
                        <div className="w-full min-h-[100px] max-h-[300px] overflow-y-auto bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 p-4 rounded-lg border border-gray-200 dark:border-gray-700 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                            {selectedData?.content || 'Matn yo\'q'}
                        </div>
                    </div>
                </div>
            </MyModal>
        </>
    );
};

export default KeylogsTable;
