import MyBadge from 'components/Atoms/MyBadge';
import { Building2, Users, MapPin, Phone, Mail, Eye, Pencil, Trash2 } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

function DepartmentListItem({ item, setOpen, setDepartmentId, setShow, setEditId }: any) {
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
    <div className="group flex my-4 items-center gap-4 rounded-lg dark:border-[#2E3035] border border-border/50 bg-card px-4 py-3 transition-all duration-200 hover:border-primary/25 hover:shadow-sm cursor-pointer">
      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Building2 className="h-6 w-6 text-gray-500 dark:text-white stroke-[1.3]" />
      </div>

      <div className="flex flex-1 items-center gap-6 min-w-0">
        {/* Name & Status */}
        <div className="min-w-0 w-40 shrink-0">
          <div className="relative group/name mb-1">
            <h3 className="text-[13px] font-semibold text-card-foreground truncate leading-tight cursor-default dark:text-text-title-dark">
              {item.fullName}
            </h3>
            <div className="invisible opacity-0 dark:text-text-title-dark group-hover/name:visible group-hover/name:opacity-100 transition-all duration-150 absolute left-0 bottom-full mb-1.5 z-50 max-w-[280px] rounded-md bg-foreground px-2.5 py-1.5 text-[11px] text-background shadow-lg pointer-events-none whitespace-nowrap">
              {item.fullName}
              <div className="absolute left-3 top-full h-0 w-0 border-x-4 border-x-transparent border-t-4 border-t-foreground" />
            </div>
          </div>
          <MyBadge variant={item?.isActive ? 'green' : 'red'}>
            {item?.isActive ? t('Active') : t('Inactive')}
          </MyBadge>
        </div>

        {/* Stats */}
        <div className="hidden md:flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Building2 className="h-4 w-4 text-gray-500 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground leading-none dark:text-text-title-dark">
                {item?._count?.childrens}
              </p>
              {/* <p className="text-[10px] text-muted-foreground">Depts</p> */}
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Users className="h-4 w-4 text-gray-500 dark:text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-card-foreground leading-none dark:text-text-title-dark">
                {item?._count?.employees}
              </p>
              {/* <p className="text-[10px] text-muted-foreground">Staff</p> */}
            </div>
          </div>
        </div>

        {/* Details - hidden on small */}
        <div className="hidden lg:flex items-center gap-4 flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
            <MapPin className="h-3 w-3 shrink-0 text-gray-500 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.address}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
            <Phone className="h-3 w-3 shrink-0 text-gray-500 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.phone}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground min-w-0">
            <Mail className="h-3 w-3 shrink-0 text-gray-500 dark:text-white" />
            <span className="truncate dark:text-text-title-dark">{item.email}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center shrink-0 rounded-lg border dark:border-[#2E3035] border-border/60 divide-x divide-border/60 transition-opacity">
        <button
          className="flex items-center gap-1.5 dark:border-[#2E3035] dark:text-text-title-dark px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5 rounded-l-lg"
          onClick={() => handleViewClick(item)}
        >
          <Eye className="h-3.5 w-3.5 text-gray-500 dark:text-white" />
          View
        </button>
        <button
          className="flex items-center gap-1.5 dark:border-[#2E3035] dark:text-text-title-dark px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-colors hover:text-primary hover:bg-primary/5"
          onClick={(e) => {
            setShow(true);
            setEditId(item?.id);
          }}
        >
          <Pencil className="h-3.5 w-3.5 text-gray-500 dark:text-white" />
          Edit
        </button>
        <button
          className="flex items-center gap-1.5 px-3 dark:border-[#2E3035] dark:text-text-title-dark py-1.5 text-[11px] font-medium text-destructive/70 transition-colors hover:text-destructive hover:bg-destructive/5 rounded-r-lg"
          onClick={(e) => {
            setOpen(true);
            setDepartmentId(item?.id);
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-gray-500 dark:text-white" />
          Delete
        </button>
      </div>
    </div>
  );
}

export default React.memo(DepartmentListItem);
