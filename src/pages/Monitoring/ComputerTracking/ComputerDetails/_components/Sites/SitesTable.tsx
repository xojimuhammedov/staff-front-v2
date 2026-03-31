import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { get } from 'lodash';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { MyInput } from '@/components/Atoms/Form';
import { useSearch } from '@/hooks/useSearch';
import { KeyTypeEnum } from '@/enums/key-type.enum';

interface SitesTableProps {
    user?: any;
}

const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} s ${m} d`;
    return `${m} d`;
};

const SitesTable = ({ user }: SitesTableProps) => {
    const { t, i18n } = useTranslation();
    const currentLang: any = i18n.resolvedLanguage;
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);
    const { search, setSearch, handleSearch } = useSearch();

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getUsefulSites,
        url: URLS.getUsefulSites,
        params: {
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            search: searchValue?.search,
            isActive: false,
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
        },
        enabled: !!user?.employee?.id,
    });
    
    const columns: DataGridColumnType[] = useMemo(() => [
        {
            key: 'domain',
            label: "Domen",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-text-base dark:text-text-title-dark font-medium">{row?.domain ?? '--'}</div>
            ),
        },
        {
            key: 'title',
            label: "Sarlavha",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark truncate max-w-[400px]" title={row?.title}>
                    {row?.title ?? '--'}
                </div>
            ),
        },
        {
            key: 'percentage',
            label: "Foiz",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark font-medium text-blue-500">
                    {row?.percentage ?? 0}%
                </div>
            ),
        },
        {
            key: 'totalActiveTime',
            label: "Faol vaqt",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark font-mono">
                    {formatTime(row?.totalActiveTime)}
                </div>
            ),
        },
    ], [currentLang]);

    if (!user?.employee?.id) {
        return null; // The parent Sites.tsx already shows a warning if no employee
    }

    return (
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
            />
        </div>
    );
};

export default SitesTable;
