import React, { FC } from "react";
import { Lock, X } from "lucide-react";
import { MyInput } from "../../Atoms/Form";
import MyButton from "../../Atoms/MyButton";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { CheckboxListItemType } from "../CheckboxList/CheckboxList";


interface AddItemProps {
  onAdd: (data: CheckboxListItemType) => void;
  onCancel: () => void;
}

const AddItem: FC<AddItemProps> = ({ onAdd, onCancel }) => {
  const { t } = useTranslation();
  const { handleSubmit, register } = useForm({
    defaultValues: {
      checked: false,
      label: ""
    }
  });
  return <form action="" onSubmit={handleSubmit(onAdd)}>
    <div className="mb-5">
      <div className={"p-[1px] mb-5"}>
        <MyInput
          {...register("label", { required: true })}
          type={"text"}
        />
      </div>
    </div>
    <div className={"flex justify-end"}>
      <MyButton variant={"secondary"} onClick={onCancel} className={"me-3"}>{t("Cancel")}</MyButton>
      <MyButton variant={"primary"} type={"submit"}>{t("Add")}</MyButton>
    </div>
  </form>;
};

export default AddItem;
