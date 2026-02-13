import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeviceAssignModal from './DeviceAssignModal';
import { useGetAllQuery } from 'hooks/api';
import { URLS } from 'constants/url';
import { KEYS } from 'constants/key';
import { get } from 'lodash';

const LeftEmployee = ({
  deviceId,
  deviceTypeOptions,
  statusRefetch, setStatusRefetch
}: any) => {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);

  const {
    data,
    isLoading: leftLoading,
    refetch: assignRefetch,
  } = useGetAllQuery<any>({
    key: KEYS.employeeAssignDevice,
    url: URLS.employeeAssignDevice,
    params: {
      isAssigned: false,
      limit: 100,
      deviceIds: deviceId,
    },
  });

  useEffect(() => {
    assignRefetch();
  }, [statusRefetch]);

  const toggleId = (setFn: React.Dispatch<React.SetStateAction<number[]>>, id: number) => {
    setFn((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const toggleSelectAll = () =>
    setTempSelectedIds((p: any) =>
      p.length === get(data, 'data.length') ? [] : get(data, 'data')?.map((e: any) => e.id)
    );

  // usage
  const toggleTempSelect = (id: number) => toggleId(setTempSelectedIds, id);

  return (
    <>
      <div className="w-full lg:w-1/2 h-[600px] overflow-y-auto rounded-md border p-4">
        <div className="flex items-center justify-between mt-4">
          <MyCheckbox
            label={t('Select all')}
            checked={
              tempSelectedIds?.length === get(data, 'data.length') && get(data, 'data.length') > 0
            }
            indeterminate={
              tempSelectedIds?.length > 0 && tempSelectedIds?.length < get(data, 'data.length')
            }
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
          {leftLoading ? (
            <p>{t('Loading...')}</p>
          ) : get(data, 'data.length') === 0 ? (
            <p>{t('No employees found')}</p>
          ) : (
            get(data, 'data')?.map((emp: any) => (
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
        deviceTypeOptions={deviceTypeOptions}
        tempSelectedIds={tempSelectedIds}
        deviceId={deviceId}
        refetch={assignRefetch}
        setStatusRefetch={setStatusRefetch}
      />
    </>
  );
};

export default LeftEmployee;
