import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserTable from './_components/UserTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus } from 'lucide-react';

const UserManagment = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const breadCrumbs = [
    {
      label: t('Users'),
      url: '#',
    },
  ];
  return (
    <PageContentWrapper>
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">{t('Users')}</h1>
          <MyBreadCrumb items={breadCrumbs} />
        </div>
        <MyButton
          onClick={() => {
            setOpen(true);
          }}
          startIcon={<Plus />}
          className={`
                text-sm w-[180px]
                bg-white text-gray-800 border border-gray-300 hover:bg-gray-100
                dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700
                [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300 
              `}
        >
          {t('Add a user')}
        </MyButton>
      </div>
      <UserTable open={open} setOpen={setOpen} />
    </PageContentWrapper>
  );
};

export default UserManagment;
