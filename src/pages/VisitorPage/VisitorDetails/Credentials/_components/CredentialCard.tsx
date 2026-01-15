import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Download } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import Button from 'components/Atoms/MyButton';
import MyButton from 'components/Atoms/MyButton/MyButton';
import config from 'configs';

interface CredentialCardProps {
  item: any;
  onToggle: (item: any) => void;
}

const CredentialCard: React.FC<CredentialCardProps> = ({ item, onToggle }) => {
  const { t } = useTranslation();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const downloadQR = (code: string) => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const tempCanvas = document.createElement('canvas');
    const size = 512;

    tempCanvas.width = size;
    tempCanvas.height = size;

    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(canvas, 0, 0, size, size);

    const link = document.createElement('a');
    link.download = `QR_${code}.png`;
    link.href = tempCanvas.toDataURL('image/png', 1.0);
    link.click();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col">
      <div className="flex items-center mb-4">
        {item.type === 'PHOTO' ? (
          <img
            className="w-20 h-20 rounded-full object-cover"
            src={`${config.FILE_URL}api/storage/${item?.additionalDetails}`}
            alt="User photo"
          />
        ) : item?.type === 'QR' ? (
          <div className="flex justify-between w-full">
            <QRCodeCanvas
              value={item?.code}
              ref={canvasRef}
              size={80}
              style={{ opacity: '0.2' }}
            />
            <MyButton
              onClick={() => downloadQR(item?.code)}
              variant="secondary"
              startIcon={<Download />}
            />
          </div>
        ) : (
          <h2 className="text-xl font-semibold text-gray-800">{item?.code}</h2>
        )}
      </div>

      <div className="mb-6">
        <p className="text-sm text-gray-600">
          {t('Type')}: <span className="font-semibold">{item?.type}</span>
        </p>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Button
          variant="destructive"
          className="w-full font-medium"
          onClick={() => onToggle(item)}
        >
          {item?.isActive ? t('Inactive') : t('Active')}
        </Button>
      </div>
    </div>
  );
};

export default CredentialCard;
