import FirstCapitalLetter from 'components/Atoms/FirstCapitalLetter/FirstCapitalLetter';
import { LogOut } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import storage from 'services/storage';
import AlertModal from './AlertModal';
import { useAuth } from 'hooks/useAuth';
import { Link } from 'react-router-dom';
import EditIcon from 'assets/icons/edit.svg'

const ProfileWidget = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const userDataString: string | null = storage.get('userData');
  const userData: any = userDataString ? JSON.parse(userDataString) : {};
  const [open, setOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogOut = () => {
    auth.logout()
  };

  return (
    <>
      <div onClick={() => setOpen(!open)} className="flex cursor-pointer items-center">
        <FirstCapitalLetter name={userData?.username || ''} />
        <p className="text-c-m-p text-text-base dark:text-text-title-dark">{userData?.username}</p>
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute right-2 top-14 flex w-[217px] cursor-pointer flex-col justify-center rounded-lg bg-white px-4 py-3 shadow-md dark:bg-bg-dark-bg dark:border dark:border-dark-line">
          <div className="bg-[#F9FAFB] dark:bg-bg-dark-theme p-2 rounded-md">
            <h2 className="text-base font-medium text-text-base dark:text-text-title-dark">
              {userData?.username}
            </h2>
            <p className="text-subtle font-inter text-sm dark:text-text-muted">{userData?.role}</p>
          </div>
          <Link to={'/profile/edit'} className="flex items-center gap-2 pt-6 text-text-base dark:text-text-title-dark">
            <img src={EditIcon} />
            <h3 className="text-sm font-medium">{t('Edit profile')}</h3>
          </Link>
          <span
            onClick={() => setOpenAlert(true)}
            className="flex items-center gap-2 pt-4"
          >
            <LogOut width={'20px'} stroke="#E11D48" />
            <h3 className="text-sm font-medium text-red-600">{t('Sign Out')}</h3>
          </span>
        </div>
      )}

      <AlertModal
        onClose={() => setOpenAlert(false)}
        handleLogOut={handleLogOut}
        show={openAlert}
      />
    </>
  );
};

export default ProfileWidget;
