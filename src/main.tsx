import ReactDOM from 'react-dom/client';
import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import './assets/css/app.css';
import { AuthProvider } from 'context/AuthContext';
import { ToastContainer } from 'react-toastify';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ImageCropProvider from 'context/ImageCropProvider';
import AppRoutes from 'router/AppRoutes';
import { SearchParamsProvider } from 'context/RouteContext';
import { DarkLightProvider } from 'context/DarkLightContext';
import Loading from 'assets/icons/Loading';
import { NavigateParamsProvider } from 'context/NavigateRouteContext';
const queryClient = new QueryClient();
import { registerSW } from 'virtual:pwa-register'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <Suspense
      fallback={
        <div className="absolute flex h-full w-full items-center justify-center">
          <Loading />
        </div>
      }>
      <ToastContainer />
      <DarkLightProvider>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <ImageCropProvider>
              <SearchParamsProvider>
                <NavigateParamsProvider>
                  <AppRoutes />
                </NavigateParamsProvider>
              </SearchParamsProvider>
            </ImageCropProvider>
          </QueryClientProvider>
        </AuthProvider>
      </DarkLightProvider>
    </Suspense>
  </BrowserRouter>
);


const updateSW = registerSW({
  onNeedRefresh() {
    // yangi versiya mavjud bo'lsa xabar chiqarish
    if (confirm("Yangi versiya mavjud. Yangilaysizmi?")) {
      updateSW(true)
    }
  },
  onOfflineReady() {
    console.log('App offline rejimda ishlashga tayyor ✅')
  },
})
