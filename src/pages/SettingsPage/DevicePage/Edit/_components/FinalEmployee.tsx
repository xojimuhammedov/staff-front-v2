import React, { useEffect, useState } from 'react';
import RemoveAssignModal from './RemoveAssignModal';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { MyCheckbox } from 'components/Atoms/Form';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';
import AssignPagination from 'components/Atoms/AssignPagination';
import { useLocation } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';
import { searchValue } from 'types/search';

const FinalEmployee = ({ deviceId, statusRefetch, setStatusRefetch }: any) => {
  const { t } = useTranslation();
  const location = useLocation();
  const [removeModal, setRemoveModal] = useState(false);
  const [removeSelectIds, setRemoveSelectIds] = useState<number[]>([]);
  const searchValue: searchValue = paramsStrToObj(location.search);

  const {
    data,
    isLoading: finalLoading,
    refetch: removeRefetch,
  } = useGetAllQuery<any>({
    key: KEYS.employeeAssignDevice,
    url: URLS.employeeAssignDevice,
    params: {
      isAssigned: true,
      deviceIds: deviceId,
      page: searchValue?.page || 1,
      limit: searchValue?.limit || 10,
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
      <div className="w-full lg:w-1/2 rounded-md border overflow-hidden flex flex-col max-h-[calc(100vh-140px)]">
        <div className="flex items-center justify-between bg-gray-100 p-2 shrink-0">
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

        <div className="flex-1 overflow-y-auto space-y-2 p-2">
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
        <div className="shrink-0 sticky bottom-0 bg-white dark:bg-bg-dark-bg border-t border-gray-200 dark:border-[#2E3035]">
          <AssignPagination total={get(data, 'total', 0)} />
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
