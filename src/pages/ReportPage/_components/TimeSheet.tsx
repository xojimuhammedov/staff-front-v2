import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css'

const TimeSheet = ({ currentTableRef, data }: any) => {
    const { t } = useTranslation();

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
                            {t('По плану')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Опоздание')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Ранний уход')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Отработано')}
                        </th>
                        <th
                            style={{
                                height: '30px',
                                fontSize: '12px',
                                border: '1px solid gray',
                                textAlign: 'center'
                            }}
                            rowSpan={2}>
                            {t('Вовремя')}
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
                    {data?.map((evt: any, index: number) => {
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
                                    {evt?.fio}
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

                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.workSchedule}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalHoursPlan}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalHoursLate}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalHoursEarly}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalWorkedHours}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.ontimeHours}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.resonableAbsentHours ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.unresaonableAbsentHours ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.total ?? '--'}
                                </td>
                                <td
                                    style={{
                                        height: '30px',
                                        fontSize: '12px',
                                        border: '1px solid gray',
                                        textAlign: 'center'
                                    }}>
                                    {evt?.totalDays ?? '--'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default React.memo(TimeSheet);
