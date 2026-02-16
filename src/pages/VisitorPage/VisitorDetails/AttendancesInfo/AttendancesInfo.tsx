import MyDivider from 'components/Atoms/MyDivider';
import ArrivalDepartureTimeline from './_components/ArrivalDepartureTimeline';
import { useGetAllQuery } from 'hooks/api';
import { KEYS } from 'constants/key';
import { URLS } from 'constants/url';
import { useParams } from 'react-router-dom';
import MyTailwindPicker from 'components/Atoms/Form/MyTailwindDatePicker';
import { Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import dayjs from 'dayjs';

const AttendancesInfo = () => {
  const { t } = useTranslation();
  const { control, watch } = useForm({
    defaultValues: {
      date: {
        endDate: dayjs().format('YYYY-MM-DD'),
        startDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
      },
    },
  });
  const { id } = useParams();

  const paramsValue = watch('date')
    ? {
        startDate: dayjs(watch('date')?.startDate)?.format('YYYY-MM-DD'),
        endDate: dayjs(watch('date')?.endDate)?.format('YYYY-MM-DD'),
      }
    : {
        endDate: dayjs().format('YYYY-MM-DD'),
        startDate: dayjs().subtract(3, 'day').format('YYYY-MM-DD'),
      };
  const { data } = useGetAllQuery({
    key: KEYS.actionAttendancesList,
    url: URLS.actionAttendancesList,
    params: {
      visitorId: id,
      ...paramsValue,
    },
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="headers-core dark:text-text-title-dark text-text-base">
            {t('Attendance & Arrival/Leave Tracking System')} 
          </h1>
          <p className='dark:text-text-title-dark'>{t("Monitor visitor attendance patterns and punctuality")}</p>
        </div>
        <div className="flex items-center w-[240px]">
          <MyTailwindPicker
            useRange={true}
            name="date"
            asSingle={false}
            control={control}
            placeholder={t('Today')}
            showShortcuts={true}
            startIcon={<Calendar stroke="#9096A1" />}
          />
        </div>
      </div>
      <MyDivider />
      <ArrivalDepartureTimeline data={data} />
    </>
  );
};

export default AttendancesInfo;
