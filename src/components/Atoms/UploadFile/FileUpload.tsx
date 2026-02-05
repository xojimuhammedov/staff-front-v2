import React, { useState } from 'react';
import { get } from 'lodash';
import cn from 'classnames';
import UploadBase from './UploadBase';
import { UploadIcon } from 'lucide-react';
import Button from '../MyButton';
import { request } from 'services/request';
import storage from 'services/storage';
import { twMerge } from 'tailwind-merge';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface FileUploadProps {
  title: string;
  subtitle?: string;
  accept?: string;
  isMultiple?: boolean;
  className?: string;
  labelExtractInfo?: string;
  label?: string;
  setUpload?: any;
}

const FileUpload: React.FC<FileUploadProps> = ({
  title,
  subtitle = '',
  accept = '.png,.jpg,.jpeg',
  isMultiple = false,
  className = '',
  label,
  // labelExtractInfo = 'Upload Documents',
  setUpload
}) => {
  const [file, setFile] = useState<any>();
  const [percentage, setPercentage] = useState<string>('0%');
  const [status, setStatus] = useState<string>('loading');
  const [imageUrl, setImageUrl] = useState<string>('');
  const { t } = useTranslation();

  const requiredLabelStyles = [
    `before:absolute before:right-[-10px] before:top-0 before:text-text-error before:content-['*']`
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (!uploadedFile) return;

    setFile(uploadedFile);
    const formData = new FormData();
    formData.append('files', uploadedFile);

    request
      .post('/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${storage.get('accessToken')}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(({ data }) => {
        setStatus('success');
        toast.success('File uploaded successfully');
        if (data?.length > 0) {
          const ids = data[0]?.id;
          setUpload((prevIds: any) => [...prevIds, ids]);
        }
        setImageUrl(get(data, '0.url', ''));
      })
      .catch((error) => {
        setStatus('error');
        toast.error('File upload error');
        setTimeout(() => {
          setFile(null);
        }, 2000);
      });
  };

  return (
    <div className="w-full">
      {title && (
        <label
          htmlFor="upload-file"
          className={twMerge(['relative mb-1.5 inline-block text-c-m-p text-text-base'])}>
          {title}
        </label>
      )}
      <UploadBase
        className={cn(file ? `file__zone file__zone_${status}` : 'file-upload', className)}
        accept={accept}
        isMultiple={isMultiple}
        onFileUpload={handleImageUpload}
        isDisabled={file}>
        {
          <div className="flex h-[124px] w-full flex-col items-center justify-center gap-4 rounded-sm border border-dashed border-gray-300 bg-white p-2">
            <UploadIcon stroke="gray" className="mb_10" />
            <p className="text-sm font-normal leading-6 text-gray-400">{t('Upload documents')}</p>
            <p className="text-sm font-normal leading-6 text-gray-400">{file?.name}</p>
          </div>
        }
        {/* {file && (
          <>
            {status === 'success' && (
              <Button
                onClick={(event: any) => {
                  event.stopPropagation();
                  setFile(null);
                }}
                className="file__close"
                //   append={<CloseIcon />}
              />
            )}
            <div className="file__zone-loading mt_10">
              <div style={{ width: percentage }}></div>
            </div>
          </>
        )} */}
      </UploadBase>
    </div>
  );
};

export default FileUpload;
