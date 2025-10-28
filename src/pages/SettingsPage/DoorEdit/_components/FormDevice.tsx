import { yupResolver } from "@hookform/resolvers/yup";
import { MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, usePostQuery } from "hooks/api";
import { get } from "lodash";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import storage from "services/storage";
import { object, string } from "yup";

function FormDevice({ setOpenModal, doorId }: any) {
  const { t } = useTranslation();
  const userDataString: string | null = storage.get("userData");
  const companyId: any = userDataString ? JSON.parse(userDataString) : {};
  const [device, setDevice] = useState<any>();
  const { data: getDeviceType } = useGetAllQuery({
    key: KEYS.getDeviceType,
    url: URLS.getDeviceType,
  });

  const { data: getCheck } = useGetAllQuery({
    key: KEYS.getCheck,
    url: URLS.getCheck,
  });

  const { data: getDeviceModel } = useGetAllQuery({
    key: KEYS.getDeviceModel,
    url: URLS.getDeviceModel,
    params: {},
  });

  const { mutate: create, isLoading: isLoadingPost } = usePostQuery({
    listKeyId: KEYS.createDevice,
    hideSuccessToast: true,
  });

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

  const handleChange = (key: any, value: any) => {
    setDevice((prevState: any) => ({ ...prevState, [key]: value }));
  };

  const onSubmit = (data: any) => {
    const submitData = {
      ...device,
      ...data,
      company: get(companyId, "company.id"),
      door: doorId,
    };
    create(
      {
        url: URLS.createDevice,
        attributes: {
          data: submitData,
        },
      },
      {
        onSuccess: (data: any) => {
          // toast.success(t("Muvaffaqiyatli yaratildi"));
          toast.success(t("Successfully created!"));
          setOpenModal(false);
        },
        onError: (e: any) => {
          console.log(e);
          if (
            e.response.data.error.message === "This attribute must be unique"
          ) {
            // toast.error("Bu ip address oldin ro`yhatdan o`tkazilgan");
            toast.error(t("This IP address has been registered before"));
          } else {
            toast.error(t("The IP address was entered incorrectly!"));
          }
        },
      },
    );
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      action=""
    >
      <MySelect
        options={get(getDeviceType, "data.data")?.map((evt: any) => {
          return {
            label: evt.name,
            value: evt.id,
          };
        })}
        placeholder={t("Choose device type")}
        onChange={(evt: any) => handleChange("deviceType", evt.value)}
        label="Device type"
      />
      <MySelect
        options={get(getDeviceModel, "data.data")?.map((evt: any) => {
          return {
            label: evt.name,
            value: evt.id,
          };
        })}
        placeholder={t("Choose model type")}
        label="Model type"
        onChange={(evt: any) => handleChange("deviceModel", evt.value)}
      />
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
      <MySelect
        options={get(getCheck, "data.data")?.map((evt: any) => {
          return {
            label: evt.name,
            value: evt.id,
          };
        })}
        placeholder={t("Choose using type")}
        onChange={(evt: any) => handleChange("checkType", evt.value)}
        label="Using type"
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
