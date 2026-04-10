import React, { useState } from "react";
import MyModal from "@/components/Atoms/MyModal/MyModal";
import MySelect from "@/components/Atoms/Form/MySelect";
import usePostQuery from "@/hooks/api/usePostQuery";
import { useQueryClient } from "@tanstack/react-query";
import { KEYS } from "@/constants/key";
import { useParams } from "react-router-dom";
import { Terminal, Send } from "lucide-react";
import MyButton from "@/components/Atoms/MyButton/MyButton";
import { URLS } from "@/constants/url";
import { useGetOneQuery } from "@/hooks/api";

export const ACTION_UI_MAP: Record<string, { label: string }> = {
    REMOVE: { label: "O'chirish (Remove)" },
    CLEAN: { label: "Tozalash (Clean)" },
    RESTART: { label: "Dasturni yoqish (Restart)" },
    RESTART_PC: { label: "Kompyuterni yoqish (Restart PC)" },
    POWER_OFF_PC: { label: "Kompyuterni o'chirish (Power Off)" },
    STOP: { label: "To'xtatish (Stop)" },
    START: { label: "Boshlash (Start)" }
};

interface SendCommandModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    user: any;
}

export const SendCommandModal: React.FC<SendCommandModalProps> = ({ open, setOpen, user }) => {
    const { id } = useParams();
    const queryClient = useQueryClient();
    const [selectedAction, setSelectedAction] = useState<any>(null);

    const { data } = useGetOneQuery({
        id,
        url: URLS.getComputerList,
        params:{},
        enabled: !!id
    });


    const commandOptions = Object.entries(ACTION_UI_MAP).map(([key, { label }]) => ({
        label,
        value: key
    }));

    const { mutate: sendCommand, isLoading: isSending } = usePostQuery({
        listKeyId: KEYS.getCommandHistory,
    });

    const handleSend = () => {
        if (!selectedAction || !id) return;
        const url = `/api/computers/${data?.data?.computerUid}/${id}/command/${selectedAction.value}`;

        sendCommand({
            url,
            attributes: {} // The prompt says POST request but no payload mentioned, so sending empty attributes
        }, {
            onSuccess: () => {
                setOpen(false);
                queryClient.invalidateQueries([KEYS.getCommandHistory]);
                setSelectedAction(null);
            }
        });
    }

    return (
        <MyModal
            modalProps={{
                show: open,
                onClose: () => setOpen(false),
                size: "md",
            }}
            headerProps={{
                children: (
                    <div className="flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-blue-500" />
                        <span>Komanda yuborish</span>
                    </div>
                ),
            }}
            bodyProps={{
                className: "pb-4 pt-2"
            }}
        >
            <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-2">
                    Kompyuterga (yoki dasturga) yubormoqchi bo'lgan buyruqni tanlang:
                </p>
                <div className="relative">
                    <MySelect
                        placeholder="Buyruqni tanlang"
                        options={commandOptions}
                        value={selectedAction}
                        onChange={(val: any) => setSelectedAction(val)}
                        allowedRoles={['ADMIN', 'HR', 'IT']} // Using typical roles to avoid Type Issue
                    />
                </div>

                <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-gray-700">
                    <MyButton
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition-colors"
                    >
                        Bekor qilish
                    </MyButton>
                    <MyButton
                        onClick={handleSend}
                        disabled={isSending || !selectedAction}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 transition-colors"
                    >
                        {isSending ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Yuborilmoqda...
                            </span>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Yuborish
                            </>
                        )}
                    </MyButton>
                </div>
            </div>
        </MyModal>
    );
};
