import MyBadge from 'components/Atoms/MyBadge';
import MyAvatar from 'components/Atoms/MyAvatar';
import ConfirmationModal from 'components/Atoms/Confirmation/Modal';
import config from 'configs';
import dayjs from 'dayjs';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type BadgeVariant = 'orange' | 'purple' | 'red' | 'blue' | 'green' | 'neutral';

export type AbsenceItem = {
  id?: number | string;
  status?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  employee?: {
    name?: string;
    photo?: string;
    jobTitle?: string;
    position?: { name?: string };
  };
  absence?: {
    name?: string;
    shortLetterUz?: string;
    shortLetterRu?: string;
    shortLetterEng?: string;
  };
};

type AbsenceCardProps = {
  item: AbsenceItem;
  onDelete?: (id: number | string) => void;
};

const getInitials = (name?: string) => {
  if (!name) return '--';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
};

const getStatusMeta = (status?: string, startTime?: string, endTime?: string): {
  label: 'Planned' | 'Active' | 'Completed';
  variant: BadgeVariant;
  bar: string;
} => {
  if (status) {
    const normalized = status.toLowerCase();
    if (normalized.includes('plan')) return { label: 'Planned', variant: 'blue', bar: 'bg-blue-500' };
    if (normalized.includes('active')) return { label: 'Active', variant: 'green', bar: 'bg-green-500' };
    if (normalized.includes('complete')) return { label: 'Completed', variant: 'neutral', bar: 'bg-gray-400' };
  }

  if (startTime && endTime) {
    const now = dayjs();
    const start = dayjs(startTime);
    const end = dayjs(endTime);
    if (now.isBefore(start)) return { label: 'Planned', variant: 'blue', bar: 'bg-blue-500' };
    if (now.isAfter(end)) return { label: 'Completed', variant: 'neutral', bar: 'bg-gray-400' };
    return { label: 'Active', variant: 'green', bar: 'bg-green-500' };
  }

  return { label: 'Planned', variant: 'blue', bar: 'bg-blue-500' };
};

const getRangeLabel = (startTime?: string, endTime?: string) => {
  if (!startTime && !endTime) return '--';
  const start = startTime ? dayjs(startTime).format('DD MMM YYYY') : '--';
  const end = endTime ? dayjs(endTime).format('DD MMM YYYY') : '--';
  return `${start} - ${end}`;
};

const getDurationLabel = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return '--';
  const days = Math.max(1, dayjs(endTime).diff(dayjs(startTime), 'day') + 1);
  return `${days} ${days > 1 ? 'days' : 'day'}`;
};

const getProgress = (startTime?: string, endTime?: string) => {
  if (!startTime || !endTime) return null;
  const start = dayjs(startTime);
  const end = dayjs(endTime);
  const total = Math.max(1, end.diff(start, 'day') + 1);
  const now = dayjs();
  const done = Math.min(total, Math.max(0, now.diff(start, 'day') + 1));
  return Math.round((done / total) * 100);
};

const AbsenceCard = ({ item, onDelete }: AbsenceCardProps) => {
  const { t } = useTranslation();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const name = item.employee?.name ?? '--';
  const jobTitle = item.employee?.jobTitle ?? item.employee?.position?.name ?? '--';
  const imageUrl = item.employee?.photo
    ? `${config.FILE_URL}api/storage/${item.employee.photo}`
    : undefined;
  const statusMeta = getStatusMeta(item.status, item.startTime, item.endTime);
  const absenceLabel =
    item.absence?.shortLetterUz ||
    item.absence?.shortLetterRu ||
    item.absence?.shortLetterEng ||
    item.absence?.name ||
    '--';
  const durationLabel = getDurationLabel(item.startTime, item.endTime);
  const rangeLabel = getRangeLabel(item.startTime, item.endTime);
  const progress = getProgress(item.startTime, item.endTime);
  const progressValue =
    progress ??
    (statusMeta.label === 'Completed' ? 100 : statusMeta.label === 'Planned' ? 0 : null);

  return (
    <div className="rounded-m border border-transparent bg-bg-base p-4 shadow-base dark:border-white dark:bg-bg-dark-bg">
      <div className={`h-1 w-full rounded-full ${statusMeta.bar}`} />
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MyAvatar size="medium" shape="circle" isString={false} imageUrl={imageUrl}>
            <span className="text-c-m-p font-medium text-text-base dark:text-text-title-dark">
              {getInitials(name)}
            </span>
          </MyAvatar>
          <div>
            <p className="text-c-m-p font-medium text-text-base dark:text-text-title-dark">{name}</p>
            <p className="text-c-xs text-text-muted dark:text-text-title-dark">{jobTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MyBadge variant={statusMeta.variant}>{t(statusMeta.label)}</MyBadge>
          {onDelete && item.id ? (
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className="rounded-full p-2 text-text-muted hover:text-red-600 dark:text-text-title-dark"
              aria-label={t('Delete')}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-bg-subtle px-3 py-1 text-c-xs text-text-base dark:bg-gray-800 dark:text-text-title-dark">
          {absenceLabel}
        </span>
        <span className="rounded-full bg-bg-subtle px-3 py-1 text-c-xs text-text-base dark:bg-gray-800 dark:text-text-title-dark">
          {durationLabel}
        </span>
      </div>

      <div className="mt-3 text-c-xs text-text-muted dark:text-text-title-dark">{rangeLabel}</div>

      {progressValue !== null ? (
        <div className="mt-3">
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
            <div className={`h-2 ${statusMeta.bar}`} style={{ width: `${progressValue}%` }} />
          </div>
          <div className="mt-1 text-right text-c-xs text-text-muted dark:text-text-title-dark">
            {progressValue}%
          </div>
        </div>
      ) : null}

      {item.description ? (
        <div className="mt-3 rounded-m bg-bg-subtle p-2 text-c-xs text-text-base dark:bg-gray-800 dark:text-text-title-dark">
          {item.description}
        </div>
      ) : null}
      {onDelete && item.id ? (
        <ConfirmationModal
          title={t('Are you sure you want to delete this absence?')}
          subTitle={t('This action cannot be undone!')}
          open={confirmOpen}
          setOpen={setConfirmOpen}
          confirmationDelete={() => {
            onDelete(item.id as number | string);
            setConfirmOpen(false);
          }}
        />
      ) : null}
    </div>
  );
};

export default AbsenceCard;
