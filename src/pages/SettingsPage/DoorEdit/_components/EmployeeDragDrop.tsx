import { MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, useGetOneQuery } from 'hooks/api';
import { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import FinalEmployee from './FinalEmployee';
import LeftEmployee from './LeftEmployee';

function EmployeeDragDrop({ gateId }: any) {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [tempSelectedIds, setTempSelectedIds] = useState<number[]>([]);
  const [selectDevices, setSelectDevices] = useState<number[]>([]);
  const [statusRefetch, setStatusRefetch] = useState('');

  const { data: doorData } = useGetOneQuery({
    id,
    url: URLS.getDoorGates,
    enabled: !!id,
  });

  const { data: deviceData } = useGetAllQuery<any>({
    key: KEYS.getDoorForDevices,
    url: URLS.getDoorForDevices,
    params: {},
  });

  //Devices multi select uchun
  useEffect(() => {
    if (doorData?.data?.devices) {
      const savedGateIds = doorData?.data?.devices
        ? doorData?.data?.devices.map((g: any) => g.id)
        : doorData?.data?.devices || [];

      setSelectDevices(savedGateIds);
    }
  }, [doorData?.data?.devices]);

  const options = useMemo(
    () =>
      deviceData?.data?.map((item: any) => ({
        label: item.name,
        value: item.id,
      })) || [],
    [deviceData?.data]
  );

  const selectedValues = useMemo(
    () => options.filter((option: any) => selectDevices.includes(option.value)),
    [options, selectDevices]
  );

  return (
    <>
      <div className="w-full rounded-md bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme">
        <div className="flex items-center justify-between">
          <LabelledCaption
            title={gateId ? t('Edit employees') : t('Add employees')}
            subtitle={t('Create group and link to door')}
          />

          <MyButton
            onClick={() => navigate('/settings?current-setting=doors')}
            variant="primary"
            type="submit"
          >
            Save changes
          </MyButton>
        </div>

        <MyDivider />

        <div className="flex items-center my-4 justify-between">
          <LabelledCaption title={t('Select devices')} subtitle={t('')} />
          <div className="w-1/2">
            <MySelect
              isMulti
              options={options}
              value={selectedValues} // Bu yerda to'g'ri tanlanganlar ko'rinadi
              onChange={(selected: any) => {
                const ids = selected ? selected.map((s: any) => s.value) : [];
                setSelectDevices(ids);
              }}
              allowedRoles={['ADMIN']}
            />
          </div>
        </div>

        <MyDivider />

        <div className="mt-6 flex flex-col lg:flex-row gap-6">
          {/* Left Panel */}
          <LeftEmployee
            tempSelectedIds={tempSelectedIds}
            setTempSelectedIds={setTempSelectedIds}
            selectDevices={selectDevices}
            statusRefetch={statusRefetch}
            setStatusRefetch={setStatusRefetch}
          />
          {/* RIGHT PANEL */}
          <FinalEmployee
            statusRefetch={statusRefetch}
            setStatusRefetch={setStatusRefetch}
            setTempSelectedIds={setTempSelectedIds}
            selectDevices={selectDevices}
          />
        </div>
      </div>
    </>
  );
}

export default EmployeeDragDrop;
