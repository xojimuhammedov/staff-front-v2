import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import MyModal from 'components/Atoms/MyModal';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { Plus } from 'lucide-react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import FormDeviceModal from './FormDeviceModal';
import { useLocation, useParams } from 'react-router-dom';
import { paramsStrToObj } from 'utils/helper';

function FormDevice({ handleClick }: any) {
  const { t } = useTranslation();
  const [openModal, setOpenModal] = useState<any>(false);
  const location = useLocation();

  const doorId: any = paramsStrToObj(location.search);

  return (
    <>
      <div
        className={
          'mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
        }>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <LabelledCaption
              title={t('Connect device')}
              subtitle={t('Select and pair with device')}
            />
          </div>
          <div className="flex items-center gap-4">
            <MyButton onClick={handleClick} variant="primary">
              {t('Go to next step')}
            </MyButton>
          </div>
        </div>
        <MyDivider />
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption title={t('Choose device')} subtitle={t('Subtitle text')} />
          </div>
          <div className="w-[50%]">
            {/* <div className="ml-3 flex flex-col gap-2">
              {get(data, 'data.data')?.map((evt: any, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <MyCheckbox
                    checked
                    label={
                      evt?.deviceModel
                        ? `${evt?.deviceModel?.brand?.name} ${evt?.deviceModel?.name}`
                        : ''
                    }
                  />
                </div>
              ))}
            </div> */}
            <MyButton onClick={() => setOpenModal(true)} startIcon={<Plus stroke="black" />}>
              {t('Connect device')}
            </MyButton>
          </div>
        </div>
      </div>
      <MyModal
        modalProps={{
          show: Boolean(openModal),
          onClose: () => setOpenModal(false),
          size: 'md'
        }}
        headerProps={{
          children: (
            <h2 className="text-20 leading-32 font-inter tracking-tight text-black">
              {t('Create new permit')}
            </h2>
          )
        }}
        bodyProps={{
          children: <FormDeviceModal setOpenModal={setOpenModal} />,
          className: 'py-[15px]'
        }}
      />
    </>
  );
}

export default FormDevice;
