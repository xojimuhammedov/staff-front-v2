import React, { FC, ReactElement, useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import MyButton from "../../Atoms/MyButton";
import { useTranslation } from "react-i18next";
import { MyInput } from "../../Atoms/Form";
import { useForm } from "react-hook-form";

interface ConfirmProps {
  icon?: string | ReactElement,
  title: string | ReactElement,
  description?: string | ReactElement,
  onConfirm: (data?: any) => void;
  onCancel: () => void;
}

const Confirm: FC<ConfirmProps> = ({ icon, description, title, onConfirm, onCancel, ...props }) => {
  const { t } = useTranslation();
  return (
    <div>
      <div className={"flex justify-between items-center mb-5"}>
        <div className={"flex items-center"}>
          {icon && <div className={"p-2 rounded-lg bg-orange-400 bg-opacity-40 me-2"}>{icon}</div>}
          <b>{title}</b>
        </div>
        <X className=" text-tag-neutral-text" onClick={onCancel} />
      </div>
      {description && <div className="mb-5">
        <p className="mb-3 text-start text-c-s text-[14px] text-tag-neutral-text">
          {description}
        </p>
      </div>}
      <div className={"flex justify-end"}>
        <MyButton variant={"secondary"} onClick={onCancel} className={"me-3"}>{t("Cancel")}</MyButton>
        <MyButton variant={"primary"} onClick={onConfirm}>{t("Confirm")}</MyButton>
      </div>
    </div>
  );
};

export default Confirm;
