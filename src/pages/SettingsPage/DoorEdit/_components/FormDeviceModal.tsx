import { MyInput } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import {  usePutQuery } from "hooks/api";
import { get } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

function FormDeviceEditModal({ deviceData, deviceId, doorId, onClose }: any) {
  const { t } = useTranslation();

  const { mutate: create } = usePutQuery({
    listKeyId: KEYS.getDoorForDevices,
    hideSuccessToast: true,
  });
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
      ...object,
      door: doorId,
    };
    create(
      {
        url: `${URLS.getDoorForDevices}/${deviceId}`,
        attributes: {
          data: submitData,
        },
      },
      {
        onSuccess: () => {
          onClose();
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
