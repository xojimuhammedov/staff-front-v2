import { useRef, useState } from "react";
import {
    QrCode,
    Car,
    CreditCard,
    Camera,
    KeyRound,
    Download,
    Pencil,
    Trash2,
    ToggleLeft,
    ToggleRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";
import { QRCodeCanvas } from "qrcode.react";
import { useTranslation } from "react-i18next";

type CredentialType = "QR" | "CAR" | "CARD" | "PHOTO" | "PERSONAL_CODE";

interface CredentialCardProps {
    id: string;
    type: CredentialType;
    value: string;
    imageUrl?: string;
    isActive: boolean;
    createdAt?: string | Date | null;
    updatedAt?: string | Date | null;
    organizationId?: string | number | null;
    onToggleActive?: (id: string) => void;
    onDownload?: any;
    code?: string | undefined;
}

const typeConfig = {
    QR: {
        icon: QrCode,
        accent: "border-l-blue-500",
        badge: "bg-blue-50 text-blue-700 border-blue-200",
        hoverGlow: "hover:shadow-blue-100",
    },
    CAR: {
        icon: Car,
        accent: "border-l-purple-500",
        badge: "bg-purple-50 text-purple-700 border-purple-200",
        hoverGlow: "hover:shadow-purple-100",
    },
    CARD: {
        icon: CreditCard,
        accent: "border-l-orange-500",
        badge: "bg-orange-50 text-orange-700 border-orange-200",
        hoverGlow: "hover:shadow-orange-100",
    },
    PHOTO: {
        icon: Camera,
        accent: "border-l-teal-500",
        badge: "bg-teal-50 text-teal-700 border-teal-200",
        hoverGlow: "hover:shadow-teal-100",
    },
    PERSONAL_CODE: {
        icon: KeyRound,
        accent: "border-l-indigo-500",
        badge: "bg-indigo-50 text-indigo-700 border-indigo-200",
        hoverGlow: "hover:shadow-indigo-100",
    },
} satisfies Record<CredentialType, any>;

function safeFormatDate(date?: string | Date | null) {
    if (!date) return "-";
    const d = typeof date === "string" ? new Date(date) : date;
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export default function CredentialCard({
    id,
    type,
    value,
    imageUrl,
    isActive,
    createdAt,
    updatedAt,
    organizationId,
    onToggleActive,
    code,
}: CredentialCardProps) {
    const { t } = useTranslation()
    const [isHovered, setIsHovered] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const config = typeConfig[type];
    const TypeIcon = config.icon;

    const downloadQR = () => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const tempCanvas = document.createElement('canvas');
        const size = 512;

        tempCanvas.width = size;
        tempCanvas.height = size;

        const ctx = tempCanvas.getContext('2d');
        if (!ctx) return;

        ctx.drawImage(canvas, 0, 0, size, size);

        const link = document.createElement('a');
        link.download = `QR_${code}.png`;
        link.href = tempCanvas.toDataURL('image/png', 1.0);
        link.click();
    };

    const renderCredentialContent = () => {
        switch (type) {
            case "QR":
                return (
                    <div className="relative group">
                        <div className="w-20 h-20 bg-muted/30 rounded-xl flex items-center justify-center overflow-hidden border border-border/50">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="QR Code"
                                    className="w-full h-full object-contain p-1"
                                />
                            ) : (
                                <QRCodeCanvas
                                    value={code || ''}
                                    ref={canvasRef}
                                    size={80}
                                    includeMargin
                                />
                            )}
                        </div>

                        {code && (
                            <button
                                onClick={downloadQR}
                                className="absolute -top-2 -right-2 w-8 h-8 rounded-lg bg-card border border-border shadow-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted"
                            >
                                <Download className="w-4 h-4 text-muted-foreground" />
                            </button>
                        )}
                    </div>
                );

            case "PHOTO":
                return (
                    <div className="relative group">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-border/50 shadow-inner">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Photo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-muted/30 flex items-center justify-center">
                                    <Camera className="w-8 h-8 text-muted-foreground/50" />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case "CAR":
                return (
                    <div className="bg-gradient-to-r from-slate-100 to-slate-50 border-2 border-slate-300 rounded-lg px-4 py-2 shadow-inner">
                        <span className="font-mono text-xl font-bold tracking-wider text-slate-800">
                            {value}
                        </span>
                    </div>
                );

            case "CARD":
                return (
                    <div className="space-y-1">
                        <span className="font-mono text-2xl font-bold tracking-wide text-foreground">
                            {value}
                        </span>
                    </div>
                );

            case "PERSONAL_CODE":
                return (
                    <div className="bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-200 rounded-xl px-6 py-3 shadow-inner">
                        <span className="font-mono text-2xl font-bold tracking-widest text-indigo-900">
                            {value}
                        </span>
                    </div>
                );

            default:
                return (
                    <span className="font-mono text-xl font-bold text-foreground">
                        {value}
                    </span>
                );
        }
    };

    return (
        <div
            className={twMerge(
                "relative bg-card rounded-2xl border-l-4 overflow-hidden",
                "transition-all duration-300 ease-out",
                "animate-fade-in-up",
                "border border-border/50",
                "shadow-sm hover:shadow-xl",
                config.accent,
                config.hoverGlow,
                isHovered && "transform -translate-y-1"
            )}
            style={{
                // animationDelay: `${delay}ms`,
                animationFillMode: "forwards",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Header */}
            <div className="p-5 pb-4">
                <div className="flex items-start justify-between mb-4">
                    <div
                        className={twMerge(
                            "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border",
                            "transition-all duration-200",
                            config.badge
                        )}
                    >
                        <TypeIcon className="w-3.5 h-3.5" />
                        {type.replace("_", " ")}
                    </div>

                    <div
                        className={twMerge(
                            "px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all duration-200",
                            isActive
                                ? "border-emerald-500 text-emerald-600 bg-emerald-50"
                                : "border-red-400 text-red-500 bg-red-50"
                        )}
                    >
                        {isActive ? t('Active') : t('Inactive')}
                    </div>
                </div>

                <div className="min-h-[80px] flex items-center">{renderCredentialContent()}</div>
            </div>

            {/* Metadata */}
            <div className="px-5 py-3 bg-muted/20 border-t border-border/30">
                <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
                    <p>Created: {safeFormatDate(createdAt)}</p>
                    <p>Updated: {safeFormatDate(updatedAt)}</p>
                </div>
            </div>

            {/* Footer Actions */}
            <div className="px-5 py-3 border-t border-border/30 flex items-center justify-between">
                <button
                    onClick={() => onToggleActive?.(id)}
                    className={twMerge(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200",
                        isActive
                            ? "text-emerald-600 hover:bg-emerald-50"
                            : "text-muted-foreground hover:bg-muted/50"
                    )}
                    type="button"
                >
                    {isActive ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
                    <span className="hidden sm:inline">{isActive ? t('Inactive') : t('Active')}</span>
                </button>

                <div className="flex items-center gap-1">
                    {type === "QR" && code && (
                        <button
                            onClick={downloadQR}
                            className="p-2 rounded-lg text-muted-foreground hover:text-blue-600 hover:bg-blue-50 transition-all duration-200"
                        >
                            <Download onClick={downloadQR} className="w-4 h-4" />
                        </button>
                    )}

                    {/* <button
                        onClick={() => onEdit?.(id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-amber-600 hover:bg-amber-50 transition-all duration-200"
                        type="button"
                    >
                        <Pencil className="w-4 h-4" />
                    </button>

                    <button
                        onClick={() => onDelete?.(id)}
                        className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-all duration-200"
                        type="button"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button> */}
                </div>
            </div>
        </div>
    );
}
