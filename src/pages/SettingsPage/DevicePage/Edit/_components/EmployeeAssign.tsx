import { MyCheckbox, MyInput } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery } from "hooks/api";
import { Search } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import deviceType from "configs/deviceType";
import DeviceAssignModal from "./DeviceAssignModal";
import RemoveAssignModal from "./RemoveAssignModal";

interface Employee {
    id: number;
    name: string;
    avatar?: string;
}

interface EmployeeResponse {
    data: Employee[];
}


function EmployeeAssign({ deviceId }: any) {
    const { t } = useTranslation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [searchInput, setSearchInput] = useState("");
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
    const [rightSelectIds, setRightSelectIds] = useState<number[]>([]);
    const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const navigate = useNavigate()
    const currentSearch = searchParams.get("search") || "";

    const { data: employeesData, isLoading } =
        useGetAllQuery<EmployeeResponse>({
            key: KEYS.getEmployeeList,
            url: URLS.getEmployeeList,
            params: { search: currentSearch || undefined, limit: 100 },
        });

    const employees = employeesData?.data ?? [];

    const { data } = useGetAllQuery<any>({
        key: KEYS.hikvisionEmployeeSync,
        url: URLS.hikvisionEmployeeSync,
        params: {
            deviceId: deviceId,
            userType: 'EMPLOYEE',
            limit: 100
        }
    });

    useEffect(() => {
        if (data?.data) {
            setRightSelectIds(
                data?.data?.map((e: any) => e?.employee?.id)
            );
        }
    }, [data?.data]);

    useEffect(() => setSearchInput(currentSearch), [currentSearch]);

    const handleSearch = useCallback(() => {
        const p = new URLSearchParams(searchParams);
        if (searchInput.trim()) p.set("search", searchInput.trim());
        else p.delete("search");
        setSearchParams(p);
    }, [searchInput, searchParams, setSearchParams]);

    const handleKeyUp = (e: any) => e.key === "Enter" && handleSearch();

    // ---- TEMP SELECT ----
    const toggleTempSelect = (id: number) => {
        setTempSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleRemoveTempSelect = (id: number) => {
        setRemoveSelectIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const deviceTypeOptions =
        deviceType?.map((d: any) => ({
            label: d.label,
            value: d.value,
        })) ?? [];

    const finalEmployees = useMemo(
        () => employees.filter((e) => rightSelectIds.includes(e.id)),
        [employees, rightSelectIds]
    );

    const alreadySelectedIds = new Set(rightSelectIds);

    // LEFT PANEL LIST
    const leftEmployees = employees.filter(
        (emp) => !alreadySelectedIds.has(emp.id)
    );

    const toggleSelectAll = () =>
        setTempSelectedIds((p) =>
            p.length === leftEmployees.length ? [] : leftEmployees.map((e) => e.id));

    return (
        <>
            <div className="mt-12 w-full rounded-md bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">

                <div className="flex items-center justify-between">
                    <LabelledCaption
                        title={deviceId ? t("Edit employees") : t("Add employees")}
                        subtitle={t("Create employees group and link to the door")}
                    />
                    <MyButton variant="primary" onClick={() => navigate("/settings?current-setting=deviceControl")} type="submit">
                        {t('Save changes')}
                    </MyButton>
                </div>

                <MyDivider />

                <div className="mt-6 flex flex-col lg:flex-row gap-6">

                    {/* LEFT PANEL */}
                    <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border p-4">
                        <MyInput
                            startIcon={<Search />}
                            placeholder={t("Search")}
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyUp={handleKeyUp}
                        />

                        <div className="flex items-center justify-between mt-4">
                            <MyCheckbox
                                label={t("Select all")}
                                checked={
                                    tempSelectedIds.length === leftEmployees.length &&
                                    leftEmployees.length > 0
                                }
                                indeterminate={
                                    tempSelectedIds.length > 0 &&
                                    tempSelectedIds.length < leftEmployees.length
                                }
                                onChange={toggleSelectAll}
                            />

                            <MyButton
                                variant="secondary"
                                disabled={!tempSelectedIds.length}
                                onClick={() => setOpenModal(true)}
                            >
                                {t("Add selected")} ({tempSelectedIds.length})
                            </MyButton>
                        </div>

                        <div className="mt-4 space-y-2">
                            {isLoading ? (
                                <p>{t("Loading...")}</p>
                            ) : employees.length === 0 ? (
                                <p>{t("No employees found")}</p>
                            ) : (
                                leftEmployees.map((emp) => (
                                    <div key={emp.id} className="flex items-center p-4 rounded-md bg-white hover:bg-gray-50 transition-colors border">
                                        <MyCheckbox
                                            checked={tempSelectedIds.includes(emp.id)}
                                            onChange={() => toggleTempSelect(emp.id)}
                                            label={emp.name}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* RIGHT PANEL */}
                    <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border">
                        <div className="flex items-center justify-between bg-gray-100 p-2">
                            <h3 className="font-medium">
                                {t("Selected employees")} ({finalEmployees.length})
                            </h3>
                            <MyButton
                                variant="secondary"
                                disabled={!removeSelectIds.length}
                                onClick={() => setRemoveModal(true)}
                            >
                                {t("Remove")} ({removeSelectIds.length})
                            </MyButton>
                        </div>

                        <div className="overflow-y-auto h-full space-y-2 mt-4">
                            {!finalEmployees.length ? (
                                <p className="text-center mt-10">{t("Nothing selected yet")}</p>
                            ) : (
                                finalEmployees.map((emp) => (
                                    <div key={emp.id} className="flex items-center p-4 mx-2 rounded-md bg-white hover:bg-gray-50 transition-colors border">
                                        <MyCheckbox
                                            label={emp.name}
                                            checked={removeSelectIds.includes(emp.id)}
                                            onChange={() => toggleRemoveTempSelect(emp.id)}
                                        />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <DeviceAssignModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                deviceTypeOptions={deviceTypeOptions}
                tempSelectedIds={tempSelectedIds}
                deviceId={deviceId}
            />

            <RemoveAssignModal
                deviceId={deviceId}
                open={removeModal}
                onClose={() => setRemoveModal(false)}
                tempSelectedIds={removeSelectIds}
            />
        </>
    );
}

export default EmployeeAssign;
