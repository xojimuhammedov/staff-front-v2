import SecureStaff from 'assets/icons/SecureStaff';
import { useTranslation } from 'react-i18next';
import LoginForm from './_components/LoginForm';

const LoginPage = () => {
  const { t } = useTranslation();
  return (
    <div className="flex h-screen items-center justify-center bg-gray-100 dark:bg-bg-darkBg">
      <div className="shadow-card-rest absolute w-[432px] transform rounded-lg bg-white p-8 dark:bg-bg-dark-bg">
        <div className="mb-12 flex items-center justify-center">
          {' '}
          <SecureStaff />
        </div>
        <div className="mb-12">
          <h2 className="headers-web mb-2 text-center text-text-base dark:text-text-title-dark">
            {t('Welcome back!')}
          </h2>
          <p className="text-center text-xl text-text-subtle dark:text-subtext-color-dark">
            {t(`Enter your username and password to access admin panel.`)}
          </p>
        </div>
        <LoginForm />
      </div>
      {/* <p className='absolute  text-black'>2019 - 2024 © Developed by  <span>Sector Secure LLC</span></p> */}
    </div>
  );
};

export default LoginPage;
