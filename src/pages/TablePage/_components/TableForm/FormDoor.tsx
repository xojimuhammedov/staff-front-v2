import { yupResolver } from '@hookform/resolvers/yup';
import { MyInput, MySelect } from 'components/Atoms/Form';
import MyButton from 'components/Atoms/MyButton/MyButton';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery, usePostQuery } from 'hooks/api';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { object, string, number } from 'yup';
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';

function FormDoor() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [organizationId, setOrganizationId] = useState<number[]>([]);

  const { data } = useGetAllQuery<any>({
    key: KEYS.getAllListOrganization,
    url: URLS.getAllListOrganization,
    params: {},
    hideErrorMsg: true,
  });

  const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {},
  });

  const options =
    data?.data?.map((item: any) => ({
      label: item.fullName,
      value: item.id,
    })) || [];

  // value qiymatini options asosida topish
  const value = options.filter((option: any) => organizationId.includes(option.value));

  // onchange hodisasi
  const handleChange = (selected: any) => {
    const ids = selected.map((s: any) => s.value);
    setOrganizationId(ids);
  };

  const schema = object().shape({
    departmentId: number().required(),
  });

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const { mutate: create } = usePostQuery({
    listKeyId: KEYS.getDoorGates,
    hideSuccessToast: true,
  });

  const onSubmit = (data: any) => {
    create(
      {
        url: URLS.getDoorGates,
        attributes: {
          organizationsIds: organizationId,
          ...data,
        },
      },
      {
        onSuccess: (data) => {
          navigate(`/table?current-step=2&doorId=${data?.data?.id}`);
          toast.success(t('Door created successfully!'));
        },
        onError: (e) => {
          console.log(e);
        },
      }
    );
  };

  return (
    <div
      className={
        'mt-12 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t('Door details')}
            subtitle={t('Enter a door name and description')}
          />
        </div>
      </div>
      <MyDivider />
      <form onSubmit={handleSubmit(onSubmit)} action="">
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t('Select department')}
              subtitle={t('Short and easy-to-understand name')}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              name="departmentId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  label={t('Select department')}
                  options={
                    get(getDepartment, 'data')?.map((evt: Department) => ({
                      label: evt.fullName,
                      value: evt.id,
                    })) || []
                  }
                  value={field.value as any}
                  onChange={(val) => field.onChange(Number((val as ISelect)?.value ?? val))}
                  onBlur={field.onBlur}
                  error={!!fieldState.error}
                  allowedRoles={['ADMIN', 'HR']}
                />
              )}
            />
          </div>
        </div>
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption title={t('Department list')} subtitle={t('')} />
          </div>
          <div className="flex items-center w-[50%]">
            <MyTailwindPicker
              useRange={true}
              name="date"
              asSingle={false}
              control={control}
              placeholder={t('Today')}
              startIcon={<Calendar stroke="#9096A1" />}
            />
          </div>
        </div>
        <div className="flex justify-end">
          <MyButton type="submit" variant="primary">
            {t('Create Door')}
          </MyButton>
        </div>
      </form>
    </div>
  );
}

export default FormDoor;
