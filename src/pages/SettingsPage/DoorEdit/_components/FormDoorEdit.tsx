import { yupResolver } from "@hookform/resolvers/yup";
import { MyInput, MyTextarea } from "components/Atoms/Form";
import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { useGetAllQuery, usePutQuery } from "hooks/api";
import { get } from "lodash";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { object, string } from "yup";

function FormDoorEdit({ handleClick }: any) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();

  const { data, isLoading }: any = useGetAllQuery({
    url: `${URLS.getByIdDoors}/${id}`,
    key: KEYS.getByIdDoors,
    params: {},
  });

  const {
    handleSubmit,
    reset,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: useMemo(() => {
      return {
        name: get(data, "data.data.name"),
        description: get(data, "data.data.description"),
      };
    }, [data]),
    mode: "onChange",
  });

  useEffect(() => {
    reset({
      name: get(data, "data.data.name"),
      description: get(data, "data.data.description"),
    });
  }, [data]);

  const { mutate: create } = usePutQuery({
    listKeyId: KEYS.getByIdDoors,
    hideSuccessToast: true,
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: `${URLS.getByIdDoors}/${id}`,
        attributes: {
          data: data,
        },
      },
      {
        onSuccess: (data) => {
          // toast.success(t('Door muvaffaqiyatli tahrirlandi!'));
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
              {...register("name")}
              error={Boolean(errors?.name?.message)}
              placeholder={t("Enter door name")}
            />
          </div>
        </div>
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t("Door description")}
              subtitle={t("Short and easy-to-understand name")}
            />
          </div>
          <div className="w-[50%]">
            <MyTextarea
              {...register("description")}
              error={Boolean(errors?.description?.message)}
              className="min-h-[180px]"
              placeholder={t("Enter door description")}
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
