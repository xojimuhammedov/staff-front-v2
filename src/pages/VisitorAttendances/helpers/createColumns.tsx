import { DataGridColumnType } from 'components/Atoms/DataGrid/DataGridCell.types';
import MyAvatar from 'components/Atoms/MyAvatar';
import config from 'configs';
import dayjs from 'dayjs';
import {
    Calendar,
    Clock,
    CreditCard,
    DoorOpen,
    Fingerprint,
    KeyRound,
    LogIn,
    LogOut,
    ScanFace,
    User,
    UserRound,
} from 'lucide-react';
import { IAction } from 'interfaces/action.interface';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import DateText from 'components/Atoms/DateText';

export const createColumns = () => {
    const { t } = useTranslation();

    const renderCredentialType = (type?: string) => {
        if (!type) return '--';
        const configs: Record<string, { label: string; Icon: any; classes: string }> = {
            PHOTO: {
                label: t('PHOTO'),
                Icon: ScanFace,
                classes:
                    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
            },
            TOUCH: {
                label: t('TOUCH'),
                Icon: Fingerprint,
                classes:
                    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
            },
            PASSWORD: {
                label: t('PASSWORD'),
                Icon: KeyRound,
                classes:
                    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
            },
            CARD: {
                label: t('CARD'),
                Icon: CreditCard,
                classes:
                    'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
            },
            CAR: {
                label: t('CAR'),
                Icon: DoorOpen,
                classes:
                    'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
            },
        };
        const cfg = configs[type] ?? {
            label: type,
            Icon: CreditCard,
            classes:
                'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-300',
        };
        const Icon = cfg.Icon;
        return (
            <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${cfg.classes}`}
            >
                <Icon className="h-4 w-4" />
                {cfg.label}
            </span>
        );
    };

    const renderUserType = (type?: string) => {
        if (!type) return '--';
        const isEmployee = type === 'EMPLOYEE';
        const Icon = isEmployee ? UserRound : User;
        return (
            <span className="inline-flex items-center gap-2 text-sm font-medium text-text-base dark:text-text-title-dark">
                <Icon className="h-4 w-4 text-purple-500" />
                {t(type)}
            </span>
        );
    };

    const renderEntryType = (type?: string) => {
        if (!type) return '--';
        const isEnter = type === 'ENTER';
        return (
            <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-base font-medium ${isEnter
                    ? 'text-green-700 dark:text-green-300'
                    : 'text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                    }`}
            >
                <span className="flex h-5 w-5 items-center justify-center">
                    {isEnter ? (
                        <LogIn className="h-4 w-4 text-green-600 dark:text-green-300" />
                    ) : (
                        <LogOut className="h-4 w-4 text-orange-600 dark:text-orange-300" />
                    )}
                </span>
                {t(type)}
            </span>
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
                                            ? `${config.FILE_URL}api/storage/${row?.image ?? row?.employee?.photo}`
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
                cellRender: (row) => renderCredentialType(row?.actionType),
            },
            {
                key: 'actionTime',
                label: t('Action time'),
                headerClassName: 'w-1/4',
                cellRender: (row) => (
                    <div className="flex flex-col text-text-base dark:text-text-title-dark">
                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-text-muted dark:text-white" />
                            <span>{row?.actionTime ? dayjs(row.actionTime).format('HH:mm') : '--'}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-text-muted dark:text-text-subtle">
                            <Calendar className="h-4 w-4 dark:text-white" />
                            <span className='dark:text-white'><DateText value={row?.actionTime} /></span>
                        </div>
                    </div>
                ),
            },
            {
                key: 'visitorType',
                label: t('User type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => renderUserType(row?.visitorType),
            },
            {
                key: 'entryType',
                label: t('Entry type'),
                headerClassName: 'w-1/4',
                cellRender: (row) => renderEntryType(row?.entryType),
            },
            {
                key: 'gate',
                label: t('Gate & device name'),
                headerClassName: 'w-1/4',
                cellRender: (row) => (
                    <div className="flex flex-col dark:text-text-title-dark">
                        <div className="flex items-center gap-2 text-base font-medium">
                            <DoorOpen className="h-4 w-4 text-indigo-500" />
                            {row?.gate?.name ?? '--'}
                        </div>
                        <p className="text-xs text-text-muted dark:text-text-subtle">
                            {row?.device?.name ?? '--'}
                        </p>
                    </div>
                ),
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