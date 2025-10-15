import classNames from 'classnames';
import { MinusIcon, PlusIcon, ArrowRight, ArrowLeft } from 'lucide-react';
import { useImageCropContext } from '../../../context/ImageCropProvider';

export const ZoomSlider = ({ className }: any) => {
  const { zoom, setZoom, handleZoomIn, handleZoomOut, max_zoom, min_zoom, zoom_step }: any =
    useImageCropContext();

  return (
    <div className={classNames(className, 'gap-2')}>
      <button className="p-1" onClick={handleZoomOut}>
        <MinusIcon className="w-4 text-gray-400" />
      </button>
      <input
        type="range"
        name="volju"
        min={min_zoom}
        max={max_zoom}
        step={zoom_step}
        value={zoom}
        onChange={(e) => {
          setZoom(Number(e.target.value));
        }}
      />
      <button className="p-1" onClick={handleZoomIn}>
        <PlusIcon className="w-4 text-gray-400" />
      </button>
    </div>
  );
};

export const RotationSlider = ({ className }: any) => {
  const {
    rotation,
    setRotation,
    max_rotation,
    min_rotation,
    rotation_step,
    handleRotateAntiCw,
    handleRotateCw
  }: any = useImageCropContext();

  return (
    <div className={classNames(className, 'gap-2')}>
      <button className="p-1" onClick={handleRotateAntiCw}>
        <ArrowLeft className="w-4 text-gray-400" />
      </button>
      <input
        type="range"
        name="volju"
        min={min_rotation}
        max={max_rotation}
        step={rotation_step}
        value={rotation}
        onChange={(e) => {
          setRotation(Number(e.target.value));
        }}
      />
      <button className="p-1" onClick={handleRotateCw}>
        <ArrowRight className="w-4 text-gray-400" />
      </button>
    </div>
  );
};
