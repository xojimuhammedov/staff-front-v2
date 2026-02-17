import { MyCheckbox } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeviceAssignModal from './DeviceAssignModal';
import { useGetAllQuery } from 'hooks/api';
import { URLS } from 'constants/url';
import { KEYS } from 'constants/key';
import { get } from 'lodash';
import LeftPagination from 'components/Atoms/LeftPagination';
import { paramsStrToObj } from 'utils/helper';
import { useLocation } from 'react-router-dom';

const LeftEmployee = ({ deviceId, deviceTypeOptions, statusRefetch, setStatusRefetch }: any) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [openModal, setOpenModal] = useState(false);
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const searchValue: any = paramsStrToObj(location.search);

  const {
    data,
    isLoading: leftLoading,
    refetch: assignRefetch,
  } = useGetAllQuery<any>({
    key: KEYS.employeeAssignDevice,
    url: URLS.employeeAssignDevice,
    params: {
      isAssigned: false,
      deviceIds: deviceId,
      page: searchValue?.Leftpage || 1,
      limit: searchValue?.Leftlimit || 10,
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
      <div className="w-full lg:w-1/2 rounded-md border overflow-hidden flex flex-col max-h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between bg-gray-100 p-2 shrink-0">
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

        <div className="flex-1 overflow-y-auto space-y-2 p-2">
          {leftLoading ? (
            <p>{t('Loading...')}</p>
          ) : get(data, 'data.length') === 0 ? (
            <p className="p-2">{t('No employees found')}</p>
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
        <div className="shrink-0 sticky bottom-0 bg-white dark:bg-bg-dark-bg border-t border-gray-200 dark:border-[#2E3035]">
          <LeftPagination total={get(data, 'total', 0)} />
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
