import { useMemo, useState } from "react";
import { Car, Copy, Check, Clock } from "lucide-react";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import Button from "components/Atoms/MyButton";
import { twMerge } from "tailwind-merge";

interface OnetimeCodeCardProps {
  code: any; // backend object
  onToggle: (code: any) => void;
  onCopy?: (code: any) => void; // ixtiyoriy
}

export default function OnetimeCodeCardNewUI({ code, onToggle }: OnetimeCodeCardProps) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  const accessCode = code?.code ?? "--";
  const codeType = (code?.codeType ?? "ONETIME") as "ONETIME" | "MULTIPLE";
  const isActive = !!code?.isActive;

  const visitorName = `${code?.visitor?.firstName} ${code?.visitor?.lastName}` || t("Visitor");

  const carNumber = code?.carNumber || code?.carNo || undefined;

  const startTime = useMemo(() => (code?.startDate ? new Date(code.startDate) : null), [code?.startDate]);
  const endTime = useMemo(() => (code?.endDate ? new Date(code.endDate) : null), [code?.endDate]);

  const handleCopy = async () => {
    if (!accessCode || accessCode === "--") return;
    await navigator.clipboard.writeText(accessCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDateTime = (d: Date | null) => {
    if (!d) return "--";
    return dayjs(d).format("DD MMM YYYY – HH:mm");
  };

  const getDurationHours = () => {
    if (!startTime || !endTime) return "--";
    const diffMs = endTime.getTime() - startTime.getTime();
    const hours = Math.max(0, Math.round(diffMs / (1000 * 60 * 60)));
    return `${hours} ${t("hours")}`;
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
    ONETIME: "bg-blue-100 text-blue-700",
    MULTIPLE: "bg-purple-100 text-purple-700",
  } as const;

  return (
    <div
      className={twMerge(
        "relative bg-card rounded-2xl shadow-base overflow-hidden",
        "transition-all duration-300 ease-out",
        "hover:shadow-lg hover:-translate-y-1",
        "border border-border/50 group"
      )}
    >
      <div className="p-4 pl-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-foreground tracking-tight">
              {visitorName}
            </h3>
          </div>

          <span
            className={twMerge(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300",
              isActive
                ? "bg-emerald-100 text-emerald-700 shadow-sm shadow-emerald-200"
                : "bg-red-100 text-red-700 shadow-sm shadow-red-200"
            )}
          >
            {isActive ? t("Active") : t("Inactive")}
          </span>
        </div>

        {/* Body */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Access Code */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("Access Code")}
            </span>
            <div className="flex items-center gap-2">
              <code className="font-mono text-sm font-semibold text-foreground bg-muted/50 px-2 py-1 rounded-md">
                {accessCode}
              </code>
              <button
                onClick={handleCopy}
                className={twMerge(
                  "p-1.5 rounded-md transition-all duration-200",
                  "hover:bg-muted/80 active:scale-95",
                  copied && "text-emerald-600"
                )}
                type="button"
                aria-label="Copy access code"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {/* Code Type */}
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("Code Type")}
            </span>
            <span
              className={twMerge(
                "inline-block px-2.5 py-1 rounded-md text-xs font-medium",
                codeTypeBadgeColors[codeType]
              )}
            >
              {codeType}
            </span>
          </div>

          {/* Car Number */}
          <div className={twMerge("space-y-1.5", !carNumber && "invisible")}>
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t("Car Number")}
            </span>
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">
                {carNumber || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Time Section */}
        <div className="bg-muted/30 rounded-xl space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{t("Start Time")}</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {formatDateTime(startTime)}
                </p>
              </div>
            </div>

            <div className="text-center shrink-0">
              <span className="inline-block px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                {getDurationHours()}
              </span>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground ">{t("End Time")}</p>
                <p className="text-sm font-medium text-foreground truncate">
                  {formatDateTime(endTime)}
                </p>
              </div>
              <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4 text-red-600" />
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={twMerge(
                "absolute left-0 top-0 h-full rounded-full transition-all duration-500",
                isActive
                  ? "bg-gradient-to-r from-emerald-400 to-emerald-500"
                  : "bg-gradient-to-r from-red-400 to-red-500"
              )}
              style={{ width: `${progress}%` }}
            />
            {isActive && progress < 100 && progress > 0 && (
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-emerald-500 rounded-full shadow-lg animate-pulse"
                style={{ left: `calc(${progress}% - 6px)` }}
              />
            )}
          </div>
        </div>

        {/* Footer action (sen eski Button logikangni shu yerga ulaysan) */}
        <div className="mt-6">
          <Button
            variant="secondary"
            className={twMerge(
              "w-full py-3 rounded-xl font-medium text-sm",
              "transition-all duration-300 ease-out active:scale-[0.98]",
              "bg-transparent border-2",
              isActive
                ? "border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                : "border-red-500 text-red-600 hover:bg-red-50"
            )}
            onClick={() => onToggle(code)}
          >
            {isActive ? t("Inactive") : t("Active")}
          </Button>
        </div>
      </div>
    </div>
  );
}
