import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import dayjs from 'dayjs';
import { get } from 'lodash';
import { Terminal, Trash2, Eraser, RefreshCw, Power, Square, Play, CheckCircle2, Send, XCircle, Ban, Clock, Search } from 'lucide-react';
import { useGetAllQuery } from '@/hooks/api';
import { KEYS } from '@/constants/key';
import { URLS } from '@/constants/url';
import { paramsStrToObj } from 'utils/helper';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';
import { MyInput, MySelect } from '@/components/Atoms/Form';
import { useSearch } from '@/hooks/useSearch';
import { KeyTypeEnum } from '@/enums/key-type.enum';
import { SendCommandModal } from './SendCommandModal';
import MyButton from '@/components/Atoms/MyButton/MyButton';

const ACTION_UI_MAP: Record<string, { label: string, Icon: any, colors: string }> = {
    REMOVE: { label: "ACTION_REMOVE", Icon: Trash2, colors: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30" },
    CLEAN: { label: "ACTION_CLEAN", Icon: Eraser, colors: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30" },
    RESTART: { label: "ACTION_RESTART", Icon: RefreshCw, colors: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30" },
    RESTART_PC: { label: "ACTION_RESTART_PC", Icon: RefreshCw, colors: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800/30" },
    POWER_OFF_PC: { label: "ACTION_POWER_OFF_PC", Icon: Power, colors: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700" },
    STOP: { label: "ACTION_STOP", Icon: Square, colors: "bg-red-50 text-red-600 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30" },
    START: { label: "ACTION_START", Icon: Play, colors: "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800/30" }
};

const STATUS_UI_MAP: Record<string, { label: string, Icon: any, colors: string }> = {
    RECEIVED: { label: "STATUS_RECEIVED", Icon: CheckCircle2, colors: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30" },
    SENT: { label: "STATUS_SENT", Icon: Send, colors: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800/30" },
    FAILED: { label: "STATUS_FAILED", Icon: XCircle, colors: "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800/30" },
    CANCELLED: { label: "STATUS_CANCELLED", Icon: Ban, colors: "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700" },
    PENDING: { label: "STATUS_PENDING", Icon: Clock, colors: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-800/30" },
};



const CommandHistory = ({ user }: { user?: any }) => {
    const { t, i18n } = useTranslation();
    const currentLang: any = i18n.resolvedLanguage;
    const { id } = useParams();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const searchValue: any = paramsStrToObj(location.search);
    const [isCommandModalOpen, setIsCommandModalOpen] = useState(false);
    const { search, setSearch, handleSearch } = useSearch();

    const actionOptions = useMemo(() => [
        { label: t('All'), value: "" },
        ...Object.entries(ACTION_UI_MAP).map(([value, { label }]) => ({ value, label: t(label) }))
    ], [t]);

    const statusOptions = useMemo(() => [
        { label: t('All'), value: "" },
        ...Object.entries(STATUS_UI_MAP).map(([value, { label }]) => ({ value, label: t(label) }))
    ], [t]);

    const { data, isLoading } = useGetAllQuery<any>({
        key: KEYS.getCommandHistory,
        url: URLS.getCommandHistory,
        params: {
            page: searchValue?.page || 1,
            limit: searchValue?.limit || 10,
            computerId: id,
            action: searchValue?.action || undefined,
            status: searchValue?.status || undefined,
            search: searchValue?.search,
            startDate: searchValue?.startDate,
            endDate: searchValue?.endDate,
        },
        enabled: !!id,
    });

    const columns: DataGridColumnType[] = useMemo(() => [
        {
            key: 'command',
            label: t('Command'),
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                    {row?.command ?? '--'}
                </div>
            ),
        },
        {
            key: 'action',
            label: t('Action'),
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => {
                const actionData = ACTION_UI_MAP[row?.action];
                if (actionData) {
                    const { Icon, label, colors } = actionData;
                    return (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colors}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {t(label)}
                        </div>
                    );
                }
                return (
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {row?.action ?? '--'}
                    </div>
                );
            },
        },
        {
            key: 'status',
            label: t('Status'),
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => {
                const statusData = STATUS_UI_MAP[row?.status];
                if (statusData) {
                    const { Icon, label, colors } = statusData;
                    return (
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${colors}`}>
                            <Icon className="h-3.5 w-3.5" />
                            {t(label)}
                        </div>
                    );
                }
                return (
                    <div className="font-medium text-gray-900 dark:text-gray-100">
                        {row?.status ?? '--'}
                    </div>
                );
            },
        },
        {
            key: 'user',
            label: t('User'),
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div>
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {row?.user?.name ?? '--'}
                    </div>
                    {row?.user?.role && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {row.user.role}
                        </div>
                    )}
                </div>
            ),
        },
        {
            key: 'createdAt',
            label: t('Time'),
            headerClassName: 'dark:text-text-title-dark min-w-max',
            cellRender: (row) => (
                <div className="text-sm text-gray-500 dark:text-gray-400 font-mono">
                    {row?.createdAt ? dayjs(row.createdAt).format('DD.MM.YYYY HH:mm:ss') : '--'}
                </div>
            ),
        },
    ], [t, currentLang]);

    return (
        <div>
            <div className="flex justify-between items-start mb-6 pr-[260px]">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Terminal className="h-5 w-5 text-primary" />
                        <h1 className="text-2xl font-semibold text-foreground">{t('Command History')}</h1>
                    </div>
                    <p className="text-muted-foreground">
                        {t('Command History Desc')}
                    </p>
                </div>
                <MyButton
                    onClick={() => setIsCommandModalOpen(true)}
                    variant='secondary'
                    startIcon={<Terminal className="h-4 w-4" />}
                >
                    {t('Send Command')}
                </MyButton>
            </div>

            <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-[rgb(var(--color-bg-base-dark))] shadow-sm overflow-hidden min-h-[400px]">
                <div className="flex p-4 justify-between items-center gap-4">
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
                    <div className="flex items-center gap-4">
                        <div className="w-[200px]">
                            <MySelect
                                options={actionOptions}
                                value={searchValue?.action || ""}
                                onChange={(val: any) => {
                                    if (val?.value) {
                                        searchParams.set('action', val.value);
                                    } else {
                                        searchParams.delete('action');
                                    }
                                    searchParams.set('page', '1');
                                    setSearchParams(searchParams);
                                }}
                            />
                        </div>
                        <div className="w-[200px]">
                            <MySelect
                                options={statusOptions}
                                value={searchValue?.status || ""}
                                onChange={(val: any) => {
                                    if (val?.value) {
                                        searchParams.set('status', val.value);
                                    } else {
                                        searchParams.delete('status');
                                    }
                                    searchParams.set('page', '1');
                                    setSearchParams(searchParams);
                                }}
                            />
                        </div>
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

            <SendCommandModal
                open={isCommandModalOpen}
                setOpen={setIsCommandModalOpen}
                user={user}
            />
        </div>
    );
};

export default CommandHistory;
