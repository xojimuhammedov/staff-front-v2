import { Clock, Calendar } from 'lucide-react';
import Button from 'components/Atoms/MyButton';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';

interface OnetimeCodeCardProps {
  code: any;
  onToggle: (code: any) => void;
}

const OnetimeCodeCard = ({ code, onToggle }: OnetimeCodeCardProps) => {
  const { t } = useTranslation();
  
  const infoItems = [
    { 
      icon: Calendar, 
      color: "text-blue-500", 
      label: t('Code ID'), 
      value: code?.id 
    },
    { 
      icon: Clock, 
      color: "text-green-500", 
      label: t('Start Time'), 
      value: code?.startDate ? dayjs(code.startDate).format('DD/MM/YYYY HH:mm') : '--'
    },
    { 
      icon: Clock, 
      color: "text-red-500", 
      label: t('End Time'), 
      value: code?.endDate ? dayjs(code.endDate).format('DD/MM/YYYY HH:mm') : '--' 
    }
  ];
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 flex flex-col">
      <div className="mb-4 space-y-2">
        {infoItems.map(({ icon: Icon, color, label, value }, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon className={color} size={18} />
            <p className="text-sm text-gray-600">
              <span className="font-medium">{label}:</span>{' '}
              <span className="font-semibold text-gray-800">{value}</span>
            </p>
          </div>
        ))}
        {code?.codeType && (
          <div className="mt-2">
            <p className="text-xs text-gray-500">
              {t('Type')}: <span className="font-semibold">{code.codeType}</span>
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Button
          variant='destructive'
          className='w-full font-medium'
          onClick={() => onToggle(code)}
        >
          {code?.isActive ? t('Inactive') : t('Active')}
        </Button>
      </div>
    </div>
  );
};

export default OnetimeCodeCard;