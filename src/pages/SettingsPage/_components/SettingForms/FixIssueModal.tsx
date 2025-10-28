import React, { useState } from 'react';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePutQuery } from 'hooks/api';
import { UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { X, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { get } from 'lodash';
import storage from 'services/storage';

function FixIssueModal({ doorData, setOpenModal, refetch }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const userDataString: string | null = storage.get('userData');
  const companyId: any = userDataString ? JSON.parse(userDataString) : {};
  const { data } = useGetAllQuery({
    key: KEYS.getFixIssue,
    url: URLS.getFixIssue,
    params: {
      filters: {
        door: doorData?.door?.id,
        employee: doorData?.employee?.id
      },
      populate: 'device, employee'
    }
  });

  const { mutate: create } = usePutQuery({
    listKeyId: KEYS.updateEmployee,
    hideSuccessToast: true
  });

  const onSubmit = (object: any) => {
    const submitData = {
      employee: data?.data?.data[0]?.employee,
      doors: [doorData?.door?.id],
      func: 'Update',
      resubmit: true,
      companyId: get(companyId, 'company.id')
    };

    create(
      {
        url: URLS.updateEmployee,
        attributes: {
          data: submitData
        }
      },
      {
        onSuccess: (data) => {
          toast.success(t('Successfully edited!'));
          setOpenModal(false);
          refetch();
        },
        onError: (e) => {
          console.log(e);
          toast.error('An error occurred!');
        }
      }
    );
  };

  return (
    <>
      <div>
        <h2 className="border-tag-red-border rounded-md border bg-tag-red-bg p-2 font-inter text-xs leading-5 text-text-error">
          {t('The photo is not matched. Please, resubmit employee photo.')}
        </h2>
        <div className="mt-4 rounded-md border border-border-base bg-bg-subtle p-2">
          {get(data, 'data.data')?.map((evt: any, index: number) => (
            <div className="flex items-center gap-2">
              {evt?.isSuccess ? <Check /> : <X />}
              <p className="text-12 leading-20 font-inter dark:text-text-title-dark" key={index}>
                {evt?.device?.name}
              </p>
            </div>
          ))}
        </div>
        <div className="mx-auto mt-8 flex h-[213px] w-[198px] cursor-pointer items-center items-center justify-center justify-center rounded-lg border-2 bg-[#F9FAFB]">
          <label className="">
            <img className="h-[200px] w-[180px]" src={data?.data?.data[0]?.employee?.photoBase64} />
          </label>
        </div>
        <label
          htmlFor=""
          onClick={() => navigate(`/employees/edit/${data?.data?.data[0]?.employee?.id}`)}
          className="mx-auto mt-6 flex h-[32px] w-[180px] cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-gray-300 px-[10px]  py-[6px] text-sm font-medium leading-5 text-gray-700 shadow-sm">
          <UploadCloud /> {t('Upload image')}
        </label>
        <div className="mt-4 flex items-center justify-end gap-4">
          <MyButton onClick={onSubmit} type="submit" className="w-[98px]" variant="secondary">
            {t('Resubmit')}
          </MyButton>
          <MyButton onClick={() => setOpenModal(false)} className="w-[98px]" variant="secondary">
            {t('Close')}
          </MyButton>
        </div>
      </div>
    </>
  );
}

export default FixIssueModal;
