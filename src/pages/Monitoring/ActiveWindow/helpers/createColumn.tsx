import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from '@/components/Atoms/DataGrid/NewTable';
import dayjs from 'dayjs';
import { Tooltip } from 'flowbite-react';

export const createColumnsActiveWindow = () => {
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
                            {text.length > 20 ? (
                                <Tooltip content={<div className="max-w-[300px] break-words whitespace-pre-wrap">{text}</div>} placement="bottom">
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
            {
                key: 'icon',
                label: t('Icon'),
                headerClassName: 'dark:text-text-title-dark min-w-[60px]',
                cellRender: (row) => (
                    <div>
                        {row?.icon ? (
                            <img
                                src={row.icon.startsWith('data:image') ? row.icon : `data:image/png;base64,${row.icon}`}
                                alt="icon"
                                className="w-8 h-8 object-contain"
                            />
                        ) : (
                            '-'
                        )}
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
