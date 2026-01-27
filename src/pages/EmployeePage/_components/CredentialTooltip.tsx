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
        <div className="flex items-center gap-2">
            {items.map(({ type, anyActive }) => {
                const meta = TYPE_META[type];
                if (!meta) return null;

                const tooltipText = anyActive ? "Active" : "Inactive";
                const Icon = meta.Icon;

                return (
                    <div key={type} className="relative group">
                        <div
                            className={`inline-flex h-8 w-8 items-center justify-center rounded-md border
                             ${anyActive ? "border-green-400" : "border-gray-200"}`}
                            aria-label={meta.type}
                        >
                            <Icon className="h-4 w-4" />
                        </div>

                        <div
                            className="pointer-events-none absolute left-1/2 top-0 z-50 -translate-x-1/2 -translate-y-[115%]
                            whitespace-nowrap rounded-md border bg-white px-2 py-1 text-xs text-gray-800
                            opacity-0 shadow-sm transition group-hover:opacity-100"
                            role="tooltip"
                        >
                            <p className="">{meta?.type}</p>
                            {tooltipText}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
