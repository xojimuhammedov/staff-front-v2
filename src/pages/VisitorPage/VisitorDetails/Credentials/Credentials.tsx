import Button from 'components/Atoms/MyButton';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useDeleteQuery, useGetAllQuery, usePostQuery } from 'hooks/api';
import { Plus } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import AddNewTypeModal from './_components/AddNewTypeModal';
import { toast } from 'react-toastify';
import ConfirmationCredential from './Confirmation';
import { Controller, useForm } from 'react-hook-form';
import { MySelect } from 'components/Atoms/Form';
import { ISelect } from 'interfaces/select.interface';
import VisitorDetailsModal from 'pages/VisitorPage/_components/VisitorDetailsModal';
import OnetimeCodeCardNewUI from './OnetimeCodeCard';
import Loading from 'assets/icons/Loading';

const Credentials = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<any>();
  const [showModal, setShowModal] = useState(false);
  const [visitorsModal, setVisitorsModal] = useState(false)
  const [createdVisitor, setCreatedVisitor] = useState<any>(null);
  const { control, watch } = useForm();

  const { data: onetimeCodesData, refetch: refetchOnetimeCodes, isLoading }: any = useGetAllQuery({
    key: KEYS.getOnetimeCodes,
    url: URLS.getOnetimeCodes,
    params: {
      visitorId: Number(id),
      codeType: watch("type")
    },
  });

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

  const codeTypeOptions = [
    { label: t("ONETIME"), value: "ONETIME" },
    { label: t("MULTIPLE"), value: "MULTIPLE" },
  ];

  const { mutate: updateOnetimeCode } = usePostQuery({
    listKeyId: KEYS.activeOneTimeCode,
    hideSuccessToast: true,
  });

  const { mutate: createOnetimeCode } = usePostQuery({
    listKeyId: KEYS.getOnetimeCodes,
    hideSuccessToast: true,
  });
  const { mutate: deleteOnetimeCode } = useDeleteQuery({
    listKeyId: KEYS.getOnetimeCodes,
  });

  const onSubmitOnetimeCode = () => {
    updateOnetimeCode(
      {
        url: active.isActive ? `${URLS.activeOneTimeCode}/${active?.id}/deactivate` : `${URLS.activeOneTimeCode}/${active?.id}/activate`,
        attributes: {},
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          refetchOnetimeCodes();
          setOpen(false);
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message);
        },
      }
    );
  };

  const handleModalSubmit = (data: any) => {
    const submitData: any = {
      visitorId: Number(id),
      codeType: data.codeType,
      startDate: data.startDate,
      endDate: data.endDate,
      carNumber: data?.carNumber,
      isActive: true,
    };

    createOnetimeCode(
      {
        url: URLS.getOnetimeCodes,
        attributes: submitData,
      },
      {
        onSuccess: (onetimeCodesData: any) => {
          toast.success(t('Successfully created!'));
          setShowModal(false);
          const visitorWithOnetimeCode = {
            ...onetimeCodesData?.data,
            onetimeCode: {
              startDate: onetimeCodesData?.data?.startDate,
              endDate: onetimeCodesData?.data?.endDate,
              codeType: onetimeCodesData?.data?.codeType,
              code: onetimeCodesData?.data?.code,
              carNumber: onetimeCodesData?.data?.carNumber
            }
          };
          setVisitorsModal(true);
          setCreatedVisitor(visitorWithOnetimeCode)
          refetchOnetimeCodes();
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message || t('Error creating onetime code'));
        },
      }
    );
  };

  const handleDeleteOnetimeCode = (code: any) => {
    if (!code?.id) return;
    deleteOnetimeCode(
      {
        url: `${URLS.getOnetimeCodes}/${code.id}`,
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully deleted!'));
          refetchOnetimeCodes();
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message || t('Update failed'));
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end gap-4">
        <div className="flex w-[200px]">
          <Controller
            name="type"
            control={control}
            render={({ field, fieldState }) => (
              <MySelect
                placeholder={t('Select type')}
                options={codeTypeOptions?.map((evt: any) => ({
                  label: evt.label,
                  value: evt.value,
                }))}
                value={field.value as any}
                onChange={(val: any) => {
                  field.onChange((val as ISelect)?.value ?? val);
                }}
                onBlur={field.onBlur}
                error={!!fieldState.error}
                allowedRoles={['ADMIN', 'HR' , 'DEPARTMENT_LEAD' , 'GUARD']}
              />
            )}
          />
        </div>
        <Button
          startIcon={<Plus />}
          onClick={() =>
            setShowModal(true)
          }
          className={`text-sm [&_svg]:stroke-white-600 dark:[&_svg]:stroke-black-300`}
          variant="primary"
        >
          {t('Add new type')}
        </Button>
      </div>
      {onetimeCodesData?.data && onetimeCodesData.data.length > 0 ? (
        <div className="mt-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {onetimeCodesData.data.map((code: any, idx: number) => (
              <div
                key={code?.id || code?.code || idx}
                className="animate-fade-in-up"
                style={{ animationDelay: `${100 + idx * 50}ms` }}
              >
                <OnetimeCodeCardNewUI
                  code={code}
                  onToggle={(code) => {
                    setActive(code);
                    setOpen(true);
                  }}
                  onDelete={handleDeleteOnetimeCode}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-8 text-center text-gray-500">{t('No onetime codes found')}</div>
      )
      }
      <AddNewTypeModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModalSubmit}
        employeeData={employeeData}
        codeTypeOptions={codeTypeOptions}
      />
      <ConfirmationCredential
        title={
          active?.isActive
            ? t('Are you sure you want to deactivate this code?')
            : t('Are you sure you want to activate this code?')
        }
        subTitle={t('This action cannot be undone!')}
        open={open}
        setOpen={setOpen}
        confirmationDelete={() => {
          onSubmitOnetimeCode();
        }}
      />
      <VisitorDetailsModal
        show={visitorsModal}
        onClose={() => {
          setVisitorsModal(false);
        }}
        visitor={createdVisitor}
        organizationData={organizationData}
        employeeData={employeeData}
      />
    </>
  );
};

export default Credentials;
