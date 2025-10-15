import React, { forwardRef } from 'react';

import { FileInput, Label } from 'flowbite-react';
import IconByName from 'assets/icons/IconByName';

interface FormInputProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'className'> {
  rounded?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  title?: string;
  text?: string;
  onChange?: ($e: React.ChangeEvent<HTMLInputElement>) => void;
}

type FormInputRef = React.ComponentPropsWithRef<'input'>['ref'];

const MyUploadFile = forwardRef((props: FormInputProps, ref: FormInputRef) => {
  const { error = false, fullWidth = true, rounded, className, title, text, onChange } = props;
  return (
    <div className="dark:bg-bg-form flex w-full flex-col gap-2">
      <p className="text-sm font-normal text-gray-700">{title}</p>
      <Label
        htmlFor="dropzone-file"
        className="dark:hover:bg-bray-800 flex h-[114px] w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div className="flex flex-col items-center justify-center gap-4 pb-6 pt-5">
          <div className="flex items-center gap-3">
            <IconByName color={'#4B5563'} name="Download" />
          </div>
          <p className="text-sm font-normal text-gray-400">{text}</p>
        </div>
        <FileInput id="dropzone-file" className="hidden" onChange={onChange && onChange} />
      </Label>
    </div>
  );
});

export default MyUploadFile;
