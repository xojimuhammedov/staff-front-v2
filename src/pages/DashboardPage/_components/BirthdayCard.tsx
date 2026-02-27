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
        'group relative flex items-start gap-4 rounded-lg border p-4 transition-all duration-200 hover:shadow-md',
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
              <span className="truncate text-sm font-semibold flex flex-col text-foreground">
                {employee?.name}
                <span className="text-xs text-muted-foreground">{employee?.job?.uz}</span>
              </span>
            </div>
          </div>

          <div className="col-span-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Briefcase className="size-3.5 shrink-0 text-primary/60" />
                <span>{employee?.department?.fullName}</span>
              </div>

              {/* Phone */}
              {employee?.phone && (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="size-3.5 shrink-0 text-primary/60" />
                  <span>{employee?.phone}</span>
                </div>
              )}

              {/* Email */}
              {employee?.email && (
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                  <Mail className="size-3.5 shrink-0 text-primary/60" />
                  <span className="truncate">{employee?.email}</span>
                </div>
              )}

              {/* Address */}
              {employee?.address && (
                <div className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
                  <MapPin className="size-3.5 shrink-0 text-primary/60" />
                  <span className="truncate">{employee?.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Days badge */}
          <div className="col-span-1">
            <MyBadge variant="orange">{getDaysUntilBirthday(employee?.birthday)} kun</MyBadge>
          </div>
        </div>
      </div>
    </div>
  );
}
