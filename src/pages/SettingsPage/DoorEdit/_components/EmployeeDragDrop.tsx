import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, useGetOneQuery } from "hooks/api";
import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import RemoveAssignModal from "./RemoveAssignModal";
import DeviceAssignModal from "./DeviceAssignModal";

interface Employee {
  id: number;
  name: string;
  avatar?: string;
}

interface EmployeeResponse {
  data: Employee[];
}


function EmployeeDragDrop({ employeeData, gateId, refetch: hikvisionRefetch }: any) {
  const { t } = useTranslation();
  const { id } = useParams()
  const navigate = useNavigate()
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]);
  const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);
  const [rightSelectIds, setRightSelectIds] = useState<number[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [removeModal, setRemoveModal] = useState(false)
  const [selectDevices, setSelectDevices] = useState<number[]>([]);

  const { data: employeesData, isLoading, refetch } =
    useGetAllQuery<EmployeeResponse>({
      key: KEYS.getEmployeeList,
      url: URLS.getEmployeeList,
      params: { limit: 100 },
    });

  const { data: doorData } = useGetOneQuery({
    id,
    url: URLS.getDoorGates,
    enabled: !!id,
  });

  const employees = employeesData?.data ?? [];

  const { data: deviceData } = useGetAllQuery<any>({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {},
  });

  useEffect(() => {
    if (employeeData) {
      setFinalSelectedIds(
        employeeData?.map((e: any) => e?.employee?.id)
      );
    }
  }, [employeeData]);



  const toggleSelectAll = () =>
    setTempSelectedIds((p) =>
      p.length === employees.length ? [] : employees.map((e) => e.id)
    );


  const finalEmployees = useMemo(
    () => employees.filter((e) => finalSelectedIds.includes(e.id)),
    [employees, finalSelectedIds]
  );

  const alreadySelectedIds = new Set(finalSelectedIds);

  // LEFT PANEL LIST
  const leftEmployees = employees.filter(
    (emp) => !alreadySelectedIds.has(emp.id)
  );


  //Devices multi select uchun
  useEffect(() => {
    if (doorData?.data?.devices) {

      const savedGateIds =
        doorData?.data?.devices
          ? doorData?.data?.devices.map((g: any) => g.id)
          : doorData?.data?.devices || [];

      setSelectDevices(savedGateIds);
    }
  }, [doorData?.data?.devices]);

  const options = useMemo(() =>
    deviceData?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [],
    [deviceData?.data]);


  const selectedValues = useMemo(() =>
    options.filter((option: any) => selectDevices.includes(option.value)),
    [options, selectDevices]
  );


  useEffect(() => {
    if (!employeeData) return;

    const ids = employeeData?.map((x: any) => x?.id).filter(Boolean);

    setRightSelectIds(ids);
    setTempSelectedIds([]);
    setRemoveSelectIds([]);
  }, [employeeData]);

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
            title={gateId ? t("Edit employees") : t("Add employees")}
            subtitle={t("Create group and link to door")}
          />

          <MyButton onClick={() => navigate("/settings?current-setting=doors")} variant="primary" type="submit">
            Save changes
          </MyButton>
        </div>

        <MyDivider />

        <div className="flex items-center my-4 justify-between">
          <LabelledCaption
            title={t("Select devices")}
            subtitle={t("")}
          />
          <div className="w-1/2">
            <MySelect
              isMulti
              options={options}
              value={selectedValues}        // Bu yerda to'g'ri tanlanganlar ko'rinadi
              onChange={(selected: any) => {
                const ids = selected ? selected.map((s: any) => s.value) : [];
                setSelectDevices(ids);
              }}
              allowedRoles={["ADMIN"]}
            />
          </div>
        </div>

        <MyDivider />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">

          <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border p-4">
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
                  <div key={emp.id} className="flex items-center p-4 rounded-md dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] transition-colors">
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
              {!finalEmployees.length ? (
                <p className="text-center mt-10">{t("Nothing selected yet")}</p>
              ) : (
                finalEmployees.map((emp) => (
                  <div key={emp.id} className="flex items-center p-4 mx-2 rounded-md dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] transition-colors">
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
        tempSelectedIds={tempSelectedIds}
        deviceId={selectDevices}
        refetch={refetch}
        hikvisionRefetch={hikvisionRefetch}
      />
      <RemoveAssignModal
        deviceId={selectDevices}
        open={removeModal}
        onClose={() => setRemoveModal(false)}
        tempSelectedIds={removeSelectIds}
        refetch={refetch}
        hikvisionRefetch={hikvisionRefetch}
      />
    </>
  );
}

export default EmployeeDragDrop;
