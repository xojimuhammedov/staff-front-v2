import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UploadCloud } from 'lucide-react';
import MyModal from 'components/Atoms/MyModal';
import { URLS } from 'constants/url';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import { request } from 'services/request';
import ImageCropModalContent from '../Create/_components/ImageCropModalContent';

interface AvatarUploadProps {
  onChangeImageKey: (key: string | null) => void;
}

const AvatarUpload: React.FC<AvatarUploadProps> = ({ onChangeImageKey }) => {
  const { t } = useTranslation();
  const [preview, setPreview] = useState<any>();
  const [openModal, setOpenModal] = useState(false);
  const { getProcessedImage, setImage, resetStates }: any = useImageCropContext();

  const handleFileChange = async ({ target: { files } }: any) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
    setOpenModal(true);
  };

  const handleDone = async (): Promise<void> => {
    const avatar = await getProcessedImage();
    if (avatar) {
      if (avatar instanceof Blob) {
        try {
          const formData = new FormData();
          formData.append('file', avatar);

          const response = request.post(URLS.uploadPhotoByEmployee, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          response.then((res) => onChangeImageKey(res?.data?.key ?? null));

          const imageUrl = URL.createObjectURL(avatar);
          setPreview(imageUrl);

          resetStates();
          setOpenModal(false);
        } catch (error) {
          console.error('❌ Error uploading avatar:', error);
        }
      } else {
        console.error('Processed image is not a valid Blob.');
      }
    } else {
      console.error('Processed image is not available.');
    }
  };

  return (
    <>
      <div className="cursor-pointer">
        <p className="font-inter text-base font-medium leading-5 dark:text-text-title-dark">
          {t('Avatar image')} <span className="text-red-500">{'*'}</span>
        </p>
        <div className="mt-2 flex h-[160px] w-[150px] items-center justify-center border-2 bg-[#F9FAFB]">
          <label className="cursor-pointer">
            <img className="h-[160px] w-[150px] object-cover" src={preview} />
          </label>
        </div>
        <input
          type="file"
          onChange={handleFileChange}
          className="hidden"
          id="avatarInput"
          accept="image/*"
        />
        <label
          htmlFor="avatarInput"
          className="mt-6 flex h-[32px] cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-gray-300 px-[6px] py-[6px]  text-xs font-medium text-gray-700 shadow-sm dark:text-text-title-dark"
        >
          <UploadCloud /> {t('Upload image')}
        </label>
      </div>
      <MyModal
        modalProps={{
          show: Boolean(openModal),
          onClose: () => setOpenModal(false),
          size: 'md',
        }}
        headerProps={{
          children: <h2 className="text-gray-800">{t('Edit profile picture')}</h2>,
        }}
        bodyProps={{
          children: (
            <>
              <ImageCropModalContent
                handleDone={handleDone}
                handleClose={() => setOpenModal(false)}
              />
            </>
          ),
        }}
      />
    </>
  );
};

export default AvatarUpload;
