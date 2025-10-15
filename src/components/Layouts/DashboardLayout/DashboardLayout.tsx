import { Outlet } from 'react-router-dom';
import Header from './Header';

const DashboardLayout = ({ setLoading }: any) => {
  return (
    <div>
      <div className="shadow-[0px_12px_84px_0px_rgba(0, 0, 0, 0.05)] fixed top-0 z-10 flex h-[72px] w-full items-center border-b-2 bg-bg-base px-5 dark:border-bg-dark-bg dark:bg-bg-dark-theme">
        <Header setLoading={setLoading} />
      </div>

      <div className="relative mt-[72px] bg-white">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
