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
import { useRef, useState } from 'react';
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
  const visitorIdRef = useRef<number | null>(null);
  const visitorCacheRef = useRef<any>(null);

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
      limit: 100
    },
  });

  const { data: gateData } = useGetAllQuery<any>({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
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
      carNumber: null
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
    const onetimeCodeData = getOnetimeCodeValues();

    // 👉 Agar visitor allaqachon yaratilgan bo‘lsa
    if (visitorIdRef.current) {
      submitOnetimeCode(visitorIdRef.current, onetimeCodeData);
      return;
    }

    console.log(visitorData)

    // 👉 Aks holda 1-API chaqiriladi
    const formattedData = {
      ...visitorData,
      birthday: visitorData.birthday?.startDate
        ? dayjs(visitorData.birthday.startDate).format("YYYY-MM-DD")
        : null,
    };

    createVisitor(
      {
        url: URLS.getVisitorList,
        attributes: formattedData,
      },
      {
        onSuccess: (response: any) => {
          toast.success(t("Visitor created successfully!"))
          const visitorId = response?.data?.id || response?.id;
          if (!visitorId) return;

          // 🔐 CACHE QILAMIZ
          visitorIdRef.current = visitorId;
          visitorCacheRef.current = response?.data || response;

          submitOnetimeCode(visitorId, onetimeCodeData);
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  const submitOnetimeCode = (visitorId: number, onetimeCodeData: any) => {
    if (!onetimeCodeData.codeType) {
      openSuccessModal(visitorCacheRef.current);
      return;
    }

    const formattedOnetimeCodeData = {
      visitorId,
      codeType: onetimeCodeData.codeType,
      startDate: dayjs(onetimeCodeData.startDate).toISOString(),
      endDate: dayjs(onetimeCodeData.endDate).toISOString(),
      additionalDetails: onetimeCodeData.additionalDetails || "",
      isActive: onetimeCodeData.isActive ?? true,
      carNumber: onetimeCodeData?.carNumber
    };

    createOnetimeCode(
      {
        url: URLS.getOnetimeCodes,
        attributes: formattedOnetimeCodeData,
      },
      {
        onSuccess: (onetimeCodeResponse: any) => {
          toast.success(t("Onetime code created successfully!"))
          const visitorWithOnetimeCode = {
            ...visitorCacheRef.current,
            onetimeCode: {
              code: onetimeCodeResponse?.data?.code,
              startDate: onetimeCodeResponse?.data?.startDate,
              endDate: onetimeCodeResponse?.data?.endDate,
              codeType: onetimeCodeResponse?.data?.codeType,
              carNumber: onetimeCodeResponse?.data?.carNumber
            },
          };

          openSuccessModal(visitorWithOnetimeCode);

          // 🔄 HAMMASINI TOZALAYMIZ
          visitorIdRef.current = null;
          visitorCacheRef.current = null;
          reset({
            firstName: '',
            lastName: '',
            middleName: '',
            birthday: { startDate: null, endDate: null },
            additionalDetails: '',
            phone: '',
            passportNumberOrPinfl: '',
            workPlace: '',
            organizationId: null,
            gateId: null,
            attachedId: null,
          });
          resetOnetimeCode();
        },
        onError: (e: any) => {
          // ❗ HECH NIMA TOZALANMAYDI
          toast.error(
            e?.response?.data?.error?.message ||
            t("Error creating onetime code")
          );
        },
      }
    );
  };

  const openSuccessModal = (visitorData: any) => {
    setCreatedVisitor(visitorData);
    if (setShowCreateModal) setShowCreateModal(false);
    if (refetch) refetch();
    setTimeout(() => {
      setShowVisitorDetailsModal(true);
    }, 100);
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
    gateData,
    codeTypeOptions,
    onetimeCodeControl,
    onetimeCodeErrors,
    createdVisitor,
    showVisitorDetailsModal,
    setShowVisitorDetailsModal,
  };
};