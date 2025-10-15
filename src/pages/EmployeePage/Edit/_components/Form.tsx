import { MyInput, MySelect } from 'components/Atoms/Form';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import { useGetAllQuery, useGetOneQuery, usePostQuery, usePutQuery } from 'hooks/api';
import { get } from 'lodash';
import { UploadCloud } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import { ISelect } from 'interfaces/select.interface';
import { toast } from 'react-toastify';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';

function Form() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const { id } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<any>();
  const { getProcessedImage, setImage, resetStates }: any = useImageCropContext();
  const handleDone = async (): Promise<void> => {
    const avatar = await getProcessedImage();
    if (avatar) {
      if (avatar instanceof Blob) {
        const reader = new FileReader();
        reader.readAsDataURL(avatar);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setPreview(base64data);
        };
      } else {
        console.error('Processed image is not a valid Blob.');
      }
      resetStates();
      setOpenModal(false);
      setError(false);
    } else {
      console.error('Processed image is not available.');
    }
  };

  const handleFileChange = async ({ target: { files } }: any) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
    setOpenModal(true);
  };
  const { data: getDepartment } = useGetAllQuery<any>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {}
  })

  const { data } = useGetOneQuery({
    id: id,
    url: URLS.getEmployeeList,
    params: {},
    enabled: !!id
  })
  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(data, 'data.name'),
        email: get(data, 'data.email'),
        phone: get(data, 'data.phone'),
        additionalDetails: get(data, 'data.additionalDetails'),
        address: get(data, 'data.address'),
        departmentId: get(data, 'data.departmentId')
      };
    }, [data]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: get(data, 'data.name'),
      email: get(data, 'data.email'),
      phone: get(data, 'data.phone'),
      additionalDetails: get(data, 'data.additionalDetails'),
      address: get(data, 'data.address'),
      departmentId: get(data, 'data.departmentId')
    });
  }, [data]);

  const { mutate: update } = usePutQuery({
    listKeyId: KEYS.getEmployeeList,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    update(
      {
        url: `${URLS.getEmployeeList}/${id}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully edited!'));
          reset();
          navigate('/employees')
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-2/3 flex justify-between'>
          <div className='grid grid-cols-2 gap-4 w-3/4'>
            <MyInput
              {...register("name")}
              error={Boolean(errors?.name?.message)}
              helperText={t(`${errors?.name?.message}`)}
              label={t('User name')}
            />
            <MyInput
              {...register("address")}
              error={Boolean(errors?.address?.message)}
              helperText={t(`${errors?.address?.message}`)}
              label={t('User address')}
            />
            <MyInput
              {...register("phone")}
              error={Boolean(errors?.phone?.message)}
              helperText={t(`${errors?.phone?.message}`)}
              label={t('User phone number')}
            />
            <MyInput
              {...register("email")}
              error={Boolean(errors?.email?.message)}
              helperText={t(`${errors?.email?.message}`)}
              label={t('User email')}
            />
            <MyInput
              {...register("additionalDetails")}
              error={Boolean(errors?.additionalDetails?.message)}
              helperText={t(`${errors?.additionalDetails?.message}`)}
              label={t('User details')}
            />
            <Controller
              name="departmentId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t("Select department")}
                  options={get(getDepartment, "data")?.map((evt: Department) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  value={field.value as any}  // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                />
              )}
            />
          </div>
          <div className="cursor-pointer">
            <p className="font-inter text-base font-medium leading-5 dark:text-text-title-dark">
              {t('Avatar image')} <span className="text-red-500">{'*'}</span>
            </p>
            <div className="mt-2 flex h-[160px] w-[150px] items-center justify-center border-2 bg-[#F9FAFB]">
              <label className="cursor-pointer">
                <img className="h-[160px] w-[150px] object-cover" src={preview} />
              </label>
            </div>
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="avatarInput"
              accept="image/*"
            />
            <label
              htmlFor="avatarInput"
              className="mt-6 flex h-[32px] cursor-pointer items-center justify-center gap-2 rounded-md border border-solid border-gray-300 px-[6px] py-[6px]  text-xs font-medium text-gray-700 shadow-sm dark:text-text-title-dark">
              <UploadCloud /> {t('Upload image')}
            </label>
            {error && <p className="text-red-500">{t("Image is required")}</p>}
          </div>
        </div>
        <MyDivider />
        <MyButton
          type='submit'
          className={'mt-3'}
          variant="primary">{t("Add & Save")}</MyButton>
      </form>
      <MyModal
        modalProps={{
          show: Boolean(openModal),
          onClose: () => setOpenModal(false),
          size: 'md'
        }}
        headerProps={{
          children: <h2 className="text-gray-800">{t('Edit profile picture')}</h2>
        }}
        bodyProps={{
          children: (
            <>
              {/* <ImageCropModalContent
                handleDone={handleDone}
                handleClose={() => setOpenModal(false)}
              /> */}
            </>
          )
        }}
      />
    </>
  );
}

export default Form;
