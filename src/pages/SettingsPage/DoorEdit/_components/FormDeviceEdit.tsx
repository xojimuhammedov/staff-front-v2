import MyButton from "components/Atoms/MyButton/MyButton";
import MyDivider from "components/Atoms/MyDivider";
import MyModal from "components/Atoms/MyModal";
import LabelledCaption from "components/Molecules/LabelledCaption";
import { Edit2, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MyCheckbox } from "components/Atoms/Form";
import { useGetAllQuery, useDeleteQuery, useGetOneQuery } from "hooks/api";
import { useParams } from "react-router-dom";
import { KEYS } from "constants/key";
import { URLS } from "constants/url";
import { get } from "lodash";
import { DEFAULT_ICON_SIZE } from "constants/ui.constants";
import FormDeviceEditModal from "./FormDeviceModal";
import FormDevice from "./FormDevice";

function FormDeviceEdit({ handleClick }: any) {
  const { t } = useTranslation();
  const { id }: any = useParams();
  const [deviceId, setDeviceId] = useState<any>();
  const [openModal, setOpenModal] = useState<any>(false);
  const [openEditModal, setOpenEditModal] = useState<any>(false);
  // const [deviceData, setDeviceData] = useState();

  const { data } = useGetAllQuery({
    key: KEYS.getByIdDeviceDoors,
    url: URLS.getByIdDeviceDoors,
    params: {
      populate: "deviceModel, deviceModel.brand, deviceType, checkType",
      filter: {
        door: {
          id: id,
        },
      },
    },
  });

  const { data: deviceData } = useGetOneQuery({
    id: deviceId,
    url: URLS.getByIdDeviceDoors,
    params: {
      params: {
        populate: "deviceModel, deviceModel.brand, deviceType, checkType",
      },
    },
    enabled: !!deviceId,
  });

  console.log(deviceData);

  // useEffect(() => {
  //   if (data && deviceId) {
  //     const foundDeviceData = get(data, "data.data")?.find(
  //       (evt: any) => evt?.id === Number(deviceId),
  //     );
  //     setDeviceData(foundDeviceData);
  //   }
  // }, [data, deviceId]);

  const { mutate: deleteRequest } = useDeleteQuery({
    listKeyId: KEYS.getByIdDeviceDoors,
  });

  const deleteItem = (id: any) => {
    deleteRequest({
      url: `${URLS.getByIdDeviceDoors}/${id}`,
    });
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
            <div className="ml-3 flex flex-col gap-2">
              {get(data, "data.data")?.map((evt: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <MyCheckbox
                    checked
                    label={
                      evt?.deviceModel
                        ? `${evt?.deviceModel?.brand?.name} ${evt?.deviceModel?.name}`
                        : ""
                    }
                  />
                  <div className="flex items-center ">
                    <MyButton
                      onClick={() => {
                        setDeviceId(evt?.id);
                        setOpenEditModal(true);
                      }}
                    >
                      <Edit2 size={DEFAULT_ICON_SIZE} />
                    </MyButton>
                    <MyButton onClick={() => deleteItem(evt?.id)}>
                      <Trash2 size={DEFAULT_ICON_SIZE} />
                    </MyButton>
                  </div>
                </div>
              ))}
            </div>
            <MyButton
              onClick={() => setOpenModal(true)}
              startIcon={<Plus stroke="black" />}
            >
              {t("Connect device")}
            </MyButton>
          </div>
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
              {t("Create new permit")}
            </h2>
          ),
        }}
        bodyProps={{
          children: <FormDevice doorId={id} setOpenModal={setOpenModal} />,
          className: "py-[10px]",
        }}
      />
      <MyModal
        modalProps={{
          show: Boolean(openEditModal),
          onClose: () => setOpenEditModal(false),
          size: "md",
        }}
        headerProps={{
          children: (
            <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
              {t("Create new permit")}
            </h2>
          ),
        }}
        bodyProps={{
          children: (
            <FormDeviceEditModal
              onClose={() => setOpenEditModal(false)}
              doorId={id}
              deviceId={deviceId}
              deviceData={get(deviceData, "data.data")}
            />
          ),
          className: "py-[10px]",
        }}
      />
    </>
  );
}

export default FormDeviceEdit;
