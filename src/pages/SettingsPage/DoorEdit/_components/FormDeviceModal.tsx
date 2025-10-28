import { MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, usePutQuery } from "hooks/api";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import storage from "services/storage";

function FormDeviceEditModal({ deviceData, deviceId, doorId, onClose }: any) {
  const { t } = useTranslation();
  const [device, setDevice] = useState<any>(null);
  const userDataString: string | null = storage.get("userData");
  const companyId: any = userDataString ? JSON.parse(userDataString) : {};
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

  const { mutate: create } = usePutQuery({
    listKeyId: KEYS.getByIdDeviceDoors,
    hideSuccessToast: true,
  });
  const handleChange = (key: any, value: any) => {
    setDevice((prevState: any) => ({ ...prevState, [key]: value }));
  };

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        ip: get(deviceData, "ip"),
        name: get(deviceData, "name"),
        password: get(deviceData, "password"),
      };
    }, [deviceData]),
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      ip: get(deviceData, "ip"),
      name: get(deviceData, "name"),
      password: get(deviceData, "password"),
    });
  }, [deviceData]);

  const onSubmit = (object: any) => {
    const submitData = {
      ...deviceData,
      ...device,
      ...object,
      door: doorId,
    };
    create(
      {
        url: `${URLS.getByIdDeviceDoors}/${deviceId}`,
        attributes: {
          data: submitData,
        },
      },
      {
        onSuccess: (data) => {
          onClose();
          // toast.success(t("Muvaffaqiyatli tahrirlandi!"));
          toast.success(t("Successfully edited!"));
        },
        onError: (e) => {
          console.log(e);
          toast.error(t("An error occurred!"));
        },
      },
    );
  };

  return (
    <>
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
          placeholder={"Choose device type"}
          value={device?.deviceType ?? get(deviceData, "deviceType.id")}
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
          value={device?.deviceModel ?? get(deviceData, "deviceModel.id")}
          onChange={(evt: any) => handleChange("deviceModel", evt.value)}
        />
        <MyInput
          {...register("ip")}
          error={Boolean(errors?.ip?.message)}
          placeholder={t("Enter ip address")}
          label={t("Ip address")}
        />
        <MyInput
          {...register("password")}
          error={Boolean(errors?.password?.message)}
          placeholder={t("Enter password")}
          label="Password"
        />
        <MyInput
          {...register("name")}
          error={Boolean(errors?.name?.message)}
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
          value={device?.checkType ?? get(deviceData, "checkType.id")}
          label="Using type"
          onChange={(evt: any) => handleChange("checkType", evt.value)}
        />
        <div className="flex items-center justify-end gap-4">
          <MyButton type="submit" variant="primary">
            {t("Edit device")}
          </MyButton>
          <MyButton
            onClick={onClose}
            className={"w-[98px]"}
            variant="secondary"
          >
            {t("Close")}
          </MyButton>
        </div>
      </form>
    </>
  );
}

export default FormDeviceEditModal;
