import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FinalEmployee from './FinalEmployee';
import LeftEmployee from './LeftEmployee';

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
  const { id } = useParams();
  const navigate = useNavigate();
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]);
  const [selectDevices, setSelectDevices] = useState<number[]>([]);

  const {
    data: employeesData,
    isLoading,
    refetch,
  } = useGetAllQuery<EmployeeResponse>({
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
      setFinalSelectedIds(employeeData?.map((e: any) => e?.employee?.id));
    }
  }, [employeeData]);

  const finalEmployees = useMemo(
    () => employees.filter((e) => finalSelectedIds.includes(e.id)),
    [employees, finalSelectedIds]
  );

  const alreadySelectedIds = new Set(finalSelectedIds);

  // // LEFT PANEL LIST
  const leftEmployees = employees.filter((emp) => !alreadySelectedIds.has(emp.id));

  //Devices multi select uchun
  useEffect(() => {
    if (doorData?.data?.devices) {
      const savedGateIds = doorData?.data?.devices
        ? doorData?.data?.devices.map((g: any) => g.id)
        : doorData?.data?.devices || [];

      setSelectDevices(savedGateIds);
    }
  }, [doorData?.data?.devices]);

  const options = useMemo(
    () =>
      deviceData?.data?.map((item: any) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [deviceData?.data]
  );

  const selectedValues = useMemo(
    () => options.filter((option: any) => selectDevices.includes(option.value)),
    [options, selectDevices]
  );

  return (
    <>
      <div className="mt-12 w-full rounded-md bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">
        <div className="flex items-center justify-between">
          <LabelledCaption
            title={gateId ? t('Edit employees') : t('Add employees')}
            subtitle={t('Create group and link to door')}
          />

          <MyButton
            onClick={() => navigate('/settings?current-setting=doors')}
            variant="primary"
            type="submit"
          >
            Save changes
          </MyButton>
        </div>

        <MyDivider />

        <div className="flex items-center my-4 justify-between">
          <LabelledCaption title={t('Select devices')} subtitle={t('')} />
          <div className="w-1/2">
            <MySelect
              isMulti
              options={options}
              value={selectedValues} // Bu yerda to'g'ri tanlanganlar ko'rinadi
              onChange={(selected: any) => {
                const ids = selected ? selected.map((s: any) => s.value) : [];
                setSelectDevices(ids);
              }}
              allowedRoles={['ADMIN']}
            />
          </div>
        </div>

        <MyDivider />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Left Panel */}
          <LeftEmployee
            refetch={refetch}
            hikvisionRefetch={hikvisionRefetch}
            tempSelectedIds={tempSelectedIds}
            setTempSelectedIds={setTempSelectedIds}
            leftEmployees={leftEmployees}
            employees={employees}
            selectDevices={selectDevices}
            isLoading={isLoading}
          />
          {/* RIGHT PANEL */}
          <FinalEmployee
            setTempSelectedIds={setTempSelectedIds}
            employeeData={employeeData}
            finalEmployees={finalEmployees}
            selectDevices={selectDevices}
            refetch={refetch}
            hikvisionRefetch={hikvisionRefetch}
          />
        </div>
      </div>
    </>
  );
}

export default EmployeeDragDrop;
