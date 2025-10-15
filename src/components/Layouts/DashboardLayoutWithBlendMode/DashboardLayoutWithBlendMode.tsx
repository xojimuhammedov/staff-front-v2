import { Outlet } from 'react-router-dom';

const DashboardLayoutWithBlendMode = () => {
  return (
    <div>
      <div
        className="pb-8 pt-8"
      />
      <Outlet />
    </div>
  );
};

export default DashboardLayoutWithBlendMode;
