import { yupResolver } from "@hookform/resolvers/yup";
import { MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { object, string } from "yup";

function FormDevice({ setOpenModal, doorId }: any) {
  const { t } = useTranslation();


  const schema = object().shape({
    ip: string().required(),
    password: string().required(),
    name: string().required(),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    mode: "onChange",
    resolver: yupResolver(schema),
  });


  return (
    <form
      className="flex flex-col gap-4"
      action=""
    >
      <MyInput
        {...register("ip")}
        error={Boolean(errors?.ip?.message)}
        helperText={errors?.ip?.message}
        placeholder={t("Enter ip address")}
        label={t("Ip address")}
      />
      <MyInput
        {...register("password")}
        error={Boolean(errors?.password?.message)}
        helperText={errors?.password?.message}
        placeholder={t("Enter password")}
        label="Password"
      />
      <MyInput
        {...register("name")}
        error={Boolean(errors?.name?.message)}
        helperText={errors?.name?.message}
        placeholder={t("Enter device name")}
        label="Name"
      />
      <div className="flex items-center justify-end gap-4">
        <MyButton variant="primary">{t("Go to schedule")}</MyButton>
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
