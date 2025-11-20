import { MyInput } from 'components/Atoms/Form';
import  { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { KEYS } from 'constants/key';
import { useGetOneQuery, usePutQuery } from 'hooks/api';
import { toast } from 'react-toastify';
import { URLS } from 'constants/url';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { get } from 'lodash';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import MyModal from 'components/Atoms/MyModal';
import dayjs from 'dayjs';

const EditForm = ({ setShow, show, refetch, visitorId }: any) => {
  const { t } = useTranslation()

  const { data } = useGetOneQuery({
    id: visitorId,
    url: URLS.getVisitorList,
    params: {},
    enabled: !!visitorId
  })
  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm<any>({
    defaultValues: useMemo(() => {
      return {
        firstName: get(data, 'data.data.firstName'),
        lastName: get(data, 'data.data.lastName'),
        middleName: get(data, 'data.data.middleName'),
        workPlace: get(data, 'data.workPlace'),
        pinfl: get(data, 'data.data.pinfl'),
        passportNumber: get(data, 'data.data.passportNumber'),
        additionalDetails: get(data, 'data.data.additionalDetails'),
        organizationId: get(data, 'data.data.organizationId'),
        phone: get(data, 'data.data.phone'),
        birthday: {
          startDate: get(data, 'data.data.birthday')
            ? dayjs(get(data, 'data.data.birthday')).format("YYYY-MM-DD") // ✅ formatlanadi
            : null, endDate: null
        }
      };
    }, [data]),
    mode: 'onChange'
  });

  useEffect(() => {
    reset({
      firstName: get(data, 'data.data.firstName'),
      lastName: get(data, 'data.data.lastName'),
      middleName: get(data, 'data.data.middleName'),
      workPlace: get(data, 'data.data.workPlace'),
      pinfl: get(data, 'data.data.pinfl'),
      passportNumber: get(data, 'data.data.passportNumber'),
      additionalDetails: get(data, 'data.data.additionalDetails'),
      phone: get(data, 'data.data.phone'),
      birthday: {
        startDate: get(data, 'data.data.birthday')
          ? dayjs(get(data, 'data.data.birthday')).format("YYYY-MM-DD")
          : null, endDate: null
      },
      organizationId: get(data, 'data.data.organizationId'),
    });
  }, [data]);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getVisitorList,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    const formattedData = {
      ...data,
      birthday: data.birthday?.startDate
        ? dayjs(data.birthday.startDate).format("YYYY-MM-DD")
        : null,
    };
    update(
      {
        url: `${URLS.getVisitorList}/${visitorId}`,
        attributes: formattedData
      },
      {
        onSuccess: () => {
          toast.success(t('Edit successfully!'));
          reset();
          refetch()
          setShow(false)
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <MyModal
      modalProps={{
        show: Boolean(show),
        onClose: () => {
          setShow(false)
        }
      }}
      headerProps={{
        children: <h2 className="text-xl font-semibold">{t('Edit visitor')}</h2>,
        className: 'px-6'
      }}
      bodyProps={{
        children: (
          <div className='p-4'>
            <form onSubmit={handleSubmit(onSubmit)} action="">
              <div className='grid grid-cols-2 gap-4'>
                <MyInput
                  {...register("firstName")}
                  error={Boolean(errors?.firstName?.message)}
                  helperText={t(`${errors?.firstName?.message}`)}
                  label={t('Visitor full name')}
                />
                <MyInput
                  {...register("lastName")}
                  error={Boolean(errors?.lastName?.message)}
                  helperText={t(`${errors?.lastName?.message}`)}
                  label={t('Visitor short name')}
                />
                <MyInput
                  {...register("middleName")}
                  error={Boolean(errors?.middleName?.message)}
                  helperText={t(`${errors?.middleName?.message}`)}
                  label={t('Visitor email')}
                />
                <MyInput
                  {...register("workPlace")}
                  error={Boolean(errors?.workPlace?.message)}
                  helperText={t(`${errors?.workPlace?.message}`)}
                  label={t('Visitor address')}
                />
                <MyInput
                  {...register("additionalDetails")}
                  error={Boolean(errors?.additionalDetails?.message)}
                  helperText={t(`${errors?.additionalDetails?.message}`)}
                  label={t('Visitor details')}
                />
                <MyInput
                  {...register('phone')}
                  error={Boolean(errors?.phone?.message)}
                  helperText={t(`${errors?.phone?.message}`)}
                  type="tel"
                  placeholder="+998 (_ _)  _ _ _  _ _  _ _"
                  label={t('Phone number')}
                />
                <MyTailwindPicker
                  name="birthday"
                  control={control}
                  asSingle={true}
                  placeholder="Select birthday"
                  label={t('Birthday')}
                  useRange={false}
                  startIcon={<Calendar stroke="#9096A1" />}
                />
                <MyInput
                  {...register('pinfl')}
                  error={Boolean(errors?.pinfl?.message)}
                  helperText={t(`${errors?.pinfl?.message}`)}
                  type="tel"
                  label={t('Pinfl')}
                />
                <MyInput
                  {...register('passportNumber')}
                  error={Boolean(errors?.passportNumber?.message)}
                  helperText={t(`${errors?.passportNumber?.message}`)}
                  type="tel"
                  label={t('Passport Number')}
                />
              </div>
              <div className="mt-2 flex w-full justify-end gap-4">
                <MyButton
                  type='submit'
                  variant="primary">{t("Submit")}</MyButton>
                <MyButton
                  onClick={() => {
                    setShow(false);
                    reset();
                  }}
                  variant="secondary">
                  {' '}
                  {t('Close')}
                </MyButton>
              </div>
            </form>
          </div>
        )
      }}
    />
  );
}

export default EditForm;
