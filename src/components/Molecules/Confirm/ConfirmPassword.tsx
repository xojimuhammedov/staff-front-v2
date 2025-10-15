import React, { FC, useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import MyButton from "../../Atoms/MyButton";
import { useTranslation } from "react-i18next";
import { MyInput } from "../../Atoms/Form";
import { useForm } from "react-hook-form";

interface ConfirmPasswordProps {
  onConfirm: (data: any) => void;
  onCancel: () => void;
}

const ConfirmPassword: FC<ConfirmPasswordProps> = ({ onConfirm, onCancel, ...props }) => {
  const { t } = useTranslation();
  const { handleSubmit, register } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form action="" onSubmit={handleSubmit(onConfirm)}>
      <div className={"flex justify-between items-center mb-5"}>
        <div className={"flex items-center"}>
          <div className={"p-2 rounded-lg bg-orange-400 bg-opacity-40 me-2"}><Lock /></div>
          <b>{t("Confirm password")}</b>
        </div>
        <X className=" text-tag-neutral-text" onClick={onCancel} />
      </div>
      <div className="mb-5">
        <p className="mb-3 text-start text-c-s text-[14px] text-tag-neutral-text">
          {t("Enter password to confirm current action.")}
        </p>
        <div className={"p-[1px] mb-5"}>
          <MyInput
            {...register("password", { required: true })}
            placeholder={t("Enter password")}
            type={showPassword ? 'text': 'password'}
            endIcon={<div className={'cursor-pointer text-gray-400'} onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</div>}
          />
        </div>
      </div>
      <div className={"flex justify-end"}>
        <MyButton variant={"secondary"} onClick={onCancel} className={"me-3"}>{t("Cancel")}</MyButton>
        <MyButton variant={"primary"} type={"submit"}>{t("Confirm")}</MyButton>
      </div>
    </form>
  );
};

export default ConfirmPassword;
