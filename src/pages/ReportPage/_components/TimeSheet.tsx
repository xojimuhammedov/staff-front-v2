import dayjs from 'dayjs';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css'

const TimeSheet = ({ currentTableRef }: any) => {
    const { t } = useTranslation();
    // const dayLength = data?.days?.length;
    const formatTime = (minutes: any) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const formattedTime = `${hours} ${t('hours')} ${mins.toString().padStart(2, '0')} ${t('minutes')}`;
        return formattedTime;
    };

    return (
        <div className="wrapper-table">
            <table
                ref={currentTableRef}
                style={{
                    borderCollapse: 'collapse',
                    border: '1px solid rgb(204, 204, 204)'
                }}>
                <thead style={{ background: '#c2c2c2' }}>
                    <tr style={{ background: '#c2c2c2' }}>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            №
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                minWidth: '150px',
                                maxWidth: '250px'
                            }}
                            rowSpan={2}>
                            {t('FIO')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                minWidth: '80px',
                                maxWidth: '150px'
                            }}
                            rowSpan={2}>
                            {t('Job title')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Subdivision')}
                        </th>
                        {/* {data?.days?.map((evt: any, index: number) => (
                            <th
                                key={index}
                                style={{
                                    height: '30px',
                                    fontSize: '12px',
                                    border: '1px solid gray',
                                    textAlign: 'center',
                                    maxWidth: '80px'
                                }}
                                className="num">
                                {dayjs(evt.date).format('MM-DD')}
                            </th>
                        ))} */}
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('According to plan')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Late2')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Early departure')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Completed')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('During')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Overtime')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            colSpan={2}>
                            {t('Off schedule')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                maxWidth: '80px'
                            }}
                            rowSpan={2}
                            className="num">
                            {t('Absence')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                maxWidth: '80px'
                            }}
                            rowSpan={2}
                            className="num">
                            {t('Total')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                width: '70px'
                            }}
                            rowSpan={2}
                            className="working-days">
                            {t('Days worked')}
                        </th>
                    </tr>
                    <tr style={{ background: '#c2c2c2' }}>
                        {/* {data?.days?.map((evt: any, index: number) => (
                            <th
                                key={index}
                                style={{
                                    height: '30px',
                                    fontSize: '12px',
                                    border: '1px solid gray',
                                    textAlign: 'center'
                                }}>
                                {evt?.name}
                            </th>
                        ))} */}
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                maxWidth: '80px'
                            }}
                            className="num">
                            {t('Because of')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center',
                                maxWidth: '80px'
                            }}
                            className="num">
                            {t('Without a reason')}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {/* {data?.employees?.map((evt: any, index: number) => {
                        const count = dayLength - evt?.attendances?.length;
                        const attendancesWithEmptyObjects = Array.from({ length: count }, () => ({
                            firstIn: null,
                            lastOut: null,
                            workTimeTotal: null
                        }));
                        const combinedArray = [...attendancesWithEmptyObjects, ...(evt?.attendances ?? [])];
                        return (
                            <tr key={index} className="dark:text-text-title-dark">
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {index + 1}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt.lastName} {evt.firstName} {evt.middleName ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.position ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt.department ?? '--'}
                                </td>
                                {combinedArray?.map((evt: any) => {
                                    if (evt.firstIn) {
                                        return (
                                            <td
                                                style={{
                                                    height: '30px',
                                                    fontSize: '12px',
                                                    border: '1px solid gray',
                                                    textAlign: 'center'
                                                }}>
                                                {evt.firstIn ?? ''} / {evt.lastOut ?? ''} (
                                                {formatTime(evt?.workTimeTotal) ?? '--'})
                                            </td>
                                        );
                                    } else {
                                        return (
                                            <td
                                                style={{
                                                    height: '30px',
                                                    fontSize: '12px',
                                                    border: '1px solid gray',
                                                    textAlign: 'center',
                                                    background: '#EBB9B6'
                                                }}>
                                                X
                                            </td>
                                        );
                                    }
                                })}

                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {formatTime(evt?.workedTimePlan)}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {formatTime(evt?.lateInMinutes)}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {formatTime(evt?.earlyOutMinutes)}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {formatTime(evt?.workTimeTotal)}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {formatTime(evt?.workedTimeByPlan)}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    --
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.absenceTimeWithReason ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.absenceTimeWithoutReason ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.workedTimeOutOfPlan ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalWorkTimeWithReason ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.workedDays ?? '--'}
                                </td>
                            </tr>
                        );
                    })} */}
                </tbody>
            </table>
        </div>
    );
}

export default React.memo(TimeSheet);
