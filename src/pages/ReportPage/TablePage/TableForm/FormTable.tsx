import { yupResolver } from '@hookform/resolvers/yup';
import { MySelect } from 'components/Atoms/Form';
import MyDivider from 'components/Atoms/MyDivider';
import LabelledCaption from 'components/Molecules/LabelledCaption';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useGetAllQuery } from 'hooks/api';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { object, number } from 'yup';
import { get } from 'lodash';
import { ISelect } from 'interfaces/select.interface';
import { Department } from 'pages/DepartmentsPage/interface/department.interface';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import EditEmployeeGroup from '../_components/EditEmployeeGroup';
import MyButton from 'components/Atoms/MyButton/MyButton';
import { useCallback, useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';

type FormValues = {
  departmentId: number;
  date?: {
    startDate?: string | Date;
    endDate?: string | Date;
  };
};

type DraftParams = {
  startDate?: string;
  endDate?: string;
  employeeIds: number[];
};

function normalizeDate(d?: string | Date) {
  if (!d) return undefined;
  const parsed = dayjs(d);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : undefined;
}

function FormTable() {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [draftParams, setDraftParams] = useState<DraftParams>({
    employeeIds: [],
  });

  const { data: getDepartment } = useGetAllQuery<{ data: Department[] }>({
    key: KEYS.getAllListDepartment,
    url: URLS.getAllListDepartment,
    params: {
      limit: 100
    },
  });

  const schema = useMemo(
    () =>
      object().shape({
        departmentId: number().required(),
      }),
    []
  );

  const { control, watch } = useForm<FormValues>({
    defaultValues: {},
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  const date = useWatch({ control, name: "date" });

  useEffect(() => {
    const startDate = normalizeDate(date?.startDate);
    const endDate = normalizeDate(date?.endDate);

    setDraftParams((prev) => ({
      ...prev,
      startDate,
      endDate,
    }));
  }, [date?.startDate, date?.endDate]);

  // ✅ EmployeeGroup’dan kelgan ids larni draftga yozish
  const handleEmployeesSelected = useCallback((ids: number[]) => {
    setDraftParams((prev) => {
      if (prev.employeeIds.length === ids.length &&
        prev.employeeIds.every((v, i) => v === ids[i])) {
        return prev;
      }
      return { ...prev, employeeIds: ids };
    });
  }, []);

  const handleSaveClick = () => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);

      next.set("current-step", "2");

      if (draftParams.startDate) next.set("startDate", draftParams.startDate);
      else next.delete("startDate");

      if (draftParams.endDate) next.set("endDate", draftParams.endDate);
      else next.delete("endDate");

      // ✅ bracketsiz
      next.delete("employeeIds");
      draftParams.employeeIds.forEach((id) => {
        next.append("employeeIds", String(id));
      });

      next.delete("employeeIds[]");

      return next;
    }, { replace: true });
  };


  return (
    <div
      className={
        'mt-4 min-h-[400px] w-full rounded-m bg-bg-base p-4 shadow-base dark:bg-bg-dark-theme'
      }
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <LabelledCaption
            title={t('Table details')}
            subtitle={t('')}
          />
        </div>
        <MyButton onClick={handleSaveClick} variant="primary">
          {t('Save changes')}
        </MyButton>
      </div>
      <MyDivider />
      <form action="">
        <div className="my-10 flex">
          <div className="w-[50%]">
            <LabelledCaption
              title={t('Select department')}
              subtitle={t('')}
            />
          </div>
          <div className="w-[50%]">
            <Controller
              name="departmentId"
              control={control}
              render={({ field, fieldState }) => (
                <MySelect
                  placeholder={t('Select department')}
                  options={
                    get(getDepartment, 'data')?.map((evt: Department) => ({
                      label: evt.fullName,
                      value: evt.id,
                    })) || []
                  }
                  value={field.value as any}
                  onChange={(val) => {
                    const id = Number((val as ISelect)?.value ?? val); field.onChange(id);
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
        <EditEmployeeGroup onSelectedIdsChange={handleEmployeesSelected} departmentId={watch("departmentId")} />
      </form>
    </div>
  );
}

export default FormTable;
