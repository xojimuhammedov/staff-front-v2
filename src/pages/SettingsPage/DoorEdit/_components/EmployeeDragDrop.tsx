import { MyCheckbox, MyInput } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import MyAvatar from "components/Atoms/MyAvatar";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, useGetOneQuery, usePostQuery } from "hooks/api";
import { Search, Trash2 } from "lucide-react";
import { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import AvatarIcon from "assets/icons/avatar.png";
import deviceType from "configs/deviceType";
import DeviceTypeSelectModal from './DeviceSelectModal';

interface Employee {
  id: number;
  name: string;
  avatar?: string;
}

interface EmployeeResponse {
  data: Employee[];
}


function EmployeeDragDrop() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams(); // <-- agar id bo‘lsa UPDATE rejim
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState("");
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]);
  const [selectedDeviceTypes, setSelectedDeviceTypes] = useState<string[]>([]);
  const [openModal, setOpenModal] = useState(false);


  const currentSearch = searchParams.get("search") || "";

  const { data: employeesData, isLoading } =
    useGetAllQuery<EmployeeResponse>({
      key: KEYS.getEmployeeList,
      url: URLS.getEmployeeList,
      params: { search: currentSearch || undefined, limit: 100 },
    });

  const employees = employeesData?.data ?? [];

  const { data: doorData } = useGetOneQuery({
    id,
    url: URLS.getDoorGates,
    enabled: !!id,
  });

  useEffect(() => {
    if (doorData?.data?.employees) {
      setFinalSelectedIds(
        doorData.data.employees.map((e: any) => e.id)
      );
    }
  }, [doorData]);


  const { mutate: assignEmployees } = usePostQuery({
    listKeyId: KEYS.devicesEmployeeAssign,
    hideSuccessToast: true,
  });

  useEffect(() => setSearchInput(currentSearch), [currentSearch]);

  const handleSearch = useCallback(() => {
    const p = new URLSearchParams(searchParams);
    if (searchInput.trim()) p.set("search", searchInput.trim());
    else p.delete("search");
    setSearchParams(p);
  }, [searchInput, searchParams, setSearchParams]);

  const handleKeyUp = (e: any) => e.key === "Enter" && handleSearch();

  // ---- TEMP SELECT ----
  const toggleTempSelect = (id: number) =>
    setTempSelectedIds((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );

  const toggleSelectAll = () =>
    setTempSelectedIds((p) =>
      p.length === employees.length ? [] : employees.map((e) => e.id)
    );

  // ---- ADD TO FINAL ----
  const addSelectedToFinal = (deviceTypes: string[]) => {
    if (!tempSelectedIds.length) return;

    setFinalSelectedIds((prev) =>
      Array.from(new Set([...prev, ...tempSelectedIds]))
    );

    setSelectedDeviceTypes(deviceTypes);
    setTempSelectedIds([]);
  };

  const removeFromFinal = (id: number) =>
    setFinalSelectedIds((p) => p.filter((x) => x !== id));

  const finalEmployees = useMemo(
    () => employees.filter((e) => finalSelectedIds.includes(e.id)),
    [employees, finalSelectedIds]
  );

  const deviceTypeOptions =
    deviceType?.map((d: any) => ({
      label: d.label,
      value: d.value,
    })) ?? [];

  const alreadySelectedIds = new Set(finalSelectedIds);

  // LEFT PANEL LIST
  const leftEmployees = employees.filter(
    (emp) => !alreadySelectedIds.has(emp.id)
  );

  const handleConfirmModal = (credentialTypes: string[]) => {
    addSelectedToFinal(credentialTypes);
    setOpenModal(false);
  };



  const handleAssign = () => {
    if (!finalSelectedIds.length)
      return toast.warning(t("Please select at least one employee"));


    assignEmployees(
      {
        url: URLS.devicesEmployeeAssign,
        attributes: {
          employeeIds: finalSelectedIds,
          credentialTypes: selectedDeviceTypes,
          gateId: Number(id),
        },
      },
      {
        onSuccess: () => {
          toast.success(t("Saved successfully"));
          navigate("/settings");
        },
        onError: (e: any) =>
          console.log(e)
      }
    );
  };


  return (
    <>
      <div className="mt-12 w-full rounded-md bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">

        <MyDivider />

        <LabelledCaption
          title={id ? t("Edit employees") : t("Add employees")}
          subtitle={t("Create group and link to door")}
        />

        <div className="mt-6 flex justify-end">
          <MyButton variant="primary" onClick={handleAssign} type="submit">
            Save changes
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
                  tempSelectedIds.length === employees.length &&
                  employees.length > 0
                }
                indeterminate={
                  tempSelectedIds.length > 0 &&
                  tempSelectedIds.length < employees.length
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
          <div className="w-full lg:w-1/2 h-[600px] rounded-md border overflow-hidden">
            <h3 className="p-4 font-medium bg-gray-100">
              {t("Selected employees")} ({finalSelectedIds.length})
            </h3>

            <div className="overflow-y-auto h-full">
              {!finalEmployees.length ? (
                <p className="text-center mt-10">{t("Nothing selected yet")}</p>
              ) : (
                finalEmployees.map((emp) => (
                  <div key={emp.id} className="flex justify-between items-center p-4 border-b">
                    <div className="flex items-center gap-3">
                      <MyAvatar imageUrl={emp.avatar || AvatarIcon} size="medium" />
                      <span>{emp.name}</span>
                    </div>

                    <button onClick={() => removeFromFinal(emp.id)}>
                      <Trash2 />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <DeviceTypeSelectModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleConfirmModal}
        deviceTypeOptions={deviceTypeOptions}
        initialValues={selectedDeviceTypes}
      />
    </>
  );
}

export default EmployeeDragDrop;
