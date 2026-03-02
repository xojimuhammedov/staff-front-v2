import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { useDeleteQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { get } from 'lodash';
import Loading from 'assets/icons/Loading';
import { IAction } from 'interfaces/action.interface';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';
import { Edit3, Search, Trash2 } from 'lucide-react';
import Edit from './Edit';
import MyModal from 'components/Atoms/MyModal';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import { DataGridColumnType, DynamicTable } from '@/components/Atoms/DataGrid/NewTable';


const TypeList = ({ data, isLoading, refetch }: any) => {
    const { t, i18n } = useTranslation();
    const [open, setOpen] = useState(false);
    const [show, setShow] = useState(false)
    const [typeId, setTypeId] = useState(null)
    const currentLang = i18n.resolvedLanguage;

    const { mutate: deleteRequest } = useDeleteQuery({
        listKeyId: KEYS.attendancesReason
    });

    const deleteItem = () => {
        deleteRequest(
            {
                url: `${URLS.attendancesReason}/${typeId}`
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
                label: t('Reason value'),
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
                    setShow(true)
                    setTypeId(row?.id)
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
            <DynamicTable
                data={get(data, 'items', [])}
                pagination={get(data, 'meta')}
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
                    children: <h2 className="dark:text-text-title-dark">{t('Reason')}</h2>
                }}
                bodyProps={{
                    children: (
                        <Edit setOpen={setOpen} refetch={refetch} typeId={typeId} />
                    ),
                    className: 'py-[10px]'
                }}
            />
            <ConfirmationModal
                title={t("Bu sababni o'chirmoqchimisiz?")}
                subTitle={t("Bu amalni qaytarib bo'lmaydi!")}
                open={show} setOpen={setShow} confirmationDelete={deleteItem} />
        </div>
    );
};

export default TypeList;
