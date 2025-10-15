import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import ArrowUpRightSvg from 'assets/icons/ArrowUpRightSvg';

export interface MainCardProps {
  icon: any;
  subInfo: string;
  title: string;
  count: string | number;
  className?: string;
  link?: string;
  search?: string;
}

const MainCard: FC<MainCardProps> = ({ icon, subInfo, title, count, className, link, search }) => {
  const { t } = useTranslation();
  return (
    <article
      className={twMerge(
        'rounded-m bg-white p-4 shadow-base dark:bg-dark-dashboard-cards',
        className
      )}>
      <div className="mb-2 flex items-center justify-between">
        {icon}
        <span className="subInfo sm:text-[10px] font-medium lg:text-c-xs-p">{subInfo}</span>
      </div>
      <p className="mb-3 text-text-subtle dark:text-text-title-dark sm:text-[10px] lg:text-s-p">
        {title}
      </p>
      <div className="flex items-center justify-between">
        <h2 className="headers-web text-text-base dark:text-text-title-dark">{count}</h2>
        <Link state={{ search: search }} className="flex items-center" to={`${link}`}>
          <span className="text-s-p text-text-link">{t('See more')}</span> <ArrowUpRightSvg />
        </Link>
      </div>
    </article>
  );
};

export default MainCard;
