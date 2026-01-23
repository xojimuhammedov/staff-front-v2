import MyBreadCrumb from 'components/Atoms/MyBreadCrumb';
import PageContentWrapper from 'components/Layouts/PageContentWrapper';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import UserTable from './_components/UserTable';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { Plus, Search } from 'lucide-react';
import { MyInput } from 'components/Atoms/Form';
import { KeyTypeEnum } from 'enums/key-type.enum';
import { useSearch } from 'hooks/useSearch';

const UserManagment = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { search, setSearch, handleSearch } = useSearch();
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
        <div className='flex items-center gap-4'>
          <MyInput
            onKeyUp={(event) => {
              if (event.key === KeyTypeEnum.enter) {
                handleSearch();
              } else {
                setSearch((event.target as HTMLInputElement).value);
              }
            }}
            defaultValue={search}
            startIcon={<Search className="stroke-text-muted" onClick={handleSearch} />}
            className="dark:bg-bg-input-dark"
            placeholder={t('Search...')}
          />
          <MyButton
            onClick={() => {
              setOpen(true);
            }}
            startIcon={<Plus />}
            variant='primary'
            className={`text-sm w-[170px] [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          >
            {t('Add a user')}
          </MyButton>
        </div>
      </div>
      <UserTable open={open} setOpen={setOpen} />
    </PageContentWrapper>
  );
};

export default UserManagment;
