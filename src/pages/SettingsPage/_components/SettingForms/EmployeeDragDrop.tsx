import { MyCheckbox, MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { get } from 'lodash';
import { Search, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AvatarIcon from 'assets/icons/avatar.png'
import MyAvatar from 'components/Atoms/MyAvatar';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

interface EmployeeResponse {
  data: Employee[];
  limit: number;
  page: number;
  total: number;
}

interface Employee {
  id: number;
  name: string;
  additionalDetails: string;
  avatar: string;
}

function EmployeeDragDrop() {
  const { t } = useTranslation();
  const navigate = useNavigate()
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectGates, setSelectGates] = useState<number[]>([]);
  const [finalSelectedIds, setFinalSelectedIds] = useState<number[]>([]); // yakuniy tanlanganlar
  const { data } = useGetAllQuery<EmployeeResponse>({
    key: KEYS.getEmployeeList,
    url: URLS.getEmployeeList,
    params: {}
  });

  const { data: getDoor }: any = useGetAllQuery({
    key: KEYS.getDoorGates,
    url: URLS.getDoorGates,
    params: {}
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.devicesEmployeeAssign,
    hideSuccessToast: true
  });

  const { handleSubmit } = useForm()

  const handleSelectAll = () => {
    if (selectedIds.length === (data?.data?.length ?? 0)) {
      setSelectedIds([]);
    } else {
      const ids = data?.data?.map((emp) => emp.id) ?? [];
      setSelectedIds(ids);
    }
  };

  const handleCheckboxChange = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    );
  };

  const handleAddSelected = () => {
    setFinalSelectedIds((prev) => {
      // yangi tanlangan id’larni eski listga qo‘shib, dublikatlarsiz qaytaradi
      const merged = Array.from(new Set([...prev, ...selectedIds]));
      return merged;
    });
    setSelectedIds([]); // vaqtinchalik tanlovni tozalasa ham bo‘ladi (agar xohlasang)
  };

  const handleRemoveFinal = (id: number) => {
    setFinalSelectedIds((prev) => prev.filter((empId) => empId !== id));
  };

  const finalEmployees =
    data?.data?.filter((emp) => finalSelectedIds.includes(emp.id)) ?? [];

  const options =
    getDoor?.data?.map((item: any) => ({
      label: item.name,
      value: item.id,
    })) || [];

  // value qiymatini options asosida topish
  const value = options.filter((option: any) =>
    selectGates.includes(option.value)
  );

  // onchange hodisasi
  const handleChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value);
    setSelectGates(ids);
  };


  const onSubmit = () => {
    const submitData = {
      employeeIds: selectedIds,
      gateIds: selectGates
    }
    create(
      {
        url: URLS.devicesEmployeeAssign,
        attributes: submitData
      },
      {
        onSuccess: () => {
          toast.success(t('Successfully created!'));
          navigate('/settings')
        },
        onError: (e: any) => {
          toast.error(e?.response?.data?.error?.message)
        }
      }
    );
  };

  return (
    <div
      className={
        'mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
      }>
      <div className="mb-12 flex w-full items-start justify-between">
        <LabelledCaption
          className="flex-1"
          title={t('Gates')}
          subtitle={t('')}
        />
        <div className='w-[462px]'>
          <MySelect
            label={t("Foydali saytlar")}
            isMulti
            options={options}
            value={value}
            onChange={handleChange}
          />
        </div>
      </div>
      <MyDivider />
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t('Add employees')}
            subtitle={t('Create employees group and link to the door')}
          />
        </div>
      </div>

      <MyDivider />
      <div className="mt-6 flex w-full gap-4">
        <div className="h-[600px] w-1/2 overflow-y-auto rounded-md border-2 border-solid border-gray-300 bg-gray-100 p-4 dark:border-dark-line dark:bg-bg-dark-theme">
          <div>
            <MyInput
              startIcon={<Search className="stroke-text-muted" />}
              placeholder={t('Search')}
            />
          </div>
          <div className="mt-4 flex w-full flex-col gap-4">
            <div className="flex items-center justify-between sm:mx-1 lg:mx-4">
              <MyCheckbox
                label={t('Employees')}
                checked={selectedIds?.length === data?.data?.length}
                onChange={handleSelectAll}
                id={(Math.random() * 10).toString()}
              />
              <MyButton
                onClick={handleAddSelected}
                disabled={selectedIds.length > 0 ? false : true}
                className={'font-medium sm:px-[2px] sm:text-xs lg:px-2 lg:text-sm'}
                variant="secondary">
                {t('Add selected employees')}
              </MyButton>
            </div>
            <div className="flex flex-col gap-3">
              {get(data, 'data')?.map((emp: Employee) => (
                <div
                  key={emp?.id}
                  className="flex items-center p-4 border rounded-sm bg-white hover:bg-gray-50 transition"
                >
                  <MyCheckbox
                    className="w-4 h-4 accent-black mr-3"
                    checked={selectedIds.includes(emp?.id)}
                    onChange={() => handleCheckboxChange(emp?.id)}
                    label={emp?.name}
                    id={emp?.id.toString()}
                  />
                  {/* <img
                    src={emp.avatar}
                    alt={emp.name}
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  /> */}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex h-[600px] w-1/2 flex-col gap-3 overflow-y-auto rounded-md border-2 border-solid border-gray-300 dark:border-dark-line">
          <h3 className='bg-gray-100 p-4 text-[#030712]'>{t("Selected employees")}</h3>
          {finalEmployees?.map((evt: Employee) => (
            <div className="flex w-full items-center justify-between border-b-2 bg-white p-4 dark:border-dark-line">
              <div className="flex items-center gap-3" key={evt?.id}>
                <MyAvatar
                  imageUrl={evt.avatar ?? AvatarIcon}
                  size="medium"
                />
                <h2 className="text-sm font-normal text-black">
                  {evt?.name}
                </h2>
              </div>
              <div
                onClick={() => handleRemoveFinal(evt.id)}
                className="cursor-pointer">
                <Trash2 color="#9CA3AF" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='flex justify-end mt-4'>
        <MyButton onClick={handleSubmit(onSubmit)} type="submit" variant="secondary">
          {t('Save changes')}
        </MyButton>
      </div>
    </div>
  );
}

export default EmployeeDragDrop;
