import { MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, useGetOneQuery, usePutQuery } from "hooks/api";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface FormValues {
  name: string;
  organizationIds: number[];
}

function FormDoorEdit({ handleClick }: any) {
  const { t } = useTranslation();
  const { id } = useParams();

  const { data: doorData } = useGetOneQuery({
    id,
    url: URLS.getDoorGates,
    params: {},
    enabled: !!id,
  });

  const { data: organizationsData } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    hideErrorMsg: true,
    params: {},
  });

  const organizationOptions = useMemo(
    () =>
      organizationsData?.data?.map((item: any) => ({
        label: item.fullName,
        value: item.id,
      })) || [],
    [organizationsData?.data]
  );

  const defaultOrganizationIds = useMemo(() => {
    return (
      doorData?.data?.organizations?.map((org: any) => org.id) || []
    );
  }, [doorData?.data?.organizations]);

  const {
    handleSubmit,
    register,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: doorData?.data?.name || "",
      organizationIds: defaultOrganizationIds,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (doorData?.data) {
      reset({
        name: doorData.data.name || "",
        organizationIds: defaultOrganizationIds,
      });
    }
  }, [doorData?.data, defaultOrganizationIds, reset]);

  const { mutate: updateDoor } = usePutQuery({
    listKeyId: KEYS.getDoorGates,
    hideSuccessToast: true,
  });

  const onSubmit = (values: FormValues) => {
    const payload = {
      name: values.name,
      organizationIds: values.organizationIds,
    };

    updateDoor(
      {
        url: `${URLS.getDoorGates}/${id}`,
        attributes: payload,
      },
      {
        onSuccess: () => {
          toast.success(t("Door successfully edited!"));
          handleClick?.();
        },
        onError: (error) => {
          console.error("Update error:", error);
        },
      }
    );
  };


  return (
    <div
      className={
        "mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme"
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t("Door details")}
            subtitle={t("Enter a door name and description")}
          />
        </div>
        <div className="flex items-center gap-4">
          <MyButton onClick={handleClick} variant="primary">
            {t("Go to next step")}
          </MyButton>
        </div>
      </div>
      <MyDivider />
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t("Door name")}
              subtitle={t("Short and easy-to-understand name")}
            />
          </div>
          <div className="w-[50%]">
            <MyInput
              placeholder={t("Enter door name")}
              {...register('name')}
              error={Boolean(errors?.name?.message)}
              helperText={t(`${errors?.name?.message}`)}
            />
          </div>
        </div>
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t('Organization')}
              subtitle={t('')}
            />
          </div>

          <div className="w-1/2">
            <Controller
              name="organizationIds"
              control={control}
              rules={{ required: t("At least one organization must be selected") }}
              render={({ field }) => (
                <MySelect
                  isMulti={true}
                  options={organizationOptions}
                  value={organizationOptions.filter((opt: any) =>
                    field.value?.includes(opt.value)
                  )}
                  onChange={(selectedOptions: any) => {
                    const values = selectedOptions
                      ? selectedOptions?.map((opt: any) => opt.value)
                      : [];
                    field.onChange(values);
                  }}
                  allowedRoles={["ADMIN"]}
                  placeholder={t("Select organizations")}
                />
              )}
            />
          </div>

        </div>
        <div className="flex justify-end">
          <MyButton type="submit" variant="primary">
            {t("Save changes")}
          </MyButton>
        </div>
      </form>
    </div>
  );
}

export default FormDoorEdit;
