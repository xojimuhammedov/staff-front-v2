import { ReactNode, FC, ComponentPropsWithoutRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageContentWrapperProps extends Omit<ComponentPropsWithoutRef<'div'>, 'className'> {
  children: ReactNode | ReactNode[];
  className?: string | string[];
  paginationProps?: ReactNode
}

const PageContentWrapper: FC<PageContentWrapperProps> = ({ children, className, id, paginationProps, ...rest }) => {
  return (
   <div className="min-h-[100vh - 72px] dark:bg-bg-dark-bg">
      <div
        id="table-container"
        style={{ width: 'calc(100% - 40px)' }}
         className={'dark:bg-bg-dark-bg m-auto pt-[12px]'}>
        <div
          className={twMerge([
            'mt-8 rounded-m min-h-[648px] max-h-[100vh] p-4 shadow-base dark:bg-bg-dark-bg',
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
