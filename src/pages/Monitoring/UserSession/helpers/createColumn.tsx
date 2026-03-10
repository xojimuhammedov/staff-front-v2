import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from '@/components/Atoms/DataGrid/NewTable';
import dayjs from 'dayjs';
import config from '@/configs';
import { Tooltip } from 'flowbite-react';

export const createColumnsUserSession = () => {
    const { t } = useTranslation();

    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'title',
                label: t('Title'),
                headerClassName: 'dark:text-text-title-dark min-w-max',
                cellRender: (row) => {
                    const text = row?.title || '-';
                    return (
                        <div className="flex items-center gap-2 dark:text-text-title-dark">
                            {text.length > 30 ? (
                                <Tooltip content={text} placement="bottom">
                                    <span className="cursor-pointer">{text.substring(0, 20)}...</span>
                                </Tooltip>
                            ) : (
                                <span>{text}</span>
                            )}
                        </div>
                    );
                },
            },
            {
                key: 'datetime',
                label: t('Datetime'),
                headerClassName: 'dark:text-text-title-dark min-w-max',
                cellRender: (row) =>
                    <div className="dark:text-text-title-dark">{dayjs(row?.datetime).format('DD/MM/YYYY HH:mm:ss') || '-'}</div>
            },
            {
                key: 'processName',
                label: t('Process Name'),
                headerClassName: 'dark:text-text-title-dark min-w-max',
                cellRender: (row) => (
                    <div className="dark:text-text-title-dark">
                        {row?.processName || '-'}
                    </div>
                ),
            },
        ],
        [t]
    );

    return {
        columns,
    };
};
