import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import dayjs from 'dayjs';
import storage from 'services/storage';
import { visitorSchema, onetimeCodeSchema } from 'schema/visitor.schema';
import { useState } from 'react';
import { t } from 'i18next';
const codeTypeOptions = [ 
  { label: t("ONETIME"), value: "ONETIME" },
  { label: t("MULTIPLE"), value: "MULTIPLE" },
];
export const useVisitorForm = (refetch?: () => void, setShowCreateModal?: (show: boolean) => void) => {
  const { t } = useTranslation();
  const userData: any = storage.get('userData');
  const userRole = JSON.parse(userData)?.role;
  const [createdVisitor, setCreatedVisitor] = useState<any>(null);
  const [showVisitorDetailsModal, setShowVisitorDetailsModal] = useState(false);

  const { data: organizationData } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  });

  const { data: employeeData } = useGetAllQuery<any>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {},
  });

  // Visitor form
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

  // Onetime code form
  const {
    control: onetimeCodeControl,
    getValues: getOnetimeCodeValues,
    reset: resetOnetimeCode,
    formState: { errors: onetimeCodeErrors },
  } = useForm<any>({
    defaultValues: {
      codeType: '',
      startDate: null,
      endDate: null,
      additionalDetails: '',
      isActive: true,
    },
    mode: 'onChange',
    resolver: yupResolver(onetimeCodeSchema),
  });

  const { mutate: createVisitor } = usePostQuery({
    listKeyId: KEYS.getVisitorList,
    hideSuccessToast: true,
  });

  const { mutate: createOnetimeCode } = usePostQuery({
    listKeyId: KEYS.getOnetimeCodes,
    hideSuccessToast: true,
  });

  const onSubmit = (visitorData: any) => {
    const { attachId, ...visitorDataWithoutAttachId } = visitorData;
    
    const formattedData = {
      ...visitorDataWithoutAttachId,
      birthday: visitorData.birthday?.startDate
        ? dayjs(visitorData.birthday.startDate).format('YYYY-MM-DD')
        : null,
    };

    createVisitor(
      {
        url: URLS.getVisitorList,
        attributes: formattedData,
      },
      {
        onSuccess: (response: any) => {
          const visitorId = response?.data?.id || response?.id;
          if (visitorId) {
            const onetimeCodeData = getOnetimeCodeValues();
            if (onetimeCodeData.codeType && onetimeCodeData.startDate && onetimeCodeData.endDate) {
              const formattedOnetimeCodeData = {
                visitorId: visitorId,
                codeType: onetimeCodeData.codeType,
                startDate: dayjs(onetimeCodeData.startDate).toISOString(),
                endDate: dayjs(onetimeCodeData.endDate).toISOString(),
                additionalDetails: onetimeCodeData.additionalDetails || '',
                isActive: onetimeCodeData.isActive ?? true,
              };

              createOnetimeCode(
                {
                  url: URLS.getOnetimeCodes,
                  attributes: formattedOnetimeCodeData,
                },
                {
                  onSuccess: (onetimeCodeResponse: any) => {
                    const visitorData = response?.data || response;
                    // Add onetime code data to visitor object for modal display
                    const visitorWithOnetimeCode = {
                      ...visitorData,
                      onetimeCode: {
                        startDate: onetimeCodeData.startDate,
                        endDate: onetimeCodeData.endDate,
                        codeType: onetimeCodeData.codeType,
                      }
                    };
                    console.log('Visitor data to save:', visitorWithOnetimeCode);
                    setCreatedVisitor(visitorWithOnetimeCode);
                    if (setShowCreateModal) setShowCreateModal(false);
                    reset();
                    resetOnetimeCode();
                    if (refetch) refetch();
                    setTimeout(() => {
                      console.log('Opening modal, visitor:', visitorWithOnetimeCode);
                      setShowVisitorDetailsModal(true);
                    }, 100);
                  },
                  onError: (e: any) => {
                    console.log(e);
                    toast.error(e?.response?.data?.error?.message || t('Error creating onetime code'));
                  },
                }
              );
            } else {
              const visitorData = response?.data || response;
              setCreatedVisitor(visitorData);
              if (setShowCreateModal) setShowCreateModal(false);
              reset();
              if (refetch) refetch();
              setTimeout(() => {
                setShowVisitorDetailsModal(true);
              }, 100);
            }
          } else {
            const visitorData = response?.data || response;
            setCreatedVisitor(visitorData);
            if (setShowCreateModal) setShowCreateModal(false);
            reset();
            if (refetch) refetch();
            setTimeout(() => {
              setShowVisitorDetailsModal(true);
            }, 100);
          }
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  return {
    t,
    handleSubmit,
    register,
    reset,
    control,
    errors,
    onSubmit,
    organizationData,
    employeeData,
    codeTypeOptions,
    onetimeCodeControl,
    onetimeCodeErrors,
    createdVisitor,
    showVisitorDetailsModal,
    setShowVisitorDetailsModal,
  };
};