import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import MyModal from "components/Atoms/MyModal";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import FormDevice from "./FormDevice";
import { useGetAllQuery, usePostQuery } from "hooks/api";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { get } from "lodash";
import { MyCheckbox, MySelect } from "components/Atoms/Form";
import { toast } from "react-toastify";

function FormDeviceEdit({ handleClick }: any) {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const [openModal, setOpenModal] = useState<any>(false);
  const [deviceId, setDeviceId] = useState<number[]>([])

  const { data, refetch }: any = useGetAllQuery({
    key: KEYS.getGatesByIdDevices,
    url: `${URLS.getGatesByIdDevices}/${id}/devices`,
    params: {
      gateId: id
    }
  });

  const { data: deviceData } = useGetAllQuery<any>({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {
      isConnected: false
    }
  });

  const options =
    deviceData?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [];

  // value qiymatini options asosida topish
  const value = options.filter((option: any) =>
    deviceId.includes(option.value)
  );

  const handleChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value);
    setDeviceId(ids);
  };

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.doorDevice,
    hideSuccessToast: true
  });

  const handleSubmit = () => {
    create(
      {
        url: URLS.doorDevice,
        attributes: {
          gateId: Number(id),
          deviceIds: deviceId
        }
      },
      {
        onSuccess: () => {
          toast.success(t('Device created successfully!'));
          refetch()
        },
        onError: (e: any) => {
          console.log(e);
        }
      }
    );
  };


  return (
    <>
      <div
        className={
          "mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme"
        }
      >
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <LabelledCaption
              title={t("Connect device")}
              subtitle={t("Select and pair with device")}
            />
          </div>
          <div className="flex items-center gap-4">
            <MyButton onClick={handleClick} variant="primary">
              {t("Go to next step")}
            </MyButton>
          </div>
        </div>
        <MyDivider />


        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t("Choose device")}
              subtitle={t("Subtitle text")}
            />
          </div>
          <div className="w-[50%]">
            <div className="mb-4">
              <MySelect
                isMulti
                options={options}
                value={value}
                onChange={handleChange}
                allowedRoles={["ADMIN"]}
              />
            </div>
            <div className="ml-3 flex flex-col gap-2">
              {get(data, "devices")?.map((evt: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <MyCheckbox
                    checked
                    label={evt?.name}
                  />
                </div>
              ))}
            </div>
            <MyButton
              onClick={() => setOpenModal(true)}
              startIcon={<Plus stroke="black" />}>
              {t("Connect device")}
            </MyButton>
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <MyButton variant="primary" onClick={handleSubmit} type="submit">
            Save changes
          </MyButton>
        </div>
      </div>
      <MyModal
        modalProps={{
          show: Boolean(openModal),
          onClose: () => setOpenModal(false),
          size: "md",
        }}
        headerProps={{
          children: (
            <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
              {t("Create new device")}
            </h2>
          ),
        }}
        bodyProps={{
          children: <FormDevice doorId={id} setOpenModal={setOpenModal} refetch={refetch} />,
          className: "py-[10px]",
        }}
      />
    </>
  );
}

export default FormDeviceEdit;
