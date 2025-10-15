import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

interface LabelledCaptionProps {
  title: string;
  subtitle: string;
  className?: string;
}

const LabelledCaption: FC<LabelledCaptionProps> = ({ title, subtitle, className }) => {
  return (
    <div className={twMerge(['flex flex-1 flex-col', className])}>
      <h1 className="headers-core dark:text-text-title-dark mb-1 text-text-base">{title}</h1>
      <p className="dark:text-subtext-color-dark text-c-m text-text-subtle">{subtitle}</p>
    </div>
  );
};

export default LabelledCaption;
