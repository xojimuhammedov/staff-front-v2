import clsx from 'clsx';
import { FC } from 'react';
import { SvgComponentProps } from 'types/common';

const ArrowUpRightSvg: FC<SvgComponentProps> = ({ className, ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      className={clsx(['stroke-text-link', className])}
      {...props}>
      <path
        d="M4.66675 4.66675H11.3334M11.3334 4.66675V11.3334M11.3334 4.66675L4.66675 11.3334"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowUpRightSvg;
