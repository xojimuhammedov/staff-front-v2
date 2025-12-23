import { yupResolver } from "@hookform/resolvers/yup";
import { MyCheckbox, MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import deviceType from "configs/deviceType";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { usePostQuery } from "hooks/api";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { object, string, array } from "yup";

const checkType = [
  {
    id: 1,
    label: "Both",
    value: "BOTH"
  },
  {
    id: 2,
    label: "Check in",
    value: "ENTER"
  },
  {
    id: 3,
    label: "Check out",
    value: "EXIT"
  }
]

function FormDevice({ setOpenModal, doorId, refetch }: {
  setOpenModal: (open: boolean) => void;
  doorId: number | string;
  refetch: () => void;
}) {
  const { t } = useTranslation();

  const schema = object().shape({
    name: string().required(t("Name is required")),
    deviceTypes: array()
      .of(string())
      .min(1, t("At least one device type must be selected"))
      .required(t("Device type is required")),
    ipAddress: string().required(t("IP address is required")),
    login: string().required(t("Login is required")),
    password: string().required(t("Password is required")),
    entryType: string().required(t("Entry type is required")),
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
    defaultValues: {
      name: "",
      deviceTypes: [],
      ipAddress: "",
      login: "",
      password: "",
      entryType: "",
    },
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
          refetch()
        },
        onError: (e: any) => {
          console.log(e);
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  const deviceTypeOptions = deviceType?.map((evt: any) => ({
    label: evt.label,
    value: evt.value,
  }));

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(onSubmit)}>
      <MyInput
        {...register('name')}
        error={Boolean(errors?.name?.message)}
        helperText={t(`${errors?.name?.message}`)}
        placeholder={t('Enter device name')}
        label={t('Name')}
      />
      <Controller
        name="deviceTypes"
        control={control}
        render={({ field }) => (
          <MySelect
            isMulti
            label={t("Select type")}
            options={deviceTypeOptions}
            value={deviceTypeOptions.filter((opt) =>
              field.value?.includes(opt.value)
            )}
            onChange={(selectedOptions: any) => {
              const values = selectedOptions
                ? selectedOptions.map((opt: any) => opt.value)
                : [];
              field.onChange(values);
            }}
            placeholder={t("Choose one or more types")}
            error={!!errors.deviceTypes}
            allowedRoles={["ADMIN", "HR"]}
          />
        )}
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
