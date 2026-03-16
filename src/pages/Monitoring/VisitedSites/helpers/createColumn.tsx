import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { DataGridColumnType } from '@/components/Atoms/DataGrid/NewTable';
import dayjs from 'dayjs';
import { Tooltip } from 'flowbite-react';

export const createColumnsVisitedSites = () => {
    const { t } = useTranslation();

    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'title',
                label: t('Title'),
                headerClassName: 'dark:text-text-title-dark ',
                cellRender: (row) => {
                    const text = row?.title || '-';
                    return (
                        <div className="flex items-center gap-2 dark:text-text-title-dark">
                            {text.length > 20 ? (
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
                headerClassName: 'dark:text-text-title-dark',
                cellRender: (row) =>
                    <div className="dark:text-text-title-dark">{dayjs(row?.datetime).format('DD/MM/YYYY HH:mm:ss') || '-'}</div>
            },
            {
                key: 'processName',
                label: t('Process Name'),
                headerClassName: 'dark:text-text-title-dark ',
                cellRender: (row) => (
                    <div className="dark:text-text-title-dark">
                        {row?.processName || '-'}
                    </div>
                ),
            },
            {
                key: 'url',
                label: t('URL'),
                headerClassName: 'dark:text-text-title-dark',
                cellRender: (row) => {
                    const text = row?.url || '-';
                    return (
                        <div className="dark:text-text-title-dark text-blue-500 hover:underline">
                            {text.length > 10 && text !== '-' ? (
                                <Tooltip content={<div className="max-w-[300px] break-words whitespace-pre-wrap">{text}</div>} placement="bottom">
                                    <a href={text.startsWith('http') ? text : `http://${text}`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                        {text.substring(0, 20)}...
                                    </a>
                                </Tooltip>
                            ) : text !== '-' ? (
                                <a href={text.startsWith('http') ? text : `http://${text}`} target="_blank" rel="noopener noreferrer">
                                    {text}
                                </a>
                            ) : (
                                <span>{text}</span>
                            )}
                        </div>
                    );
                },
            },
        ],
        [t]
    );

    return {
        columns,
    };
};
