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
      value: code?.code
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
    <div className="bg-white dark:bg-bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm p-4 flex flex-col">
      <div className="mb-4 space-y-2">
        {infoItems.map(({ icon: Icon, color, label, value }, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <Icon className={color} size={18} />
            <p className="text-sm text-gray-600 dark:text-text-title-dark">
              <span className="font-medium">{label}:</span>{' '}
              <span className="font-semibold text-gray-800 dark:text-text-title-dark">{value}</span>
            </p>
          </div>
        ))}
        {code?.codeType && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 dark:text-text-title-dark">
              {t('Type')}: <span className="font-semibold">{code.codeType}</span>
            </p>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 mt-auto">
        <Button
          variant='primary'
          className={`
            w-full rounded-md bg-red-600 dark:bg-red-700 text-sm font-semibold text-white dark:text-white shadow-xs hover:bg-red-500 dark:hover:bg-red-600 [&_svg]:stroke-gray-600 dark:[&_svg]:stroke-gray-300
          `}
          onClick={() => onToggle(code)}
        >
          {code?.isActive ? t('Inactive') : t('Active')}
        </Button>
      </div>
    </div>
  );
};

export default OnetimeCodeCard;