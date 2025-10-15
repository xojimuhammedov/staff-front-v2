import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function Components404() {
  const { t } = useTranslation();
  return (
    <section className="relative h-[100vh] max-h-full">
      <div className="absolute left-1/2 top-2/4 mx-auto max-w-screen-xl -translate-x-1/2 -translate-y-1/2 px-4 py-8 lg:px-6 lg:py-16">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="dark:text-primary-500 mb-4 text-7xl font-extrabold tracking-tight text-blue-600 lg:text-9xl">
            404
          </h1>
          <p className="mb-4 text-3xl font-bold tracking-tight text-gray-900 dark:text-white md:text-4xl">
            {t("Something's missing.")}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            {t("Sorry, we can't find that page. You'll find lots to explore on the home page.")}{' '}
          </p>
          <Link
            to={'/'}
            className="hover:bg-primary-800 focus:ring-primary-300 dark:focus:ring-primary-900 my-4 inline-flex rounded-lg bg-blue-600 px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
            {t('Back to Homepage')}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Components404;
