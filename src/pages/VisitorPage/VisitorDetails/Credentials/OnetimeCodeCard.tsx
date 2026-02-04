import { useMemo, useState } from 'react';
import { Car, Copy, Check, Clock, ToggleLeft, ToggleRight, Trash2 } from 'lucide-react';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { twMerge } from 'tailwind-merge';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';

interface OnetimeCodeCardProps {
  code: any;
  onToggle: (code: any) => void;
  onDelete?: (code: any) => void;
  onCopy?: (code: any) => void;
}

export default function OnetimeCodeCardNewUI({ code, onToggle, onDelete }: OnetimeCodeCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const accessCode = code?.code ?? '--';
  const codeType = (code?.codeType ?? 'ONETIME') as 'ONETIME' | 'MULTIPLE';
  const isActive = !!code?.isActive;

  const visitorName = `${code?.visitor?.firstName} ${code?.visitor?.lastName}` || t('Visitor');

  const carNumber = code?.carNumber || code?.carNo || undefined;

  const startTime = useMemo(
    () => (code?.startDate ? new Date(code.startDate) : null),
    [code?.startDate]
  );
  const endTime = useMemo(() => (code?.endDate ? new Date(code.endDate) : null), [code?.endDate]);

  const handleCopy = async () => {
    if (!accessCode || accessCode === '--') return;
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (d: Date | null) => {
    if (!d) return '--';
    return dayjs(d).format('DD MMM YYYY – HH:mm');
  };

  const getDurationHours = () => {
    if (!startTime || !endTime) return '--';
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
    return `${hours} ${t('hours')}`;
  };

  const getProgress = () => {
    if (!startTime || !endTime) return 0;
    const now = Date.now();
    const start = startTime.getTime();
    const end = endTime.getTime();
    if (now <= start) return 0;
    if (now >= end) return 100;
    return ((now - start) / (end - start)) * 100;
  };

  const progress = getProgress();

  const codeTypeBadgeColors = {
    ONETIME: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    MULTIPLE: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  } as const;

  return (
    <div
      className={twMerge(
        'relative bg-card rounded-lg shadow-base overflow-hidden',
        'border border-border/50 dark:border-dark-line dark:bg-bg-dark-bg group'
      )}
    >
      <div className="p-4 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground dark:text-text-title-dark tracking-tight">
              {visitorName}
            </h3>
          </div>

          <span
            className={twMerge(
              'px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-200',
              isActive
                ? 'border-emerald-500 text-emerald-600 dark:text-emerald-300 dark:border-emerald-800'
                : 'border-red-400 text-red-500 dark:text-red-300 dark:border-red-800'
            )}
          >
            {isActive ? t('Active') : t('Inactive')}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Access Code */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground dark:text-white uppercase tracking-wider">
              {t('Access Code')}
            </span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm font-semibold text-foreground dark:text-text-title-dark bg-muted/50 dark:bg-bg-form px-2 py-1 rounded-md">
                {accessCode}
              </code>
              <button
                onClick={handleCopy}
                className={twMerge(
                  'p-1.5 rounded-md transition-all duration-200',
                  'hover:bg-muted/80 dark:hover:bg-bg-form active:scale-95',
                  copied && 'text-emerald-600 dark:text-emerald-300'
                )}
                type="button"
                aria-label="Copy access code"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground dark:text-text-subtle" />
                )}
              </button>
            </div>
          </div>

          {/* Code Type */}
          <div className="space-y-1.5 ">
            <span className="text-xs font-medium text-muted-foreground mr-2 dark:text-white uppercase tracking-wider">
              {t('Code Type')}
            </span>
            <span
              className={twMerge(
                'inline-block px-2.5 py-1 rounded-md text-xs font-medium',
                codeTypeBadgeColors[codeType]
              )}
            >
              {codeType}
            </span>
          </div>

          {/* Car Number */}
          <div className={twMerge('space-y-1.5', !carNumber && 'invisible')}>
            <span className="text-xs font-medium text-muted-foreground dark:text-white uppercase tracking-wider">
              {t('Car Number')}
            </span>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-muted-foreground dark:text-text-subtle" />
              <span className="text-sm font-medium text-foreground dark:text-text-title-dark">
                {carNumber || '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="bg-muted/30  space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground dark:text-white">{t('Start time')}</p>
                <p className="text-sm font-medium text-foreground dark:text-text-title-dark truncate">
                  {formatDateTime(startTime)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-red-600 dark:text-red-300" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground dark:text-white">{t('End time')}</p>
                <p className="text-sm font-medium text-foreground dark:text-text-title-dark truncate">
                  {formatDateTime(endTime)}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div className="mt-6">

          <div className="border-t border-border/30 dark:border-dark-line flex items-center justify-between">
            <button
              onClick={() => onToggle(code)}
              className={twMerge(
                'flex items-center gap-2 px-3 mt-2 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'text-emerald-600 hover:bg-emerald-50 dark:text-emerald-300 dark:hover:bg-emerald-900/30'
                  : 'text-muted-foreground hover:bg-muted/50 dark:text-text-subtle dark:hover:bg-bg-form'
              )}
              type="button"
            >
              {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              <span className="hidden sm:inline">{isActive ? t('Inactive') : t('Active')}</span>
            </button>
            <div className="flex items-center gap-1">
              {onDelete && (
                <button
                  onClick={() => setConfirmOpen(true)}
                  className="rounded-lg text-muted-foreground hover:text-red-600 mt-2"
                  type="button"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {onDelete && (
            <ConfirmationModal
              title={t('Are you sure you want to delete this code?')}
              subTitle={t('This action cannot be undone!')}
              open={confirmOpen}
              setOpen={setConfirmOpen}
              confirmationDelete={() => {
                onDelete(code);
                setConfirmOpen(false);
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
