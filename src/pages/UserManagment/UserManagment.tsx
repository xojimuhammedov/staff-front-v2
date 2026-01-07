import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserTable from './_components/UserTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';

const UserManagment = () => {
    const { t } = useTranslation()
    const [open, setOpen] = useState(false);
    const breadCrumbs = [
        {
            label: t('Users'),
            url: '#'
        }
    ];
    return (
        <PageContentWrapper>
            <div className='flex items-center justify-between'>
                <div className="flex flex-col">
                    <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Users')}</h1>
                    <MyBreadCrumb items={breadCrumbs} />
                </div>
                <MyButton
                    onClick={() => {
                        setOpen(true)
                    }}
                    startIcon={<Plus />}
                    variant="primary"
                    className="[&_svg]:stroke-bg-white w-[130px] text-sm">
                    {t('Add a user')}
                </MyButton>
            </div>
            <UserTable open={open} setOpen={setOpen} />
        </PageContentWrapper>
    );
}

export default UserManagment;
