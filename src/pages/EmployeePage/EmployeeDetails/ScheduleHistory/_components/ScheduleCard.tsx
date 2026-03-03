import { Clock, Timer } from "lucide-react"
import { twMerge } from "tailwind-merge";
import { WeekdayBadges } from "./WeekDaysBadge";
import { useTranslation } from "react-i18next";

interface SchedulePlanCardProps {
    plan: any
    label: string
    variant: "old" | "new"
}
const SchedulePlanCard = ({ plan, label, variant }: SchedulePlanCardProps) => {
    const { t } = useTranslation();
    return (
        <div
            className={twMerge(
                "rounded-lg border p-3 space-y-2.5 transition-colors",
                variant === "old"
                    ? "bg-red-50/50 border-red-200/60 dark:bg-red-950/30 dark:border-red-900/50"
                    : "bg-emerald-50/50 border-emerald-200/60 dark:bg-emerald-950/30 dark:border-emerald-900/50"
            )}
        >
            <div className="flex items-center justify-between">
                <span
                    className={twMerge(
                        "text-[10px] font-semibold uppercase tracking-wider",
                        variant === "old"
                            ? "text-red-500 dark:text-red-400"
                            : "text-emerald-600 dark:text-emerald-400"
                    )}
                >
                    {label}
                </span>
                {plan?.isDefault && (
                    <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground dark:text-text-title-dark">
                        {t("Default")}
                    </span>
                )}
            </div>
            <p className="text-sm font-semibold text-foreground dark:text-text-title-dark">{plan?.name}</p>
            <WeekdayBadges weekdays={plan?.weekdays} />
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 dark:text-text-title-dark">
                    <Clock className="size-3.5" />
                    {plan?.startTime} - {plan?.endTime}
                </span>
                <span className="inline-flex items-center gap-1 dark:text-text-title-dark">
                    <Timer className="size-3.5" />
                    {plan?.extraTime} min
                </span>
            </div>
        </div>
    );
};

export default SchedulePlanCard;
