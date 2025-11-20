import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MyButton from '../MyButton/MyButton';
import { twMerge } from 'tailwind-merge';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '../../../constants/pagination.constants';
import { MySelect } from '../Form';

interface PaginationProps {
  total: number | any;
  className?: string[];
}

/**
 * `MyPagination` is a component that provides navigation for paginated data. It displays the current page,
 * total results, and buttons for navigating to the next and previous pages. The component utilizes the
 * `useSearchParams` hook from `react-router-dom` to manage the pagination state in the URL, allowing for
 * bookmarkable pages and improved user experience. It also integrates with `react-i18next` for internationalization,
 * supporting translations for text displayed within the component.
 *
 * @component
 * @param {PaginationProps} props - The properties of the pagination component.
 * @param {number} props.total - The total number of items across all pages.
 * @param {string[]} [props.className] - Optional custom CSS classes to apply additional styling.
 * @returns {React.ReactElement} - The rendered pagination component with navigation controls.
 */

const sizeData = [
  {
    id: 1,
    size: 10
  },
  {
    id: 1,
    size: 25
  },
  {
    id: 2,
    size: 50
  },
  {
    id: 3,
    size: 100
  }
];

const MyPagination: FC<PaginationProps> = ({ total = 0, className = [] }) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const page: number = Number(searchParams.get('page')) || DEFAULT_PAGE;
  const limit: number = Number(searchParams.get('pageSize')) || DEFAULT_LIMIT;
  const totalNumber = total === 0 ? 1 : total;

  return (
    <div
      className={twMerge([
        'flex w-full items-center justify-between pb-6 pl-5 pr-5 pt-4',
        className
      ])}>
      <div className="flex items-center gap-4">
        <p className="text-subtle:text-gray-700 font-inter font-medium text-gray-900 dark:text-subtext-color-dark sm:text-[10px] lg:text-xs">
          {t('Show results')}
        </p>
        <div className="pagination-list w-[80px]">
          <MySelect
            className="dark:text-text-title-dark"
            options={sizeData?.map((evt: any) => {
              return {
                label: evt.size,
                value: evt.size
              };
            })}
            onChange={(evt: any) => {
              if (evt.value) {
                searchParams.set('pageSize', evt.value);
              }
              setSearchParams(searchParams);
            }}
            allowedRoles={["ADMIN", "HR", "GUARD", "DEPARTMENT_LEAD"]}
            value={Number(searchParams.get('pageSize')) || DEFAULT_LIMIT}
          />
        </div>
        <p className="text-subtle:text-gray-700 font-inter font-medium text-gray-900 dark:text-subtext-color-dark sm:text-[10px] lg:text-xs">
          {t('per page')}
        </p>
      </div>
      <div>
        <div className="flex items-center justify-center text-tag-neutral-text dark:text-subtext-color-dark sm:text-[10px] lg:text-c-s-p">
          {page * limit - limit + 1}
          <div className="mx-1 h-[2px] w-[16px] bg-text-muted" />
          {page * limit} {t('of')} {total} {t('results')}
        </div>
      </div>
      <div className="flex flex-row items-center gap-2">
        <p className="text-tag-neutral-text dark:text-subtext-color-dark sm:text-[10px] lg:text-c-s-p">
          {page} {t('of')} {Math.ceil(total / limit)} {t('pages')}
        </p>
        <div className="flex flex-row items-center gap-2 ">
          <MyButton
            size="base"
            disabled={page === 1}
            variant={page === 1 ? 'ghost' : 'secondary'}
            className={page === 1 ? 'dark-prev' : 'prev-button dark:text-text-title-dark'}
            onClick={() => {
              if (page) {
                searchParams.set('page', `${page - 1}`);
              }
              setSearchParams(searchParams);
              // setSearchParams({ ...searchParams, page: `${page - 1}` });
            }}
            startIcon={<ChevronLeft width={20} height={20} />}>
            {t('Prev')}
          </MyButton>
          <MyButton
            size="base"
            className={'dark-button dark:text-text-title-dark'}
            disabled={Math.ceil(totalNumber / limit) === page}
            variant={Math.ceil(totalNumber / limit) === page ? 'ghost' : 'secondary'}
            onClick={() => {
              if (page) {
                searchParams.set('page', `${page + 1}`);
              }
              setSearchParams(searchParams);
            }}
            endIcon={<ChevronRight width={20} height={20} />}>
            {t('Next')}
          </MyButton>
        </div>
      </div>
    </div>
  );
};

export default MyPagination;
