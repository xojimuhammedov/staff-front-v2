import LineChart from 'components/Molecules/Chart';
import { useTranslation } from 'react-i18next';

const AttendancesLine = ({ date, onTime, late, absent }: any) => {
    const { t } = useTranslation();


    return (
        <div className="h-full">
            <h1 className="headers-core text-sm  dark:text-text-title-dark">{t('Attendances')}</h1>
            <LineChart
                xAxis={{
                    data: date
                }}
                height="300px"
                type="line"
                legends={[
                    { legend: t('On time'), color: '#059669', className: 'bg-tag-green-icon' },
                    { legend: t('Late'), color: '#D97706', className: 'bg-tag-orange-icon' },
                    { legend: t('Absence'), color: '#E11D48', className: 'bg-tag-red-icon' }
                ]}
                series={[
                    {
                        data: late,
                        color: '#FDB563'
                    },
                    {
                        data: onTime,
                        color: '#30B08F'
                    },
                    {
                        data: absent,
                        color: '#E11D48'
                    }
                ]}
            />
        </div>
    );
};

export default AttendancesLine;
