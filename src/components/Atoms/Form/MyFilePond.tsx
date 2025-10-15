import React, { forwardRef } from 'react';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import 'filepond/dist/filepond.min.css';
import { useTranslation } from 'react-i18next';
import { FilePondFile } from 'filepond';
import { twMerge } from 'tailwind-merge';

registerPlugin(FilePondPluginFileValidateType);

// interface FormInputProps
//   extends Omit<React.ComponentPropsWithoutRef<'input'>, 'size' | 'className'> {
//   error?: boolean;
//   className?: string;
//   server?: string;
//   maxFiles?: number;
//   label?: string;
//   name: string;
//   accept?: string[];
//   isMulti?: boolean;
//   onChange?: (files: FilePondFile[]) => void;
// }

/**
 * `MyInput` is a customizable input component that extends the standard HTML input. It provides additional
 * features like different sizes, optional rounded corners, error state styling, full width option, and
 * inclusion of start/end icons. This component integrates with `i18next` for optional translation.
 *
 * @component
 * @param {FormInputProps} props - The properties of the input component.
 * @param {boolean} [props.rounded] - If true, the input will have rounded corners.
 * @param {'small' | 'base'} [props.size='base'] - The size of the input ('small' or 'base').
 * @param {boolean} [props.error=false] - If true, applies error styling to the input.
 * @param {boolean} [props.fullWidth=true] - If true, the input takes full width of its container.
 * @param {string} [props.className] - Additional custom CSS classes.
 * @param {string} [props.rootClassName] - Additional custom CSS classes for root element.
 * @param {ReactNode} [props.label] - Optional label for the input.
 * @param {ReactNode} [props.labelExtraInfo] - Optional extra info is positioned after label for the input.
 * @param {string} [props.helperText] - Optional helper text displayed below the input.
 * @param {ReactNode} [props.startIcon] - Icon displayed at the start of the input.
 * @param {ReactNode} [props.endIcon] - Icon displayed at the end of the input.
 * @param {FormInputRef} ref - Ref forwarded to the input element.
 * @returns {React.ReactElement} - The rendered input component.
 */

type FormInputRef = React.ComponentPropsWithRef<'input'>['ref'];

const MyFilePond = forwardRef((props: any, ref: FormInputRef) => {
  const { t } = useTranslation();
  const {
    error = false,
    isMulti = false,
    maxFiles = 1,
    accept = [],
    server,
    name,
    label = t('Drag & Drop your files or Browse'),
    className = '',
    onChange
  } = props;

  return (
    <FilePond
      className={twMerge('dark:bg-bg-form mb-0', className)}
      onupdatefiles={onChange && onChange}
      allowMultiple={isMulti}
      maxFiles={maxFiles}
      acceptedFileTypes={accept}
      server={server}
      name="licence"
      labelIdle={label}
    />
  );
});

export default MyFilePond;
