import React, { useState } from "react";
import MyModal from "@/components/Atoms/MyModal/MyModal";
import MySelect from "@/components/Atoms/Form/MySelect";
import { useGetAllQuery } from "@/hooks/api";
import usePostQuery from "@/hooks/api/usePostQuery";
import { KEYS } from "@/constants/key";
import { URLS } from "@/constants/url";
import { useQueryClient } from "@tanstack/react-query";

interface AssignEmployeeModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    userId: number;
}

export const AssignEmployeeModal: React.FC<AssignEmployeeModalProps> = ({ open, setOpen, userId }) => {
    const queryClient = useQueryClient();
    const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

    const { data: employeeData } = useGetAllQuery<any>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: {
            page: 1,
            limit: 100,
        },
    });

    const employeeOptions = employeeData?.data?.map((emp: any) => ({
        label: emp.name,
        value: emp.id,
    })) || [];

    const { mutate: linkEmployee, isLoading: isLinking } = usePostQuery({
        listKeyId: KEYS.getComputerUserList,
    });

    const handleAssign = () => {
        if (!selectedEmployee) return;
        linkEmployee({
            url: `/api/computer-users/${userId}/link-employee`,
            attributes: {
                employeeId: selectedEmployee.value
            }
        }, {
            onSuccess: () => {
                setOpen(false);
                queryClient.invalidateQueries([KEYS.getComputerUserList]);
                setSelectedEmployee(null);
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
                children: "Xodimga biriktirish",
            }}
            bodyProps={{
                 className: "pb-6 pt-2"
            }}
        >
            <div className="space-y-4">
                 <p className="text-sm text-gray-500 mb-2">Quyidagi ro'yxatdan xodimni tanlang:</p>
                <MySelect
                    placeholder="Xodimni tanlang"
                    options={employeeOptions}
                    value={selectedEmployee}
                    onChange={(val) => setSelectedEmployee(val)}
                    allowedRoles={['ADMIN', 'HR']} // If needed
                />
                
                <div className="flex justify-end gap-2 mt-4 pt-4 border-t dark:border-gray-700">
                    <button 
                        onClick={() => setOpen(false)}
                        className="px-4 py-2 border rounded-md text-sm font-medium dark:border-gray-600 dark:text-gray-300"
                    >
                        Bekor qilish
                    </button>
                    <button 
                        onClick={handleAssign}
                        disabled={isLinking || !selectedEmployee}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium disabled:opacity-50"
                    >
                        {isLinking ? "Saqlanmoqda..." : "Saqlash"}
                    </button>
                </div>
            </div>
        </MyModal>
    );
};
