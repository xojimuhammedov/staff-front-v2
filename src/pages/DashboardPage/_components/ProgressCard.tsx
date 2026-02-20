import config from 'configs';
import AvatarIcon from '../../../assets/icons/avatar.jpg';
import { Clock, CalendarClock, AlertTriangle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import IconByName from 'assets/icons/IconByName';
import { t as i18nT } from 'i18next';
import { MySelect } from 'components/Atoms/Form';
import { useSearchParams } from 'react-router-dom';

interface Employee {
  id: number;
  name: string;
  department: string;
  photo: string;
  totalWorkedMinutes: number;
  totalPlannedMinutes: number;
  totalLateDays: number;
  percentage: number;
}

interface EmployeeCardProps {
  employee: Employee[];
  rank?: number;
  title: string;
  icon: string ;
  iconBgColor: string;
  iconColor: string;
  onRowClick?: (employeeId: number) => void;
  paginationKey?: string;
}

function getRingColor(percentage: number) {
  if (percentage >= 90) return 'stroke-emerald-500';
  if (percentage >= 80) return 'stroke-amber-500';
  return 'stroke-red-500';
}

function getPercentageTextColor(percentage: number) {
  if (percentage >= 90) return 'text-emerald-600';
  if (percentage >= 80) return 'text-amber-600';
  return 'text-red-500';
}

function CircularProgress({ percentage }: { percentage: number }) {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
      <svg className="-rotate-90" width="44" height="44" viewBox="0 0 44 44">
        <circle cx="22" cy="22" r={radius} fill="none" className="stroke-muted" strokeWidth="3" />
        <circle
          cx="22"
          cy="22"
          r={radius}
          fill="none"
          className={getRingColor(percentage)}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }}
        />
      </svg>
      <span className={`absolute text-[10px] font-bold ${getPercentageTextColor(percentage)}`}>
        {Math.ceil(percentage)}%
      </span>
    </div>
  );
}

export function EmployeeCard({
  employee,
  title,
  icon,
  iconBgColor,
  iconColor,
  onRowClick,
  paginationKey = 'employees',
}: EmployeeCardProps) {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const limitKey = `${paginationKey}Limit`;
  const defaultLimit = 5;
  const limitParam = searchParams.get(limitKey);
  const limit = limitParam ? Number(limitParam) : defaultLimit;
  const visibleEmployees = employee?.slice(0, limit) ?? [];

  const limitOptions = [
    { label: '5', value: 5 },
    { label: '10', value: 10 },
    { label: '25', value: 25 },
    { label: '50', value: 50 },
    { label: '100', value: 100 },
  ];

  function formatMinutes(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours} ${t('hours')}, ${mins} ${i18nT('minutes')}`;
  }
  return (
    <>
      <div className="bg-bg-base w-full dark:bg-dark-dashboard-cards rounded-lg p-4 shadow-base">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <div
              className={`${iconBgColor} w-10 h-10 rounded-2xl flex items-center justify-center`}
            >
              <IconByName name={icon as string} size={20} className={iconColor} strokeWidth={2} />
            </div>
            <div>
              <h1 className="headers-core text-base dark:text-text-title-dark">{t(title)}</h1>
            </div>
          </div>
          <div className="pagination-list w-[80px]">
            <MySelect
              allowedRoles={['ADMIN', 'HR', 'GUARD', 'DEPARTMENT_LEAD']}
              className="dark:text-text-title-dark dark:bg-dark-line"
              options={limitOptions}
              onChange={(evt: any) => {
                const nextLimit = evt?.value ?? evt;
                if (nextLimit) {
                  setSearchParams(
                    (prev) => {
                      const next = new URLSearchParams(prev);
                      next.set(limitKey, String(nextLimit));
                      next.delete(`${paginationKey}Page`);
                      return next;
                    },
                    { replace: true }
                  );
                }
              }}
              value={limit}
            />
          </div>
        </div>
        <div className="mt-2 h-[400px] overflow-y-auto pr-1 space-y-2">
          {visibleEmployees?.map((emp, index) => (
            <div
              key={emp.id}
              className="group flex items-center gap-3 rounded-lg border border-border dark:border-dark-line bg-card px-3 py-2.5 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer dark:bg-dark-line"
              onClick={() => {
                onRowClick?.(emp.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              {/* Rank */}
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-muted text-[10px] font-bold text-muted-foreground dark:text-white">
                {index + 1}
              </span>

              {/* Avatar */}
              <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full ring-1 ring-border">
                <img
                  src={emp?.photo ? `${config.FILE_URL}api/storage/${emp?.photo}` : AvatarIcon}
                  alt={emp?.name}
                  className="h-full w-full object-cover"
                />
              </div>

              {/* Name + Department */}
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-semibold leading-tight text-card-foreground dark:text-text-title-dark">
                  {emp?.name}
                </h3>
                <p className="truncate text-[11px] leading-tight text-muted-foreground dark:text-text-title-dark">
                  {emp?.department}
                </p>
              </div>

              {/* Inline stats */}
              <div className="hidden items-center gap-4 sm:flex">
                <div className="flex items-center gap-1.5" title="Ishlangan vaqt">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground dark:text-white" />
                  <span className="text-xs font-medium text-card-foreground dark:text-text-title-dark">
                    {formatMinutes(emp?.totalWorkedMinutes)}
                  </span>
                </div>

                <div className="flex items-center gap-1.5" title="Rejadagi vaqt">
                  <CalendarClock className="h-3.5 w-3.5 text-muted-foreground dark:text-white" />
                  <span className="text-xs text-muted-foreground dark:text-text-title-dark">
                    {formatMinutes(emp?.totalPlannedMinutes)}
                  </span>
                </div>

                {emp?.totalLateDays > 0 && (
                  <div className="flex items-center gap-1" title="Kechikish kunlari">
                    <AlertTriangle
                      className={`h-3.5 w-3.5 ${emp?.totalLateDays > 3 ? 'text-red-500' : 'text-amber-500'}`}
                    />
                    <span
                      className={`text-xs font-medium ${emp?.totalLateDays > 3 ? 'text-red-500' : 'text-amber-600'}`}
                    >
                      {emp?.totalLateDays}
                    </span>
                  </div>
                )}
              </div>

              {/* Circular percentage */}
              <CircularProgress percentage={emp?.percentage} />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
