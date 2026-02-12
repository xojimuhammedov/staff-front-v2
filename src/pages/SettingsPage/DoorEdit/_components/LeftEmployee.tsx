import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeviceAssignModal from './DeviceAssignModal';

const LeftEmployee = ({
  refetch,
  hikvisionRefetch,
  setTempSelectedIds,
  tempSelectedIds,
  leftEmployees,
  employees,
  selectDevices,
  isLoading
}: any) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);

  const toggleId = (setFn: React.Dispatch<React.SetStateAction<number[]>>, id: number) => {
    setFn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleTempSelect = (id: number) => toggleId(setTempSelectedIds, id);
  const toggleSelectAll = () =>
    setTempSelectedIds((p: any) =>
      p.length === employees.length ? [] : employees.map((e: any) => e.id)
    );
  return (
    <>
      <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border p-4">
        <div className="flex items-center justify-between mt-4">
          <MyCheckbox
            label={t('Select all')}
            checked={tempSelectedIds.length === employees.length && employees.length > 0}
            indeterminate={tempSelectedIds.length > 0 && tempSelectedIds.length < employees.length}
            onChange={toggleSelectAll}
          />

          <MyButton
            variant="secondary"
            disabled={!tempSelectedIds.length}
            onClick={() => setOpenModal(true)}
          >
            {t('Add selected')} ({tempSelectedIds.length})
          </MyButton>
        </div>

        <div className="mt-4 space-y-2">
          {isLoading ? (
            <p>{t('Loading...')}</p>
          ) : employees.length === 0 ? (
            <p>{t('No employees found')}</p>
          ) : (
            leftEmployees.map((emp:any) => (
              <div
                key={emp.id}
                className="flex items-center p-4 rounded-md dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] transition-colors"
              >
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

      <DeviceAssignModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        tempSelectedIds={tempSelectedIds}
        deviceId={selectDevices}
        refetch={refetch}
        hikvisionRefetch={hikvisionRefetch}
      />
    </>
  );
};

export default LeftEmployee;
