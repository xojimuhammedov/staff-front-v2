import { FC } from 'react';
import { ChevronRight } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';

export type BreadCrumbItemType = {
  url: string;
  label: string;
};

interface MyBreadCrumbProps {
  items: BreadCrumbItemType[];
  pageTitle?: string;
}

/**
 * `MyBreadCrumb` is a navigational helper component that displays a breadcrumb trail for users to keep track of their locations within the application. It leverages `NavLink` from `react-router-dom` for navigation, and integrates with `i18next` for the initial 'Dashboard' breadcrumb translation. The component is styled using Tailwind CSS with hover effects.
 *
 * @component
 * @param {MyBreadCrumbProps} props - The properties of the breadcrumb component.
 * @param {BreadCrumbItemType[]} props.items - An array of breadcrumb items where each item contains a URL and a label. The last item in the array represents the current page.
 * @param {pageTitle} [props.pageTitle=''] - current page title
 * @returns {React.ReactElement} - The rendered breadcrumb navigation list.
 */

const MyBreadCrumb: FC<MyBreadCrumbProps> = ({ items, pageTitle }) => {
  const { t } = useTranslation();

  const generalStyles = [
    'inline-flex items-center text-c-m text-text-subtle hover:text-text-base dark:text-subtext-color-dark'
  ];

  return (
    <div className={twMerge(['flex', pageTitle && 'flex-col'])} aria-label="Breadcrumb">
      {pageTitle && <h1 className="headers-core text-text-base dark:text-text-title-dark">{pageTitle}</h1>}
      <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
        <li className="inline-flex items-center">
          <NavLink to="/" className={twMerge(generalStyles)}>
            {t('Dashboard')}
          </NavLink>
        </li>

        {items.map(({ label, url }, i) => {
          if (i === items.length - 1) {
            return (
              <li key={i} aria-current="page">
                <div className="flex items-center">
                  <ChevronRight className="stroke-text-muted" width={16} height={16} />
                  <span className="dark:text-subtext-color-dark ms-1 text-c-m text-text-base md:ms-1">
                    {label}
                  </span>
                </div>
              </li>
            );
          }

          return (
            <li>
              <div className="flex items-center">
                <ChevronRight className="stroke-text-muted" width={16} height={16} />
                <NavLink to={url} className={twMerge(generalStyles, 'md:ms-1')}>
                  {label}
                </NavLink>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

export default MyBreadCrumb;
