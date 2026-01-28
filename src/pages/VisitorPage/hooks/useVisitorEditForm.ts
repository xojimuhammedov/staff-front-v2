import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import dayjs from 'dayjs';
import storage from 'services/storage';
import { visitorSchema } from 'schema/visitor.schema';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery, usePutQuery } from 'hooks/api';

export const useVisitorEditForm = (id: string) => {
  const { t } = useTranslation();
  const userData: any = storage.get('userData');
  const userRole = JSON.parse(userData)?.role;

  const { data: organizationData } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  });

  const { data: employeeData } = useGetAllQuery<any>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {
      limit: 100,
    },
  });

  const { data: gateData } = useGetAllQuery<any>({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {},
  });

  const { data: visitorData, isLoading } = useGetOneQuery({
    id,
    key: KEYS.getVisitorList,
    url: URLS.getVisitorList,
    enabled: Boolean(id),
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors },
  } = useForm<any>({
    defaultValues: {
      birthday: { startDate: null, endDate: null },
    },
    mode: 'onChange',
    resolver: yupResolver(visitorSchema),
    context: { role: userRole },
  });

  useEffect(() => {
    const visitor = visitorData?.data ?? visitorData;
    if (!visitor) return;
    reset({
      firstName: visitor.firstName ?? '',
      lastName: visitor.lastName ?? '',
      middleName: visitor.middleName ?? '',
      birthday: visitor.birthday
        ? { startDate: visitor.birthday, endDate: visitor.birthday }
        : { startDate: null, endDate: null },
      additionalDetails: visitor.additionalDetails ?? '',
      phone: visitor.phone ?? '',
      passportNumberOrPinfl: visitor.passportNumberOrPinfl ?? '',
      workPlace: visitor.workPlace ?? '',
      organizationId: visitor.organizationId ?? null,
      gateId: visitor.gateId ?? null,
      attachedId: visitor.attachedId ?? null,
    });
  }, [visitorData, reset]);

  const { mutate: updateVisitor } = usePutQuery({
    listKeyId: KEYS.getVisitorList,
    hideSuccessToast: true,
  });

  const onSubmit = (visitorForm: any) => {
    const formattedData = {
      ...visitorForm,
      birthday: visitorForm.birthday?.startDate
        ? dayjs(visitorForm.birthday.startDate).format('YYYY-MM-DD')
        : null,
    };

    updateVisitor(
      {
        url: `${URLS.getVisitorList}/${id}`,
        attributes: formattedData,
      },
      {
        onSuccess: () => {
          toast.success(t('Visitor updated successfully!'));
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message || t('Update failed'));
        },
      }
    );
  };

  return {
    handleSubmit,
    register,
    control,
    errors,
    onSubmit,
    organizationData,
    employeeData,
    gateData,
    isLoading,
  };
};
