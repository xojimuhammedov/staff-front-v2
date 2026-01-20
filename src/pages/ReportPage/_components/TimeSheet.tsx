import React from 'react';
import { useTranslation } from 'react-i18next';
import './style.css';
import { addHours, timeLine } from 'utils/helper';

const TimeSheet = ({ currentTableRef, data }: any) => {
  const { t } = useTranslation();

  return (
    <div className="wrapper-table">
      <table
        ref={currentTableRef}
        style={{
          borderCollapse: 'collapse',
          border: '1px solid rgb(204, 204, 204)',
        }}
      >
        <thead style={{ background: '#c2c2c2' }}>
          <tr style={{ background: '#c2c2c2' }}>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              №
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
                minWidth: '150px',
                maxWidth: '250px',
              }}
              rowSpan={2}
            >
              {t('FIO')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
                minWidth: '80px',
                maxWidth: '150px',
              }}
              rowSpan={2}
            >
              {t('Job title')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Subdivision')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('According to plan')}
            </th>
            {data?.dateData?.map((item: any) => (
              <th
                style={{
                  height: '30px',
                  fontSize: '12px',
                  border: '1px solid gray',
                  textAlign: 'center',
                }}
                rowSpan={2}
              >
                {item?.weekday} {''} ({item?.date})
              </th>
            ))}
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('According to plan')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Late2')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Early departure')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Completed')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('During')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Overtime')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              rowSpan={2}
            >
              {t('Off schedule')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
              }}
              colSpan={2}
            >
              {t('Off schedule')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
                maxWidth: '80px',
              }}
              rowSpan={2}
              className="num"
            >
              {t('Total')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
                width: '70px',
              }}
              rowSpan={2}
              className="working-days"
            >
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
                maxWidth: '80px',
              }}
              className="num"
            >
              {t('Because of')}
            </th>
            <th
              style={{
                height: '30px',
                fontSize: '12px',
                border: '1px solid gray',
                textAlign: 'center',
                maxWidth: '80px',
              }}
              className="num"
            >
              {t('Without a reason')}
            </th>
          </tr>
        </thead>
        <tbody>
          {data?.reportData?.map((evt: any, index: number) => {
            return (
              <tr key={index} className="dark:text-text-title-dark">
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {index + 1}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {evt?.fio}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {evt?.position ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {evt.department ?? '--'}
                </td>

                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {evt?.workSchedule}
                </td>
                {evt?.daysStatistics?.map((item: any) => (
                  <td
                    style={{
                      height: '30px',
                      fontSize: '12px',
                      border: '1px solid gray',
                      textAlign: 'center',
                      backgroundColor:
                        item?.status === 'ABSENT'
                          ? 'pink'
                          : item?.status === 'LATE'
                            ? 'yellow'
                            : 'transparent',
                    }}
                  >
                    {item?.startTime && item?.endTime
                      ? `(${addHours(item.startTime)}-${addHours(item.endTime)})`
                      : item?.startTime
                        ? `(${addHours(item.startTime)})`
                        : ''}{' '}
                    {timeLine(item?.totalMinutes)}
                  </td>
                ))}
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.totalPlannedMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.totalLateMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.totalEarlyMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.totalWorkedMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.onTimeMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.overtimeMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.overtimePlanMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.reasonableAbsentMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.unreasonableAbsentMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {timeLine(evt?.totalMinutes) ?? '--'}
                </td>
                <td
                  style={{
                    height: '30px',
                    fontSize: '12px',
                    border: '1px solid gray',
                    textAlign: 'center',
                  }}
                >
                  {evt?.totalDays ?? '--'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default React.memo(TimeSheet);
