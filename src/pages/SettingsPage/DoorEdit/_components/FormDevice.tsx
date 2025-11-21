import { yupResolver } from "@hookform/resolvers/yup";
import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { usePostQuery } from "hooks/api";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { object, string } from "yup";

const checkType = [
  {
    id: 1,
    label: "Both",
    value: "BOTH"
  },
  {
    id: 2,
    label: "Check in",
    value: "ENTRY"
  },
  {
    id: 3,
    label: "Check out",
    value: "EXIT"
  }
]

function FormDevice({ setOpenModal, doorId }: any) {
  const { t } = useTranslation();

  const schema = object().shape({
    ipAddress: string().required(),
    password: string().required(),
    name: string().required(),
    login: string().required(),
    entryType: string().required()
    
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getDoorForDevices,
    hideSuccessToast: true
  });

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema)
  });

  const onSubmit = (data: any) => {
    const submitData = {
      gateId: Number(doorId),
      ...data
    }
    create(
      {
        url: URLS.getDoorForDevices,
        attributes: submitData
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          setOpenModal(false);
          reset();
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
          // if (e.response.data.error.message === 'This attribute must be unique') {
          //   // toast.error('Bu ip address oldin ro`yhatdan o`tkazilgan');
          //   toast.error(t('This IP address has been registered before'));
          // } else {
          //   toast.error(t("The IP address was entered incorrectly!"));
          // }
        }
      }
    );
  };


  return (
    <form
      className="flex flex-col gap-4"
      action=""
      onSubmit={handleSubmit(onSubmit)}>
      <MyInput
        {...register('name')}
        error={Boolean(errors?.name?.message)}
        helperText={t(`${errors?.name?.message}`)}
        placeholder={t('Enter device name')}
        label={t('Name')}
      />
      <MyInput
        {...register('ipAddress')}
        error={Boolean(errors?.ipAddress?.message)}
        helperText={t(`${errors?.ipAddress?.message}`)}
        placeholder={t('Enter ip address')}
        label={t('Ip address')}
      />
      <MyInput
        {...register('login')}
        error={Boolean(errors?.login?.message)}
        helperText={t(`${errors?.login?.message}`)}
        placeholder={t('Enter device login')}
        label={t('Login')}
      />
      <MyInput
        {...register('password')}
        error={Boolean(errors?.password?.message)}
        helperText={t(`${errors?.password?.message}`)}
        placeholder={t('Enter password')}
        label={t('Password')}
      />
      <Controller
        name="entryType"
        control={control}
        defaultValue=""
        render={({ field }) => (
          <div className='flex items-center justify-between'>
            {checkType?.map((evt: any, index: number) => {
              const isChecked = field.value === evt.value;
              return (
                <MyCheckbox
                  key={index}
                  label={evt.label}
                  id={`${evt.id + 20}`}
                  checked={isChecked}
                  onChange={() => field.onChange(evt.value)}
                />
              );
            })}
          </div>
        )}
      />
      <div className="flex items-center justify-end gap-4">
        <MyButton variant="primary">{t("Create")}</MyButton>
        <MyButton
          onClick={() => setOpenModal(false)}
          className={"w-[98px]"}
          variant="secondary"
        >
          {t("Close")}
        </MyButton>
      </div>
    </form>
  );
}

export default FormDevice;
