import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import RemoveAssignModal from './RemoveAssignModal';

const FinalEmployee = ({ finalEmployees, employeeData, setTempSelectedIds, selectDevices, refetch, hikvisionRefetch }: any) => {
  const { t } = useTranslation();
  const [removeModal, setRemoveModal] = useState(false)
  const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);

  useEffect(() => {
    setTempSelectedIds([]);
    setRemoveSelectIds([]);
  }, [employeeData]);

  const toggleId = (setFn: React.Dispatch<React.SetStateAction<number[]>>, id: number) => {
    setFn(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));
  };
  const toggleRemoveTempSelect = (id: number) => toggleId(setRemoveSelectIds, id);
  return (
    <>
      <div className="w-full lg:w-1/2 h-[600px] rounded-md border">
        <div className="flex items-center justify-between bg-gray-100 p-2">
          <h3 className="font-medium">
            {t('Selected employees')} ({finalEmployees?.length})
          </h3>
          <MyButton
            variant="secondary"
            disabled={!removeSelectIds?.length}
            onClick={() => setRemoveModal(true)}
          >
            {t('Remove')} ({removeSelectIds?.length})
          </MyButton>
        </div>

        <div className="overflow-y-auto h-[510px] space-y-2 mt-4">
          {!finalEmployees.length ? (
            <p className="text-center mt-10">{t('Nothing selected yet')}</p>
          ) : (
            finalEmployees.map((emp:any) => (
              <div
                key={emp.id}
                className="flex items-center p-4 mx-2 rounded-md dark:bg-bg-dark-bg border border-gray-200 dark:border-[#2E3035] transition-colors"
              >
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
};

export default FinalEmployee;
