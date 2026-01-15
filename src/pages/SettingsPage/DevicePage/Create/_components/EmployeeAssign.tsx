import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import MyAvatar from "components/Atoms/MyAvatar";
import MyModal from "components/Atoms/MyModal"; // <-- qo'shildi
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, usePostQuery } from "hooks/api";
import { Search, Trash2 } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarIcon from "assets/icons/avatar.png";
import deviceType from "configs/deviceType"; // <-- deviceType import qilindi

interface Employee {
    id: number;
    name: string;
    additionalDetails?: string;
    avatar?: string;
}

interface EmployeeResponse {
    data: Employee[];
    limit: number;
    page: number;
    total: number;
}

interface ModalFormValues {
    credentialTypes: string[]; // multiple
}

function EmployeeAssign() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchInput, setSearchInput] = useState<string>("");
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
    const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]);
    const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]); // Yangi state
    const [openModal, setOpenModal] = useState<boolean>(false);

    const currentSearch = searchParams.get("search") || "";

    const { data: employeesData, isLoading } = useGetAllQuery<EmployeeResponse>({
        key: KEYS.getEmployeeList,
        url: URLS.getEmployeeList,
        params: { search: currentSearch || undefined },
    });


    const employees = employeesData?.data ?? [];

    const { mutate: assignEmployees } = usePostQuery({
        listKeyId: KEYS.devicesEmployeeAssign,
        hideSuccessToast: true,
    });

    useEffect(() => {
        setSearchInput(currentSearch);
    }, [currentSearch]);

    const handleSearch = useCallback(() => {
        const newParams = new URLSearchParams(searchParams);
        if (searchInput.trim()) {
            newParams.set("search", searchInput.trim());
        } else {
            newParams.delete("search");
        }
        setSearchParams(newParams);
    }, [searchInput, searchParams, setSearchParams]);

    const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const toggleTempSelect = (id: number) => {
        setTempSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (tempSelectedIds.length === employees.length) {
            setTempSelectedIds([]);
        } else {
            setTempSelectedIds(employees.map((emp) => emp.id));
        }
    };

    const addSelectedToFinal = (deviceTypes: string[]) => {
        if (tempSelectedIds.length === 0) return;

        setFinalSelectedIds((prev) => {
            const newSet = new Set([...prev, ...tempSelectedIds]);
            return Array.from(newSet);
        });

        // Tanlangan deviceTypes ni saqlash
        setSelectedDeviceTypes(deviceTypes);

        setTempSelectedIds([]); // temp ni tozalash
    };

    const removeFromFinal = (id: number) => {
        setFinalSelectedIds((prev) => prev.filter((x) => x !== id));
    };

    const handleAssign = () => {
        if (finalSelectedIds.length === 0) {
            toast.warning(t("Please select at least one employee"));
            return;
        }

        if (selectedDeviceTypes.length === 0) {
            toast.warning(t("Please select device types for the employees"));
            return;
        }

        const submitData = {
            employeeIds: finalSelectedIds,
            credentialTypes: selectedDeviceTypes,
            deviceIds: [Number(searchParams.get("deviceId"))]
        };

        assignEmployees(
            {
                url: URLS.devicesEmployeeAssign,
                attributes: submitData,
            },
            {
                onSuccess: () => {
                    toast.success(t("Employees successfully assigned with device types!"));
                    navigate("/settings?current-setting=deviceControl");
                },
                onError: (error: any) => {
                    toast.error(
                        error?.response?.data?.error?.message || t("Assignment failed")
                    );
                },
            }
        );
    };

    const finalEmployees = employees.filter((emp) =>
        finalSelectedIds.includes(emp.id)
    );

    const hasTempSelection = tempSelectedIds.length > 0;
    const isAllTempSelected =
        tempSelectedIds.length === employees.length && employees.length > 0;

    const deviceTypeOptions = deviceType?.map((item: any) => ({
        label: item.label,
        value: item.value,
    })) ?? [];


    // Modal ichidagi komponent
    const DeviceTypeSelectModal = () => {
        const { control, handleSubmit } = useForm<ModalFormValues>({
            defaultValues: { credentialTypes: selectedDeviceTypes }, // oldin tanlanganlarni ko'rsatish
        });

        const onConfirm = (data: ModalFormValues) => {
            if (data.credentialTypes.length === 0) {
                toast.warning(t("Please select at least one device type"));
                return;
            }

            addSelectedToFinal(data.credentialTypes); // xodimlar + deviceTypes qo'shiladi
            setOpenModal(false);
        };

        return (
            <form onSubmit={handleSubmit(onConfirm)} className="space-y-6">
                <Controller
                    name="credentialTypes"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => (
                        <MySelect
                            isMulti
                            label={t("Select device types")}
                            placeholder={t("Choose one or more types")}
                            options={deviceTypeOptions}
                            value={deviceTypeOptions.filter((opt) =>
                                field.value?.includes(opt.value)
                            )}
                            onChange={(selected: any) => {
                                const values = selected ? selected.map((opt: any) => opt.value) : [];
                                field.onChange(values);
                            }}
                            allowedRoles={["ADMIN", "HR"]}
                        />
                    )}
                />

                <div className="flex justify-end gap-4">
                    <MyButton type="submit" variant="primary">
                        {t("Confirm and Add Employees")}
                    </MyButton>
                    <MyButton
                        type="button"
                        variant="secondary"
                        onClick={() => setOpenModal(false)}
                    >
                        {t("Cancel")}
                    </MyButton>
                </div>
            </form>
        );
    };

    return (
        <>
            <div className="mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">

                <div className="flex items-center justify-between mb-4">
                    <LabelledCaption
                        title={t("Add employees")}
                        subtitle={t("Create employees group and link to the door")}
                    />
                </div>

                <MyDivider />

                <div className="mt-6 flex flex-col lg:flex-row gap-6">
                    {/* Chap panel */}
                    <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border-2 border-gray-300 bg-gray-100 p-4 dark:border-dark-line dark:bg-bg-dark-theme">
                        <MyInput
                            startIcon={<Search className="stroke-text-muted" />}
                            placeholder={t("Search")}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyUp={handleKeyUp}
                        />

                        <div className="mt-6">
                            <div className="flex items-center justify-between mb-4 px-2">
                                <MyCheckbox
                                    label={t("Select all")}
                                    checked={isAllTempSelected}
                                    indeterminate={!isAllTempSelected && tempSelectedIds.length > 0}
                                    onChange={toggleSelectAll}
                                />
                                <MyButton
                                    onClick={() => {
                                        if (hasTempSelection) {
                                            setOpenModal(true); // Modal ochiladi
                                        }
                                    }}
                                    disabled={!hasTempSelection}
                                    variant="secondary"
                                >
                                    {t("Add selected")} ({tempSelectedIds.length})
                                </MyButton>
                            </div>

                            <div className="space-y-3">
                                {isLoading ? (
                                    <p className="text-center text-gray-500 py-8">{t("Loading...")}</p>
                                ) : employees.length === 0 ? (
                                    <p className="text-center text-gray-500 py-8">{t("No employees found")}</p>
                                ) : (
                                    employees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center p-4 rounded-md bg-white hover:bg-gray-50 transition-colors border"
                                        >
                                            <MyCheckbox
                                                checked={tempSelectedIds.includes(emp.id)}
                                                onChange={() => toggleTempSelect(emp.id)}
                                                label={emp.name}
                                                id={`emp-${emp.id}`}
                                            />
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* O'ng panel */}
                    <div className="w-full lg:w-1/2 h-[600px] flex flex-col rounded-md border-2 border-gray-300 dark:border-dark-line overflow-hidden">
                        <h3 className="bg-gray-100 dark:bg-gray-800 p-4 text-lg font-medium">
                            {t("Selected employees")} ({finalEmployees.length})
                        </h3>

                        <div className="flex-1 overflow-y-auto">
                            {finalEmployees.length === 0 ? (
                                <p className="text-center text-gray-500 py-12">
                                    {t("No employees selected yet")}
                                </p>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {finalEmployees.map((emp) => (
                                        <div
                                            key={emp.id}
                                            className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                                        >
                                            <div className="flex items-center gap-4">
                                                <MyAvatar imageUrl={emp.avatar || AvatarIcon} size="medium" alt={emp.name} />
                                                <span className="font-medium">{emp.name}</span>
                                            </div>
                                            <button
                                                onClick={() => removeFromFinal(emp.id)}
                                                className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                                                aria-label={t("Remove")}>
                                                <Trash2 size={20} className="text-gray-500" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="mt-8 flex justify-end">
                    <MyButton
                        onClick={handleAssign}
                        variant="primary">
                        Save changes
                    </MyButton>
                </div>
            </div>


            <MyModal
                modalProps={{
                    show: openModal,
                    onClose: () => setOpenModal(false),
                    size: "md",
                }}
                headerProps={{
                    children: (
                        <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
                            {t("Select types")}
                        </h2>
                    ),
                }}
                bodyProps={{
                    children: <DeviceTypeSelectModal />,
                    className: "py-[15px]",
                }}
            />
        </>
    );
}

export default EmployeeAssign;