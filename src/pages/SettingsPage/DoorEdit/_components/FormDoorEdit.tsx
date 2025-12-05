import { MyInput, MySelect } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, useGetOneQuery, usePutQuery } from "hooks/api";
import { ISelect } from "interfaces/select.interface";
import { get } from "lodash";
import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

function FormDoorEdit({ handleClick }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data } = useGetOneQuery({
    id: id,
    url: URLS.getDoorGates,
    params: {},
    enabled: !!id
  })

  const { data: getOrganization } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    hideErrorMsg: true,
    params: {},
  })

  const {
    handleSubmit,
    register,
    reset,
    control,
    formState: { errors }
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(data, 'data.name'),
        organizationId: get(data, 'data.organizationId')
      };
    }, [data]),
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      name: get(data, 'data.name'),
      organizationId: get(data, 'data.organizationId')
    });
  }, [data]);

  const { mutate: create } = usePutQuery({
    listKeyId: KEYS.getDoorGates,
    hideSuccessToast: true,
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: `${URLS.getDoorGates}/${id}`,
        attributes: data
      },
      {
        onSuccess: () => {
          toast.success(t("Door successfully edited!"));
        },
        onError: (e) => {
          console.log(e);
        },
      },
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
          <div className="w-[50%]">
            <Controller
              name="organizationId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  options={getOrganization?.data?.map((evt: any) => ({
                    label: evt.fullName,
                    value: evt.id,
                  }))}
                  value={field.value as any}
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={["ADMIN"]}
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
