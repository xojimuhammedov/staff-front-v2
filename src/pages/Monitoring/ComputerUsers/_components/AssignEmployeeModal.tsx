import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { MySelect } from 'components/Atoms/Form';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  computerUserId: number | string | null;
  onSuccess: () => void;
}

export default function AssignEmployeeModal({ open, setOpen, computerUserId, onSuccess }: Props) {
  const { t } = useTranslation();
  const [employeeId, setEmployeeId] = useState<number | null>(null);

  const { data: employeesData } = useGetAllQuery<any>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: { limit: 100 },
    enabled: open,
  });

  const employeeOptions = employeesData?.data?.map((emp: any) => ({
    label: emp.name,
    value: emp.id,
  })) || [];

  const { mutate, isPending } = usePostQuery({
    listKeyId: KEYS.getComputerUserList,
  });

  const handleAssign = () => {
    if (!employeeId || !computerUserId) return;
    
    mutate(
      {
        url: `${URLS.getComputerUserList}/${computerUserId}/link-employee`,
        attributes: { employeeId },
      },
      {
        onSuccess: () => {
          setOpen(false);
          setEmployeeId(null);
          onSuccess();
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">
      <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" />
      <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <Dialog.Panel className="relative transform overflow-visible rounded-lg bg-white dark:bg-bg-dark-bg text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white dark:bg-bg-dark-bg px-4 pt-5 pb-4 sm:p-6 sm:pb-4 rounded-t-lg min-h-[160px]">
              <div className="sm:flex sm:items-start w-full">
                <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 dark:text-text-title-dark mb-4"
                  >
                    {t('Assign Employee')}
                  </Dialog.Title>
                  <div className="mt-2 text-left">
                    <MySelect
                        options={employeeOptions}
                        placeholder={t('Select employee')}
                        onChange={(e: any) => setEmployeeId(e?.value)}
                        value={employeeId || undefined}
                        isClearable
                        allowedRoles={["ADMIN", "HR", "DEPARTMENT_LEAD", "GUARD"]}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 rounded-b-lg">
              <MyButton
                variant="primary"
                onClick={handleAssign}
                disabled={isPending || !employeeId}
                className="w-full sm:ml-3 sm:w-auto"
              >
                 {t('Assign')}
              </MyButton>
              <MyButton
                variant="secondary"
                onClick={() => setOpen(false)}
                className="mt-3 w-full sm:mt-0 sm:w-auto"
              >
                {t('Cancel')}
              </MyButton>
            </div>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}
