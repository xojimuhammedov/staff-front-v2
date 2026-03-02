import MyAvatar from 'components/Atoms/MyAvatar';
import MyBadge from 'components/Atoms/MyBadge';
import config from 'configs';
import {
  Phone,
  Mail,
  MapPin,
  Briefcase,
} from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { getDaysUntilBirthday } from 'utils/birthday';
import AvatarIcon from '../../../assets/icons/avatar.jpg';

export function BirthdayCard({ employee }: any) {

  return (
    <div
      className={twMerge(
        'group flex items-center gap-3 rounded-lg border border-border dark:border-dark-line bg-card px-3 py-2.5 transition-all hover:shadow-md hover:border-primary/30 cursor-pointer dark:bg-dark-line',
      )}
    >
      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="grid grid-cols-12 items-center gap-3">
          <div className="col-span-3">
            <div className="flex items-center gap-2">
              <MyAvatar
                size="medium"
                imageUrl={
                  employee?.photo ? `${config.FILE_URL}api/storage/${employee?.photo}` : AvatarIcon
                }
              />
              <span className="truncate text-sm dark:text-white font-semibold flex flex-col text-foreground">
                {employee?.name}
                <span className="text-xs text-muted-foreground dark:text-white">{employee?.job?.uz}</span>
              </span>
            </div>
          </div>

          <div className="col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="size-3.5 shrink-0 dark:text-white" />
                <span className="dark:text-white">{employee?.department?.fullName}</span>
              </div>

              {/* Phone */}
              {employee?.phone && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3.5 shrink-0 dark:text-white" />
                  <span className="dark:text-white">{employee?.phone}</span>
                </div>
              )}

              {/* Email */}
              {employee?.email && (
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <Mail className="size-3.5 shrink-0 dark:text-white" />
                  <span className="truncate dark:text-white">{employee?.email}</span>
                </div>
              )}

              {/* Address */}
              {employee?.address && (
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                  <MapPin className="size-3.5 shrink-0 dark:text-white" />
                  <span className="truncate dark:text-white">{employee?.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Days badge */}
          <div className="col-span-1">
            <MyBadge variant="orange" className="dark:text-white">{getDaysUntilBirthday(employee?.birthday)} kun</MyBadge>
          </div>
        </div>
      </div>
    </div>
  );
}
