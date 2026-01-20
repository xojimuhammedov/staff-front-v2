import MyButton from "components/Atoms/MyButton/MyButton";
import MyModal from "components/Atoms/MyModal";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const FixIssueModal = ({ row }: any) => {
    const [open, setOpen] = useState(false)
    const { t } = useTranslation()
    const navigate = useNavigate()
    return (
        <>
            {
                row?.status === "FAILED" ? <MyButton variant="secondary" onClick={() => setOpen(true)}>{t("Fix issue")}</MyButton> : <MyButton variant="secondary" disabled>{t("Fix issue")}</MyButton>
            }
            <MyModal
                modalProps={{
                    show: Boolean(open),
                    onClose: () => setOpen(!open),
                    size: 'md'
                }}
                headerProps={{
                    children: (
                        <h2 className="text-20 leading-32 font-inter tracking-tight text-black dark:text-text-title-dark">
                            {t('Error issue')}
                        </h2>
                    )
                }}
                bodyProps={{
                    children: (
                        <>
                            <h2 className="mt-2 text-base text-text-base dark:text-text-title-dark font-medium leading-7">
                                {row?.message}
                            </h2>
                        </>
                    ),
                    className: 'py-[15px]'
                }}
                footerProps={{
                    children: (
                        <div className="mt-2 w-full flex items-center justify-end gap-4">
                            <MyButton onClick={() => navigate(`/employees/about/${row?.employee?.id}?current-setting=details`)} variant="primary" type="submit">
                                {t('Fix error')}
                            </MyButton>
                            <MyButton
                                onClick={() => setOpen(false)}
                                variant="secondary">
                                {t('Close')}
                            </MyButton>
                        </div>
                    ),
                    className: 'w-full'
                }}
            />
        </>
    );
}

export default FixIssueModal;
