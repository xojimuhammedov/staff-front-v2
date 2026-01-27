import React, { useMemo } from "react";
import { QrCode, Car, CreditCard, ScanFace, Hash } from "lucide-react";

type CredentialType = "QR" | "CAR" | "CARD" | "PHOTO" | "PERSONAL_CODE";

type Credential = {
    id: number;
    type: CredentialType;
    isActive: boolean;
};

const TYPE_META: Record<
    CredentialType,
    { type: string; Icon: React.ElementType }
> = {
    CARD: { type: "CARD", Icon: CreditCard },
    CAR: { type: "CAR", Icon: Car },
    QR: { type: "QR", Icon: QrCode },
    PHOTO: { type: "FACE", Icon: ScanFace },
    PERSONAL_CODE: { type: "PASSWORD", Icon: Hash },
};

function getUniqueTypesWithStatus(credentials: Credential[]) {
    const map = new Map<CredentialType, boolean>(); // type -> anyActive
    for (const c of credentials || []) {
        const prev = map.get(c.type) ?? false;
        map.set(c.type, prev || !!c.isActive);
    }
    return Array.from(map.entries()).map(([type, anyActive]) => ({
        type,
        anyActive,
    }));
}

export function CredentialIcons({ credentials }: { credentials: Credential[] }) {
    const items = useMemo(
        () => getUniqueTypesWithStatus(credentials),
        [credentials]
    );

    return (
        <div className="flex items-center gap-2.5">
            {items.map(({ type, anyActive }) => {
                const meta = TYPE_META[type];
                if (!meta) return null;

                const tooltipText = anyActive ? "Active" : "Inactive";
                const Icon = meta.Icon;
                const typeStyles: Record<CredentialType, string> = {
                    CARD: "bg-blue-100 text-blue-600 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
                    PHOTO: "bg-green-100 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800",
                    QR: "bg-purple-100 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800",
                    PERSONAL_CODE: "bg-cyan-100 text-cyan-600 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800",
                    CAR: "bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-900/30 dark:text-slate-300 dark:border-slate-800",
                };
                const badgeClasses = anyActive
                    ? typeStyles[type]
                    : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-900/30 dark:text-gray-400 dark:border-gray-800";

                return (
                    <div key={type} className="relative group">
                        <div
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-lg border shadow-sm transition-colors ${badgeClasses}`}
                            aria-label={meta.type}
                        >
                            <Icon className="h-4 w-4" />
                        </div>

                        <div
                            className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[120%]
                            whitespace-nowrap rounded-md border border-border-base bg-bg-base px-2.5 py-1.5 text-xs text-text-base
                            opacity-0 shadow-sm transition group-hover:opacity-100 dark:border-dark-line dark:bg-dark-dashboard-cards dark:text-text-title-dark"
                            role="tooltip"
                        >
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold">{meta?.type}</span>
                                <span className="text-text-muted dark:text-subtext-color-dark">•</span>
                                <span className={anyActive ? "text-emerald-600 dark:text-emerald-300" : "text-text-muted dark:text-subtext-color-dark"}>
                                    {tooltipText}
                                </span>
                            </div>
                            <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 border border-border-base bg-bg-base dark:border-dark-line dark:bg-dark-dashboard-cards" />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
