import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import Button from 'components/Atoms/MyButton';
import { ZoomSlider } from 'components/Atoms/Cropper/Sliders';
import { useTranslation } from 'react-i18next';
import Cropper from 'components/Atoms/Cropper/Cropper';

const ImageCropModalContent = ({ handleDone, handleClose }: any) => {
  const { setImage }: any = useImageCropContext();

  const { t } = useTranslation();
  const handleFileChange = async ({ target: { files } }: any) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
  };

  return (
    <div className="w-full">
      <div className="m-auto mb-4">
        <Cropper />
      </div>
      <div className="flex w-full justify-center">
        <ZoomSlider className="mb-4 flex items-center" />
      </div>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="hidden"
        id="avatarInput"
        accept="image/*"
      />

      <div className="flex justify-end gap-2">
        <Button variant="secondary" onClick={handleClose}>
          {t('Cancel')}
        </Button>
        <Button variant="primary" className="" onClick={handleDone}>
          {t('Done & Save')}
        </Button>
      </div>
    </div>
  );
};

export default ImageCropModalContent;
