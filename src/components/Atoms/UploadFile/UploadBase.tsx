import React, { ReactNode } from 'react';
import cn from 'classnames';

interface Props {
  className?: string;
  accept?: string;
  isMultiple?: boolean;
  isDisabled?: boolean;
  onFileUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: ReactNode;
}

const UploadBase: React.FC<Props> = ({
  className = '',
  accept = '.png,.jpg,.jpeg',
  isMultiple = false,
  isDisabled = false,
  onFileUpload,
  children
}) => {
  return (
    <label className={cn(className, { cursor_pointer: !isDisabled })}>
      <input
        type="file"
        accept={accept}
        multiple={isMultiple}
        onChange={onFileUpload}
        hidden={true}
        disabled={Boolean(isDisabled)}
        id='upload-file'
      />
      {children}
    </label>
  );
};

export default UploadBase;
