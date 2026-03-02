import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useDeleteQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit3, Search, Trash2, Users } from 'lucide-react';
import MyModal from 'components/Atoms/MyModal';
import Edit from './Edit';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';

const JobList = ({ data, isLoading, refetch }: any) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false)
    const [typeId, setTypeId] = useState(null)
    const currentLang = i18n.resolvedLanguage;


    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.employeeJobPosition
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.employeeJobPosition}/${typeId}`
            },
            {
                onSuccess: () => {
                    refetch();
                }
            }
        );
    };

    const columns: DataGridColumnType[] = useMemo(
        () => [
            {
                key: 'value',
                label: t('Position'),
                headerClassName: 'dark:text-text-title-dark',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        {row?.[`${currentLang}`]}
                    </div>
                )
            },
            {
                key: 'OrganizationName',
                label: t('Organization name'),
                headerClassName: 'dark:text-text-title-dark',
                cellRender: (row) => (
                    <div className="flex items-center gap-4 dark:text-text-title-dark">
                        {row?.organization?.fullName}
                    </div>
                )
            },
            {
                key: 'employeesCount',
                label: t('Employees count'),
                headerClassName: 'dark:text-text-title-dark justify-center text-center',
                cellRender: (row) => (
                    <div className="flex items-center justify-center gap-2 text-text-base dark:text-text-title-dark">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300">
                            <Users className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-semibold">
                            {row?._count?.employees ?? 0}
                        </span>
                    </div>
                )
            }
        ],
        [t]
    );

    const rowActions: IAction[] = useMemo(
        () => [
            {
                icon: <Edit3 size={DEFAULT_ICON_SIZE} />,
                type: 'secondary',
                name: t('Edit'),
                action: (row) => {
                    setOpen(true)
                    setTypeId(row?.id)
                }
            },
            {
                icon: <Trash2 size={DEFAULT_ICON_SIZE} />,
                type: 'danger',
                name: t('Delete'),
                action: (row) => {
                    setTypeId(row?.id);
                    setShow(true);
                }
            },
        ],
        [t]
    );


    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Loading />
            </div>
        );
    }

    return (
        <div>
            <MyDivider />
            <DynamicTable
                data={get(data, 'items', [])}
                pagination={data}
                columns={columns}
                rowActions={rowActions}
                hasIndex={true}
            />
            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="dark:text-text-title-dark">{t('Position')}</h2>
                }}
                bodyProps={{
                    children: (
                        <Edit setOpen={setOpen} refetch={refetch} typeId={typeId} />
                    ),
                    className: 'py-[10px]'
                }}
            />
            <ConfirmationModal
                title={t("Bu jobni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={show} setOpen={setShow} confirmationDelete={deleteItem} />
        </div>
    );
};

export default JobList;
