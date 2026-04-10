import React, { useState, useEffect, useRef } from "react";
import {
  Monitor as MonitorIcon,
  User as UserIcon,
  ChevronDown as ChevronDownIcon,
  UserCheck as UserCheckIcon,
  UserX as UserXIcon,
  Briefcase as BriefcaseIcon,
  Building as BuildingIcon,
  Mail as MailIcon,
  Phone as PhoneIcon,
  Unlink as UnlinkIcon,
  Link2 as LinkIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ConfirmationModal from "@/components/Atoms/Confirmation/Modal";
import { useDeleteQuery } from "@/hooks/api";
import { KEYS } from "@/constants/key";
import { AssignEmployeeModal } from "./AssignEmployeeModal";
import { useTranslation } from "react-i18next";

// Popover component
function SimplePopover({ open, onOpenChange, trigger, children }: any) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    function handleClickOutside(event: any) {
      if (ref.current && !ref.current.contains(event.target)) {
        onOpenChange(false);
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, onOpenChange]);

  return (
    <div className="relative" ref={ref}>
      <div onClick={() => onOpenChange(!open)}>{trigger}</div>
      {open && (
        <div className="absolute z-50 mt-2 w-64 rounded-md border border-neutral-200 bg-white p-2 shadow-md dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden"
          style={{ top: '100%', right: 0 }}>
          {children}
        </div>
      )}
    </div>
  );
}

function Badge({ variant, className, children }: any) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
      variant === "secondary" ? "bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100" : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      className)}>
      {children}
    </span>
  );
}

interface ComputerSidebarProfileProps {
    computer: any;
    user: any;
    allUsers: any[];
    selectedUserId: number | null;
    onUserSwitch: (id: number) => void;
}

