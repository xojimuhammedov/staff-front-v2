import { MyCheckbox } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import deviceType from "configs/deviceType";
import DeviceAssignModal from "./DeviceAssignModal";
import RemoveAssignModal from "./RemoveAssignModal";


function EmployeeAssign({ deviceId, employeesData, isLoading, refetch, deviceData, deviceRefetch }: any) {
    const { t } = useTranslation();
    const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
    const [rightSelectIds, setRightSelectIds] = useState<number[]>([]);
    const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);
    const [openModal, setOpenModal] = useState(false);
    const [removeModal, setRemoveModal] = useState(false);
    const navigate = useNavigate()

    useEffect(() => {
        if (deviceData?.data?.employees) {
            setRightSelectIds(
                deviceData?.data?.employees?.map((e: any) => e?.id)
            );
        }
    }, [deviceData?.data?.employees]);

    const deviceTypeOptions =
        deviceType?.map((d: any) => ({
            label: d.label,
            value: d.value,
        })) ?? [];

    const rightSet = useMemo(() => new Set(rightSelectIds), [rightSelectIds]);
    const finalEmployees = useMemo(
        () => employeesData?.data.filter((e: any) => rightSet.has(e.id)),
        [employeesData?.data, rightSet]
    );

    const alreadySelectedIds = useMemo(() => new Set(rightSelectIds), [rightSelectIds]);

    const leftEmployees = useMemo(
        () => employeesData?.data?.filter((emp: any) => !alreadySelectedIds.has(emp.id)),
        [employeesData?.data, alreadySelectedIds]
    );

    const leftIds = useMemo(() => leftEmployees?.map((e: any) => e?.id), [leftEmployees]);

    const isAllLeftSelected = useMemo(
        () => leftIds?.length > 0 && leftIds?.every((id: number) => tempSelectedIds.includes(id)),
        [leftIds, tempSelectedIds]
    );

    const toggleSelectAll = () => {
        setTempSelectedIds(prev => (isAllLeftSelected ? [] : leftIds));
    };

    useEffect(() => {
        if (!deviceData?.data?.employees) return;

        const ids = deviceData?.data?.employees.map((x: any) => x?.id).filter(Boolean);

        setRightSelectIds(ids);

        // ixtiyoriy: attaching/selectionlar ham eski bo‘lib qolmasin
        setTempSelectedIds([]);
        setRemoveSelectIds([]);
    }, [deviceData?.data?.employees]);

    const toggleId = (setFn: React.Dispatch<React.SetStateAction<number[]>>, id: number) => {
        setFn(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
    };

    // usage
    const toggleTempSelect = (id: number) => toggleId(setTempSelectedIds, id);
    const toggleRemoveTempSelect = (id: number) => toggleId(setRemoveSelectIds, id);

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
                        {/* <MyInput
                            startIcon={<Search />}
                            placeholder={t("Search")}
                            value={searchInput}
                            // onChange={(e) => setSearchInput(e.target.value)}
                            // onKeyUp={handleKeyUp}
                        /> */}

                        <div className="flex items-center justify-between mt-4">
                            <MyCheckbox
                                label={t("Select all")}
                                checked={
                                    tempSelectedIds?.length === leftEmployees?.length &&
                                    leftEmployees?.length > 0
                                }
                                indeterminate={
                                    tempSelectedIds?.length > 0 &&
                                    tempSelectedIds?.length < leftEmployees?.length
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
                            ) : employeesData?.data?.length === 0 ? (
                                <p>{t("No employees found")}</p>
                            ) : (
                                leftEmployees?.map((emp: any) => (
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
                                {t("Selected employees")} ({finalEmployees?.length})
                            </h3>
                            <MyButton
                                variant="secondary"
                                disabled={!removeSelectIds?.length}
                                onClick={() => setRemoveModal(true)}
                            >
                                {t("Remove")} ({removeSelectIds?.length})
                            </MyButton>
                        </div>

                        <div className="overflow-y-auto h-full space-y-2 mt-4">
                            {!finalEmployees?.length ? (
                                <p className="text-center mt-10">{t("Nothing selected yet")}</p>
                            ) : (
                                finalEmployees?.map((emp: any) => (
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
                refetch={refetch}
                hikvisionRefetch={deviceRefetch}
            />

            <RemoveAssignModal
                deviceId={deviceId}
                open={removeModal}
                onClose={() => setRemoveModal(false)}
                tempSelectedIds={removeSelectIds}
                refetch={refetch}
                hikvisionRefetch={deviceRefetch}
            />
        </>
    );
}

export default EmployeeAssign;
