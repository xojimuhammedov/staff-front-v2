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
import { Controller, useForm } from 'react-hook-form';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import { ISelect } from 'interfaces/select.interface';
import { toast } from 'react-toastify';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import { request } from 'services/request';
import ImageCropModalContent from 'pages/EmployeePage/Create/_components/ImageCropModalContent';

function Form() {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState(false);
  const [imageKey, setImageKey] = useState(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const [preview, setPreview] = useState<any>();
  const { getProcessedImage, setImage, resetStates }: any = useImageCropContext();
  const handleDone = async (): Promise<void> => {
    const avatar = await getProcessedImage();
    if (avatar) {
      if (avatar instanceof Blob) {
        try {
          const formData = new FormData();
          formData.append('file', avatar);

          // 🧩 2. API'ga yuboramiz
          const response = request.post(URLS.uploadPhotoByEmployee, formData, {
            headers: {
              "Content-Type": "multipart/form-data"
            }
          })
          response.then((res) => setImageKey(res?.data?.key))

          const imageUrl = URL.createObjectURL(avatar);
          setPreview(imageUrl);

          resetStates();
          setOpenModal(false);

        } catch (error) {
          console.error('❌ Error uploading avatar:', error);
        }
      } else {
        console.error('Processed image is not a valid Blob.');
      }
    } else {
      console.error('Processed image is not available.');
    }
  };

  const handleFileChange = async ({ target: { files } }: any) => {
    const file = files && files[0];
    const imageDataUrl = await readFile(file);
    setImage(imageDataUrl);
    setOpenModal(true);

  }
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
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(data, 'data.name'),
        address: get(data, 'data.address'),
        email: get(data, 'data.email'),
        phone: get(data, 'data.phone'),
        additionalDetails: get(data, 'data.additionalDetails'),
        departmentId: get(data, 'data.departmentId'),
        organizationId: get(data, 'data.organizationId')
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
      departmentId: get(data, 'data.departmentId'),
      organizationId: get(data, 'data.organizationId')
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
        attributes: {
          photo: imageKey,
          ...data
        }
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

  const { data: getOrganization } = useGetAllQuery<any>({
    key: KEYS.getListOrganizationSelf,
    url: URLS.getListOrganizationSelf,
    params: {}
  })

  const { data: getDepartment } = useGetAllQuery<any>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {
      organizationId: watch("organizationId")
    }
  })

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className='w-2/3 flex justify-between'>
          <div className='grid grid-cols-2 gap-4 w-3/4'>
            <MyInput
              {...register("name")}
              error={Boolean(errors?.name?.message)}
              helperText={t(`${errors?.name?.message}`)}
              label={t('Employee name')}
            />
            <MyInput
              {...register("address")}
              error={Boolean(errors?.address?.message)}
              helperText={t(`${errors?.address?.message}`)}
              label={t('Employee address')}
            />
            <MyInput
              {...register("phone")}
              error={Boolean(errors?.phone?.message)}
              helperText={t(`${errors?.phone?.message}`)}
              label={t('Employee phone number')}
            />
            <MyInput
              {...register("email")}
              error={Boolean(errors?.email?.message)}
              helperText={t(`${errors?.email?.message}`)}
              label={t('Employee email')}
            />
            <MyInput
              {...register("additionalDetails")}
              error={Boolean(errors?.additionalDetails?.message)}
              helperText={t(`${errors?.additionalDetails?.message}`)}
              label={t('Employee details')}
            />
            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t("Select organization")}
                  options={getOrganization?.map((evt: any) => ({
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
              <ImageCropModalContent
                handleDone={handleDone}
                handleClose={() => setOpenModal(false)}
              />
            </>
          )
        }}
      />
    </>
  );
}


export default Form;
