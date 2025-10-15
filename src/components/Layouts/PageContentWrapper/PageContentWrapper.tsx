import { ReactNode, FC, ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageContentWrapperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  children: ReactNode | ReactNode[];
  className?: string | string[];
  paginationProps?:ReactNode
}

const PageContentWrapper: FC<PageContentWrapperProps> = ({ children, className, id, paginationProps, ...rest }) => {
  return (
    <div className="relative min-h-screen bg-bg-subtle dark:bg-bg-dark-bg px-5">
      <div
        id="table-container"
        style={{ width: 'calc(100% - 40px)' }}
        className={' absolute -top-5'}>
        <div
          className={twMerge([
            'mt-12 min-h-[500px] rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme',
            className
          ])}
          {...rest}>
          {children}
        </div>
        {paginationProps}
      </div>
      
    </div>
  );
};

export default PageContentWrapper;
