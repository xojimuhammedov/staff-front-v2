import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';
import dayjs from 'dayjs';
import { IAction } from 'interfaces/action.interface';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarIcon from '../../../assets/icons/avatar.jpg';

export const createColumns = () => {
    const { t } = useTranslation();

    const renderTimeCell = (time?: string, format = 'HH:mm') => {
        if (!time) return '--';
        return (
            <div className="department-text text-text-base dark:text-text-title-dark">
                {' '}
                {dayjs(time).format(format)}{' '}
            </div>
        );
    };

    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'fullName',
                label: t('Employee name'),
                headerClassName: 'w-1/3',
                cellRender: (row) => {
                    if (row.visitorType === 'EMPLOYEE') {
                        return (
                            <div className="flex items-center gap-2 dark:text-text-title-dark">
                                <MyAvatar
                                    size="medium"
                                    imageUrl={
                                        row?.employee?.photo
                                            ? `${config.FILE_URL}api/storage/${row?.employee?.photo}`
                                            : AvatarIcon
                                    }
                                />
                                {row?.employee?.name}
                            </div>
                        )
                    } else {
                        return (
                            <div className="flex items-center gap-2 dark:text-text-title-dark">
                                <MyAvatar
                                    size="medium"
                                    imageUrl={AvatarIcon}
                                />
                                {row?.visitor?.firstName} {row?.visitor?.lastName}
                            </div>
                        )
                    }
                },
            },
            {
                key: 'actionType',
                label: t('Credential type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => <div className='text-text-base dark:text-text-title-dark'>{row?.actionType}</div>,
            },
            {
                key: 'actionTime',
                label: t('Action time'),
                headerClassName: 'w-1/4',
                cellRender: (row) => renderTimeCell(row?.actionTime, 'HH:mm'),
            },
            {
                key: 'visitorType',
                label: t('User type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => <div className='text-text-base dark:text-text-title-dark'>{row?.visitorType}</div>,
            },
            {
                key: 'entryType',
                label: t('Entry type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => <div className='text-text-base dark:text-text-title-dark'>{row?.entryType}</div>,
            },
            {
                key: 'gate',
                label: t('Gate & device name'),
                headerClassName: 'w-1/4',
                cellRender: (row) => <div className='dark:text-text-title-dark flex flex-col'>
                    <p className='text-base'>{row?.gate?.name}</p>
                    <p className='text-xs'>{row.device?.name}</p>
                </div>,
            },
        ],
        [t]
    );

    const dataColumn = [
        {
            id: 1,
            label: t('Employee name'),
            headerClassName: 'w-1/3',
        },
        {
            id: 2,
            label: t('Credential type'),
            headerClassName: 'w-1/4',
        },
        {
            id: 3,
            label: t('Action time'),
            headerClassName: 'w-1/4',
        },
        {
            id: 4,
            label: t('User type'),
            headerClassName: 'w-1/4',
        },
        {
            id: 5,
            label: t('Entry type'),
            headerClassName: 'w-1/4',
        },
        {
            id: 6,
            label: t('Gate & device name'),
            headerClassName: 'w-1/4',
        },
    ];
    const rowActions: IAction[] = useMemo(
        () => [],
        [t]
    );

    return {
        rowActions,
        dataColumn,
        columns,
    };
};