export const ComputerSidebarProfile: React.FC<ComputerSidebarProfileProps> = ({ 
    computer, 
    user, 
    allUsers, 
    selectedUserId, 
    onUserSwitch 
}) => {
    const { t } = useTranslation();
    const [userSwitcherOpen, setUserSwitcherOpen] = useState(false);
    const [showUnassignDialog, setShowUnassignDialog] = useState(false);
    const [showAssignDialog, setShowAssignDialog] = useState(false);

    const { mutate: unlinkEmployee } = useDeleteQuery({
        listKeyId: KEYS.getComputerUserList,
    });

    const handleUnlink = () => {
        unlinkEmployee({
            url: `/api/computer-users/${user.id}/unlink-employee`,
        }, {
            onSuccess: () => {
                setShowUnassignDialog(false);
            }
        });
    };

    const handleUserSwitch = (uId: number) => {
        onUserSwitch(uId);
        setUserSwitcherOpen(false);
    };

    return (
        <>
            {/* Computer Info */}
            <div className="p-4 border-b border-gray-200 dark:border-[rgb(var(--color-dark-line))]">
                <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
                        <MonitorIcon className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-[rgb(var(--color-text-base))] dark:text-text-title-dark truncate">{computer?.pcName}</p>
                        <p className="text-xs text-gray-500 dark:text-neutral-400">{computer?.ipAddress}</p>
                    </div>
                </div>

                {user && (
                    <SimplePopover
                        open={userSwitcherOpen}
                        onOpenChange={setUserSwitcherOpen}
                        trigger={
                            <button className="w-full p-3 rounded-lg bg-gray-50 dark:bg-[rgb(var(--color-bg-base-dark))] hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-left flex flex-col">
                                <div className="flex items-center gap-3">
                                    <div className="relative flex-shrink-0">
                                        <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                            <UserIcon className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <span className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-[rgb(var(--color-bg-bgblack-dark))] ${user.isActive ? 'bg-green-500' : 'bg-gray-400'}`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-sm font-medium text-[rgb(var(--color-text-base))] dark:text-text-title-dark truncate">
                                                {user.name || user.username}
                                            </p>
                                            {user.isActive && (
                                                <Badge className="bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 text-xs h-5">
                                                    {t('Online')}
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-neutral-400">@{user.username}</p>
                                    </div>
                                    {allUsers.length > 1 && (
                                        <ChevronDownIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                                    )}
                                </div>
                                {user.isAdmin && (
                                    <Badge variant="secondary" className="text-xs mt-2 self-start">{t('Administrator')}</Badge>
                                )}
                            </button>
                        }
                    >
                        {allUsers.length > 1 && (
                            <div>
                                <div className="mb-2 px-2 py-1">
                                    <p className="text-xs font-medium text-gray-500">{t('Switch User')}</p>
                                </div>
                                <div className="space-y-1">
                                    {allUsers.map((u: any) => (
                                        <button
                                            key={u.id}
                                            onClick={() => handleUserSwitch(u.id)}
                                            className={cn(
                                                "w-full flex items-center gap-3 p-2 rounded-md transition-colors text-left",
                                                u.id === selectedUserId
                                                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600"
                                                    : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300"
                                            )}
                                        >
                                            <div className="relative flex-shrink-0">
                                                <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                                    <span className="text-blue-600 text-sm font-medium">
                                                        {(u.name || u.username).charAt(0).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white dark:border-neutral-800 ${u.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate dark:text-text-title-dark">{u.name || u.username}</p>
                                                <p className="text-xs text-gray-500 dark:text-neutral-400">@{u.username}</p>
                                            </div>
                                            {u.employee ? (
                                                <UserCheckIcon className="h-4 w-4 text-green-500 flex-shrink-0" />
                                            ) : (
                                                <UserXIcon className="h-4 w-4 text-orange-500 flex-shrink-0" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </SimplePopover>
                )}
            </div>

            {/* Employee Info Section */}
            {user && (
                <div className="p-4 border-b border-gray-200 dark:border-[rgb(var(--color-dark-line))]">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wider">
                            {t('Employee Info')}
                        </span>
                    </div>

                    {user.employee ? (
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/30">
                                <div className="flex items-center gap-2 mb-2">
                                    <UserCheckIcon className="h-4 w-4 text-green-600 dark:text-green-500" />
                                    <span className="text-sm font-medium text-green-600 dark:text-green-500">{t('Linked')}</span>
                                </div>
                                <p className="text-sm font-medium text-[rgb(var(--color-text-base))] dark:text-text-title-dark mb-1">
                                    {user.employee.name}
                                </p>
                                <div className="space-y-1.5 text-xs text-gray-600 dark:text-neutral-400">
                                    <div className="flex items-center gap-2">
                                        <BriefcaseIcon className="h-3 w-3" />
                                        <span className="truncate">{user.employee.department?.shortName || user.employee.job?.uz || "—"}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <BuildingIcon className="h-3 w-3" />
                                        <span>{user.employee.department?.shortName || "—"}</span>
                                    </div>
                                    {user.employee.email && (
                                        <div className="flex items-center gap-2">
                                            <MailIcon className="h-3 w-3" />
                                            <span className="truncate">{user.employee.email}</span>
                                        </div>
                                    )}
                                    {user.employee.phone && (
                                        <div className="flex items-center gap-2">
                                            <PhoneIcon className="h-3 w-3" />
                                            <span>{user.employee.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center h-8 rounded-md border border-gray-200 dark:border-neutral-700 bg-transparent px-3 text-xs font-medium text-red-600 dark:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                onClick={() => setShowUnassignDialog(true)}
                            >
                                <UnlinkIcon className="h-3.5 w-3.5 mr-2" />
                                {t('Unlink')}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30">
                                <div className="flex items-center gap-2">
                                    <UserXIcon className="h-4 w-4 text-orange-500" />
                                    <span className="text-sm text-orange-600 dark:text-orange-400">{t('Not Linked')}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="w-full flex items-center justify-center h-8 rounded-md border border-gray-200 dark:border-neutral-700 bg-transparent px-3 text-xs font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
                                onClick={() => setShowAssignDialog(true)}
                            >
                                <LinkIcon className="h-3.5 w-3.5 mr-2" />
                                {t('Assign to Employee')}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {user && <AssignEmployeeModal open={showAssignDialog} setOpen={setShowAssignDialog} userId={user.id} />}
            <ConfirmationModal
                open={showUnassignDialog}
                setOpen={setShowUnassignDialog}
                title={t('Unlink Employee title')}
                subTitle={t('Unlink confirmation')}
                confirmationDelete={handleUnlink}
            />
        </>
    );
};
