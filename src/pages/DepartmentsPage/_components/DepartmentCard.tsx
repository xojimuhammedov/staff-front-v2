import { useTranslation } from 'react-i18next';
import { Building2, Users, MapPin, Phone, Mail, FileText, Eye, Pencil, Trash2 } from 'lucide-react';
import MyBadge from 'components/Atoms/MyBadge';
import React from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const DepartmentCard = ({ item, setOpen, setDepartmentId, setShow, setEditId }: any) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleViewClick = (item: any) => {
    const currentSetting = searchParams.get('current-setting');

    if (location?.pathname && currentSetting === 'department') {
      return navigate(
        `/view?organizationId=${item?.organizationId}&parentDepartmentId=${item?.id}&current-setting=departmentInfo`
      );
    }
    if (location?.pathname && currentSetting === 'subdepartment') {
      return navigate(
        `/view?organizationId=${item?.organizationId}&parentDepartmentId=${item?.parentId}&subdepartmentId=${item?.id}&current-setting=subdepartmentInfo`
      );
    } else {
      return navigate(`/employees?subdepartmentId=${item?.id}`);
    }
  };

  return (
    <div className="dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] rounded-lg shadow-sm gap-2 relative">
      <div
        className={`h-[2px] rounded-t-xl transition-colors ${item.status === 'Active' ? 'bg-[hsl(var(--success))]' : 'bg-muted-foreground/30'}`}
      />
      <div className="flex flex-col flex-1 px-4 pt-3 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="h-6 w-6 text-gray-500 dark:text-white stroke-[1.3]" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="relative group/name mb-1">
                <h3 className="text-base font-semibold text-card-foreground truncate leading-tight cursor-default dark:text-text-title-dark">
                  {item.fullName}
                </h3>
                <div className="invisible opacity-0 group-hover/name:visible group-hover/name:opacity-100 transition-all duration-150 absolute left-0 bottom-full mb-1.5 z-50 max-w-[280px] rounded-md bg-foreground px-2.5 py-1.5 text-[11px] text-background shadow-lg pointer-events-none whitespace-nowrap">
                  {item.fullName}
                  <div className="absolute left-3 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
                </div>
              </div>
              <MyBadge variant={item?.isActive ? 'green' : 'red'}>
                {item?.isActive ? t('Active') : t('Inactive')}
              </MyBadge>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2 rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme px-2.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-white stroke-[1.3]" />
            </div>
            <div>
              <p className="text-base font-bold text-card-foreground leading-none dark:text-text-title-dark">
                {item?._count?.childrens}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 dark:text-text-title-dark">
                {t('Departments')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-[#F9FAFB] dark:bg-bg-dark-theme px-2.5 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Users className="h-4 w-4 text-gray-500 dark:text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-card-foreground leading-none dark:text-text-title-dark">
                {item._count?.employees}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5 dark:text-text-title-dark">
                {t('Employees')}
              </p>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="mt-3 flex flex-col gap-1.5 min-h-[100px]">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-gray-700 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.address ?? "--"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Phone className="h-4 w-4 text-gray-700 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.phone ?? "--"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-gray-700 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.email ?? "--"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4 text-gray-700 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.additionalDetails ?? "--"}</span>
          </div>
        </div>

        {/* Action bar */}
        <div className="mt-auto pt-3 -mx-4 -mb-3">
          <div className="flex items-center border-t dark:border-[#2E3035] border-border/40 divide-x divide-border/40">
            <button
              className="dark:text-text-title-dark dark:border-[#2E3035] flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5"
              onClick={() => handleViewClick(item)}
            >
              <Eye className="h-3.5 w-3.5" />
              {t('View')}
            </button>
            <button
              className="dark:text-text-title-dark dark:border-[#2E3035] flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5"
              onClick={() => {
                setShow(true);
                setEditId(item?.id);
              }}
            >
              <Pencil className="h-3.5 w-3.5" />
            { t('Edit')}
            </button>
            <button
              className="dark:text-text-title-dark dark:border-[#2E3035] flex flex-1 items-center justify-center gap-1.5 py-2 text-sm font-medium text-destructive/70 transition-colors hover:text-destructive hover:bg-destructive/5 rounded-br-xl"
              onClick={() => {
                setOpen(true);
                setDepartmentId(item?.id);
              }}
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t('Delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DepartmentCard);
