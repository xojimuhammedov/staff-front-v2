import DashboardLayout from 'components/Layouts/DashboardLayout';

import { Route, Routes } from 'react-router-dom';
import { PrivateRoutes, PublicRoutes } from 'router';
import storage from 'services/storage';
import PrivateRoute from './components/PrivateRoutes';
import { twMerge } from 'tailwind-merge';
import { useState } from 'react';
import Loading from 'components/Layouts/DashboardLayout/Loading';
import Components404 from 'components/Layouts/DashboardLayout/404';

function AppRoutes() {
  const [loading, setLoading] = useState<boolean>(false);

  if (loading) {
    return <Loading />;
  }

  return (
    // <ThemeProvider storageKey='staff-ui-theme'>
      <Routes>
        {PublicRoutes.map((evt: any, key: number) => (
          <Route key={key} path={evt.path} element={evt.element} />
        ))}
        {PrivateRoutes?.map((evt: any, key: number) => (
          <Route
            key={key}
            path={evt.path}
            element={
              <>
                <DashboardLayout setLoading={setLoading} />
                <PrivateRoute element={evt?.element} roles={evt?.roles} />
              </>
            }
          />
        ))}
        <Route path="*" element={<Components404 />} />
      </Routes>
    // </ThemeProvider>
  );
}

export default AppRoutes;
