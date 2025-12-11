import { MyInput, MySelect } from 'components/Atoms/Form';
import MyModal from 'components/Atoms/MyModal';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useImageCropContext } from 'context/ImageCropProvider';
import { readFile } from 'helpers/cropImage';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { get } from 'lodash';
import { Plus, Trash2, UploadCloud } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { object, string } from 'yup';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import { ISelect } from 'interfaces/select.interface';
import ImageCropModalContent from './ImageCropModalContent';
import { toast } from 'react-toastify';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import { request } from 'services/request';
import storage from 'services/storage';
import { typeData } from 'configs/type';
import { DEFAULT_ICON_SIZE } from 'constants/ui.constants';

interface Credential {
  code: string;
  type: 'CAR' | 'QR';
  additionalDetails: string;
}

function Form() {
  const { t, i18n } = useTranslation();
  const userData: any = storage.get("userData")
  const userRole = JSON.parse(userData)?.role
  const [openModal, setOpenModal] = useState(false);
  const [imageKey, setImageKey] = useState(null)
  const [credentials, setCredentials] = useState<Credential[]>([
    {
      code: '',
      type: 'QR',
      additionalDetails: '',
    },
  ]);
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
  };

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true
  })

  const { data: jobData } = useGetAllQuery<any>({
    key: KEYS.employeeJobPosition,
    url: URLS.employeeJobPosition,
    params: {},
    hideErrorMsg: true
  })

  const schema = object().shape({
    name: string().required(),
    address: string(),
    phone: string(),
    email: string(),
    departmentId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' || "HR" ? schema.required() : schema.optional()
      ),
    organizationId: yup
      .number()
      .when('$role', (role: any, schema) =>
        role === 'ADMIN' ? schema.required() : schema.optional()
      ),
    additionalDetails: string(),
    jobId: yup.number().required()
  });
  const {
    handleSubmit,
    register,
    control,
    watch,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema),
    context: { role: userRole }
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getEmployeeList,
    hideSuccessToast: true
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.getEmployeeList,
        attributes: {
          photo: imageKey,
          credentials: credentials,
          ...data
        }
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          navigate('/employees')
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  const addCredential = () => {
    setCredentials([
      ...credentials,
      {
        code: '',
        type: 'QR',
        additionalDetails: '',
      },
    ]);
  };

  const removeCredential = (index: number) => {
    if (credentials.length === 1) {
      alert("Kamida bitta hujjat qoldirish kerak!");
      return;
    }
    setCredentials(credentials.filter((_, i) => i !== index));
  };

  const updateCredential = (index: number, field: keyof Credential, value: any) => {
    const updated = [...credentials];
    updated[index] = { ...updated[index], [field]: value };
    setCredentials(updated);
  };


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
        <div className='sm:w-full lg:w-2/3 flex gap-6 justify-between'>
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
                  options={data?.data?.map((evt: any) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  value={field.value as any}  // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={["ADMIN"]}
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
                  allowedRoles={["ADMIN", "HR"]}
                />
              )}
            />
            <Controller
              name="jobId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t("Select position")}
                  options={get(jobData, "items")?.map((evt: any) => ({
                    label: evt[`${i18n?.language}`],
                    value: evt.id,
                  }))}
                  value={field.value as any}  // 👈 cast to any
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={["ADMIN", "HR"]}
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
        {
          credentials?.map((item, index) => (
            <div className='flex items-center gap-4 w-3/4'>
              <div key={index} className='grid grid-cols-3 gap-3 mt-4 w-full'>
                <MySelect
                  label={t("Select type")}
                  options={typeData?.map((evt: any) => ({
                    label: evt.label,
                    value: evt.value,
                  }))}
                  value={item.type}
                  onChange={(val) => updateCredential(index, 'type', ((val as ISelect)?.value ?? val) as Credential['type'])}
                  allowedRoles={["ADMIN", "HR"]}
                />
                <MyInput
                  value={item?.code}
                  onChange={(e) => updateCredential(index, 'code', e.target.value)}
                  label={t('Code')}
                />
                <MyInput
                  value={item?.additionalDetails}
                  onChange={(e) => updateCredential(index, 'additionalDetails', e.target.value)}
                  label={t('Add information')}
                />
              </div>
              <MyButton startIcon={<Trash2 size={DEFAULT_ICON_SIZE} />} type='button' className={'border p-2 mt-10'} onClick={() => removeCredential(index)} />
            </div>
          ))
        }
        <MyButton startIcon={<Plus size={DEFAULT_ICON_SIZE} />} type='button' className={'border p-2 mt-4'} onClick={addCredential} />
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
