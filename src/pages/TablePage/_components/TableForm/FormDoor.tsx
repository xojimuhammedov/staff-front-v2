import { yupResolver } from '@hookform/resolvers/yup';
import { MySelect } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { object, number } from 'yup';
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import EditEmployeeGroup from '../EditEmployeeGroup';

function FormDoor() {
  const { t } = useTranslation();
  const [departmentId, setDepartmentId] = useState<number | undefined>(undefined);

  const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {},
  });

  const schema = object().shape({
    departmentId: number().required(),
  });

  const { control } = useForm({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema),
  });


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
      <form action="">
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
                  onChange={(val) => {
                    const id = Number((val as ISelect)?.value ?? val);
                    field.onChange(id);
                    setDepartmentId(id);
                  }}
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
        <MyDivider />
        <EditEmployeeGroup 
            departmentId={departmentId}
          />
        {!departmentId && (
          <div className="text-center py-8 text-text-muted dark:text-text-title-dark">
            {t('Please select a department first')}
          </div>
        )}
      </form>
    </div>
  );
}

export default FormDoor;
