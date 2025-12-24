import { MySelect, MyTextarea } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyModal from 'components/Atoms/MyModal';
import { ISelect } from 'interfaces/select.interface';
import React from 'react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useFormAttendance } from '../hooks/useFormAttendance';

function ReasonModal({ row, refetch }: any) {
    const { t, i18n } = useTranslation();
    const {
        open,
        setOpen,
        reasonData,
        register,
        watch,
        onSubmit,
        handleSubmit,
        control
    } = useFormAttendance({ row, refetch })

    return (
        <>
            {
                row?.reasons ?
                    <MyButton onClick={() => setOpen(true)} variant="secondary">
                        {t('Sababli')}
                    </MyButton> :
                    <MyButton variant="secondary"
                        disabled={!(row?.arrivalStatus === "ABSENT" || row?.arrivalStatus === "LATE")}
                        onClick={() => setOpen(true)}>
                        {t('Reason')}
                    </MyButton>
            }

            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(false),
                    size: 'md'
                }}
                headerProps={{
                    children: <h2 className="dark:text-text-title-dark">{t('Reasonably')}</h2>
                }}
                bodyProps={{
                    children: (
                        <>
                            {
                                row?.reasons ? (
                                    <>
                                        <p className='dark:text-text-title-dark'>{t('Reason')}</p>
                                        <h2 className="mt-2 text-base dark:text-text-title-dark font-medium leading-7">
                                            {
                                                row?.reasons?.uz === "Boshqa" ? row.reason : row?.reasons?.[`${i18n?.language}`]
                                            }
                                        </h2>
                                        <MyDivider />
                                        <div className="mt-6 flex items-center justify-end gap-4">
                                            <MyButton
                                                onClick={() => setOpen(false)}
                                                className={'w-[98px]'}
                                                variant="secondary">
                                                {t('Close')}
                                            </MyButton>
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" action="">
                                        {
                                            watch("reasonTypeId") !== 1 ? (
                                                <Controller
                                                    name="reasonTypeId"
                                                    control={control}
                                                    render={({ field, fieldState }) => (
                                                        <MySelect
                                                            label={t("Select type")}
                                                            options={reasonData?.items?.map((evt: any) => ({
                                                                label: evt[`${i18n?.language}`],
                                                                value: evt.id,
                                                            }))}
                                                            value={field.value as any}  // 👈 cast to any
                                                            onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                                                            onBlur={field.onBlur}
                                                            error={!!fieldState.error}
                                                            allowedRoles={['ADMIN']}
                                                            required
                                                        />
                                                    )}
                                                />
                                            ) : null
                                        }
                                        {
                                            watch("reasonTypeId") === 1 ? (
                                                <MyTextarea label={t('Note')}  {...register('reason')} />
                                            ) : null
                                        }
                                        <div className="mt-2 flex items-center justify-end gap-4">
                                            <MyButton variant="primary" type="submit">
                                                {t('Save changes')}
                                            </MyButton>
                                            <MyButton
                                                onClick={() => setOpen(false)}
                                                variant="secondary">
                                                {t('Close')}
                                            </MyButton>
                                        </div>
                                    </form>
                                )
                            }
                        </>
                    ),
                    className: 'py-[10px]'
                }}
            />
        </>
    );
}

export default React.memo(ReasonModal);
