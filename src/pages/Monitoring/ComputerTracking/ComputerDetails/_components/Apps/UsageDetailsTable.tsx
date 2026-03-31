import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { get } from 'lodash';
import { useLocation, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import MyBadge from '@/components/Atoms/MyBadge';
import { MyInput } from '@/components/Atoms/Form';
import { useSearch } from '@/hooks/useSearch';
import { KeyTypeEnum } from '@/enums/key-type.enum';

interface UsageDetailsTableProps {
    user?: any;
}

const formatTime = (seconds: number) => {
    if (!seconds) return "0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    if (h > 0) return `${h} s ${m} d`;
    return `${m} d`;
};

const UsageDetailsTable = ({ user }: UsageDetailsTableProps) => {
    const { t, i18n } = useTranslation();
    const currentLang: any = i18n.resolvedLanguage;
    const { id } = useParams();
    const location = useLocation();
    const searchValue: any = paramsStrToObj(location.search);
    const { search, setSearch, handleSearch } = useSearch();

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getUsageDetails,
        url: URLS.getUsageDetails,
        params: {
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            search: searchValue?.search,
            computerId: id,
            employeeId: user?.employee?.id,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
            resourceType: "APPLICATION",
        },
        enabled: !!id,
    });

    const columns: DataGridColumnType[] = useMemo(() => [
        {
            key: 'type',
            label: "Turi",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="flex items-center gap-3 dark:text-text-title-dark">
                    <p className="font-medium text-xs">{row?.type === 'APPLICATION' ? 'Ilova' : row?.type === 'WEBSITE' ? 'Veb-sayt' : row?.type}</p>
                </div>
            ),
        },
        {
            key: 'name',
            label: "Nomi",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-text-base dark:text-text-title-dark font-medium">{row?.name ?? '--'}</div>
            ),
        },
        {
            key: 'title',
            label: "Sarlavha",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => {
                return (
                    <div className="text-sm dark:text-text-title-dark truncate max-w-[300px]" title={row?.title}>
                        {row?.title ?? '--'}
                    </div>
                );
            },
        },
        {
            key: 'category',
            label: "Kategoriya",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => {
                const category = row?.category;
                let variant = 'gray';
                let label = category;
                
                if (category === 'UNUSEFUL') {
                    variant = 'red';
                    label = 'Foydasiz';
                } else if (category === 'USEFUL') {
                    variant = 'green';
                    label = 'Foydali';
                } else if (category === 'OTHER') {
                    variant = 'gray';
                    label = 'Boshqa';
                }

                return (
                    <MyBadge
                        className={`border ` + (variant === 'red' ? 'border-tag-red-icon [&_p]:text-tag-red-text dark:border-tag-red-icon dark:[&_p]:text-tag-red-text' : 
                            variant === 'green' ? 'border-tag-green-icon [&_p]:text-tag-green-text dark:border-tag-green-icon dark:[&_p]:text-tag-green-text' : 
                            'border-gray-300 [&_p]:text-gray-600 dark:border-gray-600 dark:[&_p]:text-gray-400')}
                        variant={variant as any}
                    >
                        {label || '--'}
                    </MyBadge>
                );
            },
        },
        {
            key: 'totalUsageTime',
            label: "Foydalanilgan vaqt",
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm dark:text-text-title-dark font-mono">
                    {formatTime(row?.totalUsageTime)}
                </div>
            ),
        },
    ], [currentLang]);

    if (!user?.employee?.id) {
        return null;
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

export default UsageDetailsTable;
