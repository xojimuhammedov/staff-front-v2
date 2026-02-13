import React, { useEffect, useState } from 'react';
import RemoveAssignModal from './RemoveAssignModal';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { MyCheckbox } from 'components/Atoms/Form';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

const FinalEmployee = ({ deviceId, statusRefetch, setStatusRefetch }: any) => {
  const { t } = useTranslation();
  const [removeModal, setRemoveModal] = useState(false);
  const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);

  const {
    data,
    isLoading: leftLoading,
    refetch: removeRefetch,
  } = useGetAllQuery<any>({
    key: KEYS.employeeAssignDevice,
    url: URLS.employeeAssignDevice,
    params: {
      isAssigned: true,
      limit: 100,
      deviceIds: deviceId,
    },
  });
  useEffect(() => {
    removeRefetch();
  }, [statusRefetch]);

  const toggleId = (setFn: React.Dispatch<React.SetStateAction<number[]>>, id: number) => {
    setFn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };
  const toggleRemoveTempSelect = (id: number) => toggleId(setRemoveSelectIds, id);
  return (
    <>
      <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border">
        <div className="flex items-center justify-between bg-gray-100 p-2">
          <h3 className="font-medium">
            {t('Selected employees')} ({get(data, 'data.length')})
          </h3>
          <MyButton
            variant="secondary"
            disabled={!removeSelectIds?.length}
            onClick={() => setRemoveModal(true)}
          >
            {t('Remove')} ({removeSelectIds?.length})
          </MyButton>
        </div>

        <div className="overflow-y-auto h-full space-y-2 mt-4">
          {!get(data, 'data.length') ? (
            <p className="text-center mt-10">{t('Nothing selected yet')}</p>
          ) : (
            get(data, 'data')?.map((emp: any) => (
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
        deviceId={deviceId}
        open={removeModal}
        onClose={() => setRemoveModal(false)}
        tempSelectedIds={removeSelectIds}
        refetch={removeRefetch}
        setStatusRefetch={setStatusRefetch}
      />
    </>
  );
};

export default FinalEmployee;
