import React, { useMemo } from "react";
import { QrCode, Car, CreditCard, KeyRound, ScanFace } from "lucide-react";

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
    PERSONAL_CODE: { type: "PASSWORD", Icon: KeyRound },
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
    const activeCount = (credentials || []).filter((c) => c?.isActive).length;
    const totalCount = (credentials || []).length;

    return (
        <div className="flex items-center gap-2.5">
            {items.map(({ type, anyActive }) => {
                const meta = TYPE_META[type];
                if (!meta) return null;

                const tooltipText = anyActive ? "Active" : "Inactive";
                const Icon = meta.Icon;
                const typeStyles: Record<CredentialType, string> = {
                    QR: "text-blue-700 border-blue-200  dark:text-blue-300 dark:border-blue-800",
                    CAR: "text-purple-700 border-purple-200 dark:text-purple-300 dark:border-purple-800",
                    CARD: "text-orange-700 border-orange-20 dark:text-orange-300 dark:border-orange-800",
                    PHOTO: "text-teal-700 border-teal-200 dark:text-teal-300 dark:border-teal-800",
                    PERSONAL_CODE: " text-indigo-700 border-indigo-200 dark:text-indigo-300 dark:border-indigo-800",
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
            {totalCount > 0 ? (
                <div className="flex items-center gap-1 text-sm font-semibold">
                    <span className="text-emerald-600 dark:text-emerald-300">{activeCount}</span>
                    <span className="text-text-muted dark:text-subtext-color-dark">/</span>
                    <span className="text-text-muted dark:text-subtext-color-dark">{totalCount}</span>
                </div>
            ) : (
                <span className="text-text-muted dark:text-subtext-color-dark text-sm">
                    No credentials
                </span>
            )}
        </div>
    );
}
